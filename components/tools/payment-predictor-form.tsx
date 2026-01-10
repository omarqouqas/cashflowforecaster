'use client';

import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { ClientPaymentHistory, PaymentTerms } from '@/lib/tools/calculate-payment-date';

export type PaymentPredictorFormAction = 'calculate' | 'add_invoice';

const paymentTermsEnum = z.enum([
  'due_on_receipt',
  'net_7',
  'net_15',
  'net_30',
  'net_45',
  'net_60',
  'net_90',
  'custom',
]);

const clientHistoryEnum = z.enum(['on_time', 'usually_late', 'very_late']);

const optionalNumber = (opts?: { min?: number; max?: number; message?: string }) =>
  z.preprocess(
    (v) => {
      if (v === '' || v === null || v === undefined) return undefined;
      return v;
    },
    z
      .coerce
      .number({ invalid_type_error: 'Enter a number' })
      .refine((n) => Number.isFinite(n), 'Enter a valid number')
      .refine((n) => (typeof opts?.min === 'number' ? n >= opts.min : true), opts?.message ?? 'Value is too small')
      .refine((n) => (typeof opts?.max === 'number' ? n <= opts.max : true), 'Value is too large')
      .optional()
  );

const paymentPredictorSchema = z
  .object({
    invoiceDate: z.string().min(1, 'Invoice date is required'),
    paymentTerms: paymentTermsEnum,
    customDays: optionalNumber({ min: 1, max: 365, message: 'Custom days must be at least 1' }),
    adjustForWeekends: z.coerce.boolean().default(true),
    clientHistory: clientHistoryEnum.default('on_time'),
    invoiceAmount: optionalNumber({ min: 0, max: 1_000_000, message: 'Amount cannot be negative' }),
    clientName: z.string().max(80, 'Name too long').optional().or(z.literal('')),
  })
  .superRefine((val, ctx) => {
    if (val.paymentTerms === 'custom') {
      const days = val.customDays ?? 0;
      if (!Number.isFinite(days) || days < 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['customDays'],
          message: 'Custom days is required for Custom terms',
        });
      }
    }
  });

export type PaymentPredictorFormValues = z.infer<typeof paymentPredictorSchema> & {
  paymentTerms: PaymentTerms;
  clientHistory: ClientPaymentHistory;
};

type Props = {
  defaultValues?: Partial<PaymentPredictorFormValues>;
  onAction: (values: PaymentPredictorFormValues, action: PaymentPredictorFormAction) => void;
  onFirstInteraction?: () => void;
};

function todayDateOnly() {
  return new Date().toISOString().slice(0, 10);
}

export function PaymentPredictorForm({ defaultValues, onAction, onFirstInteraction }: Props) {
  const [submitMode, setSubmitMode] = useState<PaymentPredictorFormAction>('calculate');

  const defaults = useMemo<PaymentPredictorFormValues>(() => {
    return {
      invoiceDate: todayDateOnly(),
      paymentTerms: 'net_30',
      customDays: undefined,
      adjustForWeekends: true,
      clientHistory: 'on_time',
      invoiceAmount: undefined,
      clientName: '',
      ...defaultValues,
    };
  }, [defaultValues]);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PaymentPredictorFormValues>({
    resolver: zodResolver(paymentPredictorSchema),
    defaultValues: defaults,
    mode: 'onSubmit',
  });

  const paymentTerms = watch('paymentTerms');

  const baseInput =
    'bg-zinc-950/40 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus:ring-teal-500 focus:ring-offset-zinc-950 focus:border-transparent';

  const baseSelect = [
    'h-11 w-full rounded-md border px-3 py-2 text-sm',
    'bg-zinc-950/40 border-zinc-800 text-zinc-100',
    'focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-zinc-950 focus:border-transparent',
    'cursor-pointer',
  ].join(' ');

  const onSubmit = (values: PaymentPredictorFormValues) => {
    onAction(values, submitMode);

    if (submitMode === 'add_invoice') {
      // Keep the "policy" choices to make adding multiple invoices fast.
      reset({
        invoiceDate: todayDateOnly(),
        paymentTerms: values.paymentTerms,
        customDays: values.paymentTerms === 'custom' ? values.customDays : undefined,
        adjustForWeekends: values.adjustForWeekends,
        clientHistory: values.clientHistory,
        invoiceAmount: undefined,
        clientName: '',
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
      onChange={() => {
        onFirstInteraction?.();
      }}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="invoiceDate" className="text-zinc-300 mb-1.5 block">
            Invoice date<span className="text-rose-400 ml-0.5">*</span>
          </Label>
          <Input
            id="invoiceDate"
            type="date"
            {...register('invoiceDate')}
            className={[
              baseInput,
              'cursor-pointer',
              errors.invoiceDate ? 'border-rose-500 focus:ring-rose-500' : '',
            ].join(' ')}
          />
          {errors.invoiceDate?.message && <p className="text-sm text-rose-300 mt-1.5">{errors.invoiceDate.message}</p>}
          <p className="text-sm text-zinc-500 mt-1.5">When you sent (or will send) the invoice.</p>
        </div>

        <div>
          <Label htmlFor="paymentTerms" className="text-zinc-300 mb-1.5 block">
            Payment terms<span className="text-rose-400 ml-0.5">*</span>
          </Label>
          <select
            id="paymentTerms"
            {...register('paymentTerms')}
            className={[baseSelect, errors.paymentTerms ? 'border-rose-500 ring-rose-500' : ''].join(' ')}
          >
            <option value="due_on_receipt">Due on Receipt</option>
            <option value="net_7">Net 7</option>
            <option value="net_15">Net 15</option>
            <option value="net_30">Net 30</option>
            <option value="net_45">Net 45</option>
            <option value="net_60">Net 60</option>
            <option value="net_90">Net 90</option>
            <option value="custom">Custom</option>
          </select>
          {errors.paymentTerms?.message && (
            <p className="text-sm text-rose-300 mt-1.5">{errors.paymentTerms.message as any}</p>
          )}
          <p className="text-sm text-zinc-500 mt-1.5">Net-30 means “due 30 days after invoice date”.</p>
        </div>
      </div>

      {paymentTerms === 'custom' && (
        <div>
          <Label htmlFor="customDays" className="text-zinc-300 mb-1.5 block">
            Custom days<span className="text-rose-400 ml-0.5">*</span>
          </Label>
          <Input
            id="customDays"
            type="number"
            step="1"
            min={1}
            max={365}
            placeholder="45"
            {...register('customDays')}
            className={[baseInput, errors.customDays ? 'border-rose-500 focus:ring-rose-500' : ''].join(' ')}
          />
          {errors.customDays?.message && <p className="text-sm text-rose-300 mt-1.5">{errors.customDays.message}</p>}
          <p className="text-sm text-zinc-500 mt-1.5">For example: 45 for “Net 45”.</p>
        </div>
      )}

      <div className="rounded-xl border border-zinc-800 bg-zinc-950/30 p-4">
        <h3 className="text-sm font-semibold text-white">Real-world adjustments</h3>

        <div className="mt-4 space-y-4">
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              {...register('adjustForWeekends')}
              className="h-4 w-4 rounded border border-zinc-700 bg-zinc-950/40 text-teal-500 accent-teal-500"
            />
            <span className="text-sm text-zinc-200">Adjust for weekends (move to next Monday)</span>
          </label>

          <div>
            <p className="text-sm text-zinc-300 mb-2">Client payment history</p>
            <div className="space-y-2">
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="radio"
                  value="on_time"
                  {...register('clientHistory')}
                  className="h-4 w-4 border-zinc-700 accent-teal-500"
                />
                <span className="text-sm text-zinc-200">Pays on time</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="radio"
                  value="usually_late"
                  {...register('clientHistory')}
                  className="h-4 w-4 border-zinc-700 accent-teal-500"
                />
                <span className="text-sm text-zinc-200">Usually 1 week late</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="radio"
                  value="very_late"
                  {...register('clientHistory')}
                  className="h-4 w-4 border-zinc-700 accent-teal-500"
                />
                <span className="text-sm text-zinc-200">Often 2+ weeks late</span>
              </label>
            </div>
            {errors.clientHistory?.message && (
              <p className="text-sm text-rose-300 mt-1.5">{errors.clientHistory.message as any}</p>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-zinc-800 bg-zinc-950/30 p-4">
        <h3 className="text-sm font-semibold text-white">Optional details (for your list)</h3>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="clientName" className="text-zinc-300 mb-1.5 block min-h-[40px] leading-tight">
              Client / project name <span className="text-zinc-500">(optional)</span>
            </Label>
            <Input
              id="clientName"
              type="text"
              placeholder="e.g., Acme Co"
              {...register('clientName')}
              className={[baseInput, errors.clientName ? 'border-rose-500 focus:ring-rose-500' : ''].join(' ')}
            />
            {errors.clientName?.message && <p className="text-sm text-rose-300 mt-1.5">{errors.clientName.message}</p>}
          </div>

          <div>
            <Label htmlFor="invoiceAmount" className="text-zinc-300 mb-1.5 block min-h-[40px] leading-tight">
              Invoice amount <span className="text-zinc-500">(optional)</span>
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">$</span>
              <Input
                id="invoiceAmount"
                type="number"
                step="0.01"
                placeholder="2500"
                {...register('invoiceAmount')}
                className={[
                  'pl-8',
                  baseInput,
                  errors.invoiceAmount ? 'border-rose-500 focus:ring-rose-500' : '',
                  '[appearance:textfield]',
                  '[&::-webkit-outer-spin-button]:appearance-none',
                  '[&::-webkit-inner-spin-button]:appearance-none',
                ].join(' ')}
              />
            </div>
            {errors.invoiceAmount?.message && (
              <p className="text-sm text-rose-300 mt-1.5">{errors.invoiceAmount.message}</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          type="submit"
          onClick={() => setSubmitMode('calculate')}
          disabled={isSubmitting}
          className="w-full rounded-lg bg-teal-500 hover:bg-teal-400 text-zinc-950 font-semibold px-4 py-3 min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-zinc-950"
        >
          {isSubmitting ? 'Calculating...' : 'Calculate'}
        </button>
        <button
          type="submit"
          onClick={() => setSubmitMode('add_invoice')}
          disabled={isSubmitting}
          className="w-full rounded-lg border border-zinc-800 bg-zinc-950/40 text-zinc-200 hover:bg-zinc-900/50 font-semibold px-4 py-3 min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Add another invoice
        </button>
      </div>
    </form>
  );
}

