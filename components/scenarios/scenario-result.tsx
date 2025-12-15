'use client';

import { AlertTriangle, CheckCircle2, ArrowRight, Plus } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/format';
import { cn } from '@/lib/utils';

export type ScenarioResultViewModel = {
  canAfford: boolean;
  lowestBalance: number;
  previousLowest: number;
  lowestDate: string; // YYYY-MM-DD
  causesOverdraft: boolean;
  causesLowBalance: boolean;
  firstProblemDay: string | null; // YYYY-MM-DD
  impactSummary: string;
};

export type ScenarioPreviewViewModel = Array<{
  date: string; // YYYY-MM-DD
  baselineBalance: number;
  scenarioBalance: number;
  delta: number;
}>;

export interface ScenarioResultProps {
  currency: string;
  scenarioName: string;
  scenarioAmount: number;
  scenarioDate: string; // YYYY-MM-DD
  isRecurring: boolean;
  result: ScenarioResultViewModel;
  preview: ScenarioPreviewViewModel;
  nextAffordableDate: string | null;
  onAddToBills: () => Promise<void> | void;
  onSaveForLater: () => Promise<void> | void;
  onDone: () => void;
  onBack: () => void;
  isWorking?: boolean;
}

function formatDateOnly(date: string): string {
  // Render date-only without timezone conversion (parse as local date).
  try {
    return new Date(date + 'T00:00:00').toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return date;
  }
}

export function ScenarioResult({
  currency,
  scenarioName,
  scenarioAmount,
  scenarioDate,
  isRecurring,
  result,
  preview,
  nextAffordableDate,
  onAddToBills,
  onSaveForLater,
  onDone,
  onBack,
  isWorking,
}: ScenarioResultProps) {
  const safe = result.canAfford;

  return (
    <div className="space-y-5">
      <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
        <p className="text-xs uppercase tracking-wide text-zinc-400">Scenario</p>
        <div className="mt-2 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-base font-semibold text-zinc-100 truncate">
              {scenarioName || 'New purchase'}
            </p>
            <p className="text-sm text-zinc-400 mt-1">
              {formatDateOnly(scenarioDate)} · {isRecurring ? 'Monthly' : 'One-time'}
            </p>
          </div>
          <p className="text-lg font-semibold tabular-nums text-zinc-100">
            {formatCurrency(scenarioAmount, currency)}
          </p>
        </div>
      </div>

      {safe ? (
        <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-300 mt-0.5" />
            <div className="min-w-0">
              <p className="text-base font-semibold text-emerald-200">Yes, you can afford this!</p>
              <p className="text-sm text-emerald-100/80 mt-1">
                Your lowest balance would be{' '}
                <span className="font-semibold">
                  {formatCurrency(result.lowestBalance, currency)}
                </span>{' '}
                on <span className="font-semibold">{formatDateOnly(result.lowestDate)}</span>.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-300 mt-0.5" />
            <div className="min-w-0">
              <p className="text-base font-semibold text-rose-200">This purchase would cause issues</p>

              {result.causesOverdraft ? (
                <p className="text-sm text-rose-100/80 mt-1">
                  You&apos;d go negative (lowest:{' '}
                  <span className="font-semibold">{formatCurrency(result.lowestBalance, currency)}</span>) on{' '}
                  <span className="font-semibold">{formatDateOnly(result.lowestDate)}</span>.
                </p>
              ) : (
                <p className="text-sm text-rose-100/80 mt-1">
                  Your balance would drop to{' '}
                  <span className="font-semibold">{formatCurrency(result.lowestBalance, currency)}</span> on{' '}
                  <span className="font-semibold">{formatDateOnly(result.lowestDate)}</span>.
                </p>
              )}

              <div className="mt-3 rounded-md border border-zinc-800 bg-zinc-950/40 p-3">
                <p className="text-xs uppercase tracking-wide text-zinc-400">Comparison</p>
                <p className="text-sm text-zinc-200 mt-1">
                  Current lowest:{' '}
                  <span className="font-semibold tabular-nums">{formatCurrency(result.previousLowest, currency)}</span>{' '}
                  <span className="text-zinc-500">→</span>{' '}
                  <span className="font-semibold tabular-nums text-rose-200">
                    {formatCurrency(result.lowestBalance, currency)}
                  </span>
                </p>
              </div>

              {nextAffordableDate && (
                <div className="mt-3 text-sm text-rose-100/80">
                  Suggestion: You could afford this after{' '}
                  <span className="font-semibold">{formatDateOnly(nextAffordableDate)}</span>.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {preview.length > 0 && (
        <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
          <p className="text-xs uppercase tracking-wide text-zinc-400">Impact preview</p>
          <div className="mt-3 space-y-2">
            {preview.map((p) => {
              const worsened = p.scenarioBalance < p.baselineBalance;
              const isProblem = p.scenarioBalance < 100;
              return (
                <div
                  key={p.date}
                  className={cn(
                    'flex items-center justify-between rounded-md border px-3 py-2',
                    isProblem
                      ? 'border-rose-500/30 bg-rose-500/10'
                      : worsened
                        ? 'border-zinc-800 bg-zinc-950/40'
                        : 'border-zinc-800 bg-zinc-950/30'
                  )}
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-zinc-200">{formatDateOnly(p.date)}</p>
                    <p className="text-xs text-zinc-400">
                      {formatCurrency(p.baselineBalance, currency)}{' '}
                      <ArrowRight className="inline w-3 h-3 mx-1 text-zinc-500" />
                      <span className={cn('font-semibold tabular-nums', isProblem ? 'text-rose-200' : 'text-zinc-100')}>
                        {formatCurrency(p.scenarioBalance, currency)}
                      </span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={cn('text-sm font-semibold tabular-nums', worsened ? 'text-rose-200' : 'text-zinc-300')}>
                      -{formatCurrency(p.delta, currency)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2">
        {safe ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              type="button"
              onClick={onAddToBills}
              disabled={isWorking}
              className={cn(
                'inline-flex items-center justify-center gap-2 rounded-md px-4 py-2.5 min-h-[44px] font-medium',
                'bg-teal-600 hover:bg-teal-700 text-white disabled:opacity-50 disabled:pointer-events-none'
              )}
            >
              <Plus className="w-4 h-4" />
              Add to Bills
            </button>
            <button
              type="button"
              onClick={onDone}
              disabled={isWorking}
              className={cn(
                'inline-flex items-center justify-center rounded-md px-4 py-2.5 min-h-[44px] font-medium',
                'bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-zinc-700 disabled:opacity-50 disabled:pointer-events-none'
              )}
            >
              Done
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              type="button"
              onClick={onAddToBills}
              disabled={isWorking}
              className={cn(
                'inline-flex items-center justify-center rounded-md px-4 py-2.5 min-h-[44px] font-medium',
                'bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-zinc-700 disabled:opacity-50 disabled:pointer-events-none'
              )}
            >
              Add Anyway
            </button>
            <button
              type="button"
              onClick={onDone}
              disabled={isWorking}
              className={cn(
                'inline-flex items-center justify-center rounded-md px-4 py-2.5 min-h-[44px] font-medium',
                'bg-white/5 hover:bg-white/10 text-zinc-100 border border-zinc-700 disabled:opacity-50 disabled:pointer-events-none'
              )}
            >
              Cancel
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <button
            type="button"
            onClick={onSaveForLater}
            disabled={isWorking}
            className={cn(
              'inline-flex items-center justify-center rounded-md px-4 py-2.5 min-h-[44px] font-medium',
              'bg-transparent hover:bg-zinc-800 text-zinc-200 border border-zinc-700 disabled:opacity-50 disabled:pointer-events-none'
            )}
          >
            Save for later
          </button>
          <button
            type="button"
            onClick={onBack}
            disabled={isWorking}
            className={cn(
              'inline-flex items-center justify-center rounded-md px-4 py-2.5 min-h-[44px] font-medium',
              'bg-transparent hover:bg-zinc-800 text-zinc-300 border border-zinc-800 disabled:opacity-50 disabled:pointer-events-none'
            )}
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}


