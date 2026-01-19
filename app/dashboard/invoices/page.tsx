import { getInvoices } from '@/lib/actions/invoices';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus, Receipt, ArrowLeft } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/format';
import { canUseInvoicing } from '@/lib/stripe/subscription';
import { InvoicingUpgradePrompt } from '@/components/invoices/invoicing-upgrade-prompt';
import { InvoicesContent } from '@/components/invoices/invoices-content';
import type { Tables } from '@/types/supabase';
import { isRedirectError } from 'next/dist/client/components/redirect';

interface InvoicesPageProps {
  searchParams?: { success?: string };
}

function isOverdue(dueDate: string, status: string | null | undefined) {
  if ((status ?? 'draft') === 'paid') return false;
  const today = new Date();
  const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const due = new Date(`${dueDate}T00:00:00`);
  return due < todayMidnight;
}

export default async function InvoicesPage({ searchParams }: InvoicesPageProps) {
  const hasInvoicingAccess = await canUseInvoicing();
  if (!hasInvoicingAccess) {
    return <InvoicingUpgradePrompt />;
  }

  let invoices: Tables<'invoices'>[] = [];
  let error: string | null = null;

  try {
    invoices = await getInvoices();
  } catch (e) {
    // Don't treat auth redirects as fetch failures (common during build/static generation)
    if (isRedirectError(e)) {
      throw e;
    }
    error = e instanceof Error ? e.message : 'Unknown error';
    // eslint-disable-next-line no-console
    console.error('Error fetching invoices:', e);
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
      {searchParams?.success === 'invoice-deleted' && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3 mb-6">
          <p className="text-sm text-emerald-400">✓ Invoice deleted successfully</p>
        </div>
      )}

      {/* Page Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-zinc-100">Invoices</h2>
          <p className="text-sm text-zinc-400 mt-1">
            Create invoices and track who has paid
          </p>
        </div>
        <Link href="/dashboard/invoices/new">
          <Button variant="primary">
            <Plus className="w-4 h-4 mr-2" />
            Create Invoice
          </Button>
        </Link>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-rose-500/10 border border-rose-500/30 rounded-lg p-4 mb-6">
          <p className="text-sm text-rose-400">
            Error loading invoices. Please try refreshing the page.
          </p>
        </div>
      )}

      {/* Content */}
      {!error && (
        <>
          {invoices.length === 0 ? (
            <div className="border border-zinc-800 bg-zinc-900 rounded-lg p-12 text-center">
              <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Receipt className="w-8 h-8 text-teal-400" />
              </div>
              <p className="text-zinc-100 font-semibold text-lg mb-2">No invoices yet</p>
              <p className="text-sm text-zinc-400 mb-6 max-w-md mx-auto">
                Create your first invoice to get paid faster and automatically sync it with your cash flow forecast.
              </p>
              <Link href="/dashboard/invoices/new">
                <Button variant="primary">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Invoice
                </Button>
              </Link>
            </div>
          ) : (() => {
            // Calculate summary stats
            const totalOutstanding = invoices
              .filter((inv) => (inv.status ?? 'draft') !== 'paid')
              .reduce((sum, inv) => sum + inv.amount, 0);
            const overdueCount = invoices.filter((inv) => isOverdue(inv.due_date, inv.status)).length;
            const awaitingPaymentCount = invoices.filter((inv) => {
              const s = inv.status ?? 'draft';
              return s === 'sent' || s === 'viewed';
            }).length;

            return (
              <>
                {/* Summary Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  <div className="border border-zinc-800 bg-zinc-900 rounded-lg p-4">
                    <p className="text-xs font-medium text-zinc-400 mb-1">Total Outstanding</p>
                    <p className="text-2xl font-bold text-zinc-100 tabular-nums">
                      {formatCurrency(totalOutstanding)}
                    </p>
                  </div>
                  <div className="border border-zinc-800 bg-zinc-900 rounded-lg p-4">
                    <p className="text-xs font-medium text-zinc-400 mb-1">Awaiting Payment</p>
                    <p className="text-2xl font-bold text-zinc-100 tabular-nums">
                      {awaitingPaymentCount}
                    </p>
                  </div>
                  <div className="border border-zinc-800 bg-zinc-900 rounded-lg p-4">
                    <p className="text-xs font-medium text-zinc-400 mb-1">Overdue</p>
                    <p className="text-2xl font-bold text-rose-400 tabular-nums">
                      {overdueCount}
                    </p>
                  </div>
                </div>

                {/* Invoice List with Filters */}
                <InvoicesContent invoices={invoices as any} />
              </>
            );
          })()}
        </>
      )}
    </>
  );
}
