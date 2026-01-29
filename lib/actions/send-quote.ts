'use server';

import { requireAuth } from '@/lib/auth/session';
import { createClient } from '@/lib/supabase/server';
import { resend } from '@/lib/email/resend';
import { buildQuoteEmail } from '@/lib/email/templates/quote-email';
import { renderToBuffer } from '@react-pdf/renderer';
import { QuoteTemplate } from '@/lib/pdf/quote-template';
import { revalidatePath } from 'next/cache';
import type { Quote } from './quotes';

export type SendQuoteInput = {
  quoteId: string;
  message?: string;
  forceResend?: boolean;
};

export type SendQuoteResult =
  | { ok: true; sentTo: string; sentAt: string }
  | { ok: false; error: string; code?: string };

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function getSenderName(user: { email?: string | null; user_metadata?: Record<string, unknown> }) {
  const meta = user.user_metadata ?? {};
  return (
    (meta.full_name as string) ||
    (meta.name as string) ||
    (meta.display_name as string) ||
    (typeof user.email === 'string' && user.email) ||
    'Sender'
  );
}

async function fetchOwnedQuote(
  supabase: Awaited<ReturnType<typeof createClient>>,
  quoteId: string,
  userId: string
): Promise<Quote | null> {
  const { data, error } = await supabase
    .from('quotes')
    .select('*')
    .eq('id', quoteId)
    .eq('user_id', userId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return (data as Quote) ?? null;
}

export async function sendQuote(input: SendQuoteInput): Promise<SendQuoteResult> {
  try {
    if (!process.env.RESEND_API_KEY) {
      return { ok: false, code: 'missing_resend_api_key', error: 'Email is not configured.' };
    }

    const user = await requireAuth();
    const supabase = await createClient();

    // Fetch quote and branding settings in parallel
    const [quote, brandingResult] = await Promise.all([
      fetchOwnedQuote(supabase, input.quoteId, user.id),
      supabase
        .from('user_settings')
        .select('business_name, logo_url')
        .eq('user_id', user.id)
        .single(),
    ]);
    const branding = brandingResult.data;

    if (!quote) {
      return { ok: false, code: 'not_found', error: 'Quote not found' };
    }

    const status = (quote.status ?? 'draft') as string;
    const isAlreadySent = status !== 'draft';
    if (isAlreadySent && !input.forceResend) {
      return { ok: false, code: 'already_sent', error: 'Quote has already been sent' };
    }

    // Check if quote has expired
    const today = new Date().toISOString().split('T')[0]!;
    if (quote.valid_until < today) {
      return { ok: false, code: 'expired', error: 'Cannot send an expired quote. Please update the valid until date.' };
    }

    const toEmail = (quote.client_email ?? '').trim();
    if (!toEmail) {
      return { ok: false, code: 'missing_email', error: 'Client email is required to send a quote' };
    }

    if (!isValidEmail(toEmail)) {
      return { ok: false, code: 'invalid_email', error: 'Please enter a valid email address' };
    }

    const senderName = getSenderName(user);

    // Generate PDF
    const doc = QuoteTemplate({
      quote,
      fromEmail: user.email ?? 'Unknown',
      businessName: branding?.business_name,
      logoUrl: branding?.logo_url,
    });
    const pdfBuffer = await renderToBuffer(doc);

    const { subject, html } = buildQuoteEmail({
      quote_number: quote.quote_number ?? 'Quote',
      amount: quote.amount ?? 0,
      currency: quote.currency ?? 'USD',
      valid_until: quote.valid_until,
      client_name: quote.client_name,
      sender_name: senderName,
      note: input.message,
    });

    const from =
      process.env.RESEND_FROM_EMAIL?.trim() || 'Cash Flow Forecaster <onboarding@resend.dev>';

    const res = await resend.emails.send({
      from,
      to: toEmail,
      subject,
      html,
      attachments: [
        {
          filename: `quote-${quote.quote_number ?? quote.id}.pdf`,
          content: Buffer.from(pdfBuffer),
          contentType: 'application/pdf',
        },
      ],
    });

    if (res.error) {
      console.error('Resend error:', res.error);
      return { ok: false, code: 'resend_error', error: 'Failed to send quote. Please try again.' };
    }

    const sentAt = new Date().toISOString();

    const { error: updateErr } = await supabase
      .from('quotes')
      .update({
        status: 'sent',
        sent_at: sentAt,
        updated_at: sentAt,
      })
      .eq('id', quote.id)
      .eq('user_id', user.id);

    if (updateErr) {
      console.error('Failed updating quote after email send:', updateErr);
    }

    revalidatePath('/dashboard/quotes');
    revalidatePath(`/dashboard/quotes/${quote.id}`);

    return { ok: true, sentTo: toEmail, sentAt };
  } catch (e) {
    console.error('sendQuote failed:', e);
    return { ok: false, code: 'unknown', error: 'Failed to send quote. Please try again.' };
  }
}
