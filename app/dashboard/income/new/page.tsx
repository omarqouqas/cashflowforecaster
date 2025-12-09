'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormError } from '@/components/ui/form-error';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tables } from '@/types/supabase';

const incomeSchema = z.object({
  name: z.string().min(1, 'Income name is required').max(100, 'Name too long'),
  amount: z.coerce.number({
    required_error: 'Amount is required',
    invalid_type_error: 'Amount must be a number',
  }).positive('Amount must be positive'),
  frequency: z.enum(['one-time', 'weekly', 'biweekly', 'monthly', 'irregular'], {
    required_error: 'Please select a frequency',
  }),
  next_date: z.string().min(1, 'Next payment date is required'),
  account_id: z.string().nullable().optional(),
  is_active: z.boolean().default(true),
});

type IncomeFormData = z.infer<typeof incomeSchema>;
type Account = Pick<Tables<'accounts'>, 'id' | 'name' | 'account_type'>;

export default function NewIncomePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IncomeFormData>({
    resolver: zodResolver(incomeSchema),
    defaultValues: {
      is_active: true,
    },
  });

  useEffect(() => {
    async function fetchAccounts() {
      const supabase = createClient();
      const { data } = await supabase
        .from('accounts')
        .select('id, name, account_type')
        .order('name');

      setAccounts(data || []);
    }

    fetchAccounts();
  }, []);

  const onSubmit = async (data: IncomeFormData) => {
    setIsLoading(true);
    setError(null);

    const supabase = createClient();

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setError('You must be logged in');
      setIsLoading(false);
      return;
    }

    // Insert income
    const { error: insertError } = await supabase.from('income').insert({
      user_id: user.id,
      name: data.name,
      amount: data.amount,
      frequency: data.frequency,
      next_date: data.next_date,
      account_id: data.account_id || null,
      is_active: data.is_active,
    });

    if (insertError) {
      setError(insertError.message);
    } else {
      router.refresh();
      router.push('/dashboard/income?success=income-created');
    }

    setIsLoading(false);
  };

  return (
    <>
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link
          href="/dashboard/income"
          className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Income
        </Link>
      </div>

      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Add Income Source</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Add a new source of income to track in your cash flow calendar
        </p>
      </div>

      {/* Form Card */}
      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-6 shadow-sm">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Income Name */}
            <div>
              <Label htmlFor="name">Income Source Name</Label>
              <Input
                id="name"
                placeholder="e.g., Salary, Freelance Project, Side Gig"
                className="mt-1"
                {...register('name')}
              />
              <FormError message={errors.name?.message} />
            </div>

            {/* Amount */}
            <div>
              <Label htmlFor="amount">Amount</Label>
              <div className="relative mt-1">
                <span className="absolute left-3 top-2.5 text-gray-500 dark:text-gray-400">$</span>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  className="pl-8"
                  {...register('amount')}
                />
              </div>
              <FormError message={errors.amount?.message} />
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Enter the amount you receive each payment
              </p>
            </div>

            {/* Frequency */}
            <div>
              <Label htmlFor="frequency">Frequency</Label>
              <select
                id="frequency"
                {...register('frequency')}
                className={cn(
                  'w-full mt-1 px-3 py-2 rounded-md border border-gray-300 bg-white',
                  'text-sm',
                  'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                  'disabled:cursor-not-allowed disabled:opacity-50',
                  'dark:bg-slate-700 dark:border-slate-600 dark:text-white'
                )}
              >
                <option value="">Select frequency...</option>
                <option value="weekly">Weekly</option>
                <option value="biweekly">Bi-weekly (every 2 weeks)</option>
                <option value="monthly">Monthly</option>
                <option value="one-time">One-time payment</option>
                <option value="irregular">Irregular / Variable</option>
              </select>
              <FormError message={errors.frequency?.message} />
            </div>

            {/* Next Payment Date */}
            <div>
              <Label htmlFor="next_date">Next Payment Date</Label>
              <Input
                id="next_date"
                type="date"
                className="mt-1"
                {...register('next_date')}
              />
              <FormError message={errors.next_date?.message} />
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                When do you expect the next payment?
              </p>
            </div>

            {/* Account Link (Optional) */}
            <div>
              <Label htmlFor="account_id">Deposit Account (Optional)</Label>
              <select
                id="account_id"
                {...register('account_id')}
                className={cn(
                  'w-full mt-1 px-3 py-2 rounded-md border border-gray-300 bg-white',
                  'text-sm',
                  'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                  'disabled:cursor-not-allowed disabled:opacity-50',
                  'dark:bg-slate-700 dark:border-slate-600 dark:text-white'
                )}
              >
                <option value="">No specific account</option>
                {accounts.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.name} ({account.account_type})
                  </option>
                ))}
              </select>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Which account does this income go into?
              </p>
            </div>

            {/* Is Active Checkbox */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="is_active"
                {...register('is_active')}
                defaultChecked
                className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700"
              />
              <div>
                <Label htmlFor="is_active" className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                  Include in forecast
                </Label>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Uncheck to pause this income without deleting it
                </p>
              </div>
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
                onClick={() => router.push('/dashboard/income')}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading} loading={isLoading}>
                {isLoading ? 'Adding...' : 'Add Income Source'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

