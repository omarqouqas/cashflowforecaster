'use client';

import { useEffect, useMemo, useState } from 'react';
import { CalculatorForm, type CalculatorFormValues } from '@/components/tools/calculator-form';
import { CalculatorResult } from '@/components/tools/calculator-result';
import { calculateAffordability, type AffordabilityResult } from '@/lib/tools/calculate-affordability';
import posthog from 'posthog-js';
import { trackCanIAffordIt } from '@/lib/posthog';

export function CanIAffordCalculator() {
  const [result, setResult] = useState<AffordabilityResult | null>(null);
  const [lastInput, setLastInput] = useState<CalculatorFormValues | null>(null);

  useEffect(() => {
    try {
      posthog.capture('tool_can_i_afford_it_viewed');
    } catch {
      // best-effort
    }
  }, []);

  const defaultValues = useMemo<Partial<CalculatorFormValues>>(() => {
    const today = new Date().toISOString().slice(0, 10);
    const d = new Date();
    d.setDate(d.getDate() + 7);
    const nextWeek = d.toISOString().slice(0, 10);
    return {
      currentBalance: 2500,
      purchaseAmount: 350,
      purchaseDate: today,
      nextIncomeAmount: 1800,
      nextIncomeDate: nextWeek,
      upcomingBills: [
        { name: 'Rent', amount: 1200, date: nextWeek },
      ],
    };
  }, []);

  const handleCalculate = (values: CalculatorFormValues) => {
    const computed = calculateAffordability({
      currentBalance: values.currentBalance,
      purchaseAmount: values.purchaseAmount,
      purchaseDate: values.purchaseDate,
      nextIncome: { amount: values.nextIncomeAmount, date: values.nextIncomeDate },
      upcomingBills: values.upcomingBills ?? [],
    });

    setResult(computed);
    setLastInput(values);

    // PostHog tracking (core differentiator)
    try {
      trackCanIAffordIt({
        amount: values.purchaseAmount,
        canAfford: computed.canAfford,
        dateChecked: new Date().toISOString(),
      });
      posthog.capture('tool_can_i_afford_it_calculated', {
        can_afford: computed.canAfford,
        purchase_amount: values.purchaseAmount,
        purchase_date: values.purchaseDate,
        current_balance: values.currentBalance,
        bills_count: values.upcomingBills?.length ?? 0,
        next_income_amount: values.nextIncomeAmount,
        next_income_date: values.nextIncomeDate,
        lowest_balance: computed.lowestBalance.amount,
        lowest_balance_date: computed.lowestBalance.date,
        overdraft_days: computed.overdraftDays,
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
            Enter what you have now, what’s coming out, what’s coming in, and the purchase you’re considering.
          </p>

          <div className="mt-6">
            <CalculatorForm
              defaultValues={defaultValues}
              onCalculate={handleCalculate}
              onFirstInteraction={() => {
                try {
                  posthog.capture('tool_can_i_afford_it_form_interaction');
                } catch {}
              }}
            />
          </div>
        </div>
      </div>

      <div className="lg:col-span-7">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
          <h2 className="text-lg font-semibold text-white">Projection</h2>
          <p className="mt-1 text-sm text-zinc-400">
            We simulate your balance day-by-day from today through your next income and upcoming bills.
          </p>

          <div className="mt-6">
            <CalculatorResult result={result} lastInput={lastInput} />
          </div>
        </div>
      </div>
    </div>
  );
}

