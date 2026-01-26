'use client';

import Link from 'next/link';
import posthog from 'posthog-js';
import { formatCurrency } from '@/lib/utils/format';
import type { RateCalculatorResult as RateResult } from '@/lib/tools/calculate-hourly-rate';
import { EmailCaptureForm } from '@/components/tools/email-capture-form';
import { GetStartedCTA } from '@/components/landing/get-started-cta';

type Props = {
  result: RateResult | null;
  lastInput: any | null;
};

export function RateCalculatorResult({ result, lastInput }: Props) {
  if (!result) {
    return (
      <div className="rounded-xl border border-dashed border-zinc-800 bg-zinc-950/30 p-6">
        <p className="text-sm text-zinc-300 font-medium">Enter your numbers to see your rate.</p>
        <p className="mt-2 text-sm text-zinc-500">
          Click <span className="text-zinc-300">Calculate</span> to get your minimum, suggested, and premium hourly rates.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/pricing"
            className="text-sm text-teal-300 hover:text-teal-200 hover:underline"
            onClick={() => {
              try {
                posthog.capture('tool_rate_calculator_pricing_click');
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
                posthog.capture('tool_rate_calculator_signup_click');
              } catch {}
            }}
          >
            Create a free account
          </Link>
        </div>
      </div>
    );
  }

  const emailPayload = {
    tool: 'freelance-rate-calculator',
    calculatedAt: new Date().toISOString(),
    input: lastInput,
    result,
  };

  return (
    <div className="space-y-6">
      {/* Primary result */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-950/30 p-5">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="text-xs text-zinc-500">Your suggested rate</p>
            <div className="mt-2 text-4xl md:text-5xl font-bold tracking-tight text-white tabular-nums">
              {formatCurrency(result.suggestedHourlyRate)}
              <span className="text-base font-semibold text-zinc-400">/hr</span>
            </div>
            <p className="mt-2 text-sm text-zinc-500">
              This includes a 20% buffer for slow months and overhead.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <GetStartedCTA
              label="Track if you’re hitting it"
              className="bg-teal-500 hover:bg-teal-400 text-zinc-950 focus:ring-teal-400 focus:ring-offset-zinc-950"
              onClick={() => {
                try {
                  posthog.capture('tool_rate_calculator_cta_clicked', { location: 'result_header' });
                } catch {}
              }}
            />
          </div>
        </div>
      </div>

      {/* Rate comparison */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-zinc-800 bg-zinc-950/30 p-4">
          <p className="text-xs text-zinc-500">Minimum</p>
          <p className="mt-1 text-xl font-semibold text-white tabular-nums">{formatCurrency(result.minimumHourlyRate)}/hr</p>
          <p className="mt-2 text-xs text-zinc-600">Bare minimum to hit your goal.</p>
        </div>
        <div className="rounded-xl border border-teal-500/30 bg-teal-500/10 p-4">
          <p className="text-xs text-teal-200/90">Suggested</p>
          <p className="mt-1 text-xl font-semibold text-white tabular-nums">{formatCurrency(result.suggestedHourlyRate)}/hr</p>
          <p className="mt-2 text-xs text-zinc-200/80">20% buffer for reality.</p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-950/30 p-4">
          <p className="text-xs text-zinc-500">Premium</p>
          <p className="mt-1 text-xl font-semibold text-white tabular-nums">{formatCurrency(result.premiumHourlyRate)}/hr</p>
          <p className="mt-2 text-xs text-zinc-600">Specialist/expert positioning.</p>
        </div>
      </div>

      {/* Breakdown */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-950/30 p-5">
        <p className="text-sm font-semibold text-white">Breakdown</p>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center justify-between gap-4 rounded-lg border border-zinc-800 bg-zinc-950/40 p-4">
            <span className="text-zinc-400">Monthly revenue needed</span>
            <span className="text-white font-semibold tabular-nums">{formatCurrency(result.monthlyRevenueNeeded)}</span>
          </div>
          <div className="flex items-center justify-between gap-4 rounded-lg border border-zinc-800 bg-zinc-950/40 p-4">
            <span className="text-zinc-400">Daily rate (8 hours)</span>
            <span className="text-white font-semibold tabular-nums">{formatCurrency(result.dailyRate)}</span>
          </div>
          <div className="flex items-center justify-between gap-4 rounded-lg border border-zinc-800 bg-zinc-950/40 p-4">
            <span className="text-zinc-400">Working weeks</span>
            <span className="text-white font-semibold tabular-nums">{result.workingWeeks.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between gap-4 rounded-lg border border-zinc-800 bg-zinc-950/40 p-4">
            <span className="text-zinc-400">Annual billable hours</span>
            <span className="text-white font-semibold tabular-nums">{result.annualBillableHours.toLocaleString()}</span>
          </div>
        </div>
        <p className="mt-3 text-xs text-zinc-600">
          Annual revenue needed: <span className="text-zinc-300">{formatCurrency(result.annualRevenueNeeded)}</span> •
          Annual expenses: <span className="text-zinc-300">{formatCurrency(result.annualExpenses)}</span>
        </p>
      </div>

      {/* Project guidance */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-950/30 p-5">
        <p className="text-sm font-semibold text-white">Project rate guidance (using suggested rate)</p>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <div className="rounded-lg border border-zinc-800 bg-zinc-950/40 p-4">
            <p className="text-zinc-400">10-hour project</p>
            <p className="mt-1 text-white font-semibold tabular-nums">{formatCurrency(result.tenHourProject)}</p>
          </div>
          <div className="rounded-lg border border-zinc-800 bg-zinc-950/40 p-4">
            <p className="text-zinc-400">20-hour project</p>
            <p className="mt-1 text-white font-semibold tabular-nums">{formatCurrency(result.twentyHourProject)}</p>
          </div>
          <div className="rounded-lg border border-zinc-800 bg-zinc-950/40 p-4">
            <p className="text-zinc-400">40-hour project</p>
            <p className="mt-1 text-white font-semibold tabular-nums">{formatCurrency(result.fortyHourProject)}</p>
          </div>
        </div>
        <p className="mt-3 text-xs text-zinc-600">
          Quick rule: a 10-hour project should be at least{' '}
          <span className="text-zinc-300">{formatCurrency(result.tenHourProject)}</span>.
        </p>
      </div>

      <EmailCaptureForm
        payload={emailPayload}
        events={{
          sent: 'tool_rate_calculator_email_sent',
          failed: 'tool_rate_calculator_email_failed',
        }}
      />

      {/* Bottom CTA */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-950/30 p-5">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-white">Now track if you’re actually hitting these numbers</p>
            <p className="mt-1 text-sm text-zinc-500">
              Cash Flow Forecaster helps you forecast revenue, expenses, and cash balance across the next 90 days.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/auth/signup"
              className="rounded-lg bg-teal-500 hover:bg-teal-400 text-zinc-950 font-semibold px-4 py-3 min-h-[44px] inline-flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-zinc-950"
              onClick={() => {
                try {
                  posthog.capture('tool_rate_calculator_cta_clicked', { location: 'bottom' });
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
                  posthog.capture('tool_rate_calculator_pricing_click', { location: 'bottom' });
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

