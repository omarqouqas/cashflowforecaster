import { redirect } from 'next/navigation';
import { canUseInvoicing } from '@/lib/stripe/subscription';
import { NewInvoiceForm } from '@/components/invoices/new-invoice-form';

export default async function NewInvoicePage() {
  const hasAccess = await canUseInvoicing();
  if (!hasAccess) {
    redirect('/dashboard/invoices');
  }

  return <NewInvoiceForm />;
}


