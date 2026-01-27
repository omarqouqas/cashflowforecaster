import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { renderToBuffer } from '@react-pdf/renderer';
import { InvoiceTemplate } from '@/lib/pdf/invoice-template';
import { canUseInvoicing } from '@/lib/stripe/subscription';

export const runtime = 'nodejs';

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
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
    // RLS + not found will typically look like a "no rows" error
    return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
  }

  const doc = InvoiceTemplate({
    invoice: invoice as any,
    fromEmail: user.email ?? 'Unknown',
    businessName: branding?.business_name,
    logoUrl: branding?.logo_url,
  });

  const pdfBuffer = await renderToBuffer(doc);

  const filename = `${(invoice as any).invoice_number || 'invoice'}.pdf`;

  // NextResponse expects a BodyInit; Buffer isn't always accepted by TS, but Uint8Array is.
  return new NextResponse(new Uint8Array(pdfBuffer), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="${filename}"`,
      'Cache-Control': 'private, max-age=0, must-revalidate',
    },
  });
}


