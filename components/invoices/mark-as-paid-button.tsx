'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateInvoiceStatus } from '@/lib/actions/invoices';
import { showError, showSuccess } from '@/lib/toast';

export function MarkAsPaidButton({ invoiceId }: { invoiceId: string }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      await updateInvoiceStatus(invoiceId, 'paid');
      showSuccess('Invoice marked as paid');
      router.refresh();
    } catch (e) {
      showError(e instanceof Error ? e.message : 'Failed to update invoice');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isLoading}
      className="inline-flex items-center justify-center px-4 py-2.5 min-h-[44px] rounded-md bg-teal-600 hover:bg-teal-700 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isLoading ? 'Marking…' : 'Mark as Paid'}
    </button>
  );
}


