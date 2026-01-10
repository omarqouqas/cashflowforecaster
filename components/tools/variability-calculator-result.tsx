'use client';

import Link from 'next/link';
import posthog from 'posthog-js';
import { AlertTriangle, PiggyBank, TrendingUp } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/format';
import type { VariabilityCalculatorResult as Result } from '@/lib/tools/calculate-income-variability';
import { IncomeBarChart } from '@/components/tools/income-bar-chart';
import { EmailCaptureForm } from '@/components/tools/email-capture-form';

type Props = {
  result: Result | null;
  lastInput: any | null;
};

function levelBadge(level: Result['variabilityLevel']) {
  if (level === 'high') return { label: 'HIGH', className: 'bg-rose-500/15 text-rose-200 border-rose-500/30' };
  if (level === 'medium') return { label: 'MEDIUM', className: 'bg-amber-500/15 text-amber-200 border-amber-500/30' };
  return { label: 'LOW', className: 'bg-teal-500/15 text-teal-200 border-teal-500/30' };
}

function levelChip(level: Result['variabilityLevel']) {
  if (level === 'high') return { label: 'High', className: 'bg-rose-500 text-zinc-950' };
  if (level === 'medium') return { label: 'Medium', className: 'bg-amber-500 text-zinc-950' };
  return { label: 'Low', className: 'bg-teal-500 text-zinc-950' };
}

export function VariabilityCalculatorResult({ result, lastInput }: Props) {
  if (!result) {
    return (
      <div className="rounded-xl border border-dashed border-zinc-800 bg-zinc-950/30 p-6">
        <p className="text-sm text-zinc-300 font-medium">Enter your monthly income to see your variability score.</p>
        <p className="mt-2 text-sm text-zinc-500">
          Add at least <span className="text-zinc-300">3 months</span> (6–12 is best), then click{' '}
          <span className="text-zinc-300">Calculate</span>.
        </p>
      </div>
    );
  }

  const badge = levelBadge(result.variabilityLevel);
  const chip = levelChip(result.variabilityLevel);

  const emailPayload = {
    tool: 'income-variability-calculator',
    calculatedAt: new Date().toISOString(),
    input: lastInput,
    result,
  };

  return (
    <div className="space-y-6">
      {/* Hero result */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-950/30 p-5">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="text-xs text-zinc-500">Your income variability</p>
            <div className="mt-2 flex items-center gap-3 flex-wrap">
              <div className={['inline-flex items-center rounded-full border px-3 py-1 text-sm', badge.className].join(' ')}>
                <span className="font-semibold">{badge.label}</span>
              </div>
              <p className="text-sm text-zinc-400">
                Your income varies by{' '}
                <span className="text-white font-semibold tabular-nums">{result.variabilityScore}%</span> month-to-month.
              </p>
            </div>
            <p className="mt-3 text-sm text-zinc-500">
              You’re more stable than{' '}
              <span className="text-zinc-200 font-semibold tabular-nums">{result.percentileBetterThan}%</span> of freelancers.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/auth/signup"
              className="rounded-lg bg-teal-500 hover:bg-teal-400 text-zinc-950 font-semibold px-4 py-3 min-h-[44px] inline-flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-zinc-950"
              onClick={() => {
                try {
                  posthog.capture('tool_variability_calculator_cta_clicked', { location: 'result_header' });
                } catch {}
              }}
            >
              Start forecasting free
            </Link>
          </div>
        </div>
      </div>

      <IncomeBarChart data={result.incomeData} average={result.averageIncome} dangerThreshold={result.dangerZoneThreshold} />

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="rounded-xl border border-zinc-800 bg-zinc-950/30 p-4">
          <p className="text-xs text-zinc-500">Average monthly income</p>
          <p className="mt-1 text-xl font-semibold text-white tabular-nums">{formatCurrency(result.averageIncome)}</p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-950/30 p-4">
          <p className="text-xs text-zinc-500">Median monthly income</p>
          <p className="mt-1 text-xl font-semibold text-white tabular-nums">{formatCurrency(result.medianIncome)}</p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-950/30 p-4">
          <p className="text-xs text-zinc-500">Standard deviation</p>
          <p className="mt-1 text-xl font-semibold text-white tabular-nums">{formatCurrency(result.standardDeviation)}</p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-950/30 p-4">
          <p className="text-xs text-zinc-500">Highest month</p>
          <p className="mt-1 text-xl font-semibold text-white tabular-nums">{formatCurrency(result.highestMonth.amount)}</p>
          <p className="mt-1 text-xs text-zinc-600">{result.highestMonth.label}</p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-950/30 p-4">
          <p className="text-xs text-zinc-500">Lowest month</p>
          <p className="mt-1 text-xl font-semibold text-white tabular-nums">{formatCurrency(result.lowestMonth.amount)}</p>
          <p className="mt-1 text-xs text-zinc-600">{result.lowestMonth.label}</p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-950/30 p-4">
          <p className="text-xs text-zinc-500">Income range</p>
          <p className="mt-1 text-xl font-semibold text-white tabular-nums">{formatCurrency(result.incomeRange)}</p>
          <p className="mt-1 text-xs text-zinc-600 tabular-nums">{result.rangeAsPercentage}% of average</p>
        </div>
      </div>

      {/* Danger zone */}
      {result.dangerZoneThreshold ? (
        <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-5">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-lg border border-rose-500/30 bg-rose-500/10 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-rose-200" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white">Danger zone analysis</p>
              <p className="mt-1 text-sm text-zinc-300">
                <span className="font-semibold tabular-nums">{result.monthsBelowDanger}</span> of{' '}
                <span className="font-semibold tabular-nums">{result.incomeData.length}</span> months (
                <span className="font-semibold tabular-nums">{result.dangerPercentage}%</span>) fell below your{' '}
                <span className="text-rose-200 font-semibold tabular-nums">{formatCurrency(result.dangerZoneThreshold)}</span>{' '}
                expense threshold.
              </p>
              {result.dangerMonths.length ? (
                <p className="mt-2 text-xs text-zinc-400">
                  Danger months:{' '}
                  <span className="text-zinc-200">
                    {result.dangerMonths.map((m) => m.label).slice(0, 10).join(', ')}
                    {result.dangerMonths.length > 10 ? '…' : ''}
                  </span>
                </p>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}

      {/* Emergency fund */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-950/30 p-5">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-lg border border-zinc-800 bg-zinc-950/40 flex items-center justify-center">
            <PiggyBank className="h-5 w-5 text-teal-200" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white">Recommended emergency fund</p>
            <p className="mt-1 text-sm text-zinc-400">
              Based on your <span className="text-zinc-200 font-semibold">{chip.label}</span> variability, we recommend{' '}
              <span className="text-white font-semibold tabular-nums">{result.recommendedEmergencyMonths}</span> months saved:
            </p>
            <p className="mt-2 text-2xl font-bold text-white tabular-nums">{formatCurrency(result.recommendedEmergencyFund)}</p>
            <p className="mt-1 text-xs text-zinc-600">
              This is a buffer for income swings (and the “quiet weeks” that always show up).
            </p>
          </div>
        </div>
      </div>

      {/* Conversion hook */}
      <div className="rounded-xl border border-teal-500/30 bg-gradient-to-b from-teal-500/10 to-zinc-950/30 p-5">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-lg border border-teal-500/30 bg-teal-500/10 flex items-center justify-center">
            <TrendingUp className="h-5 w-5 text-teal-200" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-white">
              Your income varies by <span className="tabular-nums">{result.variabilityScore}%</span> month-to-month.
            </p>
            <p className="mt-1 text-sm text-zinc-300">
              That’s why knowing your cash flow <span className="text-white font-semibold">60 days ahead</span> matters.
            </p>
            <p className="mt-1 text-sm text-zinc-400">See exactly when you’ll have money—and when you won’t.</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href="/auth/signup"
                className="rounded-lg bg-teal-500 hover:bg-teal-400 text-zinc-950 font-semibold px-4 py-3 min-h-[44px] inline-flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-zinc-950"
                onClick={() => {
                  try {
                    posthog.capture('tool_variability_calculator_cta_clicked', { location: 'conversion_hook' });
                  } catch {}
                }}
              >
                Start forecasting free
              </Link>
              <Link
                href="/pricing"
                className="rounded-lg border border-zinc-800 bg-zinc-950/40 text-zinc-200 hover:bg-zinc-900/50 font-medium px-4 py-3 min-h-[44px] inline-flex items-center justify-center"
                onClick={() => {
                  try {
                    posthog.capture('tool_variability_calculator_cta_clicked', { location: 'pricing' });
                  } catch {}
                }}
              >
                View pricing
              </Link>
            </div>
          </div>
        </div>
      </div>

      <EmailCaptureForm
        payload={emailPayload}
        events={{
          sent: 'tool_variability_calculator_email_sent',
          failed: 'tool_variability_calculator_email_failed',
        }}
      />
    </div>
  );
}

