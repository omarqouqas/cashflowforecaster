'use client';

import { Download } from 'lucide-react';

export function DownloadQuotePdfButton({ quoteId }: { quoteId: string }) {
  return (
    <button
      type="button"
      onClick={() => window.open(`/api/quotes/${quoteId}/pdf`, '_blank', 'noopener,noreferrer')}
      className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 min-h-[32px] transition-colors"
      aria-label="Download quote PDF"
      title="Download PDF"
    >
      <Download className="w-3.5 h-3.5" />
      <span className="hidden sm:inline">Download PDF</span>
    </button>
  );
}
