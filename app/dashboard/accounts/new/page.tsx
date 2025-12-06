'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormError } from '@/components/ui/form-error';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

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

export default function NewAccountPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AccountFormData>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      currency: 'USD',
      is_spendable: true,
    },
  });

  const onSubmit = async (data: AccountFormData) => {
    setIsLoading(true);
    setError(null);

    const supabase = createClient();

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError('You must be logged in');
      setIsLoading(false);
      return;
    }

    // Insert account
    const { error: insertError } = await supabase.from('accounts').insert({
      user_id: user.id,
      name: data.name,
      account_type: data.account_type,
      current_balance: data.current_balance,
      currency: data.currency,
      is_spendable: data.is_spendable,
    });

    if (insertError) {
      setError(insertError.message);
    } else {
      // Success - redirect to accounts list
      router.push('/dashboard/accounts?success=account-created');
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
      {/* Header/Nav */}
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              Cash Flow Forecaster
            </h1>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link
            href="/dashboard/accounts"
            className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Accounts
          </Link>
        </div>

        {/* Page Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Add Account</h2>
        </div>

        {/* Form Card */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-6 shadow-sm">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Account Name */}
              <div>
                <Label htmlFor="name">Account Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Main Checking"
                  {...register('name')}
                  className="mt-1"
                />
                <FormError message={errors.name?.message} />
              </div>

              {/* Account Type */}
              <div>
                <Label htmlFor="account_type">Account Type</Label>
                <select
                  id="account_type"
                  {...register('account_type')}
                  className={cn(
                    'w-full mt-1 px-3 py-2 rounded-md border border-gray-300 bg-white',
                    'text-sm',
                    'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                    'disabled:cursor-not-allowed disabled:opacity-50',
                    'dark:bg-slate-700 dark:border-slate-600 dark:text-white'
                  )}
                >
                  <option value="">Select type...</option>
                  <option value="checking">Checking</option>
                  <option value="savings">Savings</option>
                </select>
                <FormError message={errors.account_type?.message} />
              </div>

              {/* Current Balance */}
              <div>
                <Label htmlFor="current_balance">Current Balance</Label>
                <div className="relative mt-1">
                  <span className="absolute left-3 top-2.5 text-gray-500 dark:text-gray-400">
                    $
                  </span>
                  <Input
                    id="current_balance"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    className="pl-8"
                    {...register('current_balance')}
                  />
                </div>
                <FormError message={errors.current_balance?.message} />
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Enter your current account balance
                </p>
              </div>

              {/* Currency */}
              <div>
                <Label htmlFor="currency">Currency</Label>
                <select
                  id="currency"
                  {...register('currency')}
                  className={cn(
                    'w-full mt-1 px-3 py-2 rounded-md border border-gray-300 bg-white',
                    'text-sm',
                    'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                    'disabled:cursor-not-allowed disabled:opacity-50',
                    'dark:bg-slate-700 dark:border-slate-600 dark:text-white'
                  )}
                >
                  <option value="USD">USD ($)</option>
                  <option value="CAD">CAD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
                <FormError message={errors.currency?.message} />
              </div>

              {/* Is Spendable Checkbox */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_spendable"
                  {...register('is_spendable')}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700"
                />
                <Label htmlFor="is_spendable" className="font-normal cursor-pointer">
                  Use this account for expenses
                </Label>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded p-3 text-sm text-red-800 dark:text-red-200">
                  {error}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/dashboard/accounts')}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading} loading={isLoading}>
                  {isLoading ? 'Creating...' : 'Create Account'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

