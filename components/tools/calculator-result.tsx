'use client';

import Link from 'next/link';
import posthog from 'posthog-js';
import { formatCurrency, formatDateOnly } from '@/lib/utils/format';
import type { AffordabilityResult } from '@/lib/tools/calculate-affordability';
import { MiniCalendarPreview } from '@/components/tools/mini-calendar-preview';
import { EmailCaptureForm } from '@/components/tools/email-capture-form';
import { GetStartedCTA } from '@/components/landing/get-started-cta';

type Props = {
  result: AffordabilityResult | null;
  lastInput: any | null;
};

export function CalculatorResult({ result, lastInput }: Props) {
  if (!result) {
    return (
      <div className="rounded-xl border border-dashed border-zinc-800 bg-zinc-950/30 p-6">
        <p className="text-sm text-zinc-300 font-medium">Ready when you are.</p>
        <p className="mt-2 text-sm text-zinc-500">
          Fill out the inputs and click <span className="text-zinc-300">Calculate</span> to see your projected low point.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/pricing"
            className="text-sm text-teal-300 hover:text-teal-200 hover:underline"
            onClick={() => {
              try {
                posthog.capture('tool_can_i_afford_it_pricing_click');
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
                posthog.capture('tool_can_i_afford_it_signup_click');
              } catch {}
            }}
          >
            Create a free account
          </Link>
        </div>
      </div>
    );
  }

  const badge = result.canAfford
    ? { label: 'Yes — you can afford it', className: 'bg-teal-500/15 text-teal-200 border-teal-500/30' }
    : { label: 'No — this would take you negative', className: 'bg-rose-500/15 text-rose-200 border-rose-500/30' };

  const lowest = result.lowestBalance;

  const emailPayload = {
    tool: 'can-i-afford-it',
    calculatedAt: new Date().toISOString(),
    input: lastInput,
    result: {
      canAfford: result.canAfford,
      startDate: result.startDate,
      endDate: result.endDate,
      currentBalance: result.currentBalance,
      purchaseAmount: result.purchaseAmount,
      lowestBalance: result.lowestBalance,
      overdraftDays: result.overdraftDays,
      timeline: result.timeline.slice(0, 35),
    },
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-zinc-800 bg-zinc-950/30 p-5">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className={['inline-flex items-center rounded-full border px-3 py-1 text-sm', badge.className].join(' ')}>
              <span className="font-semibold">{badge.label}</span>
            </div>
            <p className="mt-3 text-sm text-zinc-400">
              Lowest point: <span className="text-white font-semibold">{formatCurrency(lowest.amount)}</span>{' '}
              <span className="text-zinc-500">on</span>{' '}
              <span className="text-zinc-200">{formatDateOnly(lowest.date)}</span>
            </p>
            <p className="mt-1 text-xs text-zinc-600">
              This is a simplified forecast using only what you entered (bills + next income + purchase today).
            </p>
          </div>

          <div className="flex items-center gap-3">
            <GetStartedCTA
              label="Unlock the full 90‑day forecast"
              className="bg-teal-500 hover:bg-teal-400 text-zinc-950 focus:ring-teal-400 focus:ring-offset-zinc-950"
              onClick={() => {
                try {
                  posthog.capture('tool_can_i_afford_it_cta_clicked', { location: 'result_header' });
                } catch {}
              }}
            />
          </div>
        </div>
      </div>

      <MiniCalendarPreview timeline={result.timeline} lowestDate={lowest.date} />

      <EmailCaptureForm payload={emailPayload} />

      <div className="rounded-xl border border-zinc-800 bg-zinc-950/30 p-5">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-white">Want the real answer (not a quick estimate)?</p>
            <p className="mt-1 text-sm text-zinc-500">
              Cash Flow Forecaster lets you track multiple accounts, recurring bills, and a full calendar projection.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/auth/signup"
              className="rounded-lg bg-teal-500 hover:bg-teal-400 text-zinc-950 font-semibold px-4 py-3 min-h-[44px] inline-flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-zinc-950"
              onClick={() => {
                try {
                  posthog.capture('tool_can_i_afford_it_cta_clicked', { location: 'bottom' });
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
                  posthog.capture('tool_can_i_afford_it_pricing_click', { location: 'bottom' });
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

