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
      return 'bg-zinc-100 text-zinc-700';
    case 'sent':
      return 'bg-blue-100 text-blue-800';
    case 'viewed':
      return 'bg-yellow-100 text-yellow-800';
    case 'paid':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-zinc-100 text-zinc-700';
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
          className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Dashboard
        </Link>
      </div>

      {/* Success */}
      {searchParams?.success === 'invoice-deleted' && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 mb-6">
          <p className="text-sm text-green-800 dark:text-green-200">✓ Invoice deleted successfully</p>
        </div>
      )}

      {/* Page Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-zinc-100">Invoices</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
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
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
          <p className="text-sm text-red-800 dark:text-red-200">
            Error loading invoices. Please try refreshing the page.
          </p>
        </div>
      )}

      {/* Content */}
      {!error && (
        <>
          {invoices.length === 0 ? (
            <div className="text-center py-12">
              <Receipt className="w-10 h-10 mx-auto mb-3 text-zinc-400" />
              <p className="text-zinc-700 font-medium">No invoices yet.</p>
              <p className="text-sm text-zinc-500 mt-1 mb-6">
                Create your first invoice to get paid faster.
              </p>
              <Link href="/dashboard/invoices/new">
                <Button variant="primary">Create Invoice</Button>
              </Link>
            </div>
          ) : (() => {
            const now = new Date();
            const followUpInvoices = invoices.filter((inv) => needsFollowUp(inv, now));
            const filter = (searchParams?.filter ?? '').toLowerCase();
            const showFollowUpOnly = filter === 'followup';
            const visibleInvoices = showFollowUpOnly ? followUpInvoices : invoices;

            return (
              <>
                {followUpInvoices.length > 0 && (
                  <div className="mb-4">
                    <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div className="flex items-start gap-2">
                          <div className="mt-0.5">
                            <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-300" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
                              {followUpInvoices.length} invoice{followUpInvoices.length === 1 ? '' : 's'} need follow-up
                            </p>
                            <p className="text-xs text-amber-800/80 dark:text-amber-200/80 mt-0.5">
                              Overdue and not reminded in the last 3 days.
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {!showFollowUpOnly ? (
                            <Link
                              href="/dashboard/invoices?filter=followup"
                              className="text-xs font-medium text-amber-900 dark:text-amber-100 hover:underline"
                            >
                              View follow-ups
                            </Link>
                          ) : (
                            <>
                              <span className="text-xs text-amber-800/80 dark:text-amber-200/80">
                                Showing follow-ups
                              </span>
                              <Link
                                href="/dashboard/invoices"
                                className="text-xs font-medium text-amber-900 dark:text-amber-100 hover:underline"
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

                <div className="border border-zinc-200 bg-white rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead className="bg-zinc-50 border-b border-zinc-200">
                        <tr>
                          <th className="text-left font-medium text-zinc-600 px-4 py-3">Invoice</th>
                          <th className="text-left font-medium text-zinc-600 px-4 py-3">Client</th>
                          <th className="text-right font-medium text-zinc-600 px-4 py-3">Amount</th>
                          <th className="text-left font-medium text-zinc-600 px-4 py-3">Due date</th>
                          <th className="text-left font-medium text-zinc-600 px-4 py-3">Status</th>
                          <th className="text-right font-medium text-zinc-600 px-4 py-3">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-100">
                        {visibleInvoices.map((invoice) => {
                          const showFollowUpIndicator = needsFollowUp(invoice, now);
                          const overdue = isOverdue(invoice.due_date, invoice.status);

                          return (
                            <tr key={invoice.id} className="hover:bg-zinc-50 transition-colors">
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-2">
                                  {showFollowUpIndicator && (
                                    <span
                                      className="inline-block w-2 h-2 rounded-full bg-amber-500"
                                      title="Needs follow-up"
                                      aria-label="Needs follow-up"
                                    />
                                  )}
                                  <Link
                                    href={`/dashboard/invoices/${invoice.id}`}
                                    className="text-zinc-900 font-medium hover:text-teal-700"
                                  >
                                    {invoice.invoice_number}
                                  </Link>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-zinc-700">{invoice.client_name}</td>
                              <td className="px-4 py-3 text-right tabular-nums font-semibold text-zinc-900">
                                {formatCurrency(invoice.amount)}
                              </td>
                              <td className="px-4 py-3 text-zinc-700">
                                <div className="flex items-center gap-2">
                                  <span>{formatDateOnly(invoice.due_date)}</span>
                                  {overdue && (invoice.status ?? 'draft') !== 'paid' && (
                                    <span className="text-xs font-medium text-rose-600">Overdue</span>
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
                                          className="p-2 text-zinc-400 hover:text-teal-700 hover:bg-teal-50 rounded-md transition-colors"
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
