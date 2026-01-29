'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { CurrencyInput } from '@/components/ui/currency-input';
import { Label } from '@/components/ui/label';
import { createQuote } from '@/lib/actions/quotes';
import { showError, showSuccess } from '@/lib/toast';
import { optionalEmailSchema } from '@/lib/validations/email';

const CURRENCY_OPTIONS = [
  { value: 'USD', label: 'USD ($)' },
  { value: 'EUR', label: 'EUR (€)' },
  { value: 'GBP', label: 'GBP (£)' },
  { value: 'CAD', label: 'CAD ($)' },
  { value: 'AUD', label: 'AUD ($)' },
  { value: 'JPY', label: 'JPY (¥)' },
  { value: 'CHF', label: 'CHF' },
  { value: 'INR', label: 'INR (₹)' },
  { value: 'BRL', label: 'BRL (R$)' },
  { value: 'MXN', label: 'MXN ($)' },
];

const quoteSchema = z.object({
  quote_number: z
    .string()
    .max(50, 'Quote number too long')
    .optional()
    .or(z.literal('')),
  client_name: z.string().min(1, 'Client name is required').max(100, 'Name too long'),
  client_email: optionalEmailSchema,
  amount: z.coerce
    .number({
      required_error: 'Amount is required',
      invalid_type_error: 'Amount must be a number',
    })
    .positive('Amount must be positive')
    .refine((n) => n >= 0.01, 'Amount must be at least 0.01'),
  currency: z.string().min(1, 'Currency is required'),
  valid_until: z
    .string()
    .min(1, 'Valid until date is required')
    .refine((dateStr) => {
      const validUntil = new Date(dateStr);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return validUntil >= today;
    }, 'Valid until date cannot be in the past'),
  description: z.string().max(2000, 'Description too long').optional(),
});

type QuoteFormData = z.infer<typeof quoteSchema>;

function defaultValidUntilString(days: number = 30) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

interface NewQuoteFormProps {
  defaultCurrency?: string;
}

export function NewQuoteForm({ defaultCurrency = 'USD' }: NewQuoteFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const defaultValidUntil = useMemo(() => defaultValidUntilString(30), []);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm<QuoteFormData>({
    resolver: zodResolver(quoteSchema),
    defaultValues: {
      valid_until: defaultValidUntil,
      currency: defaultCurrency,
    },
  });

  const setValidityPeriod = (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    setValue('valid_until', d.toISOString().slice(0, 10));
  };

  const onSubmit = async (data: QuoteFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      await createQuote({
        quote_number: data.quote_number ? data.quote_number.trim() : null,
        client_name: data.client_name,
        client_email: data.client_email ? data.client_email : null,
        amount: data.amount,
        currency: data.currency,
        valid_until: data.valid_until,
        description: data.description ? data.description : null,
      });

      showSuccess('Quote created');
      router.refresh();
      router.push('/dashboard/quotes');
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Something went wrong';
      showError(message);
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      <Link
        href="/dashboard/quotes"
        className="inline-flex items-center text-sm text-zinc-400 hover:text-teal-400 transition-colors group mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
        Back to Quotes
      </Link>

      <h1 className="text-2xl font-bold text-zinc-100 mb-6">Create Quote</h1>

      <div className="border border-zinc-800 bg-zinc-900 rounded-lg p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Quote number */}
          <div>
            <Label htmlFor="quote_number" className="text-zinc-300 mb-1.5 block">
              Quote number <span className="text-zinc-500">(optional)</span>
            </Label>
            <Input
              id="quote_number"
              placeholder="Leave blank to auto-generate (e.g., QTE-0001)"
              {...register('quote_number')}
              className={errors.quote_number ? 'border-rose-500 focus:ring-rose-500' : undefined}
            />
            {errors.quote_number?.message && (
              <p className="text-sm text-rose-400 mt-1.5">{errors.quote_number.message}</p>
            )}
          </div>

          {/* Client name */}
          <div>
            <Label htmlFor="client_name" className="text-zinc-300 mb-1.5 block">
              Client name<span className="text-rose-400 ml-0.5">*</span>
            </Label>
            <Input
              id="client_name"
              placeholder="e.g., Acme Inc."
              {...register('client_name')}
              className={errors.client_name ? 'border-rose-500 focus:ring-rose-500' : undefined}
            />
            {errors.client_name?.message && (
              <p className="text-sm text-rose-400 mt-1.5">{errors.client_name.message}</p>
            )}
          </div>

          {/* Client email */}
          <div>
            <Label htmlFor="client_email" className="text-zinc-300 mb-1.5 block">
              Client email <span className="text-zinc-500">(optional, required to send)</span>
            </Label>
            <Input
              id="client_email"
              type="email"
              placeholder="e.g., billing@acme.com"
              {...register('client_email')}
              className={errors.client_email ? 'border-rose-500 focus:ring-rose-500' : undefined}
            />
            {errors.client_email?.message && (
              <p className="text-sm text-rose-400 mt-1.5">{errors.client_email.message}</p>
            )}
          </div>

          {/* Amount and Currency */}
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <Label htmlFor="amount" className="text-zinc-300 mb-1.5 block">
                Amount<span className="text-rose-400 ml-0.5">*</span>
              </Label>
              <Controller
                name="amount"
                control={control}
                render={({ field }) => (
                  <CurrencyInput
                    id="amount"
                    placeholder="0.00"
                    value={field.value}
                    onChange={field.onChange}
                    className={[
                      'bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500',
                      'focus:border-teal-500 focus:ring-teal-500/20',
                      errors.amount ? 'border-rose-500 focus:ring-rose-500' : '',
                    ].join(' ')}
                  />
                )}
              />
              {errors.amount?.message && (
                <p className="text-sm text-rose-400 mt-1.5">{errors.amount.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="currency" className="text-zinc-300 mb-1.5 block">
                Currency
              </Label>
              <select
                id="currency"
                {...register('currency')}
                className={[
                  'w-full h-10 bg-zinc-800 border border-zinc-700 rounded-md px-3 text-zinc-100',
                  'focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent',
                  errors.currency ? 'border-rose-500 focus:ring-rose-500' : '',
                ].join(' ')}
              >
                {CURRENCY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Valid until */}
          <div>
            <Label htmlFor="valid_until" className="text-zinc-300 mb-1.5 block">
              Valid until<span className="text-rose-400 ml-0.5">*</span>
            </Label>
            <div className="flex gap-2 mb-2">
              <button
                type="button"
                onClick={() => setValidityPeriod(14)}
                className="px-3 py-1.5 text-xs font-medium bg-zinc-800 border border-zinc-700 text-zinc-300 rounded hover:bg-zinc-700 hover:text-teal-400 hover:border-teal-500/30 transition-colors"
              >
                14 days
              </button>
              <button
                type="button"
                onClick={() => setValidityPeriod(30)}
                className="px-3 py-1.5 text-xs font-medium bg-zinc-800 border border-zinc-700 text-zinc-300 rounded hover:bg-zinc-700 hover:text-teal-400 hover:border-teal-500/30 transition-colors"
              >
                30 days
              </button>
              <button
                type="button"
                onClick={() => setValidityPeriod(60)}
                className="px-3 py-1.5 text-xs font-medium bg-zinc-800 border border-zinc-700 text-zinc-300 rounded hover:bg-zinc-700 hover:text-teal-400 hover:border-teal-500/30 transition-colors"
              >
                60 days
              </button>
            </div>
            <Input
              id="valid_until"
              type="date"
              {...register('valid_until')}
              className={[
                'cursor-pointer [color-scheme:dark]',
                errors.valid_until ? 'border-rose-500 focus:ring-rose-500' : '',
              ].join(' ')}
            />
            {errors.valid_until?.message && (
              <p className="text-sm text-rose-400 mt-1.5">{errors.valid_until.message}</p>
            )}
            <p className="text-sm text-zinc-400 mt-1.5">Quick select validity period or choose a custom date.</p>
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description" className="text-zinc-300 mb-1.5 block">
              Description <span className="text-zinc-500">(optional)</span>
            </Label>
            <textarea
              id="description"
              rows={4}
              {...register('description')}
              className={[
                'w-full bg-zinc-800 border border-zinc-700 rounded-md px-3 py-2 text-zinc-100',
                'placeholder:text-zinc-500',
                'focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent',
                'min-h-[96px]',
                errors.description ? 'border-rose-500 focus:ring-rose-500' : '',
              ].join(' ')}
              placeholder="What is this quote for?"
            />
            {errors.description?.message && (
              <p className="text-sm text-rose-400 mt-1.5">{errors.description.message}</p>
            )}
          </div>

          {error && <p className="text-sm text-rose-400">{error}</p>}

          <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-6 border-t border-zinc-800">
            <button
              type="button"
              onClick={() => router.push('/dashboard/quotes')}
              disabled={isLoading}
              className="w-full bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 text-zinc-100 font-medium rounded-md px-4 py-2.5 min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-md px-4 py-2.5 min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Creating...' : 'Create Quote'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
