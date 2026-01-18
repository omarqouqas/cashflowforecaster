import { getInvoices } from '@/lib/actions/invoices';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus, Receipt, ArrowLeft, Pencil, AlertTriangle } from 'lucide-react';
import { formatCurrency, formatDateOnly } from '@/lib/utils/format';
import { DownloadPdfButton } from '@/components/invoices/download-pdf-button';
import { DeleteInvoiceIconButton } from '@/components/invoices/delete-invoice-icon-button';
import { SendInvoiceButton } from '@/components/invoices/send-invoice-button';
import { canUseInvoicing } from '@/lib/stripe/subscription';
import { InvoicingUpgradePrompt } from '@/components/invoices/invoicing-upgrade-prompt';
import type { Tables } from '@/types/supabase';
import { isRedirectError } from 'next/dist/client/components/redirect';

function statusBadge(status: string | null | undefined) {
  const s = status ?? 'draft';
  switch (s) {
    case 'draft':
      return 'bg-zinc-800 text-zinc-300 border border-zinc-700';
    case 'sent':
      return 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
    case 'viewed':
      return 'bg-amber-500/20 text-amber-400 border border-amber-500/30';
    case 'paid':
      return 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
    default:
      return 'bg-zinc-800 text-zinc-300 border border-zinc-700';
  }
}

interface InvoicesPageProps {
  searchParams?: { success?: string; filter?: string };
}

function isOverdue(dueDate: string, status: string | null | undefined) {
  if ((status ?? 'draft') === 'paid') return false;
  const today = new Date();
  const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const due = new Date(`${dueDate}T00:00:00`);
  return due < todayMidnight;
}

function wasRemindedRecently(lastReminderAt: string | null, now = new Date()) {
  if (!lastReminderAt) return false;
  const last = new Date(lastReminderAt);
  if (Number.isNaN(last.getTime())) return false;
  const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;
  return now.getTime() - last.getTime() < THREE_DAYS_MS;
}

function needsFollowUp(invoice: Tables<'invoices'>, now = new Date()) {
  const status = invoice.status ?? 'draft';
  if (!(status === 'sent' || status === 'viewed')) return false;
  if (!isOverdue(invoice.due_date, status)) return false;
  // Either never reminded, or last reminder was 3+ days ago
  if (!invoice.last_reminder_at) return true;
  return !wasRemindedRecently(invoice.last_reminder_at, now);
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
            const now = new Date();
            const followUpInvoices = invoices.filter((inv) => needsFollowUp(inv, now));
            const filter = (searchParams?.filter ?? '').toLowerCase();
            const showFollowUpOnly = filter === 'followup';
            const visibleInvoices = showFollowUpOnly ? followUpInvoices : invoices;

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

                {followUpInvoices.length > 0 && (
                  <div className="mb-4">
                    <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div className="flex items-start gap-2">
                          <div className="mt-0.5">
                            <AlertTriangle className="w-4 h-4 text-amber-400" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-amber-100">
                              {followUpInvoices.length} invoice{followUpInvoices.length === 1 ? '' : 's'} need follow-up
                            </p>
                            <p className="text-xs text-amber-300/80 mt-0.5">
                              Overdue and not reminded in the last 3 days.
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {!showFollowUpOnly ? (
                            <Link
                              href="/dashboard/invoices?filter=followup"
                              className="text-xs font-medium text-amber-100 hover:underline"
                            >
                              View follow-ups
                            </Link>
                          ) : (
                            <>
                              <span className="text-xs text-amber-300/80">
                                Showing follow-ups
                              </span>
                              <Link
                                href="/dashboard/invoices"
                                className="text-xs font-medium text-amber-100 hover:underline"
                              >
                                Clear
                              </Link>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="border border-zinc-800 bg-zinc-900 rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead className="bg-zinc-800 border-b border-zinc-700">
                        <tr>
                          <th className="text-left font-medium text-zinc-300 px-4 py-4">Invoice</th>
                          <th className="text-left font-medium text-zinc-300 px-4 py-4">Client</th>
                          <th className="text-right font-medium text-zinc-300 px-4 py-4">Amount</th>
                          <th className="text-left font-medium text-zinc-300 px-4 py-4">Due date</th>
                          <th className="text-left font-medium text-zinc-300 px-4 py-4">Status</th>
                          <th className="text-right font-medium text-zinc-300 px-4 py-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-800">
                        {visibleInvoices.map((invoice) => {
                          const showFollowUpIndicator = needsFollowUp(invoice, now);
                          const overdue = isOverdue(invoice.due_date, invoice.status);

                          return (
                            <tr key={invoice.id} className="hover:bg-zinc-800/50 transition-colors">
                              <td className="px-4 py-4">
                                <div className="flex items-center gap-2">
                                  {showFollowUpIndicator && (
                                    <span
                                      className="inline-block w-2 h-2 rounded-full bg-amber-500 animate-pulse"
                                      title="Needs follow-up"
                                      aria-label="Needs follow-up"
                                    />
                                  )}
                                  <Link
                                    href={`/dashboard/invoices/${invoice.id}`}
                                    className="text-zinc-100 font-medium hover:text-teal-400 transition-colors"
                                  >
                                    {invoice.invoice_number}
                                  </Link>
                                </div>
                              </td>
                              <td className="px-4 py-4 text-zinc-300">{invoice.client_name}</td>
                              <td className="px-4 py-4 text-right tabular-nums font-semibold text-zinc-100 text-base">
                                {formatCurrency(invoice.amount)}
                              </td>
                              <td className="px-4 py-4 text-zinc-300">
                                <div className="flex items-center gap-2">
                                  <span>{formatDateOnly(invoice.due_date)}</span>
                                  {overdue && (invoice.status ?? 'draft') !== 'paid' && (
                                    <span className="text-xs font-semibold text-rose-400 bg-rose-500/20 px-2 py-0.5 rounded border border-rose-500/30">
                                      Overdue
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <span
                                  className={[
                                    'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium capitalize',
                                    statusBadge(invoice.status),
                                  ].join(' ')}
                                >
                                  {invoice.status ?? 'draft'}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-right">
                                <div className="inline-flex items-center justify-end gap-2">
                                  {(invoice.status ?? 'draft') === 'draft' && (
                                    <SendInvoiceButton
                                      invoiceId={invoice.id}
                                      clientEmail={invoice.client_email}
                                      disabled={!invoice.client_email}
                                      compact
                                    />
                                  )}
                                  {(() => {
                                    const s = invoice.status ?? 'draft';
                                    const showEdit = s === 'draft' || s === 'sent';
                                    return (
                                      showEdit && (
                                        <Link
                                          href={`/dashboard/invoices/${invoice.id}/edit`}
                                          className="p-2 text-zinc-400 hover:text-teal-400 hover:bg-teal-500/10 rounded-md transition-colors"
                                          aria-label="Edit invoice"
                                          title="Edit invoice"
                                        >
                                          <Pencil className="w-4 h-4" />
                                        </Link>
                                      )
                                    );
                                  })()}

                                  {(invoice.status ?? 'draft') === 'draft' && (
                                    <DeleteInvoiceIconButton
                                      invoiceId={invoice.id}
                                      invoiceLabel={invoice.invoice_number}
                                    />
                                  )}

                                  {/* Always visible */}
                                  <DownloadPdfButton invoiceId={invoice.id} />
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            );
          })()}
        </>
      )}
    </>
  );
}
