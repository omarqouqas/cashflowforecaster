'use server';

import { requireAuth } from '@/lib/auth/session';
import { createClient } from '@/lib/supabase/server';
import { resend } from '@/lib/email/resend';
import { buildInvoiceEmail } from '@/lib/email/templates/invoice-email';
import { renderToBuffer } from '@react-pdf/renderer';
import { InvoiceTemplate } from '@/lib/pdf/invoice-template';
import { revalidatePath } from 'next/cache';
import type { Tables } from '@/types/supabase';
import { getConnectAccount, createInvoiceCheckoutSession } from '@/lib/stripe/connect';

export type SendInvoiceInput = {
  invoiceId: string;
  message?: string;
  forceResend?: boolean;
};

export type SendInvoiceResult =
  | { ok: true; sentTo: string; sentAt: string }
  | { ok: false; error: string; code?: string };

function isValidEmail(email: string) {
  // Reasonable validation for UI + server (not RFC-complete on purpose)
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function getSenderName(user: { email?: string | null; user_metadata?: any }) {
  const meta = user.user_metadata ?? {};
  return (
    meta.full_name ||
    meta.name ||
    meta.display_name ||
    (typeof user.email === 'string' && user.email) ||
    'Sender'
  );
}

async function fetchOwnedInvoice(
  supabase: Awaited<ReturnType<typeof createClient>>,
  invoiceId: string,
  userId: string
): Promise<Tables<'invoices'> | null> {
  const { data, error } = await supabase
    .from('invoices')
    .select('*')
    .eq('id', invoiceId)
    .eq('user_id', userId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data ?? null;
}

export async function sendInvoice(input: SendInvoiceInput): Promise<SendInvoiceResult> {
  try {
    if (!process.env.RESEND_API_KEY) {
      return { ok: false, code: 'missing_resend_api_key', error: 'Email is not configured.' };
    }

    const user = await requireAuth();
    const supabase = await createClient();

    // Fetch invoice and branding settings in parallel
    const [invoice, brandingResult] = await Promise.all([
      fetchOwnedInvoice(supabase, input.invoiceId, user.id),
      supabase
        .from('user_settings')
        .select('business_name, logo_url')
        .eq('user_id', user.id)
        .single(),
    ]);
    const branding = brandingResult.data;

    if (!invoice) {
      return { ok: false, code: 'not_found', error: 'Invoice not found' };
    }

    const status = (invoice.status ?? 'draft') as string;
    const isAlreadySent = status !== 'draft';
    if (isAlreadySent && !input.forceResend) {
      return { ok: false, code: 'already_sent', error: 'Invoice has already been sent' };
    }

    const toEmail = (invoice.client_email ?? '').trim();
    if (!toEmail) {
      return { ok: false, code: 'missing_email', error: 'Client email is required to send an invoice' };
    }

    if (!isValidEmail(toEmail)) {
      return { ok: false, code: 'invalid_email', error: 'Please enter a valid email address' };
    }

    const senderName = getSenderName(user);

    // Check if user has an active Stripe Connect account for payment links
    let paymentLinkUrl: string | null = null;
    let checkoutSessionId: string | null = null;

    const connectAccount = await getConnectAccount(user.id);
    if (connectAccount?.accountStatus === 'active' && connectAccount.chargesEnabled) {
      try {
        const amountInCents = Math.round((invoice.amount ?? 0) * 100);
        if (amountInCents > 0) {
          const session = await createInvoiceCheckoutSession({
            invoiceId: invoice.id,
            invoiceNumber: invoice.invoice_number ?? invoice.id,
            amount: amountInCents,
            clientEmail: toEmail,
            clientName: invoice.client_name ?? 'Client',
            connectAccountId: connectAccount.stripeAccountId,
            description: invoice.description ?? undefined,
          });
          paymentLinkUrl = session.url;
          checkoutSessionId = session.sessionId;
        }
      } catch (err) {
        // Log but don't fail the invoice send if payment link creation fails
        console.error('Failed to create payment link:', err);
      }
    }

    // Generate PDF (include payment URL if available)
    const doc = InvoiceTemplate({
      invoice,
      fromEmail: user.email ?? 'Unknown',
      paymentUrl: paymentLinkUrl ?? undefined,
      businessName: branding?.business_name,
      logoUrl: branding?.logo_url,
    });
    const pdfBuffer = await renderToBuffer(doc);

    const { subject, html } = buildInvoiceEmail({
      invoice_number: invoice.invoice_number ?? 'Invoice',
      amount: invoice.amount ?? 0,
      due_date: invoice.due_date,
      client_name: invoice.client_name,
      sender_name: senderName,
      note: input.message,
      payment_url: paymentLinkUrl ?? undefined,
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
          filename: `invoice-${invoice.invoice_number ?? invoice.id}.pdf`,
          content: Buffer.from(pdfBuffer),
          contentType: 'application/pdf',
        },
      ],
    });

    if (res.error) {
      // eslint-disable-next-line no-console
      console.error('Resend error:', res.error);
      return { ok: false, code: 'resend_error', error: 'Failed to send invoice. Please try again.' };
    }

    const sentAt = new Date().toISOString();

    const updateData: Record<string, any> = {
      status: 'sent',
      sent_at: sentAt,
      updated_at: sentAt,
    };

    // Add payment link data if created (payment_method is set when actually paid)
    if (paymentLinkUrl) {
      updateData.payment_link_url = paymentLinkUrl;
      updateData.stripe_checkout_session_id = checkoutSessionId;
    }

    const { error: updateErr } = await supabase
      .from('invoices')
      .update(updateData)
      .eq('id', invoice.id)
      .eq('user_id', user.id);

    if (updateErr) {
      // eslint-disable-next-line no-console
      console.error('Failed updating invoice after email send:', updateErr);
    }

    revalidatePath('/dashboard/invoices');
    revalidatePath(`/dashboard/invoices/${invoice.id}`);

    return { ok: true, sentTo: toEmail, sentAt };
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('sendInvoice failed:', e);
    return { ok: false, code: 'unknown', error: 'Failed to send invoice. Please try again.' };
  }
}
