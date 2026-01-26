'use client';

import { Download, Clock, CheckCircle, XCircle, Loader2, FileSpreadsheet } from 'lucide-react';
import type { ExportHistoryItem, ExportFormat, ReportType } from '@/lib/export/types';

interface ExportHistorySectionProps {
  history: ExportHistoryItem[];
  historyLimit: number | null;
  isPro: boolean;
}

const FORMAT_LABELS: Record<ExportFormat, string> = {
  csv: 'CSV',
  excel: 'Excel',
  pdf: 'PDF',
  json: 'JSON',
};

const REPORT_TYPE_LABELS: Record<ReportType, string> = {
  monthly_summary: 'Monthly Summary',
  category_spending: 'Category Spending',
  cash_forecast: 'Cash Forecast',
  all_data: 'All Data',
  custom: 'Custom Export',
};

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

function formatFileSize(bytes: number | null): string {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function StatusIcon({ status }: { status: ExportHistoryItem['status'] }) {
  switch (status) {
    case 'completed':
      return <CheckCircle className="w-4 h-4 text-emerald-400" />;
    case 'failed':
      return <XCircle className="w-4 h-4 text-rose-400" />;
    case 'processing':
      return <Loader2 className="w-4 h-4 text-amber-400 animate-spin" />;
    default:
      return <Clock className="w-4 h-4 text-zinc-500" />;
  }
}

export function ExportHistorySection({
  history,
  historyLimit,
  isPro,
}: ExportHistorySectionProps) {
  const displayedHistory = historyLimit ? history.slice(0, historyLimit) : history;
  const hasMore = historyLimit && history.length > historyLimit;

  if (history.length === 0) {
    return (
      <section>
        <h2 className="text-lg font-semibold text-zinc-100 mb-4">Recent Exports</h2>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 text-center">
          <FileSpreadsheet className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
          <p className="text-zinc-400 text-sm">No exports yet</p>
          <p className="text-zinc-500 text-xs mt-1">
            Your export history will appear here
          </p>
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-zinc-100">Recent Exports</h2>
        {!isPro && historyLimit && (
          <span className="text-xs text-zinc-500">
            Showing {Math.min(history.length, historyLimit)} of {history.length}
          </span>
        )}
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="divide-y divide-zinc-800">
          {displayedHistory.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-4 hover:bg-zinc-800/50 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <StatusIcon status={item.status} />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-zinc-100 truncate">
                    {item.name}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-zinc-500">
                      {REPORT_TYPE_LABELS[item.report_type]}
                    </span>
                    <span className="text-zinc-700">·</span>
                    <span className="text-xs text-zinc-500">
                      {FORMAT_LABELS[item.format]}
                    </span>
                    {item.file_size_bytes && (
                      <>
                        <span className="text-zinc-700">·</span>
                        <span className="text-xs text-zinc-500">
                          {formatFileSize(item.file_size_bytes)}
                        </span>
                      </>
                    )}
                    <span className="text-zinc-700">·</span>
                    <span className="text-xs text-zinc-500">
                      {formatRelativeTime(item.created_at)}
                    </span>
                  </div>
                </div>
              </div>

              {item.status === 'completed' && item.file_url ? (
                <a
                  href={item.file_url}
                  download={`${item.name.replace(/[^a-zA-Z0-9-_ ]/g, '')}.${item.format === 'excel' ? 'xlsx' : item.format}`}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-teal-400 hover:text-teal-300 hover:bg-teal-500/10 rounded-lg transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">Download</span>
                </a>
              ) : item.status === 'completed' && !item.file_url ? (
                <span className="text-xs text-zinc-500">Expired</span>
              ) : null}

              {item.status === 'failed' && item.error_message && (
                <span className="text-xs text-rose-400 max-w-[150px] truncate">
                  {item.error_message}
                </span>
              )}

              {item.status === 'processing' && (
                <span className="text-xs text-amber-400">Processing...</span>
              )}
            </div>
          ))}
        </div>

        {hasMore && !isPro && (
          <div className="p-4 bg-zinc-800/30 border-t border-zinc-800 text-center">
            <p className="text-sm text-zinc-400">
              Upgrade to Pro to see full export history
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
