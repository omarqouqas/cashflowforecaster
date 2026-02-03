'use server';

import { requireAuth } from '@/lib/auth/session';
import { createClient } from '@/lib/supabase/server';
import { canUseInvoicing } from '@/lib/stripe/subscription';
import type { Tables } from '@/types/supabase';

export type InvoiceStatus = 'draft' | 'sent' | 'viewed' | 'paid';

export type CreateInvoiceInput = {
  invoice_number?: string | null;
  client_name: string;
  client_email?: string | null;
  amount: number;
  currency?: string;
  due_date: string; // YYYY-MM-DD
  description?: string | null;
};

export type UpdateInvoiceInput = {
  invoice_number?: string | null;
  client_name: string;
  client_email?: string | null;
  amount: number;
  currency?: string;
  due_date: string; // YYYY-MM-DD
  description?: string | null;
};

function extractInvoiceNumber(invoiceNumber: string | null | undefined): number {
  // Expected pattern: INV-0001, but we handle unknown formats gracefully.
  const match = (invoiceNumber ?? '').match(/(\d+)\s*$/);
  const num = match ? Number.parseInt(match[1]!, 10) : 0;
  return Number.isFinite(num) ? num : 0;
}

function generateInvoiceNumber(maxNum: number): string {
  const nextNum = maxNum + 1;
  return `INV-${String(nextNum).padStart(4, '0')}`;
}

async function getNextInvoiceNumber(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string
): Promise<string> {
  // Query ALL invoice numbers for this user and find the max
  // This is more robust than querying "last created" which can have race conditions
  const { data: invoices, error } = await supabase
    .from('invoices')
    .select('invoice_number')
    .eq('user_id', userId);

  if (error) throw new Error(error.message);

  // Find the maximum invoice number
  let maxNum = 0;
  for (const inv of invoices ?? []) {
    const num = extractInvoiceNumber(inv.invoice_number);
    if (num > maxNum) maxNum = num;
  }

  return generateInvoiceNumber(maxNum);
}

export async function getInvoices(): Promise<Tables<'invoices'>[]> {
  const user = await requireAuth();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('invoices')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function createInvoice(input: CreateInvoiceInput): Promise<{ id: string }> {
  const user = await requireAuth();
  const hasAccess = await canUseInvoicing(user.id);
  if (!hasAccess) {
    throw new Error('Invoicing requires a Pro subscription');
  }
  const supabase = await createClient();

  const requestedInvoiceNumber = input.invoice_number?.trim() || null;

  // Retry logic for race condition handling
  const MAX_RETRIES = 3;
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      // Generate invoice_number if not provided
      // Uses MAX of all existing numbers to avoid race conditions
      const invoice_number = requestedInvoiceNumber ?? await getNextInvoiceNumber(supabase, user.id);

      // 1) Create invoice
      const { data: invoice, error: invoiceErr } = await supabase
        .from('invoices')
        .insert({
          user_id: user.id,
          invoice_number,
          client_name: input.client_name,
          client_email: input.client_email || null,
          amount: input.amount,
          currency: input.currency || 'USD',
          due_date: input.due_date,
          description: input.description || null,
          status: 'draft',
        })
        .select('id, invoice_number')
        .single();

      if (invoiceErr) {
        // Check if it's a unique constraint violation (duplicate invoice number)
        if (invoiceErr.code === '23505' && !requestedInvoiceNumber) {
          // Retry with a new number (only if we auto-generated the number)
          lastError = new Error(invoiceErr.message);
          continue;
        }
        throw new Error(invoiceErr.message);
      }

      // If the DB has a trigger that auto-sets invoice_number on INSERT, it may overwrite
      // the user's provided invoice number. Enforce the requested value after insert.
      if (requestedInvoiceNumber && invoice.invoice_number !== requestedInvoiceNumber) {
        const { error: enforceErr } = await supabase
          .from('invoices')
          .update({ invoice_number: requestedInvoiceNumber })
          .eq('id', invoice.id)
          .eq('user_id', user.id);

        if (enforceErr) {
          await supabase.from('invoices').delete().eq('id', invoice.id).eq('user_id', user.id);
          throw new Error(enforceErr.message);
        }
      }

      // 2) Create linked income entry (transaction-like: delete invoice on failure)
      const { error: incomeErr } = await supabase.from('income').insert({
        user_id: user.id,
        name: `Invoice: ${input.client_name}`,
        amount: input.amount,
        frequency: 'one-time',
        next_date: input.due_date,
        status: 'pending',
        invoice_id: invoice.id,
        is_active: true,
        notes: input.description || null,
      });

      if (incomeErr) {
        await supabase.from('invoices').delete().eq('id', invoice.id).eq('user_id', user.id);
        throw new Error(incomeErr.message);
      }

      return { id: invoice.id };
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      // Only retry on specific errors, otherwise throw immediately
      if (!lastError.message.includes('duplicate') && !lastError.message.includes('unique')) {
        throw lastError;
      }
    }
  }

  // All retries exhausted
  throw lastError ?? new Error('Failed to create invoice after multiple attempts');
}

export async function updateInvoiceStatus(id: string, status: InvoiceStatus) {
  const user = await requireAuth();
  const hasAccess = await canUseInvoicing(user.id);
  if (!hasAccess) {
    throw new Error('Invoicing requires a Pro subscription');
  }
  const supabase = await createClient();

  const updates: Partial<Tables<'invoices'>> = { status };
  if (status === 'paid') {
    updates.paid_at = new Date().toISOString();
  }

  const { error: invoiceErr } = await supabase
    .from('invoices')
    .update(updates)
    .eq('id', id)
    .eq('user_id', user.id);

  if (invoiceErr) throw new Error(invoiceErr.message);

  if (status === 'paid') {
    const { error: incomeErr } = await supabase
      .from('income')
      .update({
        status: 'confirmed',
        status_updated_at: new Date().toISOString(),
      })
      .eq('invoice_id', id)
      .eq('user_id', user.id);

    if (incomeErr) throw new Error(incomeErr.message);
  }
}

export async function getInvoice(id: string): Promise<Tables<'invoices'> | null> {
  const user = await requireAuth();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('invoices')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data ?? null;
}

export async function updateInvoice(id: string, input: UpdateInvoiceInput): Promise<void> {
  const user = await requireAuth();
  const hasAccess = await canUseInvoicing(user.id);
  if (!hasAccess) {
    throw new Error('Invoicing requires a Pro subscription');
  }
  const supabase = await createClient();

  const { data: invoice, error: invErr } = await supabase
    .from('invoices')
    .select('id, status, invoice_number')
    .eq('id', id)
    .eq('user_id', user.id)
    .maybeSingle();

  if (invErr) throw new Error(invErr.message);
  if (!invoice) throw new Error('Invoice not found');

  const status = (invoice.status ?? 'draft') as InvoiceStatus;
  if (status === 'paid') {
    throw new Error('Paid invoices cannot be edited');
  }

  // Prevent accidentally wiping invoice_number; keep existing if blank.
  const invoice_number = input.invoice_number?.trim() || invoice.invoice_number;

  const { error: updateInvoiceErr } = await supabase
    .from('invoices')
    .update({
      invoice_number,
      client_name: input.client_name,
      client_email: input.client_email || null,
      amount: input.amount,
      currency: input.currency || 'USD',
      due_date: input.due_date,
      description: input.description || null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('user_id', user.id);

  if (updateInvoiceErr) throw new Error(updateInvoiceErr.message);

  // Keep linked income entry in sync.
  const { data: linkedIncome, error: linkedIncomeErr } = await supabase
    .from('income')
    .select('id')
    .eq('invoice_id', id)
    .eq('user_id', user.id)
    .maybeSingle();

  if (linkedIncomeErr) throw new Error(linkedIncomeErr.message);

  if (linkedIncome?.id) {
    const { error: incomeUpdateErr } = await supabase
      .from('income')
      .update({
        name: `Invoice: ${input.client_name}`,
        amount: input.amount,
        next_date: input.due_date,
        notes: input.description || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', linkedIncome.id)
      .eq('user_id', user.id);

    if (incomeUpdateErr) throw new Error(incomeUpdateErr.message);
  } else {
    const { error: incomeInsertErr } = await supabase.from('income').insert({
      user_id: user.id,
      name: `Invoice: ${input.client_name}`,
      amount: input.amount,
      frequency: 'one-time',
      next_date: input.due_date,
      status: 'pending',
      invoice_id: id,
      is_active: true,
      notes: input.description || null,
    });

    if (incomeInsertErr) throw new Error(incomeInsertErr.message);
  }
}

export async function deleteInvoice(id: string): Promise<void> {
  const user = await requireAuth();
  const hasAccess = await canUseInvoicing(user.id);
  if (!hasAccess) {
    throw new Error('Invoicing requires a Pro subscription');
  }
  const supabase = await createClient();

  const { data: invoice, error: invErr } = await supabase
    .from('invoices')
    .select('id, status')
    .eq('id', id)
    .eq('user_id', user.id)
    .maybeSingle();

  if (invErr) throw new Error(invErr.message);
  if (!invoice) throw new Error('Invoice not found');

  const status = (invoice.status ?? 'draft') as InvoiceStatus;
  if (status !== 'draft') {
    throw new Error('Only draft invoices can be deleted');
  }

  // Delete linked income entry first (or rely on FK cascade if configured).
  const { error: incomeErr } = await supabase
    .from('income')
    .delete()
    .eq('invoice_id', id)
    .eq('user_id', user.id);

  if (incomeErr) throw new Error(incomeErr.message);

  const { error: invoiceErr } = await supabase
    .from('invoices')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (invoiceErr) throw new Error(invoiceErr.message);
}

export async function getInvoiceSummary(): Promise<{
  unpaidCount: number;
  totalOutstanding: number;
  overdueCount: number;
}> {
  const user = await requireAuth();
  const supabase = await createClient();

  // Treat NULL status as unpaid (draft).
  const { data, error } = await supabase
    .from('invoices')
    .select('amount, due_date, status')
    .eq('user_id', user.id)
    .or('status.is.null,status.neq.paid');

  if (error) throw new Error(error.message);

  const invoices = data ?? [];
  const unpaidCount = invoices.length;
  const totalOutstanding = invoices.reduce((sum, inv) => sum + (inv.amount || 0), 0);

  const today = new Date();
  const todayNoon = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 12, 0, 0);
  const overdueCount = invoices.reduce((count, inv) => {
    if (!inv.due_date) return count;
    // Parse as local date (noon) to avoid timezone shifts
    const [year, month, day] = inv.due_date.split('-').map(Number);
    if (!year || !month || !day) return count;
    const due = new Date(year, month - 1, day, 12, 0, 0);
    return due < todayNoon ? count + 1 : count;
  }, 0);

  return { unpaidCount, totalOutstanding, overdueCount };
}


