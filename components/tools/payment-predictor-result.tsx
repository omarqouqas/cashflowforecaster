'use client';

import Link from 'next/link';
import posthog from 'posthog-js';
import { EmailCaptureForm } from '@/components/tools/email-capture-form';
import { GetStartedCTA } from '@/components/landing/get-started-cta';
import { formatCurrency, formatDateOnly } from '@/lib/utils/format';
import type { InvoiceEntry, PaymentPredictorResult as PredictorResult } from '@/lib/tools/calculate-payment-date';

type Props = {
  result: PredictorResult | null;
  lastInput: any | null;
  invoices: InvoiceEntry[];
};

function formatDateLong(dateOnly: string): string {
  try {
    const d = new Date(dateOnly + 'T00:00:00');
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  } catch {
    return dateOnly;
  }
}

function dayOfWeek(dateOnly: string): string {
  try {
    const d = new Date(dateOnly + 'T00:00:00');
    return d.toLocaleDateString('en-US', { weekday: 'long' });
  } catch {
    return '';
  }
}

function daysLabel(daysFromToday: number): { text: string; tone: 'future' | 'today' | 'past' } {
  if (daysFromToday === 0) return { text: 'Today', tone: 'today' };
  const abs = Math.abs(daysFromToday);
  if (daysFromToday > 0) return { text: `${abs} day${abs === 1 ? '' : 's'} from now`, tone: 'future' };
  return { text: `This was ${abs} day${abs === 1 ? '' : 's'} ago`, tone: 'past' };
}

function weeksLabel(weeks: number): string {
  if (weeks <= 0) return 'Less than a week';
  return `About ${weeks} week${weeks === 1 ? '' : 's'}`;
}

export function PaymentPredictorResult({ result, lastInput, invoices }: Props) {
  if (!result) {
    return (
      <div className="rounded-xl border border-dashed border-zinc-800 bg-zinc-950/30 p-6">
        <p className="text-sm text-zinc-300 font-medium">Enter your invoice details to get a prediction.</p>
        <p className="mt-2 text-sm text-zinc-500">
          Click <span className="text-zinc-300">Calculate</span> to see your expected payment date.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/pricing"
            className="text-sm text-teal-300 hover:text-teal-200 hover:underline"
            onClick={() => {
              try {
                posthog.capture('tool_payment_predictor_pricing_click');
              } catch {}
            }}
          >
            See plans
          </Link>
          <span className="text-zinc-700">•</span>
          <Link
            href="/auth/signup"
            className="text-sm text-teal-300 hover:text-teal-200 hover:underline"
            onClick={() => {
              try {
                posthog.capture('tool_payment_predictor_signup_click');
              } catch {}
            }}
          >
            Create a free account
          </Link>
        </div>
      </div>
    );
  }

  const dayText = daysLabel(result.daysFromToday);
  const dayToneClass =
    dayText.tone === 'past'
      ? 'bg-amber-500/15 text-amber-200 border-amber-500/30'
      : dayText.tone === 'today'
        ? 'bg-teal-500/15 text-teal-200 border-teal-500/30'
        : 'bg-zinc-800/40 text-zinc-200 border-zinc-700/60';

  const baseDow = dayOfWeek(result.basePaymentDate);
  const finalDow = result.dayOfWeek;
  const weekendAdjusted = result.weekendAdjustmentDays > 0;

  const emailPayload = {
    tool: 'invoice-payment-predictor',
    calculatedAt: new Date().toISOString(),
    input: lastInput,
    result,
    invoices: invoices.slice(0, 25).map((inv) => ({
      clientName: inv.clientName ?? null,
      invoiceAmount: inv.invoiceAmount ?? null,
      invoiceDate: inv.invoiceDate,
      paymentTerms: inv.paymentTerms,
      expectedPaymentDate: inv.result?.expectedPaymentDate ?? null,
      daysFromToday: inv.result?.daysFromToday ?? null,
    })),
  };

  const invoicesWithAmount = invoices.filter((i) => Number.isFinite(i.invoiceAmount ?? NaN));
  const hasAnyAmount = invoicesWithAmount.length > 0;
  const totalAmount = invoicesWithAmount.reduce((sum, i) => sum + (i.invoiceAmount ?? 0), 0);

  return (
    <div className="space-y-6">
      {/* Primary result */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-950/30 p-5">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="text-xs text-zinc-500">Expected payment date</p>
            <div className="mt-2 text-4xl md:text-5xl font-bold tracking-tight text-white tabular-nums">
              {formatDateLong(result.expectedPaymentDate)}
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <div className={['inline-flex items-center rounded-full border px-3 py-1 text-sm', dayToneClass].join(' ')}>
                <span className="font-semibold">{dayText.text}</span>
              </div>

              <span className="text-sm text-zinc-500">
                That&apos;s{' '}
                {weekendAdjusted ? (
                  <>
                    a <span className="line-through text-zinc-500">{baseDow}</span>{' '}
                    <span className="text-zinc-500">→</span> <span className="text-white font-semibold">{finalDow}</span>
                  </>
                ) : (
                  <span className="text-white font-semibold">{finalDow}</span>
                )}
              </span>

              <span className="text-sm text-zinc-600">•</span>
              <span className="text-sm text-zinc-400">{weeksLabel(result.weeksFromToday)}</span>
            </div>

            {weekendAdjusted && (
              <p className="mt-2 text-xs text-zinc-600">
                Weekend-adjusted: your base due date fell on a weekend, so we moved it to Monday.
              </p>
            )}
          </div>

          <div className="flex items-center gap-3">
            <GetStartedCTA
              label="See all invoices on a calendar"
              className="bg-teal-500 hover:bg-teal-400 text-zinc-950 focus:ring-teal-400 focus:ring-offset-zinc-950"
              onClick={() => {
                try {
                  posthog.capture('tool_payment_predictor_cta_clicked', { location: 'result_header' });
                } catch {}
              }}
            />
          </div>
        </div>
      </div>

      {/* Breakdown */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-950/30 p-5">
        <p className="text-sm font-semibold text-white">Breakdown</p>
        <div className="mt-4 space-y-2 text-sm">
          <div className="flex items-center justify-between gap-4 rounded-lg border border-zinc-800 bg-zinc-950/40 p-4">
            <span className="text-zinc-400">Invoice date</span>
            <span className="text-white font-semibold tabular-nums">{formatDateLong(result.invoiceDate)}</span>
          </div>

          <div className="flex items-center justify-between gap-4 rounded-lg border border-zinc-800 bg-zinc-950/40 p-4">
            <span className="text-zinc-400">{result.paymentTermsLabel}</span>
            <span className="text-white font-semibold tabular-nums">{result.paymentTermsDays} days</span>
          </div>

          <div className="flex items-center justify-between gap-4 rounded-lg border border-zinc-800 bg-zinc-950/40 p-4">
            <span className="text-zinc-400">
              Weekend shift{' '}
              {weekendAdjusted ? (
                <span className="text-zinc-600">
                  ({baseDow} → {finalDow})
                </span>
              ) : null}
            </span>
            <span className="text-white font-semibold tabular-nums">{result.weekendAdjustmentDays} days</span>
          </div>

          <div className="flex items-center justify-between gap-4 rounded-lg border border-zinc-800 bg-zinc-950/40 p-4">
            <span className="text-zinc-400">Late client adjustment</span>
            <span className="text-white font-semibold tabular-nums">{result.lateClientAdjustmentDays} days</span>
          </div>

          <div className="flex items-center justify-between gap-4 rounded-lg border border-teal-500/30 bg-teal-500/10 p-4">
            <span className="text-teal-200/90">Expected payment</span>
            <span className="text-white font-semibold tabular-nums">{formatDateLong(result.expectedPaymentDate)}</span>
          </div>
        </div>
        <p className="mt-3 text-xs text-zinc-600">
          Total time from invoice date: <span className="text-zinc-200">{result.totalDaysFromInvoice} days</span>
        </p>
      </div>

      {/* Multiple invoices */}
      {invoices.length > 1 && (
        <div className="rounded-xl border border-zinc-800 bg-zinc-950/30 p-5">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <p className="text-sm font-semibold text-white">Multiple invoices</p>
              <p className="mt-1 text-sm text-zinc-500">
                Sorted by expected payment date. (Wouldn’t it be nice to see all of these mapped to your cash flow?)
              </p>
            </div>
            {hasAnyAmount && (
              <div className="text-sm text-zinc-400">
                Total expected amount: <span className="text-white font-semibold tabular-nums">{formatCurrency(totalAmount)}</span>
              </div>
            )}
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-zinc-500">
                  <th className="py-2 pr-4 font-medium">Client/Name</th>
                  <th className="py-2 pr-4 font-medium">Invoice date</th>
                  <th className="py-2 pr-4 font-medium">Terms</th>
                  <th className="py-2 pr-4 font-medium">Expected payment</th>
                  <th className="py-2 pr-0 font-medium">Days until</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv) => {
                  const r = inv.result;
                  const dl = r ? daysLabel(r.daysFromToday) : { text: '—', tone: 'today' as const };
                  const name = (inv.clientName ?? '').trim() || '—';
                  return (
                    <tr key={inv.id} className="border-t border-zinc-900">
                      <td className="py-3 pr-4 text-zinc-200">
                        <div className="flex flex-col">
                          <span className="font-medium">{name}</span>
                          {Number.isFinite(inv.invoiceAmount ?? NaN) ? (
                            <span className="text-xs text-zinc-500">{formatCurrency(inv.invoiceAmount ?? 0)}</span>
                          ) : null}
                        </div>
                      </td>
                      <td className="py-3 pr-4 text-zinc-300 tabular-nums">{formatDateOnly(inv.invoiceDate)}</td>
                      <td className="py-3 pr-4 text-zinc-300">{r?.paymentTermsLabel ?? '—'}</td>
                      <td className="py-3 pr-4 text-zinc-200 tabular-nums">
                        {r ? formatDateOnly(r.expectedPaymentDate) : '—'}
                      </td>
                      <td className="py-3 pr-0 text-zinc-300">{dl.text}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Email capture */}
      <EmailCaptureForm
        payload={emailPayload}
        events={{
          sent: 'tool_payment_predictor_email_sent',
          failed: 'tool_payment_predictor_email_failed',
        }}
      />

      {/* Bottom CTA */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-950/30 p-5">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-white">Track exactly when money will hit your account</p>
            <p className="mt-1 text-sm text-zinc-500">
              Cash Flow Forecaster lets you map all invoices (and bills) onto a calendar so you can plan ahead.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/auth/signup"
              className="rounded-lg bg-teal-500 hover:bg-teal-400 text-zinc-950 font-semibold px-4 py-3 min-h-[44px] inline-flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-zinc-950"
              onClick={() => {
                try {
                  posthog.capture('tool_payment_predictor_cta_clicked', { location: 'bottom' });
                } catch {}
              }}
            >
              Get started free
            </Link>
            <Link
              href="/pricing"
              className="rounded-lg border border-zinc-800 bg-zinc-950/40 text-zinc-200 hover:bg-zinc-900/50 font-medium px-4 py-3 min-h-[44px] inline-flex items-center justify-center"
              onClick={() => {
                try {
                  posthog.capture('tool_payment_predictor_pricing_click', { location: 'bottom' });
                } catch {}
              }}
            >
              View pricing
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

