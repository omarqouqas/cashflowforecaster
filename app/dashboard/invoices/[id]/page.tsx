import { requireAuth } from '@/lib/auth/session';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { formatCurrency, formatDate, formatDateOnly } from '@/lib/utils/format';
import { DownloadPdfButton } from '@/components/invoices/download-pdf-button';
import { MarkAsPaidButton } from '@/components/invoices/mark-as-paid-button';
import { DeleteInvoiceButton } from '@/components/invoices/delete-invoice-button';
import { SendInvoiceButton } from '@/components/invoices/send-invoice-button';
import { SendReminderButton } from '@/components/invoices/send-reminder-button';
import { CheckCircle2, Pencil } from 'lucide-react';
import { PaymentLinkSection } from '@/components/invoices/payment-link-section';
import { canUseInvoicing } from '@/lib/stripe/subscription';

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

function isOverdue(dueDate: string, status: string | null | undefined) {
  if ((status ?? 'draft') === 'paid') return false;
  const today = new Date();
  const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const due = new Date(`${dueDate}T00:00:00`);
  return due < todayMidnight;
}

function TimelineStep({
  label,
  completed,
  timestamp,
  note,
  isLast = false,
}: {
  label: string;
  completed: boolean;
  timestamp?: string | null;
  note?: string;
  isLast?: boolean;
}) {
  return (
    <div className="flex items-start gap-3 relative">
      {!isLast && (
        <div className="absolute left-[9px] top-6 bottom-0 w-0.5 bg-zinc-800" />
      )}
      <div className={completed ? 'w-5 h-5 rounded-full bg-teal-500 flex items-center justify-center mt-0.5 relative z-10' : 'w-5 h-5 rounded-full border-2 border-zinc-700 bg-zinc-900 mt-0.5 relative z-10'}>
        {completed && <CheckCircle2 className="w-3 h-3 text-zinc-900" />}
      </div>
      <div className="min-w-0 pb-6">
        <p className="text-sm font-medium text-zinc-100">{label}</p>
        {timestamp ? (
          <p className="text-xs text-zinc-400 mt-0.5">{formatDate(timestamp)}</p>
        ) : (
          <p className="text-xs text-zinc-500 mt-0.5">{completed ? (note ?? 'Date not recorded') : 'Pending'}</p>
        )}
      </div>
    </div>
  );
}

export default async function InvoiceDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams?: { error?: string };
}) {
  const user = await requireAuth();
  const hasAccess = await canUseInvoicing(user.id);
  if (!hasAccess) {
    redirect('/dashboard/invoices');
  }
  const { id } = await params;
  const supabase = await createClient();

  const { data: invoice } = await supabase
    .from('invoices')
    .select('*')
    .eq('id', id)
    .single();

  if (!invoice) {
    redirect('/dashboard/invoices');
  }

  const invoiceData = invoice as any;

  const { data: remindersData, error: remindersErr } = await supabase
    .from('invoice_reminders')
    .select('reminder_type, sent_at')
    .eq('invoice_id', invoiceData.id)
    .order('sent_at', { ascending: false });

  const reminderHistory = (remindersData || []) as any;

  if (remindersErr) {
    // eslint-disable-next-line no-console
    console.error('Error fetching invoice reminders:', remindersErr);
  }

  const { data: linkedIncomeData } = await supabase
    .from('income')
    .select('id')
    .eq('invoice_id', invoiceData.id)
    .maybeSingle();

  const linkedIncome = linkedIncomeData as any;

  const overdue = isOverdue(invoiceData.due_date, invoiceData.status);
  const status = invoiceData.status ?? 'draft';

  const sentCompleted = status === 'sent' || status === 'viewed' || status === 'paid';
  const viewedCompleted = status === 'viewed' || status === 'paid';
  const paidCompleted = status === 'paid';

  return (
    <div className="max-w-3xl mx-auto">
      <Link
        href="/dashboard/invoices"
        className="text-sm text-zinc-400 hover:text-teal-400 flex items-center gap-1 mb-6 transition-colors"
      >
        ← Back to Invoices
      </Link>

      {searchParams?.error === 'paid-cannot-edit' && (
        <div className="bg-amber-500/20 border border-amber-500/30 rounded-lg p-3 mb-6">
          <p className="text-sm text-amber-400 font-medium">Paid invoices cannot be edited.</p>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-zinc-100">{invoiceData.invoice_number}</h1>
          <span
            className={[
              'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium capitalize',
              statusBadge(invoiceData.status),
            ].join(' ')}
          >
            {invoiceData.status ?? 'draft'}
          </span>
        </div>
      </div>

      {/* Actions - Reorganized with primary actions on right */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {/* Secondary actions on left */}
        <div className="flex flex-wrap gap-3 flex-1">
          <DownloadPdfButton invoiceId={invoiceData.id} />
          {status === 'draft' && (
            <SendInvoiceButton
              invoiceId={invoiceData.id}
              clientEmail={invoiceData.client_email}
              disabled={!invoiceData.client_email}
              allowMessage
            />
          )}
          {status !== 'draft' && status !== 'paid' && (
            <SendInvoiceButton
              invoiceId={invoiceData.id}
              clientEmail={invoiceData.client_email}
              disabled={!invoiceData.client_email}
              mode="resend"
            />
          )}
          {status !== 'paid' && (
            <SendReminderButton
              invoiceId={invoiceData.id}
              invoiceStatus={invoiceData.status}
              lastReminderAt={invoiceData.last_reminder_at}
              reminderCount={invoiceData.reminder_count ?? 0}
            />
          )}
        </div>

        {/* Primary actions on right */}
        <div className="flex gap-3">
          {status !== 'paid' && (
            <Link
              href={`/dashboard/invoices/${invoiceData.id}/edit`}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 transition-colors"
              aria-label="Edit invoice"
              title="Edit invoice"
            >
              <Pencil className="w-4 h-4" />
              <span>Edit</span>
            </Link>
          )}
          {status !== 'paid' && <MarkAsPaidButton invoiceId={invoiceData.id} />}
        </div>
      </div>

      {status !== 'draft' && status !== 'paid' && invoiceData.sent_at && (
        <p className="text-xs text-zinc-500 mb-6">
          Sent on {formatDate(invoiceData.sent_at)}
        </p>
      )}

      {/* Details */}
      <div className="border border-zinc-800 bg-zinc-900 rounded-lg p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
          <div className="min-w-0">
            <p className="text-sm text-zinc-400 mb-1">Client</p>
            <p className="text-lg font-semibold text-zinc-100 truncate">{invoiceData.client_name}</p>
            {invoiceData.client_email && (
              <p className="text-sm text-zinc-300 mt-1">{invoiceData.client_email}</p>
            )}
          </div>

          <div className="text-left sm:text-right">
            <p className="text-sm text-zinc-400 mb-1">Amount</p>
            <p className="text-3xl font-bold text-zinc-100 tabular-nums">
              {formatCurrency(invoiceData.amount)}
            </p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="border border-zinc-800 rounded-md p-4 bg-zinc-800/50">
            <p className="text-sm text-zinc-400 mb-1">Due date</p>
            <p className="text-base font-medium text-zinc-100">{formatDateOnly(invoiceData.due_date)}</p>
            {overdue && (
              <p className="text-sm text-rose-400 mt-1.5 font-medium">Overdue</p>
            )}
          </div>

          <div className="border border-zinc-800 rounded-md p-4 bg-zinc-800/50">
            <p className="text-sm text-zinc-400 mb-1">Created</p>
            <p className="text-base font-medium text-zinc-100">
              {invoiceData.created_at ? formatDate(invoiceData.created_at) : '—'}
            </p>
          </div>
        </div>

        {invoiceData.description?.trim() && (
          <div className="mt-6 pt-6 border-t border-zinc-800">
            <p className="text-sm text-zinc-400 mb-2">Description</p>
            <p className="text-sm text-zinc-200 whitespace-pre-wrap leading-relaxed">{invoiceData.description}</p>
          </div>
        )}
      </div>

      {/* Payment Link Section */}
      {invoiceData.payment_link_url && (
        <PaymentLinkSection
          paymentUrl={invoiceData.payment_link_url}
          status={status}
          paymentMethod={invoiceData.payment_method}
        />
      )}

      {/* Reminder History */}
      {Array.isArray(reminderHistory) && reminderHistory.length > 0 ? (
        <div className="border border-zinc-800 bg-zinc-900 rounded-lg p-5 mb-6">
          <h2 className="text-sm font-semibold text-zinc-100 mb-4">Reminder History</h2>
          <div className="space-y-3">
            {reminderHistory.map((r) => {
              const type = (r.reminder_type ?? '').toLowerCase();
              const label =
                type === 'friendly' ? 'Friendly' : type === 'firm' ? 'Firm' : type === 'final' ? 'Final' : 'Reminder';
              const badge =
                type === 'friendly'
                  ? 'bg-teal-500/20 text-teal-400 border border-teal-500/30'
                  : type === 'firm'
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    : type === 'final'
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      : 'bg-zinc-800 text-zinc-300 border border-zinc-700';

              return (
                <div key={`${r.sent_at}-${r.reminder_type}`} className="flex items-center justify-between gap-3 p-3 bg-zinc-800/50 rounded-md border border-zinc-800">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={['inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold', badge].join(' ')}>
                      {label}
                    </span>
                    <p className="text-sm text-zinc-300 truncate">
                      Sent {r.sent_at ? formatDate(r.sent_at) : '—'}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : overdue ? (
        <p className="text-sm text-zinc-500 mb-6">No reminders sent yet</p>
      ) : null}

      {/* Timeline */}
      <div className="border border-zinc-800 bg-zinc-900 rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold text-zinc-100 mb-6">History</h2>
        <div>
          <TimelineStep
            label="Created"
            completed={true}
            timestamp={invoiceData.created_at}
            note="Created"
          />
          <TimelineStep
            label="Sent"
            completed={sentCompleted}
            timestamp={invoiceData.sent_at}
            note="Not sent yet"
          />
          <TimelineStep
            label="Viewed"
            completed={viewedCompleted}
            timestamp={invoiceData.viewed_at}
            note="Not viewed yet"
          />
          <TimelineStep
            label="Paid"
            completed={paidCompleted}
            timestamp={invoiceData.paid_at}
            isLast={true}
          />
        </div>
      </div>

      {/* Linked Income Entry */}
      {linkedIncome?.id ? (
        <Link
          href={`/dashboard/income/${linkedIncome.id}/edit`}
          className="block border border-zinc-800 bg-zinc-900 rounded-lg p-5 mb-6 hover:bg-zinc-800 transition-colors group"
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-zinc-400 mb-1">Linked Income Entry</p>
              <p className="text-base font-medium text-zinc-100 group-hover:text-teal-400 transition-colors">
                {formatCurrency(invoiceData.amount)} • {formatDateOnly(invoiceData.due_date)}
              </p>
              <p className="text-xs text-zinc-500 mt-1">
                This invoice is tracked in your cash flow forecast
              </p>
            </div>
            <div className="text-teal-400">→</div>
          </div>
        </Link>
      ) : (
        <div className="border border-zinc-800 bg-zinc-900 rounded-lg p-5 mb-6">
          <p className="text-sm text-zinc-400 mb-1">Linked Income Entry</p>
          <p className="text-sm text-zinc-500">
            This invoice is not yet linked to your cash flow forecast.{' '}
            <Link href="/dashboard/income" className="text-teal-400 hover:text-teal-300 font-medium">
              Add to forecast →
            </Link>
          </p>
        </div>
      )}

      {/* Danger zone */}
      <div className="border border-rose-500/30 bg-rose-500/10 rounded-lg p-6">
        <h2 className="text-sm font-semibold text-rose-400 mb-2">Danger zone</h2>
        <p className="text-sm text-zinc-300 mb-4">
          Deleting a draft invoice will also remove the linked income entry from your forecast.
        </p>
        <DeleteInvoiceButton invoiceId={invoiceData.id} status={invoiceData.status} />
      </div>
    </div>
  );
}


