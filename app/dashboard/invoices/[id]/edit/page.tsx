import { redirect } from 'next/navigation';
import { getInvoice } from '@/lib/actions/invoices';
import { EditInvoiceForm } from '@/components/invoices/edit-invoice-form';

export default async function EditInvoicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const invoice = await getInvoice(id);
  if (!invoice) {
    redirect('/dashboard/invoices');
  }

  const status = invoice.status ?? 'draft';
  if (status === 'paid') {
    redirect(`/dashboard/invoices/${id}?error=paid-cannot-edit`);
  }

  return <EditInvoiceForm invoice={invoice} />;
}
