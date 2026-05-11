'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { Pencil, AlertTriangle, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { formatCurrency, formatDateOnly } from '@/lib/utils/format';
import { DownloadPdfButton } from './download-pdf-button';
import { DeleteInvoiceIconButton } from './delete-invoice-icon-button';
import { SendInvoiceButton } from './send-invoice-button';
import {
  InvoicesFilterBar,
  useInvoicesFilters,
  defaultInvoicesFilters,
  type InvoicesFilters,
  type InvoiceStatus,
} from './invoices-filters';
import {
  getClientPaymentHistory,
  calculatePaymentRisk,
  getRiskBadgeClasses,
  getRiskLabel,
  type PaymentRiskScore,
  type InvoiceForRisk,
  type RiskLevel,
} from '@/lib/invoices/payment-risk';

interface Invoice {
  id: string;
  invoice_number: string;
  client_name: string;
  client_email: string | null;
  amount: number;
  due_date: string;
  status: string | null;
  sent_at: string | null;
  paid_at: string | null;
  last_reminder_at: string | null;
  user_id: string;
  created_at: string;
  updated_at: string;
}

interface InvoicesContentProps {
  invoices: Invoice[];
  currency?: string;
}

function statusBadge(status: string | null | undefined) {
  const s = status ?? 'draft';
  switch (s) {
    case 'draft':
      return 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-300 dark:border-zinc-700';
    case 'sent':
      return 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
    case 'viewed':
      return 'bg-amber-500/20 text-amber-400 border border-amber-500/30';
    case 'paid':
      return 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
    default:
      return 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-300 dark:border-zinc-700';
  }
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

function needsFollowUp(invoice: Invoice, now = new Date()) {
  const status = invoice.status ?? 'draft';
  if (!(status === 'sent' || status === 'viewed')) return false;
  if (!isOverdue(invoice.due_date, status)) return false;
  if (!invoice.last_reminder_at) return true;
  return !wasRemindedRecently(invoice.last_reminder_at, now);
}

/**
 * Filter invoices based on the current filter settings
 */
function filterInvoices(
  invoices: Invoice[],
  filters: InvoicesFilters,
  riskScores: Map<string, PaymentRiskScore | null>
): Invoice[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Check if risk filter is active (not all risk levels selected)
  const allRiskLevels: RiskLevel[] = ['low', 'medium', 'high', 'critical'];
  const isRiskFilterActive = filters.riskLevels.length < allRiskLevels.length;

  return invoices.filter((invoice) => {
    // Filter by status
    const invoiceStatus = (invoice.status ?? 'draft') as InvoiceStatus;
    if (!filters.statuses.includes(invoiceStatus)) return false;

    // Filter by overdue
    if (filters.overdue) {
      if (!isOverdue(invoice.due_date, invoice.status)) return false;
    }

    // Filter by due date range
    if (filters.dueDateStart) {
      const dueDate = new Date(invoice.due_date + 'T00:00:00');
      if (dueDate < filters.dueDateStart) return false;
    }
    if (filters.dueDateEnd) {
      const dueDate = new Date(invoice.due_date + 'T00:00:00');
      if (dueDate > filters.dueDateEnd) return false;
    }

    // Filter by amount range
    if (filters.amountMin !== null && invoice.amount < filters.amountMin) return false;
    if (filters.amountMax !== null && invoice.amount > filters.amountMax) return false;

    // Filter by risk level
    if (isRiskFilterActive) {
      const risk = riskScores.get(invoice.id);
      // Paid invoices have no risk - exclude if risk filter is active
      if (!risk) return false;
      if (!filters.riskLevels.includes(risk.riskLevel)) return false;
    }

    // Filter by search term (client name or invoice number)
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesClient = invoice.client_name.toLowerCase().includes(searchLower);
      const matchesInvoiceNumber = invoice.invoice_number.toLowerCase().includes(searchLower);
      if (!matchesClient && !matchesInvoiceNumber) return false;
    }

    return true;
  });
}

/**
 * InvoicesContent - Client component for Invoices page with filtering
 */
export function InvoicesContent({ invoices, currency = 'USD' }: InvoicesContentProps) {
  const { filters, setFilters, visibleFilters, setVisibleFilters } = useInvoicesFilters();
  const now = new Date();

  // Calculate risk scores for all invoices (needed for filtering by risk)
  const riskScores = useMemo(() => {
    const scores = new Map<string, PaymentRiskScore | null>();

    // Convert invoices to the format needed for risk calculation
    const invoicesForRisk: InvoiceForRisk[] = invoices.map((inv) => ({
      id: inv.id,
      client_name: inv.client_name,
      client_email: inv.client_email,
      amount: inv.amount,
      due_date: inv.due_date,
      sent_at: inv.sent_at,
      paid_at: inv.paid_at,
      status: inv.status,
      created_at: inv.created_at,
    }));

    for (const invoice of invoices) {
      // Skip paid invoices
      if (invoice.status === 'paid') {
        scores.set(invoice.id, null);
        continue;
      }

      // Get client history
      const history = getClientPaymentHistory(
        invoicesForRisk,
        invoice.client_name,
        invoice.client_email
      );

      // Calculate risk
      const risk = calculatePaymentRisk(
        {
          id: invoice.id,
          client_name: invoice.client_name,
          client_email: invoice.client_email,
          amount: invoice.amount,
          due_date: invoice.due_date,
          sent_at: invoice.sent_at,
          paid_at: invoice.paid_at,
          status: invoice.status,
          created_at: invoice.created_at,
        },
        history
      );

      scores.set(invoice.id, risk);
    }

    return scores;
  }, [invoices]);

  // Apply filters to invoices (must come after riskScores)
  const filteredInvoices = useMemo(
    () => filterInvoices(invoices, filters, riskScores),
    [invoices, filters, riskScores]
  );

  // Show empty state when all invoices are filtered out
  const showEmptyState = invoices.length > 0 && filteredInvoices.length === 0;

  // Follow-up invoices for the banner
  const followUpInvoices = useMemo(
    () => invoices.filter((inv) => needsFollowUp(inv, now)),
    [invoices, now]
  );

  return (
    <>
      {/* Filter Bar */}
      {invoices.length > 0 && (
        <div className="mb-6">
          <InvoicesFilterBar
            filters={filters}
            onChange={setFilters}
            resultCount={filteredInvoices.length}
            visibleFilters={visibleFilters}
            onVisibleFiltersChange={setVisibleFilters}
          />
        </div>
      )}

      {/* Follow-up Banner */}
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
            </div>
          </div>
        </div>
      )}

      {showEmptyState ? (
        <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-lg p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-zinc-600 dark:text-zinc-500"
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
          <h3 className="text-lg font-medium text-zinc-700 dark:text-zinc-300 mb-2">
            No invoices match your filters
          </h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-500 mb-4">
            Try adjusting your filters to see more results.
          </p>
          <button
            onClick={() => setFilters(defaultInvoicesFilters)}
            className="text-sm font-medium text-teal-400 hover:text-teal-300 transition-colors"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-zinc-100 dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700">
                <tr>
                  <th className="text-left font-medium text-zinc-700 dark:text-zinc-300 px-4 py-4">Invoice</th>
                  <th className="text-left font-medium text-zinc-700 dark:text-zinc-300 px-4 py-4">Client</th>
                  <th className="text-right font-medium text-zinc-700 dark:text-zinc-300 px-4 py-4">Amount</th>
                  <th className="text-left font-medium text-zinc-700 dark:text-zinc-300 px-4 py-4">Due date</th>
                  <th className="text-left font-medium text-zinc-700 dark:text-zinc-300 px-4 py-4">Status</th>
                  <th className="text-left font-medium text-zinc-700 dark:text-zinc-300 px-4 py-4">Risk</th>
                  <th className="text-right font-medium text-zinc-700 dark:text-zinc-300 px-4 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {filteredInvoices.map((invoice) => {
                  const showFollowUpIndicator = needsFollowUp(invoice, now);
                  const overdue = isOverdue(invoice.due_date, invoice.status);

                  return (
                    <tr key={invoice.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
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
                            className="text-zinc-900 dark:text-zinc-100 font-medium hover:text-teal-400 transition-colors"
                          >
                            {invoice.invoice_number}
                          </Link>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-zinc-700 dark:text-zinc-300">{invoice.client_name}</td>
                      <td className="px-4 py-4 text-right tabular-nums font-semibold text-zinc-900 dark:text-zinc-100 text-base">
                        {formatCurrency(invoice.amount, currency)}
                      </td>
                      <td className="px-4 py-4 text-zinc-700 dark:text-zinc-300">
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
                      <td className="px-4 py-3">
                        {(() => {
                          const risk = riskScores.get(invoice.id);
                          if (!risk) {
                            // Paid invoice or no risk data
                            if (invoice.status === 'paid') {
                              return (
                                <span className="text-xs text-zinc-600 dark:text-zinc-500">—</span>
                              );
                            }
                            return null;
                          }

                          return (
                            <div
                              className="group relative"
                              title={`Expected payment: ${risk.expectedDaysLate > 0 ? `${risk.expectedDaysLate} days late` : risk.expectedDaysLate < 0 ? `${Math.abs(risk.expectedDaysLate)} days early` : 'on time'}`}
                            >
                              <span className={getRiskBadgeClasses(risk.riskLevel)}>
                                {risk.riskLevel === 'low' && <TrendingUp className="w-3 h-3" />}
                                {risk.riskLevel === 'medium' && <Minus className="w-3 h-3" />}
                                {(risk.riskLevel === 'high' || risk.riskLevel === 'critical') && (
                                  <TrendingDown className="w-3 h-3" />
                                )}
                                {getRiskLabel(risk.riskLevel)}
                              </span>
                            </div>
                          );
                        })()}
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
                                  className="p-2 text-zinc-500 dark:text-zinc-400 hover:text-teal-400 hover:bg-teal-500/10 rounded-md transition-colors"
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
      )}
    </>
  );
}
