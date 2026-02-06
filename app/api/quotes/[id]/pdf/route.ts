import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { renderToBuffer } from '@react-pdf/renderer';
import { QuoteTemplate } from '@/lib/pdf/quote-template';
import { canUseInvoicing } from '@/lib/stripe/subscription';
import { rateLimiters } from '@/lib/utils/rate-limit';
import type { Quote } from '@/lib/actions/quotes';

export const runtime = 'nodejs';

export async function GET(
  _request: NextRequest,
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

  // Rate limiting per user
  if (!rateLimiters.pdf.check(user.id)) {
    return NextResponse.json(
      { error: 'Too many requests. Please wait a moment.' },
      { status: 429 }
    );
  }

  const hasAccess = await canUseInvoicing(user.id);
  if (!hasAccess) {
    return NextResponse.json(
      { error: 'Quotes require a Pro subscription' },
      { status: 403 }
    );
  }

  // Fetch quote and branding settings in parallel
  const [quoteResult, brandingResult] = await Promise.all([
    supabase
      .from('quotes')
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

  const { data: quote, error } = quoteResult;
  const branding = brandingResult.data;

  if (error || !quote) {
    return NextResponse.json({ error: 'Quote not found' }, { status: 404 });
  }

  const doc = QuoteTemplate({
    quote: quote as Quote,
    fromEmail: user.email ?? 'Unknown',
    businessName: branding?.business_name,
    logoUrl: branding?.logo_url,
  });

  const pdfBuffer = await renderToBuffer(doc);

  const filename = `${(quote as Quote).quote_number || 'quote'}.pdf`;

  return new NextResponse(new Uint8Array(pdfBuffer), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="${filename}"`,
      'Cache-Control': 'private, max-age=0, must-revalidate',
    },
  });
}
