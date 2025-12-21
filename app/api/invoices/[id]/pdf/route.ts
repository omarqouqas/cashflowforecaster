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

  const { data: invoice, error } = await supabase
    .from('invoices')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    // RLS + not found will typically look like a "no rows" error
    return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
  }

  const doc = InvoiceTemplate({
    invoice,
    fromEmail: user.email ?? 'Unknown',
  });

  const pdfBuffer = await renderToBuffer(doc);

  const filename = `${invoice.invoice_number || 'invoice'}.pdf`;

  // NextResponse expects a BodyInit; Buffer isn't always accepted by TS, but Uint8Array is.
  return new NextResponse(new Uint8Array(pdfBuffer), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="${filename}"`,
      'Cache-Control': 'private, max-age=0, must-revalidate',
    },
  });
}


