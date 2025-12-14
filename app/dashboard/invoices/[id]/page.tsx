import { requireAuth } from '@/lib/auth/session';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { formatCurrency, formatDate, formatDateOnly } from '@/lib/utils/format';
import { DownloadPdfButton } from '@/components/invoices/download-pdf-button';
import { MarkAsPaidButton } from '@/components/invoices/mark-as-paid-button';
import { DeleteInvoiceButton } from '@/components/invoices/delete-invoice-button';
import { CheckCircle2, Circle, Pencil } from 'lucide-react';

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
}: {
  label: string;
  completed: boolean;
  timestamp?: string | null;
  note?: string;
}) {
  const Icon = completed ? CheckCircle2 : Circle;
  return (
    <div className="flex items-start gap-3">
      <Icon className={completed ? 'w-5 h-5 text-teal-700 mt-0.5' : 'w-5 h-5 text-zinc-300 mt-0.5'} />
      <div className="min-w-0">
        <p className="text-sm font-medium text-zinc-900">{label}</p>
        {timestamp ? (
          <p className="text-xs text-zinc-500 mt-0.5">{formatDate(timestamp)}</p>
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
  await requireAuth();
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

  const { data: linkedIncome } = await supabase
    .from('income')
    .select('id')
    .eq('invoice_id', invoice.id)
    .maybeSingle();

  const overdue = isOverdue(invoice.due_date, invoice.status);
  const status = invoice.status ?? 'draft';

  const sentCompleted = status === 'sent' || status === 'viewed' || status === 'paid';
  const viewedCompleted = status === 'viewed' || status === 'paid';
  const paidCompleted = status === 'paid';

  return (
    <div className="max-w-3xl mx-auto">
      <Link
        href="/dashboard/invoices"
        className="text-sm text-zinc-500 hover:text-zinc-700 flex items-center gap-1 mb-4"
      >
        ← Back to Invoices
      </Link>

      {searchParams?.error === 'paid-cannot-edit' && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
          <p className="text-sm text-amber-900 font-medium">Paid invoices cannot be edited.</p>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-zinc-900">{invoice.invoice_number}</h1>
          <span
            className={[
              'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium capitalize',
              statusBadge(invoice.status),
            ].join(' ')}
          >
            {invoice.status ?? 'draft'}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <DownloadPdfButton invoiceId={invoice.id} />
        {status !== 'paid' && (
          <Link
            href={`/dashboard/invoices/${invoice.id}/edit`}
            className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 min-h-[32px]"
            aria-label="Edit invoice"
            title="Edit invoice"
          >
            <Pencil className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Edit</span>
          </Link>
        )}
        {status !== 'paid' && <MarkAsPaidButton invoiceId={invoice.id} />}
      </div>

      {/* Details */}
      <div className="border border-zinc-200 bg-white rounded-lg p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="min-w-0">
            <p className="text-sm text-zinc-500">Client</p>
            <p className="text-lg font-semibold text-zinc-900 truncate">{invoice.client_name}</p>
            {invoice.client_email && (
              <p className="text-sm text-zinc-600 mt-0.5">{invoice.client_email}</p>
            )}
          </div>

          <div className="text-left sm:text-right">
            <p className="text-sm text-zinc-500">Amount</p>
            <p className="text-3xl font-bold text-zinc-900 tabular-nums">
              {formatCurrency(invoice.amount)}
            </p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="border border-zinc-100 rounded-md p-4 bg-zinc-50">
            <p className="text-sm text-zinc-500">Due date</p>
            <p className="text-base font-medium text-zinc-900">{formatDateOnly(invoice.due_date)}</p>
            {overdue && (
              <p className="text-sm text-rose-600 mt-1 font-medium">Overdue</p>
            )}
          </div>

          <div className="border border-zinc-100 rounded-md p-4 bg-zinc-50">
            <p className="text-sm text-zinc-500">Created</p>
            <p className="text-base font-medium text-zinc-900">
              {invoice.created_at ? formatDate(invoice.created_at) : '—'}
            </p>
          </div>
        </div>

        {invoice.description?.trim() && (
          <div className="mt-6">
            <p className="text-sm text-zinc-500 mb-1.5">Description</p>
            <p className="text-sm text-zinc-800 whitespace-pre-wrap">{invoice.description}</p>
          </div>
        )}
      </div>

      {/* Timeline */}
      <div className="border border-zinc-200 bg-white rounded-lg p-6">
        <h2 className="text-lg font-semibold text-zinc-900 mb-4">History</h2>
        <div className="space-y-4">
          <TimelineStep
            label="Created"
            completed={true}
            timestamp={invoice.created_at}
            note="Created"
          />
          <TimelineStep
            label="Sent"
            completed={sentCompleted}
            timestamp={null}
            note="Not tracked yet"
          />
          <TimelineStep
            label="Viewed"
            completed={viewedCompleted}
            timestamp={null}
            note="Not tracked yet"
          />
          <TimelineStep
            label="Paid"
            completed={paidCompleted}
            timestamp={invoice.paid_at}
          />
        </div>

        <div className="mt-6 pt-6 border-t border-zinc-100">
          <Link
            href={linkedIncome?.id ? `/dashboard/income/${linkedIncome.id}/edit` : '/dashboard/income'}
            className="text-sm text-teal-700 hover:text-teal-800 font-medium"
          >
            View linked income entry →
          </Link>
        </div>
      </div>

      {/* Danger zone (optional, less prominent) */}
      <div className="mt-6 border border-rose-200 bg-rose-50 rounded-lg p-6">
        <h2 className="text-sm font-semibold text-rose-900">Danger zone</h2>
        <p className="text-sm text-rose-800 mt-1">
          Deleting a draft invoice will also remove the linked income entry from your forecast.
        </p>
        <div className="mt-4">
          <DeleteInvoiceButton invoiceId={invoice.id} status={invoice.status} />
        </div>
      </div>
    </div>
  );
}


