'use client';

import { Download } from 'lucide-react';

export function DownloadPdfButton({ invoiceId }: { invoiceId: string }) {
  return (
    <button
      type="button"
      onClick={() => window.open(`/api/invoices/${invoiceId}/pdf`, '_blank', 'noopener,noreferrer')}
      className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 min-h-[32px]"
      aria-label="Download invoice PDF"
      title="Download PDF"
    >
      <Download className="w-3.5 h-3.5" />
      <span className="hidden sm:inline">Download PDF</span>
    </button>
  );
}


