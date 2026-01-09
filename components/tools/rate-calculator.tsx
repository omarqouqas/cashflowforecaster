'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import posthog from 'posthog-js';
import { RateCalculatorForm, type RateCalculatorFormValues } from '@/components/tools/rate-calculator-form';
import { RateCalculatorResult } from '@/components/tools/rate-calculator-result';
import { calculateHourlyRate, type RateCalculatorResult as RateResult } from '@/lib/tools/calculate-hourly-rate';

function incomeGoalBucket(goal: number) {
  if (goal < 50_000) return 'under_50k';
  if (goal < 75_000) return '50k_75k';
  if (goal < 100_000) return '75k_100k';
  if (goal < 150_000) return '100k_150k';
  return 'over_150k';
}

export function RateCalculator() {
  const [result, setResult] = useState<RateResult | null>(null);
  const [lastInput, setLastInput] = useState<RateCalculatorFormValues | null>(null);
  const interactedOnce = useRef(false);

  useEffect(() => {
    try {
      posthog.capture('tool_rate_calculator_viewed');
    } catch {
      // best-effort
    }
  }, []);

  const defaultValues = useMemo<Partial<RateCalculatorFormValues>>(() => {
    return {
      annualIncomeGoal: 75_000,
      monthlyExpenses: 500,
      billableHoursPerWeek: 25,
      vacationWeeks: 4,
    };
  }, []);

  const handleCalculate = (values: RateCalculatorFormValues) => {
    const computed = calculateHourlyRate(values);

    setResult(computed);
    setLastInput(values);

    try {
      posthog.capture('tool_rate_calculator_calculated', {
        income_goal_range: incomeGoalBucket(values.annualIncomeGoal),
        billable_hours: values.billableHoursPerWeek,
        suggested_rate: computed.suggestedHourlyRate,
      });
    } catch {
      // best-effort
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-5">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
          <h2 className="text-lg font-semibold text-white">Your inputs</h2>
          <p className="mt-1 text-sm text-zinc-400">
            Set your take-home goal, add your business expenses, and estimate your real billable hours.
          </p>

          <div className="mt-6">
            <RateCalculatorForm
              defaultValues={defaultValues}
              onCalculate={handleCalculate}
              onFirstInteraction={() => {
                if (interactedOnce.current) return;
                interactedOnce.current = true;
                try {
                  posthog.capture('tool_rate_calculator_form_interaction');
                } catch {}
              }}
            />
          </div>
        </div>
      </div>

      <div className="lg:col-span-7">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
          <h2 className="text-lg font-semibold text-white">Your rates</h2>
          <p className="mt-1 text-sm text-zinc-400">
            We calculate a minimum rate (break-even) and add buffers for suggested and premium positioning.
          </p>

          <div className="mt-6">
            <RateCalculatorResult result={result} lastInput={lastInput} />
          </div>
        </div>
      </div>
    </div>
  );
}

