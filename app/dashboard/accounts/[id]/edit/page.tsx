'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/client';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CurrencyInput } from '@/components/ui/currency-input';
import { DeleteAccountButton } from '@/components/accounts/delete-account-button';
import Link from 'next/link';
import { ArrowLeft, ChevronDown, CreditCard, Info } from 'lucide-react';
import { Tables } from '@/types/supabase';
import { showError, showSuccess } from '@/lib/toast';

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

type Account = Tables<'accounts'>;

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
  statement_close_day: z.coerce.number().int().min(1).max(28).optional().nullable(),
  payment_due_day: z.coerce.number().int().min(1).max(28).optional().nullable(),
});

type AccountFormData = z.infer<typeof accountSchema>;

export default function EditAccountPage() {
  const params = useParams();
  const router = useRouter();
  const accountId = params.id as string;

  const [account, setAccount] = useState<Account | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<AccountFormData>({
    resolver: zodResolver(accountSchema),
  });

  // Watch account_type to show/hide credit card fields
  const accountType = useWatch({ control, name: 'account_type' });
  const isCreditCard = accountType === 'credit_card';

  useEffect(() => {
    async function fetchAccount() {
      const supabase = createClient();

      const { data, error: fetchError } = await supabase
        .from('accounts')
        .select('*')
        .eq('id', accountId)
        .single();

      if (fetchError) {
        console.error('Error fetching account:', fetchError);
        const message = 'Account not found';
        showError(message);
        setError(message);
        setIsLoading(false);
        // Redirect to accounts list after a short delay
        setTimeout(() => {
          router.push('/dashboard/accounts');
        }, 2000);
        return;
      }

      if (data) {
        const accountData = data as any;
        setAccount(data);
        // Pre-fill form with existing data
        reset({
          name: accountData.name,
          account_type: (accountData.account_type as 'checking' | 'savings' | 'credit_card') || 'checking',
          current_balance: accountData.current_balance,
          currency: accountData.currency || 'USD',
          is_spendable: accountData.is_spendable ?? true,
          // Credit card fields
          credit_limit: accountData.credit_limit ?? null,
          apr: accountData.apr ?? null,
          statement_close_day: accountData.statement_close_day ?? null,
          payment_due_day: accountData.payment_due_day ?? null,
        });
      }

      setIsLoading(false);
    }

    if (accountId) {
      fetchAccount();
    }
  }, [accountId, router, reset]);

  const onSubmit = async (data: AccountFormData) => {
    setIsSubmitting(true);
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
      setIsSubmitting(false);
      return;
    }

    // Build update data with credit card fields if applicable
    const updateData: Record<string, any> = {
      name: data.name,
      account_type: data.account_type,
      current_balance: data.current_balance,
      currency: data.currency,
      is_spendable: data.account_type === 'credit_card' ? false : data.is_spendable,
      updated_at: new Date().toISOString(),
    };

    // Add or clear credit card specific fields
    if (data.account_type === 'credit_card') {
      updateData.credit_limit = data.credit_limit || null;
      updateData.apr = data.apr || null;
      updateData.statement_close_day = data.statement_close_day || null;
      updateData.payment_due_day = data.payment_due_day || null;
    } else {
      // Clear CC fields if switching away from credit card type
      updateData.credit_limit = null;
      updateData.apr = null;
      updateData.statement_close_day = null;
      updateData.payment_due_day = null;
    }

    // Update account
    const { error: updateError } = await supabase
      .from('accounts')
      .update(updateData)
      .eq('id', accountId);

    if (updateError) {
      showError(updateError.message);
      setError(updateError.message);
    } else {
      // Success - redirect to accounts list
      showSuccess('Changes saved');
      router.refresh();
      router.push('/dashboard/accounts');
    }

    setIsSubmitting(false);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="max-w-lg mx-auto">
        <Link
          href="/dashboard/accounts"
          className="inline-flex items-center text-sm text-zinc-400 hover:text-teal-400 transition-colors group mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Accounts
        </Link>

        <h1 className="text-2xl font-bold text-zinc-100 mb-6">Edit Account</h1>

        <div className="border border-zinc-800 bg-zinc-900 rounded-lg p-6">
          <div className="flex flex-col items-center justify-center gap-4 py-10">
            <svg
              className="animate-spin h-8 w-8 text-teal-400"
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
            <p className="text-zinc-400">Loading account…</p>
          </div>
        </div>
      </div>
    );
  }

  // Account not found state
  if (!account) {
    return (
      <div className="max-w-lg mx-auto">
        <Link
          href="/dashboard/accounts"
          className="inline-flex items-center text-sm text-zinc-400 hover:text-teal-400 transition-colors group mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Accounts
        </Link>

        <h1 className="text-2xl font-bold text-zinc-100 mb-6">Edit Account</h1>

        <div className="border border-zinc-800 bg-zinc-900 rounded-lg p-6">
          <p className="text-zinc-400 text-center">Account not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      <Link
        href="/dashboard/accounts"
        className="inline-flex items-center text-sm text-zinc-400 hover:text-teal-400 transition-colors group mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
        Back to Accounts
      </Link>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-zinc-100">Edit Account</h1>
        <DeleteAccountButton accountId={account.id} accountName={account.name} />
      </div>

      <div className="border border-zinc-800 bg-zinc-900 rounded-lg p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Account Name */}
          <div>
            <Label htmlFor="name" className="text-zinc-300 mb-1.5 block">
              Account Name<span className="text-rose-400 ml-0.5">*</span>
            </Label>
            <Input
              id="name"
              placeholder="e.g., Main Checking"
              {...register('name')}
              className={errors.name ? 'border-rose-500 focus:ring-rose-500' : undefined}
            />
            {errors.name?.message && (
              <p className="text-sm text-rose-400 mt-1.5">{errors.name.message}</p>
            )}
          </div>

          {/* Account Type */}
          <div>
            <Label htmlFor="account_type" className="text-zinc-300 mb-1.5 block">
              Account Type<span className="text-rose-400 ml-0.5">*</span>
            </Label>
            <div className="relative">
              <select
                id="account_type"
                {...register('account_type')}
                className={[
                  'w-full bg-zinc-800 border border-zinc-700 rounded-md px-3 py-2 text-zinc-100 min-h-[44px]',
                  'placeholder:text-zinc-500',
                  'focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent',
                  'appearance-none pr-10',
                  errors.account_type ? 'border-rose-500 focus:ring-rose-500' : '',
                ].join(' ')}
              >
                <option value="">Select type...</option>
                <option value="checking">Checking</option>
                <option value="savings">Savings</option>
                <option value="credit_card">Credit Card</option>
              </select>
              <ChevronDown className="w-4 h-4 text-zinc-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
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
                <Label htmlFor="credit_limit" className="text-zinc-300 mb-1.5 block">
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
                        className="pl-8 bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500 focus:ring-teal-500 focus:border-transparent"
                      />
                    )}
                  />
                </div>
                <p className="text-xs text-zinc-500 mt-1">Used to calculate credit utilization</p>
              </div>

              {/* APR */}
              <div>
                <Label htmlFor="apr" className="text-zinc-300 mb-1.5 block">
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
                    className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500 focus:ring-teal-500 focus:border-transparent pr-8"
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
                  <Label htmlFor="statement_close_day" className="text-zinc-300 mb-1.5 block">
                    Statement Closes
                  </Label>
                  <div className="relative">
                    <select
                      id="statement_close_day"
                      {...register('statement_close_day')}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-md px-3 py-2 min-h-[44px] text-zinc-100 [&>option]:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent appearance-none pr-10 cursor-pointer"
                    >
                      <option value="">Select day...</option>
                      {Array.from({ length: 28 }, (_, i) => i + 1).map((day) => (
                        <option key={day} value={day}>
                          {day}{getOrdinalSuffix(day)} of month
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-zinc-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="payment_due_day" className="text-zinc-300 mb-1.5 block">
                    Payment Due
                  </Label>
                  <div className="relative">
                    <select
                      id="payment_due_day"
                      {...register('payment_due_day')}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-md px-3 py-2 min-h-[44px] text-zinc-100 [&>option]:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent appearance-none pr-10 cursor-pointer"
                    >
                      <option value="">Select day...</option>
                      {Array.from({ length: 28 }, (_, i) => i + 1).map((day) => (
                        <option key={day} value={day}>
                          {day}{getOrdinalSuffix(day)} of month
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-zinc-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
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
            <Label htmlFor="current_balance" className="text-zinc-300 mb-1.5 block">
              {isCreditCard ? 'Current Balance (Amount Owed)' : 'Current Balance'}
              <span className="text-rose-400 ml-0.5">*</span>
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
                $
              </span>
              <Controller
                name="current_balance"
                control={control}
                render={({ field }) => (
                  <CurrencyInput
                    id="current_balance"
                    placeholder={isCreditCard ? '2,450.00' : '0.00'}
                    className={[
                      'pl-8',
                      errors.current_balance ? 'border-rose-500 focus:ring-rose-500' : '',
                    ].join(' ')}
                    value={field.value}
                    onChange={field.onChange}
                    allowNegative={!isCreditCard}
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
            <Label htmlFor="currency" className="text-zinc-300 mb-1.5 block">
              Currency
            </Label>
            <div className="relative">
              <select
                id="currency"
                {...register('currency')}
                className={[
                  'w-full bg-zinc-800 border border-zinc-700 rounded-md px-3 py-2 text-zinc-100 min-h-[44px]',
                  'placeholder:text-zinc-500',
                  'focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent',
                  'appearance-none pr-10',
                ].join(' ')}
              >
                <option value="USD">USD ($)</option>
                <option value="CAD">CAD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
              </select>
              <ChevronDown className="w-4 h-4 text-zinc-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Is Spendable Checkbox - hidden for credit cards since they're never "spendable" */}
          {!isCreditCard && (
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_spendable"
                {...register('is_spendable')}
                className="h-4 w-4 rounded border-zinc-600 bg-zinc-800 text-teal-500 focus:ring-2 focus:ring-teal-500 focus:ring-offset-0 checked:bg-teal-500"
              />
              <Label htmlFor="is_spendable" className="text-zinc-300 font-normal cursor-pointer">
                Use this account for expenses
              </Label>
            </div>
          )}

          {error && <p className="text-sm text-rose-400">{error}</p>}

          <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-6 border-t border-zinc-800">
            <button
              type="button"
              onClick={() => router.push('/dashboard/accounts')}
              disabled={isSubmitting}
              className="w-full bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 text-zinc-100 font-medium rounded-md px-4 py-2.5 min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-md px-4 py-2.5 min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? 'Saving...' : 'Save changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

