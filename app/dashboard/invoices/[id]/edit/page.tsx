import { redirect } from 'next/navigation';
import { getInvoice } from '@/lib/actions/invoices';
import { EditInvoiceForm } from '@/components/invoices/edit-invoice-form';
import { canUseInvoicing } from '@/lib/stripe/subscription';

export default async function EditInvoicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const hasAccess = await canUseInvoicing();
  if (!hasAccess) {
    redirect('/dashboard/invoices');
  }

  const { id } = await params;

  const invoice = await getInvoice(id);
  if (!invoice) {
    redirect('/dashboard/invoices');
  }

  return <EditInvoiceForm invoice={invoice} />;
}
