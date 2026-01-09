'use client';

import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const rateCalculatorSchema = z.object({
  annualIncomeGoal: z.coerce
    .number({
      required_error: 'Annual income goal is required',
      invalid_type_error: 'Annual income goal must be a number',
    })
    .min(1, 'Annual income goal must be at least $1')
    .refine((n) => Number.isFinite(n), 'Enter a valid number'),
  monthlyExpenses: z.coerce
    .number({
      required_error: 'Monthly expenses are required',
      invalid_type_error: 'Monthly expenses must be a number',
    })
    .min(0, 'Monthly expenses cannot be negative')
    .refine((n) => Number.isFinite(n), 'Enter a valid number'),
  billableHoursPerWeek: z.coerce
    .number({
      required_error: 'Billable hours are required',
      invalid_type_error: 'Billable hours must be a number',
    })
    .min(1, 'Billable hours must be at least 1')
    .max(60, 'Billable hours must be 60 or less')
    .refine((n) => Number.isFinite(n), 'Enter a valid number'),
  vacationWeeks: z.coerce
    .number({
      required_error: 'Vacation weeks are required',
      invalid_type_error: 'Vacation weeks must be a number',
    })
    .min(0, 'Vacation weeks cannot be negative')
    .max(52, 'Vacation weeks must be 52 or less')
    .refine((n) => Number.isFinite(n), 'Enter a valid number'),
});

export type RateCalculatorFormValues = z.infer<typeof rateCalculatorSchema>;

type Props = {
  defaultValues?: Partial<RateCalculatorFormValues>;
  onCalculate: (values: RateCalculatorFormValues) => void;
  onFirstInteraction?: () => void;
};

export function RateCalculatorForm({ defaultValues, onCalculate, onFirstInteraction }: Props) {
  const defaults = useMemo<RateCalculatorFormValues>(() => {
    return {
      annualIncomeGoal: 75_000,
      monthlyExpenses: 500,
      billableHoursPerWeek: 25,
      vacationWeeks: 4,
      ...defaultValues,
    };
  }, [defaultValues]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RateCalculatorFormValues>({
    resolver: zodResolver(rateCalculatorSchema),
    defaultValues: defaults,
    mode: 'onSubmit',
  });

  const onSubmit = (values: RateCalculatorFormValues) => {
    onCalculate(values);
  };

  const baseInput =
    'bg-zinc-950/40 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus:ring-teal-500 focus:ring-offset-zinc-950 focus:border-transparent';

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
      onChange={() => {
        onFirstInteraction?.();
      }}
    >
      <div>
        <Label htmlFor="annualIncomeGoal" className="text-zinc-300 mb-1.5 block">
          Annual income goal<span className="text-rose-400 ml-0.5">*</span>
        </Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">$</span>
          <Input
            id="annualIncomeGoal"
            type="number"
            step="1"
            placeholder="75000"
            {...register('annualIncomeGoal')}
            className={['pl-8', baseInput, errors.annualIncomeGoal ? 'border-rose-500 focus:ring-rose-500' : ''].join(
              ' '
            )}
          />
        </div>
        {errors.annualIncomeGoal?.message && (
          <p className="text-sm text-rose-300 mt-1.5">{errors.annualIncomeGoal.message}</p>
        )}
        <p className="text-sm text-zinc-500 mt-1.5">What you want to take home after expenses (before personal taxes)</p>
      </div>

      <div>
        <Label htmlFor="monthlyExpenses" className="text-zinc-300 mb-1.5 block">
          Monthly business expenses<span className="text-rose-400 ml-0.5">*</span>
        </Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">$</span>
          <Input
            id="monthlyExpenses"
            type="number"
            step="1"
            placeholder="500"
            {...register('monthlyExpenses')}
            className={['pl-8', baseInput, errors.monthlyExpenses ? 'border-rose-500 focus:ring-rose-500' : ''].join(
              ' '
            )}
          />
        </div>
        {errors.monthlyExpenses?.message && (
          <p className="text-sm text-rose-300 mt-1.5">{errors.monthlyExpenses.message}</p>
        )}
        <p className="text-sm text-zinc-500 mt-1.5">Software, tools, insurance, subscriptions, etc.</p>
      </div>

      <div className="rounded-xl border border-zinc-800 bg-zinc-950/30 p-4">
        <h3 className="text-sm font-semibold text-white">Your capacity</h3>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="billableHoursPerWeek" className="text-zinc-300 mb-1.5 block">
              Billable hours / week<span className="text-rose-400 ml-0.5">*</span>
            </Label>
            <Input
              id="billableHoursPerWeek"
              type="number"
              step="1"
              placeholder="25"
              {...register('billableHoursPerWeek')}
              className={[baseInput, errors.billableHoursPerWeek ? 'border-rose-500 focus:ring-rose-500' : ''].join(
                ' '
              )}
            />
            {errors.billableHoursPerWeek?.message && (
              <p className="text-sm text-rose-300 mt-1.5">{errors.billableHoursPerWeek.message}</p>
            )}
            <p className="text-sm text-zinc-500 mt-1.5">Be realistic - most freelancers bill 20-30 hours/week</p>
          </div>

          <div>
            <Label htmlFor="vacationWeeks" className="text-zinc-300 mb-1.5 block">
              Vacation / time-off weeks<span className="text-rose-400 ml-0.5">*</span>
            </Label>
            <Input
              id="vacationWeeks"
              type="number"
              step="1"
              placeholder="4"
              {...register('vacationWeeks')}
              className={[baseInput, errors.vacationWeeks ? 'border-rose-500 focus:ring-rose-500' : ''].join(' ')}
            />
            {errors.vacationWeeks?.message && (
              <p className="text-sm text-rose-300 mt-1.5">{errors.vacationWeeks.message}</p>
            )}
            <p className="text-sm text-zinc-500 mt-1.5">Include sick days, holidays, slow periods</p>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-lg bg-teal-500 hover:bg-teal-400 text-zinc-950 font-semibold px-4 py-3 min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-zinc-950"
      >
        {isSubmitting ? 'Calculating...' : 'Calculate'}
      </button>
    </form>
  );
}

