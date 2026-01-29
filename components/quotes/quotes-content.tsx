'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { Pencil, Clock } from 'lucide-react';
import { formatCurrency, formatDateOnly } from '@/lib/utils/format';
import { DownloadQuotePdfButton } from './download-quote-pdf-button';
import { DeleteQuoteIconButton } from './delete-quote-icon-button';
import { SendQuoteButton } from './send-quote-button';
import {
  QuotesFilterBar,
  useQuotesFilters,
  defaultQuotesFilters,
  type QuotesFilters,
  type QuoteStatus,
} from './quotes-filters';

interface Quote {
  id: string;
  quote_number: string;
  client_name: string;
  client_email: string | null;
  amount: number;
  currency: string;
  valid_until: string;
  status: string | null;
  sent_at: string | null;
  converted_invoice_id: string | null;
  user_id: string;
  created_at: string;
  updated_at: string;
}

interface QuotesContentProps {
  quotes: Quote[];
}

function statusBadge(status: string | null | undefined) {
  const s = status ?? 'draft';
  switch (s) {
    case 'draft':
      return 'bg-zinc-800 text-zinc-300 border border-zinc-700';
    case 'sent':
      return 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
    case 'viewed':
      return 'bg-amber-500/20 text-amber-400 border border-amber-500/30';
    case 'accepted':
      return 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
    case 'rejected':
      return 'bg-rose-500/20 text-rose-400 border border-rose-500/30';
    case 'expired':
      return 'bg-zinc-600/20 text-zinc-400 border border-zinc-600/30';
    default:
      return 'bg-zinc-800 text-zinc-300 border border-zinc-700';
  }
}

function isExpired(validUntil: string) {
  const today = new Date();
  const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const valid = new Date(`${validUntil}T00:00:00`);
  return valid < todayMidnight;
}

function isExpiringSoon(validUntil: string, status: string | null | undefined) {
  const s = status ?? 'draft';
  // Only show expiring soon for active quotes
  if (!['draft', 'sent', 'viewed'].includes(s)) return false;

  const today = new Date();
  const valid = new Date(`${validUntil}T00:00:00`);
  const daysUntilExpiry = Math.ceil((valid.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  return daysUntilExpiry >= 0 && daysUntilExpiry <= 7;
}

/**
 * Filter quotes based on the current filter settings
 */
function filterQuotes(quotes: Quote[], filters: QuotesFilters): Quote[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return quotes.filter((quote) => {
    // Filter by status
    const quoteStatus = (quote.status ?? 'draft') as QuoteStatus;
    if (!filters.statuses.includes(quoteStatus)) return false;

    // Filter by expiring soon
    if (filters.expiringSoon) {
      if (!isExpiringSoon(quote.valid_until, quote.status)) return false;
    }

    // Filter by valid_until date range
    if (filters.validUntilStart) {
      const validDate = new Date(quote.valid_until + 'T00:00:00');
      if (validDate < filters.validUntilStart) return false;
    }
    if (filters.validUntilEnd) {
      const validDate = new Date(quote.valid_until + 'T00:00:00');
      if (validDate > filters.validUntilEnd) return false;
    }

    // Filter by amount range
    if (filters.amountMin !== null && quote.amount < filters.amountMin) return false;
    if (filters.amountMax !== null && quote.amount > filters.amountMax) return false;

    // Filter by search term (client name or quote number)
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesClient = quote.client_name.toLowerCase().includes(searchLower);
      const matchesQuoteNumber = quote.quote_number.toLowerCase().includes(searchLower);
      if (!matchesClient && !matchesQuoteNumber) return false;
    }

    return true;
  });
}

/**
 * QuotesContent - Client component for Quotes page with filtering
 */
export function QuotesContent({ quotes }: QuotesContentProps) {
  const { filters, setFilters, visibleFilters, setVisibleFilters } = useQuotesFilters();

  // Apply filters to quotes
  const filteredQuotes = useMemo(
    () => filterQuotes(quotes, filters),
    [quotes, filters]
  );

  // Show empty state when all quotes are filtered out
  const showEmptyState = quotes.length > 0 && filteredQuotes.length === 0;

  // Expiring soon quotes for the banner
  const expiringSoonQuotes = useMemo(
    () => quotes.filter((q) => isExpiringSoon(q.valid_until, q.status)),
    [quotes]
  );

  return (
    <>
      {/* Filter Bar */}
      {quotes.length > 0 && (
        <div className="mb-6">
          <QuotesFilterBar
            filters={filters}
            onChange={setFilters}
            resultCount={filteredQuotes.length}
            visibleFilters={visibleFilters}
            onVisibleFiltersChange={setVisibleFilters}
          />
        </div>
      )}

      {/* Expiring Soon Banner */}
      {expiringSoonQuotes.length > 0 && (
        <div className="mb-4">
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="flex items-start gap-2">
                <div className="mt-0.5">
                  <Clock className="w-4 h-4 text-amber-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-amber-100">
                    {expiringSoonQuotes.length} quote{expiringSoonQuotes.length === 1 ? '' : 's'} expiring soon
                  </p>
                  <p className="text-xs text-amber-300/80 mt-0.5">
                    Valid for 7 days or less.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showEmptyState ? (
        <div className="border border-zinc-800 bg-zinc-900 rounded-lg p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-zinc-800 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-zinc-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-zinc-300 mb-2">
            No quotes match your filters
          </h3>
          <p className="text-sm text-zinc-500 mb-4">
            Try adjusting your filters to see more results.
          </p>
          <button
            onClick={() => setFilters(defaultQuotesFilters)}
            className="text-sm font-medium text-teal-400 hover:text-teal-300 transition-colors"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="border border-zinc-800 bg-zinc-900 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-zinc-800 border-b border-zinc-700">
                <tr>
                  <th className="text-left font-medium text-zinc-300 px-4 py-4">Quote</th>
                  <th className="text-left font-medium text-zinc-300 px-4 py-4">Client</th>
                  <th className="text-right font-medium text-zinc-300 px-4 py-4">Amount</th>
                  <th className="text-left font-medium text-zinc-300 px-4 py-4">Valid until</th>
                  <th className="text-left font-medium text-zinc-300 px-4 py-4">Status</th>
                  <th className="text-right font-medium text-zinc-300 px-4 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {filteredQuotes.map((quote) => {
                  const showExpiringSoonIndicator = isExpiringSoon(quote.valid_until, quote.status);
                  const expired = isExpired(quote.valid_until);
                  const status = quote.status ?? 'draft';

                  return (
                    <tr key={quote.id} className="hover:bg-zinc-800/50 transition-colors">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          {showExpiringSoonIndicator && (
                            <span
                              className="inline-block w-2 h-2 rounded-full bg-amber-500 animate-pulse"
                              title="Expiring soon"
                              aria-label="Expiring soon"
                            />
                          )}
                          <Link
                            href={`/dashboard/quotes/${quote.id}`}
                            className="text-zinc-100 font-medium hover:text-teal-400 transition-colors"
                          >
                            {quote.quote_number}
                          </Link>
                          {quote.converted_invoice_id && (
                            <span
                              className="text-xs text-teal-400"
                              title="Converted to invoice"
                            >
                              (invoiced)
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-zinc-300">{quote.client_name}</td>
                      <td className="px-4 py-4 text-right tabular-nums font-semibold text-zinc-100 text-base">
                        {formatCurrency(quote.amount, quote.currency)}
                      </td>
                      <td className="px-4 py-4 text-zinc-300">
                        <div className="flex items-center gap-2">
                          <span>{formatDateOnly(quote.valid_until)}</span>
                          {expired && !['accepted', 'rejected', 'expired'].includes(status) && (
                            <span className="text-xs font-semibold text-rose-400 bg-rose-500/20 px-2 py-0.5 rounded border border-rose-500/30">
                              Expired
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={[
                            'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium capitalize',
                            statusBadge(quote.status),
                          ].join(' ')}
                        >
                          {quote.status ?? 'draft'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="inline-flex items-center justify-end gap-2">
                          {status === 'draft' && (
                            <SendQuoteButton
                              quoteId={quote.id}
                              clientEmail={quote.client_email}
                              disabled={!quote.client_email}
                              compact
                            />
                          )}
                          {(() => {
                            const showEdit = status === 'draft' || status === 'sent';
                            return (
                              showEdit && (
                                <Link
                                  href={`/dashboard/quotes/${quote.id}/edit`}
                                  className="p-2 text-zinc-400 hover:text-teal-400 hover:bg-teal-500/10 rounded-md transition-colors"
                                  aria-label="Edit quote"
                                  title="Edit quote"
                                >
                                  <Pencil className="w-4 h-4" />
                                </Link>
                              )
                            );
                          })()}

                          {status === 'draft' && (
                            <DeleteQuoteIconButton
                              quoteId={quote.id}
                              quoteLabel={quote.quote_number}
                            />
                          )}

                          {/* Always visible */}
                          <DownloadQuotePdfButton quoteId={quote.id} />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}
