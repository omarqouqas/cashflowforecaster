import { getQuotes, getQuoteSummary } from '@/lib/actions/quotes';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus, FileText, ArrowLeft } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/format';
import { canUseInvoicing } from '@/lib/stripe/subscription';
import { InvoicingUpgradePrompt } from '@/components/invoices/invoicing-upgrade-prompt';
import { QuotesContent } from '@/components/quotes/quotes-content';
import { isRedirectError } from 'next/dist/client/components/redirect';
import { createClient } from '@/lib/supabase/server';
import { requireAuth } from '@/lib/auth/session';

interface QuotesPageProps {
  searchParams?: { success?: string };
}

export default async function QuotesPage({ searchParams }: QuotesPageProps) {
  const hasInvoicingAccess = await canUseInvoicing();
  if (!hasInvoicingAccess) {
    return <InvoicingUpgradePrompt />;
  }

  const user = await requireAuth();
  const supabase = await createClient();

  let quotes: Awaited<ReturnType<typeof getQuotes>> = [];
  let summary: Awaited<ReturnType<typeof getQuoteSummary>> | null = null;
  let error: string | null = null;
  let currency = 'USD';

  try {
    // Fetch quotes, summary, and user settings in parallel
    const [quotesData, summaryData, settingsResult] = await Promise.all([
      getQuotes(),
      getQuoteSummary(),
      supabase
        .from('user_settings')
        .select('currency')
        .eq('user_id', user.id)
        .single(),
    ]);
    quotes = quotesData;
    summary = summaryData;
    currency = settingsResult.data?.currency ?? 'USD';
  } catch (e) {
    // Don't treat auth redirects as fetch failures
    if (isRedirectError(e)) {
      throw e;
    }
    error = e instanceof Error ? e.message : 'Unknown error';
    // eslint-disable-next-line no-console
    console.error('Error fetching quotes:', e);
  }

  return (
    <>
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center text-sm text-zinc-400 hover:text-teal-400 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </Link>
      </div>

      {/* Success */}
      {searchParams?.success === 'quote-deleted' && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3 mb-6">
          <p className="text-sm text-emerald-400">Quote deleted successfully</p>
        </div>
      )}

      {/* Page Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-zinc-100">Quotes</h2>
          <p className="text-sm text-zinc-400 mt-1">
            Create quotes and convert them to invoices when accepted
          </p>
        </div>
        <Link href="/dashboard/quotes/new">
          <Button variant="primary">
            <Plus className="w-4 h-4 mr-2" />
            Create Quote
          </Button>
        </Link>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-rose-500/10 border border-rose-500/30 rounded-lg p-4 mb-6">
          <p className="text-sm text-rose-400">
            Error loading quotes. Please try refreshing the page.
          </p>
        </div>
      )}

      {/* Content */}
      {!error && (
        <>
          {quotes.length === 0 ? (
            <div className="border border-zinc-800 bg-zinc-900 rounded-lg p-12 text-center">
              <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-teal-400" />
              </div>
              <p className="text-zinc-100 font-semibold text-lg mb-2">No quotes yet</p>
              <p className="text-sm text-zinc-400 mb-6 max-w-md mx-auto">
                Create your first quote to send professional proposals to your clients.
              </p>
              <Link href="/dashboard/quotes/new">
                <Button variant="primary">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Quote
                </Button>
              </Link>
            </div>
          ) : (
            <>
              {/* Summary Stats */}
              {summary && (
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
                  <div className="border border-zinc-800 bg-zinc-900 rounded-lg p-4">
                    <p className="text-xs font-medium text-zinc-400 mb-1">Total Pending</p>
                    {Object.keys(summary.pendingByCurrency).length === 0 ? (
                      <p className="text-2xl font-bold text-zinc-100 tabular-nums">
                        {formatCurrency(0, currency)}
                      </p>
                    ) : Object.keys(summary.pendingByCurrency).length === 1 ? (
                      <p className="text-2xl font-bold text-zinc-100 tabular-nums">
                        {formatCurrency(
                          Object.values(summary.pendingByCurrency)[0] ?? 0,
                          Object.keys(summary.pendingByCurrency)[0] ?? currency
                        )}
                      </p>
                    ) : (
                      <div className="space-y-1">
                        {Object.entries(summary.pendingByCurrency).map(([curr, amount]) => (
                          <p key={curr} className="text-lg font-bold text-zinc-100 tabular-nums">
                            {formatCurrency(amount, curr)}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="border border-zinc-800 bg-zinc-900 rounded-lg p-4">
                    <p className="text-xs font-medium text-zinc-400 mb-1">Awaiting Response</p>
                    <p className="text-2xl font-bold text-zinc-100 tabular-nums">
                      {summary.awaitingResponse}
                    </p>
                  </div>
                  <div className="border border-zinc-800 bg-zinc-900 rounded-lg p-4">
                    <p className="text-xs font-medium text-zinc-400 mb-1">Accepted</p>
                    <p className="text-2xl font-bold text-emerald-400 tabular-nums">
                      {summary.accepted}
                    </p>
                  </div>
                  <div className="border border-zinc-800 bg-zinc-900 rounded-lg p-4">
                    <p className="text-xs font-medium text-zinc-400 mb-1">Expiring Soon</p>
                    <p className="text-2xl font-bold text-amber-400 tabular-nums">
                      {summary.expiringSoon}
                    </p>
                  </div>
                </div>
              )}

              {/* Quote List with Filters */}
              <QuotesContent quotes={quotes as any} />
            </>
          )}
        </>
      )}
    </>
  );
}
