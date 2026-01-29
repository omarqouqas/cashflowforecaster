import { requireAuth } from '@/lib/auth/session';
import { getQuote } from '@/lib/actions/quotes';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { formatCurrency, formatDate, formatDateOnly } from '@/lib/utils/format';
import { DownloadQuotePdfButton } from '@/components/quotes/download-quote-pdf-button';
import { DeleteQuoteButton } from '@/components/quotes/delete-quote-button';
import { SendQuoteButton } from '@/components/quotes/send-quote-button';
import { ConvertToInvoiceButton } from '@/components/quotes/convert-to-invoice-button';
import { QuoteStatusActions } from '@/components/quotes/mark-quote-status-button';
import { CheckCircle2, Pencil, FileText } from 'lucide-react';
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

function isExpired(validUntil: string, status: string | null | undefined) {
  const s = status ?? 'draft';
  if (['accepted', 'rejected', 'expired'].includes(s)) return false;
  const today = new Date();
  const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const valid = new Date(`${validUntil}T00:00:00`);
  return valid < todayMidnight;
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

export default async function QuoteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireAuth();
  const hasAccess = await canUseInvoicing(user.id);
  if (!hasAccess) {
    redirect('/dashboard/quotes');
  }
  const { id } = await params;

  // Fetch quote (getQuote includes user_id check)
  const quote = await getQuote(id);

  if (!quote) {
    redirect('/dashboard/quotes');
  }

  const expired = isExpired(quote.valid_until, quote.status);
  const status = quote.status ?? 'draft';

  const sentCompleted = ['sent', 'viewed', 'accepted', 'rejected'].includes(status);
  const viewedCompleted = ['viewed', 'accepted', 'rejected'].includes(status);
  const acceptedCompleted = status === 'accepted';
  const rejectedCompleted = status === 'rejected';

  return (
    <div className="max-w-3xl mx-auto">
      <Link
        href="/dashboard/quotes"
        className="text-sm text-zinc-400 hover:text-teal-400 flex items-center gap-1 mb-6 transition-colors"
      >
        ← Back to Quotes
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-zinc-100">{quote.quote_number}</h1>
          <span
            className={[
              'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium capitalize',
              statusBadge(quote.status),
            ].join(' ')}
          >
            {quote.status ?? 'draft'}
          </span>
          {expired && (
            <span className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium bg-rose-500/20 text-rose-400 border border-rose-500/30">
              Expired
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {/* Secondary actions on left */}
        <div className="flex flex-wrap gap-3 flex-1">
          <DownloadQuotePdfButton quoteId={quote.id} />
          {status === 'draft' && (
            <SendQuoteButton
              quoteId={quote.id}
              clientEmail={quote.client_email}
              disabled={!quote.client_email}
              allowMessage
            />
          )}
          {status !== 'draft' && !['accepted', 'rejected', 'expired'].includes(status) && (
            <SendQuoteButton
              quoteId={quote.id}
              clientEmail={quote.client_email}
              disabled={!quote.client_email}
              mode="resend"
            />
          )}
        </div>

        {/* Primary actions on right */}
        <div className="flex gap-3">
          {(status === 'draft' || status === 'sent') && (
            <Link
              href={`/dashboard/quotes/${quote.id}/edit`}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 transition-colors"
              aria-label="Edit quote"
              title="Edit quote"
            >
              <Pencil className="w-4 h-4" />
              <span>Edit</span>
            </Link>
          )}
        </div>
      </div>

      {/* Accept/Reject Actions */}
      {(status === 'sent' || status === 'viewed') && (
        <div className="border border-zinc-800 bg-zinc-900 rounded-lg p-4 mb-6">
          <p className="text-sm text-zinc-400 mb-3">Client Response</p>
          <QuoteStatusActions quoteId={quote.id} status={status} />
        </div>
      )}

      {/* Convert to Invoice Button */}
      {status === 'accepted' && (
        <div className="border border-teal-500/30 bg-teal-500/10 rounded-lg p-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-teal-400">Quote Accepted</p>
              <p className="text-sm text-zinc-300 mt-1">
                {quote.converted_invoice_id
                  ? 'This quote has been converted to an invoice.'
                  : 'Convert this quote to an invoice to get paid.'}
              </p>
            </div>
            <ConvertToInvoiceButton
              quoteId={quote.id}
              status={status}
              convertedInvoiceId={quote.converted_invoice_id}
            />
          </div>
        </div>
      )}

      {status !== 'draft' && quote.sent_at && (
        <p className="text-xs text-zinc-500 mb-6">
          Sent on {formatDate(quote.sent_at)}
        </p>
      )}

      {/* Details */}
      <div className="border border-zinc-800 bg-zinc-900 rounded-lg p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
          <div className="min-w-0">
            <p className="text-sm text-zinc-400 mb-1">Client</p>
            <p className="text-lg font-semibold text-zinc-100 truncate">{quote.client_name}</p>
            {quote.client_email && (
              <p className="text-sm text-zinc-300 mt-1">{quote.client_email}</p>
            )}
          </div>

          <div className="text-left sm:text-right">
            <p className="text-sm text-zinc-400 mb-1">Amount</p>
            <p className="text-3xl font-bold text-zinc-100 tabular-nums">
              {formatCurrency(quote.amount, quote.currency ?? 'USD')}
            </p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="border border-zinc-800 rounded-md p-4 bg-zinc-800/50">
            <p className="text-sm text-zinc-400 mb-1">Valid until</p>
            <p className="text-base font-medium text-zinc-100">{formatDateOnly(quote.valid_until)}</p>
            {expired && (
              <p className="text-sm text-rose-400 mt-1.5 font-medium">Expired</p>
            )}
          </div>

          <div className="border border-zinc-800 rounded-md p-4 bg-zinc-800/50">
            <p className="text-sm text-zinc-400 mb-1">Created</p>
            <p className="text-base font-medium text-zinc-100">
              {quote.created_at ? formatDate(quote.created_at) : '—'}
            </p>
          </div>
        </div>

        {quote.description?.trim() && (
          <div className="mt-6 pt-6 border-t border-zinc-800">
            <p className="text-sm text-zinc-400 mb-2">Description</p>
            <p className="text-sm text-zinc-200 whitespace-pre-wrap leading-relaxed">{quote.description}</p>
          </div>
        )}
      </div>

      {/* Converted Invoice Link */}
      {quote.converted_invoice_id && (
        <Link
          href={`/dashboard/invoices/${quote.converted_invoice_id}`}
          className="block border border-teal-500/30 bg-teal-500/10 rounded-lg p-5 mb-6 hover:bg-teal-500/20 transition-colors group"
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-teal-400" />
              <div>
                <p className="text-sm text-zinc-400 mb-1">Converted Invoice</p>
                <p className="text-base font-medium text-zinc-100 group-hover:text-teal-400 transition-colors">
                  View the invoice created from this quote
                </p>
              </div>
            </div>
            <div className="text-teal-400">→</div>
          </div>
        </Link>
      )}

      {/* Timeline */}
      <div className="border border-zinc-800 bg-zinc-900 rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold text-zinc-100 mb-6">History</h2>
        <div>
          <TimelineStep
            label="Created"
            completed={true}
            timestamp={quote.created_at}
            note="Created"
          />
          <TimelineStep
            label="Sent"
            completed={sentCompleted}
            timestamp={quote.sent_at}
            note="Not sent yet"
          />
          <TimelineStep
            label="Viewed"
            completed={viewedCompleted}
            timestamp={quote.viewed_at}
            note="Not viewed yet"
          />
          {rejectedCompleted ? (
            <TimelineStep
              label="Rejected"
              completed={true}
              timestamp={quote.rejected_at}
              isLast={true}
            />
          ) : (
            <TimelineStep
              label="Accepted"
              completed={acceptedCompleted}
              timestamp={quote.accepted_at}
              isLast={true}
            />
          )}
        </div>
      </div>

      {/* Danger zone */}
      <div className="border border-rose-500/30 bg-rose-500/10 rounded-lg p-6">
        <h2 className="text-sm font-semibold text-rose-400 mb-2">Danger zone</h2>
        <p className="text-sm text-zinc-300 mb-4">
          Only draft quotes can be deleted. This action cannot be undone.
        </p>
        <DeleteQuoteButton quoteId={quote.id} status={quote.status} />
      </div>
    </div>
  );
}
