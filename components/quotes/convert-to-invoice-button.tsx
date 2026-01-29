'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FileText, ArrowRight } from 'lucide-react';
import { convertQuoteToInvoice } from '@/lib/actions/quotes';
import { Button } from '@/components/ui/button';
import { showError, showSuccess } from '@/lib/toast';

export function ConvertToInvoiceButton({
  quoteId,
  status,
  convertedInvoiceId,
}: {
  quoteId: string;
  status: string | null | undefined;
  convertedInvoiceId: string | null | undefined;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const s = status ?? 'draft';

  // If already converted, show link to invoice
  if (convertedInvoiceId) {
    return (
      <Button
        variant="secondary"
        size="sm"
        onClick={() => router.push(`/dashboard/invoices/${convertedInvoiceId}`)}
      >
        <FileText className="w-4 h-4" />
        View Invoice
        <ArrowRight className="w-4 h-4" />
      </Button>
    );
  }

  // Can only convert accepted quotes
  if (s !== 'accepted') {
    return null;
  }

  const handleConvert = async () => {
    if (isLoading) return;

    const confirmed = window.confirm(
      'Convert this quote to an invoice? This will create a new invoice with the same details.'
    );
    if (!confirmed) return;

    setIsLoading(true);

    try {
      const result = await convertQuoteToInvoice(quoteId);
      showSuccess('Quote converted to invoice');
      router.push(`/dashboard/invoices/${result.invoiceId}`);
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Failed to convert quote';
      showError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="primary"
      size="sm"
      onClick={handleConvert}
      loading={isLoading}
    >
      <FileText className="w-4 h-4" />
      Convert to Invoice
    </Button>
  );
}
