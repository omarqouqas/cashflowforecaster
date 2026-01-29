'use server';

import { requireAuth } from '@/lib/auth/session';
import { createClient } from '@/lib/supabase/server';
import { canUseInvoicing } from '@/lib/stripe/subscription';
import { revalidatePath } from 'next/cache';

export type QuoteStatus = 'draft' | 'sent' | 'viewed' | 'accepted' | 'rejected' | 'expired';

export type CreateQuoteInput = {
  quote_number?: string | null;
  client_name: string;
  client_email?: string | null;
  amount: number;
  currency?: string;
  valid_until: string; // YYYY-MM-DD
  description?: string | null;
};

export type UpdateQuoteInput = {
  quote_number?: string | null;
  client_name: string;
  client_email?: string | null;
  amount: number;
  currency?: string;
  valid_until: string; // YYYY-MM-DD
  description?: string | null;
};

// Quote type matching database schema
export type Quote = {
  id: string;
  user_id: string;
  quote_number: string;
  client_name: string;
  client_email: string | null;
  amount: number;
  currency: string;
  valid_until: string;
  description: string | null;
  status: QuoteStatus;
  sent_at: string | null;
  viewed_at: string | null;
  accepted_at: string | null;
  rejected_at: string | null;
  converted_invoice_id: string | null;
  created_at: string;
  updated_at: string;
};

function extractQuoteNumber(quoteNumber: string | null | undefined): number {
  // Expected pattern: QTE-0001, but we handle unknown formats gracefully.
  const match = (quoteNumber ?? '').match(/(\d+)\s*$/);
  const num = match ? Number.parseInt(match[1]!, 10) : 0;
  return Number.isFinite(num) ? num : 0;
}

function generateQuoteNumber(maxNum: number): string {
  const nextNum = maxNum + 1;
  return `QTE-${String(nextNum).padStart(4, '0')}`;
}

async function getNextQuoteNumber(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string
): Promise<string> {
  // Query ALL quote numbers for this user and find the max
  const { data: quotes, error } = await supabase
    .from('quotes')
    .select('quote_number')
    .eq('user_id', userId);

  if (error) throw new Error(error.message);

  // Find the maximum quote number
  let maxNum = 0;
  for (const q of quotes ?? []) {
    const num = extractQuoteNumber(q.quote_number);
    if (num > maxNum) maxNum = num;
  }

  return generateQuoteNumber(maxNum);
}

export async function getQuotes(): Promise<Quote[]> {
  const user = await requireAuth();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('quotes')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as Quote[];
}

export async function getQuote(id: string): Promise<Quote | null> {
  const user = await requireAuth();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('quotes')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return (data as Quote) ?? null;
}

export async function createQuote(input: CreateQuoteInput): Promise<{ id: string }> {
  const user = await requireAuth();
  const hasAccess = await canUseInvoicing(user.id);
  if (!hasAccess) {
    throw new Error('Quotes require a Pro subscription');
  }
  const supabase = await createClient();

  // Get user's default currency if not provided
  let currency = input.currency;
  if (!currency) {
    const { data: settings } = await supabase
      .from('user_settings')
      .select('currency')
      .eq('user_id', user.id)
      .maybeSingle();
    currency = settings?.currency ?? 'USD';
  }

  const requestedQuoteNumber = input.quote_number?.trim() || null;

  // Retry logic for race condition handling
  const MAX_RETRIES = 3;
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      // Generate quote_number if not provided
      const quote_number = requestedQuoteNumber ?? await getNextQuoteNumber(supabase, user.id);

      const { data: quote, error: quoteErr } = await supabase
        .from('quotes')
        .insert({
          user_id: user.id,
          quote_number,
          client_name: input.client_name,
          client_email: input.client_email || null,
          amount: input.amount,
          currency,
          valid_until: input.valid_until,
          description: input.description || null,
          status: 'draft',
        })
        .select('id, quote_number')
        .single();

      if (quoteErr) {
        // Check if it's a unique constraint violation (duplicate quote number)
        if (quoteErr.code === '23505' && !requestedQuoteNumber) {
          lastError = new Error(quoteErr.message);
          continue;
        }
        throw new Error(quoteErr.message);
      }

      // Enforce requested quote number if DB trigger overwrote it
      if (requestedQuoteNumber && quote.quote_number !== requestedQuoteNumber) {
        const { error: enforceErr } = await supabase
          .from('quotes')
          .update({ quote_number: requestedQuoteNumber })
          .eq('id', quote.id)
          .eq('user_id', user.id);

        if (enforceErr) {
          await supabase.from('quotes').delete().eq('id', quote.id).eq('user_id', user.id);
          throw new Error(enforceErr.message);
        }
      }

      revalidatePath('/dashboard/quotes');
      return { id: quote.id };
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      if (!lastError.message.includes('duplicate') && !lastError.message.includes('unique')) {
        throw lastError;
      }
    }
  }

  throw lastError ?? new Error('Failed to create quote after multiple attempts');
}

export async function updateQuote(id: string, input: UpdateQuoteInput): Promise<void> {
  const user = await requireAuth();
  const hasAccess = await canUseInvoicing(user.id);
  if (!hasAccess) {
    throw new Error('Quotes require a Pro subscription');
  }
  const supabase = await createClient();

  const { data: quote, error: quoteErr } = await supabase
    .from('quotes')
    .select('id, status, quote_number, currency')
    .eq('id', id)
    .eq('user_id', user.id)
    .maybeSingle();

  if (quoteErr) throw new Error(quoteErr.message);
  if (!quote) throw new Error('Quote not found');

  const status = (quote.status ?? 'draft') as QuoteStatus;
  if (status === 'accepted' || status === 'rejected' || status === 'expired') {
    throw new Error('Cannot edit quotes that are accepted, rejected, or expired');
  }

  // Prevent accidentally wiping quote_number; keep existing if blank.
  const quote_number = input.quote_number?.trim() || quote.quote_number;
  const currency = input.currency || quote.currency || 'USD';

  const { error: updateQuoteErr } = await supabase
    .from('quotes')
    .update({
      quote_number,
      client_name: input.client_name,
      client_email: input.client_email || null,
      amount: input.amount,
      currency,
      valid_until: input.valid_until,
      description: input.description || null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('user_id', user.id);

  if (updateQuoteErr) throw new Error(updateQuoteErr.message);

  revalidatePath('/dashboard/quotes');
  revalidatePath(`/dashboard/quotes/${id}`);
}

export async function updateQuoteStatus(id: string, status: QuoteStatus): Promise<void> {
  const user = await requireAuth();
  const hasAccess = await canUseInvoicing(user.id);
  if (!hasAccess) {
    throw new Error('Quotes require a Pro subscription');
  }
  const supabase = await createClient();

  const updates: Record<string, unknown> = {
    status,
    updated_at: new Date().toISOString(),
  };

  // Set appropriate timestamp based on status
  const now = new Date().toISOString();
  if (status === 'sent') updates.sent_at = now;
  if (status === 'viewed') updates.viewed_at = now;
  if (status === 'accepted') updates.accepted_at = now;
  if (status === 'rejected') updates.rejected_at = now;

  const { error: quoteErr } = await supabase
    .from('quotes')
    .update(updates)
    .eq('id', id)
    .eq('user_id', user.id);

  if (quoteErr) throw new Error(quoteErr.message);

  revalidatePath('/dashboard/quotes');
  revalidatePath(`/dashboard/quotes/${id}`);
}

export async function deleteQuote(id: string): Promise<void> {
  const user = await requireAuth();
  const hasAccess = await canUseInvoicing(user.id);
  if (!hasAccess) {
    throw new Error('Quotes require a Pro subscription');
  }
  const supabase = await createClient();

  const { data: quote, error: quoteErr } = await supabase
    .from('quotes')
    .select('id, status')
    .eq('id', id)
    .eq('user_id', user.id)
    .maybeSingle();

  if (quoteErr) throw new Error(quoteErr.message);
  if (!quote) throw new Error('Quote not found');

  const status = (quote.status ?? 'draft') as QuoteStatus;
  if (status !== 'draft') {
    throw new Error('Only draft quotes can be deleted');
  }

  const { error: deleteErr } = await supabase
    .from('quotes')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (deleteErr) throw new Error(deleteErr.message);

  revalidatePath('/dashboard/quotes');
}

export async function convertQuoteToInvoice(quoteId: string): Promise<{ invoiceId: string }> {
  const user = await requireAuth();
  const hasAccess = await canUseInvoicing(user.id);
  if (!hasAccess) {
    throw new Error('Invoicing requires a Pro subscription');
  }
  const supabase = await createClient();

  // 1. Get the quote
  const quote = await getQuote(quoteId);
  if (!quote) throw new Error('Quote not found');
  if (quote.status !== 'accepted') {
    throw new Error('Only accepted quotes can be converted to invoices');
  }
  if (quote.converted_invoice_id) {
    throw new Error('This quote has already been converted to an invoice');
  }

  // 2. Create invoice using existing createInvoice action
  const { createInvoice } = await import('./invoices');
  const { id: invoiceId } = await createInvoice({
    client_name: quote.client_name,
    client_email: quote.client_email,
    amount: quote.amount,
    due_date: quote.valid_until, // Use valid_until as default due date
    description: quote.description,
  });

  // 3. Update invoice with same currency as quote
  const { error: currencyErr } = await supabase
    .from('invoices')
    .update({ currency: quote.currency })
    .eq('id', invoiceId)
    .eq('user_id', user.id);

  if (currencyErr) {
    // Log but don't fail - invoice was created
    console.error('Failed to set invoice currency:', currencyErr.message);
  }

  // 4. Link quote to invoice
  const { error: linkErr } = await supabase
    .from('quotes')
    .update({
      converted_invoice_id: invoiceId,
      updated_at: new Date().toISOString(),
    })
    .eq('id', quoteId)
    .eq('user_id', user.id);

  if (linkErr) {
    // Log but don't fail - invoice was created
    console.error('Failed to link quote to invoice:', linkErr.message);
  }

  revalidatePath('/dashboard/quotes');
  revalidatePath(`/dashboard/quotes/${quoteId}`);
  revalidatePath('/dashboard/invoices');

  return { invoiceId };
}

export async function getQuoteSummary(): Promise<{
  pendingByCurrency: Record<string, number>;
  awaitingResponse: number;
  accepted: number;
  expiringSoon: number;
}> {
  const user = await requireAuth();
  const supabase = await createClient();

  // Get all quotes with currency
  const { data, error } = await supabase
    .from('quotes')
    .select('amount, currency, valid_until, status')
    .eq('user_id', user.id);

  if (error) throw new Error(error.message);

  const quotes = data ?? [];

  // Total pending value by currency (draft, sent, viewed quotes)
  const pendingQuotes = quotes.filter((q) =>
    ['draft', 'sent', 'viewed'].includes(q.status ?? 'draft')
  );

  // Group pending totals by currency
  const pendingByCurrency: Record<string, number> = {};
  for (const q of pendingQuotes) {
    const curr = q.currency || 'USD';
    pendingByCurrency[curr] = (pendingByCurrency[curr] || 0) + (q.amount || 0);
  }

  // Awaiting response (sent or viewed, not draft)
  const awaitingResponse = quotes.filter((q) =>
    ['sent', 'viewed'].includes(q.status ?? 'draft')
  ).length;

  // Accepted quotes
  const accepted = quotes.filter((q) => q.status === 'accepted').length;

  // Count quotes expiring within 7 days (only active quotes)
  const today = new Date();
  const sevenDaysFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
  const expiringSoon = pendingQuotes.reduce((count, q) => {
    if (!q.valid_until) return count;
    const validUntil = new Date(`${q.valid_until}T23:59:59`);
    return validUntil >= today && validUntil <= sevenDaysFromNow ? count + 1 : count;
  }, 0);

  return { pendingByCurrency, awaitingResponse, accepted, expiringSoon };
}

// Check and mark expired quotes (can be called periodically or on page load)
export async function expireOverdueQuotes(): Promise<number> {
  const user = await requireAuth();
  const supabase = await createClient();

  const today = new Date().toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('quotes')
    .update({
      status: 'expired',
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', user.id)
    .in('status', ['draft', 'sent', 'viewed'])
    .lt('valid_until', today)
    .select('id');

  if (error) throw new Error(error.message);

  const expiredCount = data?.length ?? 0;
  if (expiredCount > 0) {
    revalidatePath('/dashboard/quotes');
  }

  return expiredCount;
}
