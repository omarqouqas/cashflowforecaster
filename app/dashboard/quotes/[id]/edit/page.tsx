import { redirect } from 'next/navigation';
import { getQuote } from '@/lib/actions/quotes';
import { EditQuoteForm } from '@/components/quotes/edit-quote-form';
import { canUseInvoicing } from '@/lib/stripe/subscription';

export default async function EditQuotePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const hasAccess = await canUseInvoicing();
  if (!hasAccess) {
    redirect('/dashboard/quotes');
  }

  const { id } = await params;

  const quote = await getQuote(id);
  if (!quote) {
    redirect('/dashboard/quotes');
  }

  // Only draft and sent quotes can be edited
  const status = quote.status ?? 'draft';
  if (!['draft', 'sent'].includes(status)) {
    redirect(`/dashboard/quotes/${id}`);
  }

  return <EditQuoteForm quote={quote} />;
}
