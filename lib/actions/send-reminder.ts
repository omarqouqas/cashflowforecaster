'use server';

import { requireAuth } from '@/lib/auth/session';
import { createClient } from '@/lib/supabase/server';
import { resend } from '@/lib/email/resend';
import { canUseInvoicing } from '@/lib/stripe/subscription';
import {
  buildFinalReminderEmail,
  buildFirmReminderEmail,
  buildFriendlyReminderEmail,
} from '@/lib/email/templates/reminder-emails';
import { revalidatePath } from 'next/cache';
import type { Tables } from '@/types/supabase';

export type ReminderType = 'friendly' | 'firm' | 'final';

export type SendReminderResult =
  | { ok: true; message: string; sentTo: string; sentAt: string }
  | { ok: false; message: string; code?: string };

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

function getAppUrl() {
  const raw =
    process.env.NEXT_PUBLIC_APP_URL?.trim() ||
    process.env.APP_URL?.trim() ||
    'http://localhost:3000';
  return raw.replace(/\/+$/, '');
}

function invoiceUrlFor(invoiceId: string) {
  // NOTE: today this points to the logged-in dashboard view.
  // If you later add a public invoice/payment page, switch this to that route.
  return `${getAppUrl()}/dashboard/invoices/${invoiceId}`;
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

function getTemplate(reminderType: ReminderType) {
  switch (reminderType) {
    case 'friendly':
      return buildFriendlyReminderEmail;
    case 'firm':
      return buildFirmReminderEmail;
    case 'final':
      return buildFinalReminderEmail;
    default: {
      const _exhaustive: never = reminderType;
      return _exhaustive;
    }
  }
}

export async function sendInvoiceReminder(
  invoiceId: string,
  reminderType: ReminderType
): Promise<SendReminderResult> {
  try {
    if (!process.env.RESEND_API_KEY) {
      return { ok: false, code: 'missing_resend_api_key', message: 'Email is not configured.' };
    }

    const user = await requireAuth();
    const hasAccess = await canUseInvoicing(user.id);
    if (!hasAccess) {
      return {
        ok: false,
        code: 'forbidden',
        message: 'Invoicing requires a Pro subscription',
      };
    }
    const supabase = await createClient();

    // 1) Fetch invoice (verify ownership)
    const invoice = await fetchOwnedInvoice(supabase, invoiceId, user.id);
    if (!invoice) {
      return { ok: false, code: 'not_found', message: 'Invoice not found.' };
    }

    // 2) Check invoice isn't already paid
    const status = (invoice.status ?? 'draft') as string;
    if (status === 'paid') {
      return { ok: false, code: 'already_paid', message: 'This invoice is already marked as paid.' };
    }

    const toEmail = (invoice.client_email ?? '').trim();
    if (!toEmail) {
      return {
        ok: false,
        code: 'missing_email',
        message: 'Client email is required to send a reminder.',
      };
    }

    if (!isValidEmail(toEmail)) {
      return { ok: false, code: 'invalid_email', message: 'Please enter a valid client email.' };
    }

    const senderName = getSenderName(user);
    const dueDate = new Date(`${invoice.due_date}T00:00:00`);
    const url = invoiceUrlFor(invoice.id);

    // 3) Choose template
    const buildEmail = getTemplate(reminderType);
    const { subject, html } = buildEmail({
      clientName: invoice.client_name ?? 'there',
      invoiceNumber: invoice.invoice_number ?? 'Invoice',
      amount: invoice.amount ?? 0,
      dueDate,
      invoiceUrl: url,
      senderName,
    });

    // 4) Send email
    const from =
      process.env.RESEND_FROM_EMAIL?.trim() || 'Cash Flow Forecaster <onboarding@resend.dev>';

    const res = await resend.emails.send({
      from,
      to: toEmail,
      subject,
      html,
    });

    if (res.error) {
      // eslint-disable-next-line no-console
      console.error('Resend error:', res.error);
      return {
        ok: false,
        code: 'resend_error',
        message: 'Failed to send reminder. Please try again.',
      };
    }

    const sentAt = new Date().toISOString();
    const beforeCount = invoice.reminder_count ?? 0;
    const beforeLast = invoice.last_reminder_at;

    // 5) Insert reminder record
    const { error: insertErr } = await supabase.from('invoice_reminders').insert({
      invoice_id: invoice.id,
      user_id: user.id,
      reminder_type: reminderType,
      sent_at: sentAt,
    });

    if (insertErr) {
      // eslint-disable-next-line no-console
      console.error('Failed inserting invoice_reminders:', insertErr);
      return {
        ok: false,
        code: 'db_insert_failed',
        message: 'Reminder email was sent, but saving the reminder failed.',
      };
    }

    // 6) Update invoices summary fields (but avoid double-counting if DB trigger already did it)
    const { data: after, error: afterErr } = await supabase
      .from('invoices')
      .select('reminder_count,last_reminder_at')
      .eq('id', invoice.id)
      .eq('user_id', user.id)
      .maybeSingle();

    if (afterErr) {
      // eslint-disable-next-line no-console
      console.error('Failed reading invoice after reminder insert:', afterErr);
    }

    const didTriggerUpdate =
      !!after &&
      typeof after.reminder_count === 'number' &&
      after.reminder_count >= beforeCount + 1 &&
      (beforeLast === after.last_reminder_at ||
        (typeof after.last_reminder_at === 'string' && after.last_reminder_at >= sentAt));

    if (!didTriggerUpdate) {
      const { error: updateErr } = await supabase
        .from('invoices')
        .update({
          reminder_count: beforeCount + 1,
          last_reminder_at: sentAt,
          updated_at: sentAt,
        })
        .eq('id', invoice.id)
        .eq('user_id', user.id);

      if (updateErr) {
        // eslint-disable-next-line no-console
        console.error('Failed updating invoice reminder summary fields:', updateErr);
      }
    }

    // 7) Revalidate UI
    revalidatePath('/dashboard/invoices');

    // 8) Return toast-friendly result
    return {
      ok: true,
      sentTo: toEmail,
      sentAt,
      message: `${reminderType === 'friendly' ? 'Friendly' : reminderType === 'firm' ? 'Firm' : 'Final'} reminder sent to ${toEmail}.`,
    };
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('sendInvoiceReminder failed:', e);
    return { ok: false, code: 'unknown', message: 'Failed to send reminder. Please try again.' };
  }
}


