'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';
import { deleteQuote } from '@/lib/actions/quotes';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '@/components/ui/tooltip';
import { showError, showSuccess } from '@/lib/toast';

export function DeleteQuoteButton({
  quoteId,
  status,
}: {
  quoteId: string;
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
      await deleteQuote(quoteId);
      showSuccess('Deleted successfully');
      router.push('/dashboard/quotes');
      router.refresh();
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Failed to delete quote';
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
        <InfoTooltip content="Only draft quotes can be deleted." />
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
    <div className="w-full border border-rose-500/30 bg-rose-500/10 rounded-lg p-4">
      <p className="text-sm font-medium text-rose-400">Delete this quote?</p>
      <p className="text-sm text-rose-300 mt-1">
        This action cannot be undone.
      </p>

      {error && <p className="text-sm text-rose-400 mt-2">{error}</p>}

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
