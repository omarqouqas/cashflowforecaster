'use client';

import { useMemo } from 'react';
import { useFieldArray, useForm, type UseFormRegisterReturn } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2 } from 'lucide-react';
import posthog from 'posthog-js';

const billSchema = z.object({
  name: z.string().max(100, 'Name too long').optional().or(z.literal('')),
  amount: z.coerce
    .number({
      required_error: 'Amount is required',
      invalid_type_error: 'Amount must be a number',
    })
    .positive('Amount must be positive'),
  date: z.string().min(1, 'Date is required'),
});

const calculatorSchema = z.object({
  currentBalance: z.coerce
    .number({
      required_error: 'Current balance is required',
      invalid_type_error: 'Current balance must be a number',
    })
    .refine((n) => Number.isFinite(n), 'Enter a valid number'),
  purchaseAmount: z.coerce
    .number({
      required_error: 'Purchase amount is required',
      invalid_type_error: 'Purchase amount must be a number',
    })
    .positive('Purchase amount must be positive'),
  purchaseDate: z.string().min(1, 'Purchase date is required'),
  nextIncomeAmount: z.coerce
    .number({
      required_error: 'Next income amount is required',
      invalid_type_error: 'Next income amount must be a number',
    })
    .positive('Income amount must be positive'),
  nextIncomeDate: z.string().min(1, 'Next income date is required'),
  upcomingBills: z.array(billSchema).default([]),
});

export type CalculatorFormValues = z.infer<typeof calculatorSchema>;

function defaultDateString(daysFromNow: number) {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d.toISOString().slice(0, 10);
}

const QUICK_ADD_BILLS = [
  { name: 'Rent', defaultAmount: 1500 },
  { name: 'Utilities', defaultAmount: 150 },
  { name: 'Phone', defaultAmount: 80 },
  { name: 'Insurance', defaultAmount: 200 },
  { name: 'Subscriptions', defaultAmount: 50 },
] as const;

type DateInputProps = {
  id: string;
  registration: UseFormRegisterReturn;
  hasError?: boolean;
};

type Props = {
  defaultValues?: Partial<CalculatorFormValues>;
  onCalculate: (values: CalculatorFormValues) => void;
  onFirstInteraction?: () => void;
};

export function CalculatorForm({ defaultValues, onCalculate, onFirstInteraction }: Props) {
  const defaults = useMemo<CalculatorFormValues>(() => {
    return {
      currentBalance: 0,
      purchaseAmount: 0,
      purchaseDate: defaultDateString(0),
      nextIncomeAmount: 0,
      nextIncomeDate: defaultDateString(14),
      upcomingBills: [],
      ...defaultValues,
    };
  }, [defaultValues]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<CalculatorFormValues>({
    resolver: zodResolver(calculatorSchema),
    defaultValues: defaults,
    mode: 'onSubmit',
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'upcomingBills',
  });

  const onSubmit = (values: CalculatorFormValues) => {
    onCalculate(values);
  };

  // Used to prefill bill date with income date for quick data entry
  const incomeDate = watch('nextIncomeDate');

  function DateInputField({ id, registration, hasError }: DateInputProps) {
    return (
      <div className="w-full min-w-0 flex-1">
        <Input
          id={id}
          type="date"
          {...registration}
          className={[
            'bg-zinc-950/40 border-zinc-800 text-zinc-100 placeholder:text-zinc-600',
            'focus:ring-teal-500 focus:ring-offset-zinc-950 focus:border-transparent',
            'w-full cursor-pointer',
            hasError ? 'border-rose-500 focus:ring-rose-500' : '',
          ].join(' ')}
        />
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
      onChange={() => {
        onFirstInteraction?.();
      }}
    >
      {/* Current balance */}
      <div>
        <Label htmlFor="currentBalance" className="text-zinc-300 mb-1.5 block">
          Current balance<span className="text-rose-400 ml-0.5">*</span>
        </Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">$</span>
          <Input
            id="currentBalance"
            type="number"
            step="0.01"
            placeholder="0.00"
            {...register('currentBalance')}
            className={[
              'pl-8 bg-zinc-950/40 border-zinc-800 text-zinc-100 placeholder:text-zinc-600',
              'focus:ring-teal-500 focus:ring-offset-zinc-950 focus:border-transparent',
              errors.currentBalance ? 'border-rose-500 focus:ring-rose-500' : '',
            ].join(' ')}
          />
        </div>
        {errors.currentBalance?.message && (
          <p className="text-sm text-rose-300 mt-1.5">{errors.currentBalance.message}</p>
        )}
        <p className="text-sm text-zinc-500 mt-1.5">What's in your account right now.</p>
      </div>

      {/* Purchase amount */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-950/30 p-4">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-sm font-semibold text-white">Purchase you're considering</h3>
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="purchaseAmount" className="text-zinc-300 mb-1.5 block">
              Amount<span className="text-rose-400 ml-0.5">*</span>
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">$</span>
              <Input
                id="purchaseAmount"
                type="number"
                step="0.01"
                placeholder="0.00"
                {...register('purchaseAmount')}
                className={[
                  'pl-8 bg-zinc-950/40 border-zinc-800 text-zinc-100 placeholder:text-zinc-600',
                  'focus:ring-teal-500 focus:ring-offset-zinc-950 focus:border-transparent',
                  errors.purchaseAmount ? 'border-rose-500 focus:ring-rose-500' : '',
                ].join(' ')}
              />
            </div>
            {errors.purchaseAmount?.message && (
              <p className="text-sm text-rose-300 mt-1.5">{errors.purchaseAmount.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="purchaseDate" className="text-zinc-300 mb-1.5 block">
              When?<span className="text-rose-400 ml-0.5">*</span>
            </Label>
            <DateInputField
              id="purchaseDate"
              registration={register('purchaseDate')}
              hasError={!!errors.purchaseDate}
            />
            {errors.purchaseDate?.message && (
              <p className="text-sm text-rose-300 mt-1.5">{errors.purchaseDate.message}</p>
            )}
          </div>
        </div>
        <p className="text-sm text-zinc-500 mt-3">We'll project your balance through this date and beyond.</p>
      </div>

      {/* Next income */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-950/30 p-4">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-sm font-semibold text-white">Next income</h3>
          <span className="text-xs text-zinc-500">one paycheck / payment</span>
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="nextIncomeAmount" className="text-zinc-300 mb-1.5 block">
              Amount<span className="text-rose-400 ml-0.5">*</span>
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">$</span>
              <Input
                id="nextIncomeAmount"
                type="number"
                step="0.01"
                placeholder="0.00"
                {...register('nextIncomeAmount')}
                className={[
                  'pl-8 bg-zinc-950/40 border-zinc-800 text-zinc-100 placeholder:text-zinc-600',
                  'focus:ring-teal-500 focus:ring-offset-zinc-950 focus:border-transparent',
                  errors.nextIncomeAmount ? 'border-rose-500 focus:ring-rose-500' : '',
                ].join(' ')}
              />
            </div>
            {errors.nextIncomeAmount?.message && (
              <p className="text-sm text-rose-300 mt-1.5">{errors.nextIncomeAmount.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="nextIncomeDate" className="text-zinc-300 mb-1.5 block">
              Date<span className="text-rose-400 ml-0.5">*</span>
            </Label>
            <DateInputField
              id="nextIncomeDate"
              registration={register('nextIncomeDate')}
              hasError={!!errors.nextIncomeDate}
            />
            {errors.nextIncomeDate?.message && (
              <p className="text-sm text-rose-300 mt-1.5">{errors.nextIncomeDate.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Upcoming bills */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-950/30 p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-white">Upcoming bills</h3>
            <p className="mt-1 text-xs text-zinc-500">Add any bills due before (or around) your next income.</p>
          </div>

          <button
            type="button"
            onClick={() =>
              append({
                name: '',
                amount: 0,
                date: incomeDate || defaultDateString(7),
              })
            }
            className="inline-flex items-center gap-2 rounded-md border border-zinc-800 bg-zinc-950/40 px-3 py-2 text-sm text-zinc-200 hover:bg-zinc-900/50 transition-colors"
          >
            <Plus className="h-4 w-4 text-teal-300" />
            Add bill
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          {QUICK_ADD_BILLS.map((preset) => (
            <button
              key={preset.name}
              type="button"
              onClick={() => {
                append({
                  name: preset.name,
                  amount: preset.defaultAmount,
                  date: incomeDate || defaultDateString(7),
                });
                try {
                  posthog.capture('tool_can_i_afford_it_quick_add_bill', {
                    preset: preset.name,
                    default_amount: preset.defaultAmount,
                  });
                } catch {}
              }}
              className="px-3 py-1.5 bg-zinc-950/40 hover:bg-zinc-900/50 text-zinc-300 text-sm rounded-full border border-zinc-800 transition-colors"
            >
              + {preset.name}
            </button>
          ))}
        </div>

        <div className="mt-4 space-y-3">
          {fields.length === 0 ? (
            <div className="rounded-lg border border-dashed border-zinc-800 bg-zinc-950/30 p-4">
              <p className="text-sm text-zinc-400">
                No bills yet. Add rent, subscriptions, utilities, minimums-anything that can hit your balance.
              </p>
            </div>
          ) : (
            fields.map((field, idx) => {
              const err = errors.upcomingBills?.[idx];
              return (
                <div key={field.id} className="rounded-lg border border-zinc-800 bg-zinc-950/40 p-4">
                  {/* Top row: Name and Amount side by side */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Bill name */}
                    <div>
                      <Label className="text-zinc-300 mb-1.5 block" htmlFor={`upcomingBills.${idx}.name`}>
                        Bill name <span className="text-zinc-500">(optional)</span>
                      </Label>
                      <Input
                        id={`upcomingBills.${idx}.name`}
                        placeholder="e.g., Rent"
                        {...register(`upcomingBills.${idx}.name`)}
                        className={[
                          'bg-zinc-950/40 border-zinc-800 text-zinc-100 placeholder:text-zinc-600',
                          'focus:ring-teal-500 focus:ring-offset-zinc-950 focus:border-transparent',
                          err?.name ? 'border-rose-500 focus:ring-rose-500' : '',
                        ].join(' ')}
                      />
                      {err?.name?.message && (
                        <p className="text-sm text-rose-300 mt-1">{err.name.message}</p>
                      )}
                    </div>

                    {/* Amount */}
                    <div>
                      <Label className="text-zinc-300 mb-1.5 block" htmlFor={`upcomingBills.${idx}.amount`}>
                        Amount<span className="text-rose-400 ml-0.5">*</span>
                      </Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">$</span>
                        <Input
                          id={`upcomingBills.${idx}.amount`}
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          {...register(`upcomingBills.${idx}.amount`)}
                          className={[
                            'pl-8 pr-4 bg-zinc-950/40 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 tabular-nums w-full min-w-0',
                            'focus:ring-teal-500 focus:ring-offset-zinc-950 focus:border-transparent',
                            // Prevent Chrome number spinners from stealing space / clipping digits
                            '[appearance:textfield]',
                            '[&::-webkit-outer-spin-button]:appearance-none',
                            '[&::-webkit-inner-spin-button]:appearance-none',
                            err?.amount ? 'border-rose-500 focus:ring-rose-500' : '',
                          ].join(' ')}
                        />
                      </div>
                      {err?.amount?.message && (
                        <p className="text-sm text-rose-300 mt-1">{err.amount.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Bottom row: Date and Remove button */}
                  <div className="mt-4 flex flex-col sm:flex-row sm:items-end gap-4">
                    {/* Due date */}
                    <div className="flex-1 sm:max-w-[200px]">
                      <Label className="text-zinc-300 mb-1.5 block" htmlFor={`upcomingBills.${idx}.date`}>
                        Due date<span className="text-rose-400 ml-0.5">*</span>
                      </Label>
                      <Input
                        id={`upcomingBills.${idx}.date`}
                        type="date"
                        {...register(`upcomingBills.${idx}.date`)}
                        className={[
                          'w-full bg-zinc-950/40 border-zinc-800 text-zinc-100 cursor-pointer',
                          'focus:ring-teal-500 focus:ring-offset-zinc-950 focus:border-transparent',
                          err?.date ? 'border-rose-500 focus:ring-rose-500' : '',
                        ].join(' ')}
                      />
                      {err?.date?.message && (
                        <p className="text-sm text-rose-300 mt-1">{err.date.message}</p>
                      )}
                    </div>

                    {/* Remove button */}
                    <button
                      type="button"
                      onClick={() => remove(idx)}
                      aria-label="Remove bill"
                      className="h-11 px-4 rounded-md border border-zinc-800 bg-zinc-950/40 text-zinc-400 hover:bg-rose-950/30 hover:border-rose-800 hover:text-rose-300 transition-colors flex items-center gap-2"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="text-sm">Remove</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
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

