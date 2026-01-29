'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, XCircle } from 'lucide-react';
import { updateQuoteStatus } from '@/lib/actions/quotes';
import { Button } from '@/components/ui/button';
import { showError, showSuccess } from '@/lib/toast';

type QuoteStatus = 'draft' | 'sent' | 'viewed' | 'accepted' | 'rejected' | 'expired';

export function MarkQuoteStatusButton({
  quoteId,
  currentStatus,
  targetStatus,
}: {
  quoteId: string;
  currentStatus: string | null | undefined;
  targetStatus: 'accepted' | 'rejected';
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const status = (currentStatus ?? 'draft') as QuoteStatus;

  // Only show for sent or viewed quotes
  const canChangeStatus = status === 'sent' || status === 'viewed';
  if (!canChangeStatus) return null;

  const handleClick = async () => {
    if (isLoading) return;

    const action = targetStatus === 'accepted' ? 'accept' : 'reject';
    const confirmed = window.confirm(
      `Mark this quote as ${targetStatus}?`
    );
    if (!confirmed) return;

    setIsLoading(true);

    try {
      await updateQuoteStatus(quoteId, targetStatus);
      showSuccess(`Quote marked as ${targetStatus}`);
      router.refresh();
    } catch (e) {
      const message = e instanceof Error ? e.message : `Failed to ${action} quote`;
      showError(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (targetStatus === 'accepted') {
    return (
      <Button
        variant="primary"
        size="sm"
        onClick={handleClick}
        loading={isLoading}
      >
        <CheckCircle className="w-4 h-4" />
        Accept Quote
      </Button>
    );
  }

  return (
    <Button
      variant="danger"
      size="sm"
      onClick={handleClick}
      loading={isLoading}
    >
      <XCircle className="w-4 h-4" />
      Reject Quote
    </Button>
  );
}

export function QuoteStatusActions({
  quoteId,
  status,
}: {
  quoteId: string;
  status: string | null | undefined;
}) {
  const s = (status ?? 'draft') as QuoteStatus;

  // Only show for sent or viewed quotes
  if (s !== 'sent' && s !== 'viewed') return null;

  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <MarkQuoteStatusButton
        quoteId={quoteId}
        currentStatus={status}
        targetStatus="accepted"
      />
      <MarkQuoteStatusButton
        quoteId={quoteId}
        currentStatus={status}
        targetStatus="rejected"
      />
    </div>
  );
}
