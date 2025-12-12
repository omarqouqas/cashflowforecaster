'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/client';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DeleteAccountButton } from '@/components/accounts/delete-account-button';
import Link from 'next/link';
import { ArrowLeft, ChevronDown } from 'lucide-react';
import { Tables } from '@/types/supabase';

type Account = Tables<'accounts'>;

const accountSchema = z.object({
  name: z.string().min(1, 'Account name is required').max(50, 'Name too long'),
  account_type: z.enum(['checking', 'savings'], {
    required_error: 'Please select an account type',
  }),
  current_balance: z.coerce.number({
    required_error: 'Balance is required',
    invalid_type_error: 'Balance must be a number',
  }),
  currency: z.string().default('USD'),
  is_spendable: z.boolean().default(true),
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
  } = useForm<AccountFormData>({
    resolver: zodResolver(accountSchema),
  });

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
        setError('Account not found');
        setIsLoading(false);
        // Redirect to accounts list after a short delay
        setTimeout(() => {
          router.push('/dashboard/accounts');
        }, 2000);
        return;
      }

      if (data) {
        setAccount(data);
        // Pre-fill form with existing data
        reset({
          name: data.name,
          account_type: (data.account_type as 'checking' | 'savings') || 'checking',
          current_balance: data.current_balance,
          currency: data.currency || 'USD',
          is_spendable: data.is_spendable ?? true,
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
      setError('You must be logged in');
      setIsSubmitting(false);
      return;
    }

    // Update account
    const { error: updateError } = await supabase
      .from('accounts')
      .update({
        name: data.name,
        account_type: data.account_type,
        current_balance: data.current_balance,
        currency: data.currency,
        is_spendable: data.is_spendable,
        updated_at: new Date().toISOString(),
      })
      .eq('id', accountId);

    if (updateError) {
      setError(updateError.message);
    } else {
      // Success - redirect to accounts list
      router.refresh();
      router.push('/dashboard/accounts?success=account-updated');
    }

    setIsSubmitting(false);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="max-w-lg mx-auto">
        <Link
          href="/dashboard/accounts"
          className="text-sm text-zinc-500 hover:text-zinc-700 flex items-center gap-1 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Accounts
        </Link>

        <h1 className="text-xl font-semibold text-zinc-900 mb-6">Edit Account</h1>

        <div className="border border-zinc-200 bg-white rounded-lg p-6">
          <div className="flex flex-col items-center justify-center gap-4 py-10">
            <svg
              className="animate-spin h-8 w-8 text-zinc-900"
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
            <p className="text-zinc-500">Loading account…</p>
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
          className="text-sm text-zinc-500 hover:text-zinc-700 flex items-center gap-1 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Accounts
        </Link>

        <h1 className="text-xl font-semibold text-zinc-900 mb-6">Edit Account</h1>

        <div className="border border-zinc-200 bg-white rounded-lg p-6">
          <p className="text-zinc-500 text-center">Account not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      <Link
        href="/dashboard/accounts"
        className="text-sm text-zinc-500 hover:text-zinc-700 flex items-center gap-1 mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Accounts
      </Link>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-zinc-900">Edit Account</h1>
        <DeleteAccountButton accountId={account.id} accountName={account.name} />
      </div>

      <div className="border border-zinc-200 bg-white rounded-lg p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Account Name */}
          <div>
            <Label htmlFor="name" className="text-zinc-700 mb-1.5 block">
              Account Name<span className="text-rose-500 ml-0.5">*</span>
            </Label>
            <Input
              id="name"
              placeholder="e.g., Main Checking"
              {...register('name')}
              className={errors.name ? 'border-rose-500 focus:ring-rose-500' : undefined}
            />
            {errors.name?.message && (
              <p className="text-sm text-rose-600 mt-1.5">{errors.name.message}</p>
            )}
          </div>

          {/* Account Type */}
          <div>
            <Label htmlFor="account_type" className="text-zinc-700 mb-1.5 block">
              Account Type<span className="text-rose-500 ml-0.5">*</span>
            </Label>
            <div className="relative">
              <select
                id="account_type"
                {...register('account_type')}
                className={[
                  'w-full bg-zinc-50 border border-zinc-200 rounded-md px-3 py-2 text-zinc-900 min-h-[44px]',
                  'placeholder:text-zinc-400',
                  'focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent',
                  'appearance-none pr-10',
                  errors.account_type ? 'border-rose-500 focus:ring-rose-500' : '',
                ].join(' ')}
              >
                <option value="">Select type...</option>
                <option value="checking">Checking</option>
                <option value="savings">Savings</option>
              </select>
              <ChevronDown className="w-4 h-4 text-zinc-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            {errors.account_type?.message && (
              <p className="text-sm text-rose-600 mt-1.5">{errors.account_type.message}</p>
            )}
          </div>

          {/* Current Balance */}
          <div>
            <Label htmlFor="current_balance" className="text-zinc-700 mb-1.5 block">
              Current Balance<span className="text-rose-500 ml-0.5">*</span>
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
                $
              </span>
              <Input
                id="current_balance"
                type="number"
                step="0.01"
                placeholder="0.00"
                className={[
                  'pl-8',
                  errors.current_balance ? 'border-rose-500 focus:ring-rose-500' : '',
                ].join(' ')}
                {...register('current_balance')}
              />
            </div>
            {errors.current_balance?.message && (
              <p className="text-sm text-rose-600 mt-1.5">{errors.current_balance.message}</p>
            )}
            <p className="text-sm text-zinc-500 mt-1.5">Enter your current account balance</p>
          </div>

          {/* Currency */}
          <div>
            <Label htmlFor="currency" className="text-zinc-700 mb-1.5 block">
              Currency
            </Label>
            <div className="relative">
              <select
                id="currency"
                {...register('currency')}
                className={[
                  'w-full bg-zinc-50 border border-zinc-200 rounded-md px-3 py-2 text-zinc-900 min-h-[44px]',
                  'placeholder:text-zinc-400',
                  'focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent',
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

          {/* Is Spendable Checkbox */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_spendable"
              {...register('is_spendable')}
              className="h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-2 focus:ring-zinc-900"
            />
            <Label htmlFor="is_spendable" className="text-zinc-700 font-normal cursor-pointer">
              Use this account for expenses
            </Label>
          </div>

          {error && <p className="text-sm text-rose-600">{error}</p>}

          <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-6 border-t border-zinc-100">
            <button
              type="button"
              onClick={() => router.push('/dashboard/accounts')}
              disabled={isSubmitting}
              className="w-full bg-white border border-zinc-200 hover:bg-zinc-50 text-zinc-700 font-medium rounded-md px-4 py-2.5 min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-md px-4 py-2.5 min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Updating...' : 'Save changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

