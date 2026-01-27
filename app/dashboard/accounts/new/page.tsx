'use client';

import { useForm, Controller, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Input } from '@/components/ui/input';
import { CurrencyInput } from '@/components/ui/currency-input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { ArrowLeft, ChevronDown, CreditCard, Info } from 'lucide-react';
import { showError, showSuccess } from '@/lib/toast';
import { trackAccountCreated } from '@/lib/posthog/events';

/**
 * Get ordinal suffix for a day number (1st, 2nd, 3rd, 4th, etc.)
 */
function getOrdinalSuffix(day: number): string {
  if (day >= 11 && day <= 13) return 'th';
  const lastDigit = day % 10;
  if (lastDigit === 1) return 'st';
  if (lastDigit === 2) return 'nd';
  if (lastDigit === 3) return 'rd';
  return 'th';
}

const accountSchema = z.object({
  name: z.string().min(1, 'Account name is required').max(50, 'Name too long'),
  account_type: z.enum(['checking', 'savings', 'credit_card'], {
    message: 'Please select an account type',
  }),
  current_balance: z.coerce.number({
    required_error: 'Balance is required',
    invalid_type_error: 'Balance must be a number',
  }),
  currency: z.string().default('USD'),
  is_spendable: z.boolean().default(true),
  // Credit card specific fields
  credit_limit: z.coerce.number().positive('Credit limit must be positive').optional().nullable(),
  apr: z.coerce.number().min(0, 'APR cannot be negative').max(100, 'APR cannot exceed 100%').optional().nullable(),
  statement_close_day: z.coerce.number().int().min(1).max(31).optional().nullable(),
  payment_due_day: z.coerce.number().int().min(1).max(31).optional().nullable(),
});

type AccountFormData = z.infer<typeof accountSchema>;

export default function NewAccountPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<AccountFormData>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      currency: 'USD',
      is_spendable: true,
      credit_limit: null,
      apr: null,
      statement_close_day: null,
      payment_due_day: null,
    },
  });

  // Watch account_type to show/hide credit card fields
  const accountType = useWatch({ control, name: 'account_type' });
  const isCreditCard = accountType === 'credit_card';

  const onSubmit = async (data: AccountFormData) => {
    setIsLoading(true);
    setError(null);

    const supabase = createClient();

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      const message = 'You must be logged in';
      showError(message);
      setError(message);
      setIsLoading(false);
      return;
    }

    // Insert account with credit card fields if applicable
    const accountData: Record<string, any> = {
      user_id: user.id,
      name: data.name,
      account_type: data.account_type,
      current_balance: data.current_balance,
      currency: data.currency,
      is_spendable: data.account_type === 'credit_card' ? false : data.is_spendable,
    };

    // Add credit card specific fields
    if (data.account_type === 'credit_card') {
      accountData.credit_limit = data.credit_limit || null;
      accountData.apr = data.apr || null;
      accountData.statement_close_day = data.statement_close_day || null;
      accountData.payment_due_day = data.payment_due_day || null;
    }

    const { error: insertError } = await supabase.from('accounts').insert(accountData);

    if (insertError) {
      showError(insertError.message);
      setError(insertError.message);
    } else {
      trackAccountCreated(data.account_type);
      showSuccess('Account created');
      router.push('/dashboard/accounts');
    }

    setIsLoading(false);
  };

  return (
    <div className="max-w-lg mx-auto">
      <Link
        href="/dashboard/accounts"
        className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-teal-400 mb-6 transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Accounts
      </Link>

      <h1 className="text-2xl font-semibold text-zinc-100 mb-6">Add Account</h1>

      <div className="border border-zinc-700/50 bg-zinc-800/50 backdrop-blur-sm rounded-lg p-6 shadow-xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Account Name */}
          <div>
            <Label htmlFor="name" className="text-zinc-300 mb-1.5 block font-medium">
              Account Name<span className="text-rose-400 ml-0.5">*</span>
            </Label>
            <Input
              id="name"
              placeholder="e.g., Main Checking"
              {...register('name')}
              className={[
                'bg-zinc-900 border-zinc-700 text-zinc-100 placeholder:text-zinc-500',
                'focus:border-teal-500 focus:ring-teal-500/20',
                errors.name ? 'border-rose-400 focus:border-rose-400 focus:ring-rose-400/20' : '',
              ].join(' ')}
            />
            {errors.name?.message && (
              <p className="text-sm text-rose-400 mt-1.5">{errors.name.message}</p>
            )}
          </div>

          {/* Account Type */}
          <div>
            <Label htmlFor="account_type" className="text-zinc-300 mb-1.5 block font-medium">
              Account Type<span className="text-rose-400 ml-0.5">*</span>
            </Label>
            <div className="relative">
              <select
                id="account_type"
                {...register('account_type')}
                className={[
                  'w-full bg-zinc-800 border border-zinc-700 rounded-md px-3 py-2 min-h-[44px]',
                  'text-zinc-100',
                  '[&>option]:bg-zinc-800 [&>option]:text-zinc-100',
                  'focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent',
                  'appearance-none pr-10 cursor-pointer',
                  errors.account_type ? 'border-rose-400 focus:ring-rose-400' : '',
                ].join(' ')}
              >
                <option value="" className="text-zinc-500">Select type...</option>
                <option value="checking">Checking</option>
                <option value="savings">Savings</option>
                <option value="credit_card">Credit Card</option>
              </select>
              <ChevronDown className="w-5 h-5 text-zinc-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            {errors.account_type?.message && (
              <p className="text-sm text-rose-400 mt-1.5">{errors.account_type.message}</p>
            )}
          </div>

          {/* Credit Card Fields - Shown only when credit_card is selected */}
          {isCreditCard && (
            <div className="border border-amber-500/30 bg-amber-500/5 rounded-lg p-4 space-y-4">
              <div className="flex items-center gap-2 text-amber-400 mb-2">
                <CreditCard className="w-4 h-4" />
                <span className="text-sm font-medium">Credit Card Details</span>
              </div>

              {/* Credit Limit */}
              <div>
                <Label htmlFor="credit_limit" className="text-zinc-300 mb-1.5 block font-medium">
                  Credit Limit
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 z-10">
                    $
                  </span>
                  <Controller
                    name="credit_limit"
                    control={control}
                    render={({ field }) => (
                      <CurrencyInput
                        id="credit_limit"
                        placeholder="10,000.00"
                        value={field.value ?? undefined}
                        onChange={field.onChange}
                        className="pl-8 bg-zinc-900 border-zinc-700 text-zinc-100 placeholder:text-zinc-500 focus:border-teal-500 focus:ring-teal-500/20"
                      />
                    )}
                  />
                </div>
                <p className="text-xs text-zinc-500 mt-1">Used to calculate credit utilization</p>
              </div>

              {/* APR */}
              <div>
                <Label htmlFor="apr" className="text-zinc-300 mb-1.5 block font-medium">
                  APR (Annual Percentage Rate)
                </Label>
                <div className="relative">
                  <Input
                    id="apr"
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    placeholder="24.99"
                    {...register('apr')}
                    className="bg-zinc-900 border-zinc-700 text-zinc-100 placeholder:text-zinc-500 focus:border-teal-500 focus:ring-teal-500/20 pr-8"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500">
                    %
                  </span>
                </div>
                <p className="text-xs text-zinc-500 mt-1">Used to calculate interest on carried balances</p>
              </div>

              {/* Statement Close Day & Payment Due Day */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="statement_close_day" className="text-zinc-300 mb-1.5 block font-medium">
                    Statement Closes
                  </Label>
                  <div className="relative">
                    <select
                      id="statement_close_day"
                      {...register('statement_close_day')}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-md px-3 py-2 min-h-[44px] text-zinc-100 [&>option]:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent appearance-none pr-10 cursor-pointer"
                    >
                      <option value="">Select day...</option>
                      {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                        <option key={day} value={day}>
                          {day}{getOrdinalSuffix(day)} of month
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-5 h-5 text-zinc-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="payment_due_day" className="text-zinc-300 mb-1.5 block font-medium">
                    Payment Due
                  </Label>
                  <div className="relative">
                    <select
                      id="payment_due_day"
                      {...register('payment_due_day')}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-md px-3 py-2 min-h-[44px] text-zinc-100 [&>option]:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent appearance-none pr-10 cursor-pointer"
                    >
                      <option value="">Select day...</option>
                      {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                        <option key={day} value={day}>
                          {day}{getOrdinalSuffix(day)} of month
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-5 h-5 text-zinc-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>
              <p className="text-xs text-zinc-500 flex items-start gap-1.5">
                <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
                These dates help forecast when your credit card payment will impact your cash flow.
              </p>
            </div>
          )}

          {/* Current Balance */}
          <div>
            <Label htmlFor="current_balance" className="text-zinc-300 mb-1.5 block font-medium">
              {isCreditCard ? 'Current Balance (Amount Owed)' : 'Current Balance'}
              <span className="text-rose-400 ml-0.5">*</span>
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 z-10">
                $
              </span>
              <Controller
                name="current_balance"
                control={control}
                render={({ field }) => (
                  <CurrencyInput
                    id="current_balance"
                    placeholder={isCreditCard ? '2,450.00' : '0.00'}
                    value={field.value}
                    onChange={field.onChange}
                    allowNegative={!isCreditCard}
                    className={[
                      'pl-8 bg-zinc-900 border-zinc-700 text-zinc-100 placeholder:text-zinc-500',
                      'focus:border-teal-500 focus:ring-teal-500/20',
                      errors.current_balance ? 'border-rose-400 focus:border-rose-400 focus:ring-rose-400/20' : '',
                    ].join(' ')}
                  />
                )}
              />
            </div>
            {errors.current_balance?.message && (
              <p className="text-sm text-rose-400 mt-1.5">{errors.current_balance.message}</p>
            )}
            <p className="text-sm text-zinc-400 mt-1.5">
              {isCreditCard
                ? 'Enter the amount you currently owe on this card'
                : 'Enter your current account balance'}
            </p>
          </div>

          {/* Currency */}
          <div>
            <Label htmlFor="currency" className="text-zinc-300 mb-1.5 block font-medium">
              Currency
            </Label>
            <div className="relative">
              <select
                id="currency"
                {...register('currency')}
                className={[
                  'w-full bg-zinc-800 border border-zinc-700 rounded-md px-3 py-2 min-h-[44px]',
                  'text-zinc-100',
                  '[&>option]:bg-zinc-800 [&>option]:text-zinc-100',
                  'focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent',
                  'appearance-none pr-10 cursor-pointer',
                ].join(' ')}
              >
                <option value="USD">USD ($)</option>
                <option value="CAD">CAD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
              </select>
              <ChevronDown className="w-5 h-5 text-zinc-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Is Spendable Checkbox - hidden for credit cards since they're never "spendable" */}
          {!isCreditCard && (
            <div className="flex items-center gap-3 p-3 rounded-md bg-zinc-900/50 border border-zinc-700/50">
              <input
                type="checkbox"
                id="is_spendable"
                {...register('is_spendable')}
                className="h-4 w-4 rounded border-zinc-600 bg-zinc-800 text-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:ring-offset-0 cursor-pointer"
              />
              <Label htmlFor="is_spendable" className="text-zinc-300 font-normal cursor-pointer">
                Use this account for expenses
              </Label>
            </div>
          )}

          {error && <p className="text-sm text-rose-400">{error}</p>}

          <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-6 border-t border-zinc-700/50">
            <button
              type="button"
              onClick={() => router.push('/dashboard/accounts')}
              disabled={isLoading}
              className="w-full bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 text-zinc-300 font-medium rounded-md px-4 py-2.5 min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-teal-600 hover:bg-teal-500 text-white font-medium rounded-md px-4 py-2.5 min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-teal-500/20 transition-all hover:shadow-teal-500/30"
            >
              {isLoading ? 'Creating...' : 'Create Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

