'use client';

import { useMemo } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import posthog from 'posthog-js';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2 } from 'lucide-react';

const optionalPositiveNumber = z.preprocess((v) => {
  if (v === '' || v === null || v === undefined) return undefined;
  return v;
}, z.coerce.number({ invalid_type_error: 'Must be a number' }).positive('Must be greater than 0').optional());

const incomeSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1, 'Label is required').max(50, 'Label too long'),
  amount: z.coerce
    .number({
      required_error: 'Amount is required',
      invalid_type_error: 'Amount must be a number',
    })
    .min(0, 'Amount must be ≥ 0')
    .refine((n) => Number.isFinite(n), 'Enter a valid number'),
});

const formSchema = z
  .object({
    incomes: z.array(incomeSchema).min(3, 'Add at least 3 months').max(24, 'Maximum 24 months'),
    monthlyExpenses: optionalPositiveNumber,
  })
  .refine((v) => v.incomes.filter((m) => m.amount > 0).length >= 3, {
    message: 'Enter at least 3 months with income greater than 0',
    path: ['incomes'],
  });

export type VariabilityCalculatorFormValues = z.infer<typeof formSchema>;

function formatMonthLabel(date: Date) {
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

const safeUUID = () => {
  try {
    return crypto.randomUUID();
  } catch {
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }
};

const getDefaultMonths = () => {
  const months: Array<{ id: string; label: string; amount: number }> = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({ id: safeUUID(), label: formatMonthLabel(date), amount: 0 });
  }
  return months;
};

function inferOlderMonthLabel(currentOldestLabel: string | undefined) {
  if (!currentOldestLabel) return `Month ${1}`;
  const parsed = new Date(currentOldestLabel);
  if (Number.isNaN(parsed.getTime())) return `Month ${1}`;
  parsed.setMonth(parsed.getMonth() - 1);
  return formatMonthLabel(parsed);
}

type Props = {
  defaultValues?: Partial<VariabilityCalculatorFormValues>;
  onCalculate: (values: VariabilityCalculatorFormValues) => void;
  onFirstInteraction?: () => void;
};

export function VariabilityCalculatorForm({ defaultValues, onCalculate, onFirstInteraction }: Props) {
  const defaults = useMemo<VariabilityCalculatorFormValues>(() => {
    return {
      incomes: getDefaultMonths(),
      monthlyExpenses: undefined,
      ...defaultValues,
    };
  }, [defaultValues]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<VariabilityCalculatorFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaults,
    mode: 'onSubmit',
  });

  const { fields, remove, prepend } = useFieldArray({
    control,
    name: 'incomes',
  });

  const onSubmit = (values: VariabilityCalculatorFormValues) => {
    onCalculate(values);
  };

  const watchedIncomes = watch('incomes');
  const oldestLabel = watchedIncomes?.[0]?.label;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
      onChange={() => {
        onFirstInteraction?.();
      }}
    >
      <div className="rounded-xl border border-zinc-800 bg-zinc-950/30 p-4">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <h3 className="text-sm font-semibold text-white">Monthly income history</h3>
            <p className="mt-1 text-xs text-zinc-500">
              Add your last 6–12 months. Minimum 3 months required (more months = more accuracy).
            </p>
          </div>
          <button
            type="button"
            disabled={fields.length >= 24}
            onClick={() => {
              const label = inferOlderMonthLabel(oldestLabel);
              prepend({ id: safeUUID(), label, amount: 0 });
              try {
                posthog.capture('tool_variability_calculator_month_added', { months_count: fields.length + 1 });
              } catch {}
            }}
            className="inline-flex items-center gap-2 rounded-md border border-zinc-800 bg-zinc-950/40 px-3 py-2 text-sm text-zinc-200 hover:bg-zinc-900/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="h-4 w-4 text-teal-300" />
            Add month
          </button>
        </div>

        <div className="mt-4 space-y-3">
          {fields.map((field, idx) => {
            const err = errors.incomes?.[idx];
            return (
              <div key={field.id} className="rounded-lg border border-zinc-800 bg-zinc-950/40 p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-zinc-300 mb-1.5 block" htmlFor={`incomes.${idx}.label`}>
                      Month label<span className="text-rose-400 ml-0.5">*</span>
                    </Label>
                    <Input
                      id={`incomes.${idx}.label`}
                      {...register(`incomes.${idx}.label`)}
                      className={[
                        'bg-zinc-950/40 border-zinc-800 text-zinc-100 placeholder:text-zinc-600',
                        'focus:ring-teal-500 focus:ring-offset-zinc-950 focus:border-transparent',
                        err?.label ? 'border-rose-500 focus:ring-rose-500' : '',
                      ].join(' ')}
                    />
                    {err?.label?.message ? <p className="text-sm text-rose-300 mt-1">{err.label.message}</p> : null}
                  </div>

                  <div>
                    <Label className="text-zinc-300 mb-1.5 block" htmlFor={`incomes.${idx}.amount`}>
                      Income amount<span className="text-rose-400 ml-0.5">*</span>
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">$</span>
                      <Input
                        id={`incomes.${idx}.amount`}
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        {...register(`incomes.${idx}.amount`)}
                        className={[
                          'pl-8 pr-4 bg-zinc-950/40 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 tabular-nums w-full min-w-0',
                          'focus:ring-teal-500 focus:ring-offset-zinc-950 focus:border-transparent',
                          '[appearance:textfield]',
                          '[&::-webkit-outer-spin-button]:appearance-none',
                          '[&::-webkit-inner-spin-button]:appearance-none',
                          err?.amount ? 'border-rose-500 focus:ring-rose-500' : '',
                        ].join(' ')}
                      />
                    </div>
                    {err?.amount?.message ? <p className="text-sm text-rose-300 mt-1">{err.amount.message}</p> : null}
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between gap-3">
                  <input type="hidden" {...register(`incomes.${idx}.id`)} />
                  <p className="text-xs text-zinc-600">
                    Tip: 6–12 months is best. (47% of freelancers experience income volatility.)
                  </p>
                  <button
                    type="button"
                    onClick={() => remove(idx)}
                    disabled={fields.length <= 3}
                    aria-label="Remove month"
                    className="h-11 px-4 rounded-md border border-zinc-800 bg-zinc-950/40 text-zinc-400 hover:bg-rose-950/30 hover:border-rose-800 hover:text-rose-300 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="text-sm">Remove</span>
                  </button>
                </div>
              </div>
            );
          })}

          {typeof errors.incomes?.message === 'string' ? (
            <p className="text-sm text-rose-300">{errors.incomes?.message}</p>
          ) : null}
        </div>
      </div>

      <div>
        <Label htmlFor="monthlyExpenses" className="text-zinc-300 mb-1.5 block">
          Monthly expenses <span className="text-zinc-500">(optional)</span>
        </Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">$</span>
          <Input
            id="monthlyExpenses"
            type="number"
            step="0.01"
            placeholder="e.g., 3200"
            {...register('monthlyExpenses')}
            className={[
              'pl-8 bg-zinc-950/40 border-zinc-800 text-zinc-100 placeholder:text-zinc-600',
              'focus:ring-teal-500 focus:ring-offset-zinc-950 focus:border-transparent',
              errors.monthlyExpenses ? 'border-rose-500 focus:ring-rose-500' : '',
            ].join(' ')}
          />
        </div>
        {errors.monthlyExpenses?.message ? (
          <p className="text-sm text-rose-300 mt-1.5">{errors.monthlyExpenses.message}</p>
        ) : null}
        <p className="text-sm text-zinc-500 mt-1.5">Used to highlight “danger months” below your expense threshold.</p>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-lg bg-teal-500 hover:bg-teal-400 text-zinc-950 font-semibold px-4 py-3 min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-zinc-950"
      >
        {isSubmitting ? 'Calculating…' : 'Calculate'}
      </button>
    </form>
  );
}

