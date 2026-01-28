'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Coins, ChevronDown } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { FormError } from '@/components/ui/form-error';

// Common currencies for freelancers
const CURRENCIES = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'CA$' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
  { code: 'MXN', name: 'Mexican Peso', symbol: 'MX$' },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$' },
  { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$' },
  { code: 'SEK', name: 'Swedish Krona', symbol: 'kr' },
  { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr' },
  { code: 'DKK', name: 'Danish Krone', symbol: 'kr' },
  { code: 'PLN', name: 'Polish Zloty', symbol: 'zł' },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R' },
  { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ' },
  { code: 'SAR', name: 'Saudi Riyal', symbol: '﷼' },
  { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$' },
] as const;

const currencySchema = z.object({
  currency: z.string().min(3, 'Please select a currency').max(3),
});

type CurrencyFormData = z.infer<typeof currencySchema>;

interface CurrencyFormProps {
  initialValue?: string;
}

export function CurrencyForm({ initialValue = 'USD' }: CurrencyFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<CurrencyFormData>({
    resolver: zodResolver(currencySchema),
    defaultValues: {
      currency: initialValue,
    },
  });

  const selectedCurrency = watch('currency');
  const currencyInfo = CURRENCIES.find((c) => c.code === selectedCurrency);

  useEffect(() => {
    async function fetchSettings() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setIsLoading(false);
        return;
      }

      const { data, error: fetchError } = await supabase
        .from('user_settings')
        .select('currency')
        .eq('user_id', user.id)
        .single();

      if (!fetchError && data?.currency) {
        reset({ currency: data.currency });
      }

      setIsLoading(false);
    }

    fetchSettings();
  }, [reset]);

  const onSubmit = async (data: CurrencyFormData) => {
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError('You must be logged in');
      setIsSubmitting(false);
      return;
    }

    const { error: upsertError } = await supabase.from('user_settings').upsert(
      {
        user_id: user.id,
        currency: data.currency,
      },
      {
        onConflict: 'user_id',
      }
    );

    if (upsertError) {
      setError(upsertError.message);
    } else {
      setSuccess(true);
      router.refresh();
      setTimeout(() => setSuccess(false), 3000);
    }

    setIsSubmitting(false);
  };

  if (isLoading) {
    return (
      <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6">
        <div className="flex items-center justify-center py-8">
          <svg
            className="animate-spin h-6 w-6 text-teal-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center">
          <Coins className="w-5 h-5 text-teal-400" />
        </div>
        <div>
          <h3 className="font-semibold text-zinc-100">Display Currency</h3>
          <p className="text-sm text-zinc-400">
            Currency used throughout the app
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Currency Select */}
        <div>
          <Label htmlFor="currency" className="text-zinc-300">
            Currency
          </Label>
          <div className="relative mt-1.5">
            <select
              id="currency"
              {...register('currency')}
              className={[
                'w-full bg-zinc-950 border border-zinc-800 rounded-md px-3 py-2 min-h-[44px]',
                'text-zinc-100',
                '[&>option]:bg-zinc-900 [&>option]:text-zinc-100',
                'focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent',
                'appearance-none pr-10 cursor-pointer',
                errors.currency ? 'border-rose-500 focus:ring-rose-500' : '',
              ].join(' ')}
            >
              {CURRENCIES.map((currency) => (
                <option key={currency.code} value={currency.code}>
                  {currency.code} - {currency.name} ({currency.symbol})
                </option>
              ))}
            </select>
            <ChevronDown className="w-5 h-5 text-zinc-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
          <FormError message={errors.currency?.message} />
          <p className="text-sm text-zinc-500 mt-1.5">
            All amounts in the app will be displayed in this currency
          </p>
        </div>

        {/* Preview */}
        {currencyInfo && (
          <div className="bg-zinc-950 rounded-lg p-4 border border-zinc-800">
            <p className="text-sm font-medium text-zinc-300 mb-2">Preview</p>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-teal-400">
                {currencyInfo.symbol}1,234.56
              </span>
              <span className="text-sm text-zinc-500">({currencyInfo.code})</span>
            </div>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3 text-sm text-emerald-400">
            Currency updated successfully
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-rose-500/10 border border-rose-500/20 rounded-lg p-3 text-sm text-rose-400">
            {error}
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting} loading={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  );
}
