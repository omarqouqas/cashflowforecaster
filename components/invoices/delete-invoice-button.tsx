'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';
import { deleteInvoice } from '@/lib/actions/invoices';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '@/components/ui/tooltip';
import { showError, showSuccess } from '@/lib/toast';

export function DeleteInvoiceButton({
  invoiceId,
  status,
}: {
  invoiceId: string;
  status: string | null | undefined;
}) {
  const router = useRouter();
  const [isConfirming, setIsConfirming] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const s = status ?? 'draft';
  const canDelete = s === 'draft';

  const handleDelete = async () => {
    if (isDeleting) return;
    setIsDeleting(true);
    setError(null);

    try {
      await deleteInvoice(invoiceId);
      showSuccess('Deleted successfully');
      router.push('/dashboard/invoices');
      router.refresh();
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Failed to delete invoice';
      showError(message);
      setError(message);
      setIsDeleting(false);
    }
  };

  if (!canDelete) {
    return (
      <div className="flex items-center gap-2">
        <Button variant="danger" size="sm" disabled>
          <Trash2 className="w-4 h-4" />
          Delete
        </Button>
        <InfoTooltip content="Only draft invoices can be deleted." />
      </div>
    );
  }

  if (!isConfirming) {
    return (
      <Button variant="danger" size="sm" onClick={() => setIsConfirming(true)}>
        <Trash2 className="w-4 h-4" />
        Delete
      </Button>
    );
  }

  return (
    <div className="w-full border border-rose-200 bg-rose-50 rounded-lg p-4">
      <p className="text-sm font-medium text-rose-900">Delete this invoice?</p>
      <p className="text-sm text-rose-800 mt-1">
        This will also remove the linked income entry from your forecast.
      </p>

      {error && <p className="text-sm text-rose-700 mt-2">{error}</p>}

      <div className="flex flex-col sm:flex-row gap-2 mt-4">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setIsConfirming(false)}
          disabled={isDeleting}
        >
          Cancel
        </Button>
        <Button variant="danger" size="sm" onClick={handleDelete} loading={isDeleting}>
          Confirm delete
        </Button>
      </div>
    </div>
  );
}
