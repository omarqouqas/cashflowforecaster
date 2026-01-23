import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { resend } from '@/lib/email/resend';
import { buildInvoiceEmail } from '@/lib/email/templates/invoice-email';
import { renderToBuffer } from '@react-pdf/renderer';
import { InvoiceTemplate } from '@/lib/pdf/invoice-template';
import { canUseInvoicing } from '@/lib/stripe/subscription';

export const runtime = 'nodejs';

function isValidEmail(email: string) {
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

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ error: 'Missing RESEND_API_KEY' }, { status: 500 });
  }

  const { id } = params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const hasAccess = await canUseInvoicing(user.id);
  if (!hasAccess) {
    return NextResponse.json(
      { error: 'Invoicing requires a Pro subscription' },
      { status: 403 }
    );
  }

  let body: { message?: string; forceResend?: boolean } = {};
  try {
    body = (await request.json()) ?? {};
  } catch {
    // allow empty body
  }

  // Fetch invoice and branding settings in parallel
  const [invoiceResult, brandingResult] = await Promise.all([
    supabase
      .from('invoices')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .maybeSingle(),
    supabase
      .from('user_settings')
      .select('business_name, logo_url')
      .eq('user_id', user.id)
      .single(),
  ]);

  const { data: invoice, error } = invoiceResult;
  const branding = brandingResult.data;

  if (error || !invoice) {
    return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
  }

  const status = ((invoice as any).status ?? 'draft') as string;
  const isAlreadySent = status !== 'draft';
  if (isAlreadySent && !body.forceResend) {
    return NextResponse.json(
      { error: 'Invoice already sent', code: 'already_sent' },
      { status: 409 }
    );
  }

  const invoiceData = invoice as any;

  const toEmail = (invoiceData.client_email ?? '').trim();
  if (!toEmail) {
    return NextResponse.json(
      { error: 'Client email is required', code: 'missing_email' },
      { status: 400 }
    );
  }

  if (!isValidEmail(toEmail)) {
    return NextResponse.json(
      { error: 'Invalid email address', code: 'invalid_email' },
      { status: 400 }
    );
  }

  const senderName = getSenderName(user);

  const doc = InvoiceTemplate({
    invoice: invoiceData,
    fromEmail: user.email ?? 'Unknown',
    businessName: branding?.business_name,
    logoUrl: branding?.logo_url,
  });
  const pdfBuffer = await renderToBuffer(doc);

  const { subject, html } = buildInvoiceEmail({
    invoice_number: invoiceData.invoice_number ?? 'Invoice',
    amount: invoiceData.amount ?? 0,
    due_date: invoiceData.due_date,
    client_name: invoiceData.client_name,
    sender_name: senderName,
    note: body.message,
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
        filename: `invoice-${invoiceData.invoice_number ?? invoiceData.id}.pdf`,
        content: Buffer.from(pdfBuffer),
        contentType: 'application/pdf',
      },
    ],
  });

  if (res.error) {
    // eslint-disable-next-line no-console
    console.error('Resend error:', res.error);
    return NextResponse.json(
      { error: 'Failed to send invoice. Please try again.' },
      { status: 502 }
    );
  }

  const sentAt = new Date().toISOString();

  const { error: updateErr } = await supabase
    .from('invoices')
    .update({ status: 'sent', sent_at: sentAt, updated_at: sentAt })
    .eq('id', invoiceData.id)
    .eq('user_id', user.id);

  if (updateErr) {
    // eslint-disable-next-line no-console
    console.error('Invoice update error:', updateErr);
  }

  return NextResponse.json({ ok: true, sentTo: toEmail, sentAt });
}
