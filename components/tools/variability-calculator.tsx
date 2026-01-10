'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import posthog from 'posthog-js';
import {
  calculateIncomeVariability,
  type VariabilityCalculatorResult as Result,
} from '@/lib/tools/calculate-income-variability';
import {
  VariabilityCalculatorForm,
  type VariabilityCalculatorFormValues,
} from '@/components/tools/variability-calculator-form';
import { VariabilityCalculatorResult } from '@/components/tools/variability-calculator-result';

export function VariabilityCalculator() {
  const [result, setResult] = useState<Result | null>(null);
  const [lastInput, setLastInput] = useState<VariabilityCalculatorFormValues | null>(null);
  const interactedOnce = useRef(false);

  useEffect(() => {
    try {
      posthog.capture('tool_variability_calculator_viewed');
    } catch {
      // best-effort
    }
  }, []);

  const defaultValues = useMemo<Partial<VariabilityCalculatorFormValues>>(() => {
    return {
      monthlyExpenses: undefined,
    };
  }, []);

  const handleCalculate = (values: VariabilityCalculatorFormValues) => {
    const computed = calculateIncomeVariability({
      incomes: values.incomes,
      monthlyExpenses: values.monthlyExpenses,
    });

    setResult(computed);
    setLastInput(values);

    try {
      posthog.capture('tool_variability_calculator_calculated', {
        months_count: values.incomes.length,
        variability_level: computed.variabilityLevel,
        variability_score: computed.variabilityScore,
        has_expenses: !!values.monthlyExpenses,
        danger_percentage: values.monthlyExpenses ? computed.dangerPercentage : null,
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
            Add your last 6–12 months of income to see how unpredictable your cash flow really is.
          </p>

          <div className="mt-6">
            <VariabilityCalculatorForm
              defaultValues={defaultValues}
              onCalculate={handleCalculate}
              onFirstInteraction={() => {
                if (interactedOnce.current) return;
                interactedOnce.current = true;
                try {
                  posthog.capture('tool_variability_calculator_form_interaction');
                } catch {}
              }}
            />
          </div>
        </div>
      </div>

      <div className="lg:col-span-7">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
          <h2 className="text-lg font-semibold text-white">Your results</h2>
          <p className="mt-1 text-sm text-zinc-400">
            We calculate variability (coefficient of variation), identify danger months, and recommend an emergency fund.
          </p>

          <div className="mt-6">
            <VariabilityCalculatorResult result={result} lastInput={lastInput} />
          </div>
        </div>
      </div>
    </div>
  );
}

