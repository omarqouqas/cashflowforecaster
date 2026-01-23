// app/dashboard/income/new/page.tsx
// ============================================
// New Income Page - With Feature Gating
// ============================================

'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { CurrencyInput } from '@/components/ui/currency-input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { ArrowLeft, ChevronDown } from 'lucide-react';
import { Tables } from '@/types/supabase';
import { showError, showSuccess } from '@/lib/toast';
import { useSubscriptionWithUsage } from '@/lib/hooks/use-subscription';
import { UpgradePrompt } from '@/components/subscription/upgrade-prompt';
import { trackIncomeAdded } from '@/lib/posthog/events';

const incomeSchema = z.object({
  name: z.string().min(1, 'Income name is required').max(100, 'Name too long'),
  amount: z.coerce
    .number({
      required_error: 'Amount is required',
      invalid_type_error: 'Amount must be a number',
    })
    .positive('Amount must be positive'),
  frequency: z.enum(['one-time', 'weekly', 'biweekly', 'semi-monthly', 'monthly', 'irregular'], {
    message: 'Please select a frequency',
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
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // Feature gating
  const { canAddIncome, usage, limits, isLoading: subscriptionLoading } = useSubscriptionWithUsage();

  const {
    register,
    handleSubmit,
    control,
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

      setAccounts((data || []) as any);
    }

    fetchAccounts();
  }, []);

  // Show upgrade modal if at limit
  useEffect(() => {
    if (!subscriptionLoading && !canAddIncome) {
      setShowUpgradeModal(true);
    }
  }, [subscriptionLoading, canAddIncome]);

  const onSubmit = async (data: IncomeFormData) => {
    // Double-check limit before submitting
    if (!canAddIncome) {
      setShowUpgradeModal(true);
      return;
    }

    setIsLoading(true);
    setError(null);

    const supabase = createClient();

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      const message = 'You must be logged in';
      showError(message);
      setError(message);
      setIsLoading(false);
      return;
    }

    // Server-side limit check
    const { count } = await supabase
      .from('income')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);

    if (limits.maxIncome !== Infinity && (count ?? 0) >= limits.maxIncome) {
      showError("You've reached your income sources limit. Upgrade to Pro for unlimited tracking.");
      setShowUpgradeModal(true);
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
      status: data.is_active ? 'active' : 'paused',
    });

    if (insertError) {
      showError(insertError.message);
      setError(insertError.message);
    } else {
      trackIncomeAdded({
        frequency: data.frequency,
        isRecurring: data.frequency !== 'one-time',
        hasEndDate: false,
      });
      showSuccess('Income added');
      router.refresh();
      router.push('/dashboard/income');
    }

    setIsLoading(false);
  };

  // Show loading state while checking subscription
  if (subscriptionLoading) {
    return (
      <div className="max-w-lg mx-auto">
        <Link
          href="/dashboard/income"
          className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-teal-400 mb-6 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Income
        </Link>

        <h1 className="text-2xl font-semibold text-zinc-100 mb-6">Add Income Source</h1>

        <div className="border border-zinc-700/50 bg-zinc-800/50 backdrop-blur-sm rounded-lg p-6 shadow-xl">
          <div className="flex flex-col items-center justify-center gap-4 py-10">
            <svg
              className="animate-spin h-8 w-8 text-teal-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <p className="text-zinc-400">Loading…</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      <Link
        href="/dashboard/income"
        className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-teal-400 mb-6 transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Income
      </Link>

      <h1 className="text-2xl font-semibold text-zinc-100 mb-6">Add Income Source</h1>

      {/* Usage indicator */}
      {limits.maxIncome !== Infinity && (
        <div className="mb-4 text-sm text-zinc-400">
          {usage.incomeCount}/{limits.maxIncome} income sources used
        </div>
      )}

      <div className="border border-zinc-700/50 bg-zinc-800/50 backdrop-blur-sm rounded-lg p-6 shadow-xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Income Name */}
          <div>
            <Label htmlFor="name" className="text-zinc-300 mb-1.5 block font-medium">
              Income Source Name<span className="text-rose-400 ml-0.5">*</span>
            </Label>
            <Input
              id="name"
              placeholder="e.g., Salary, Freelance Project, Side Gig"
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

          {/* Amount */}
          <div>
            <Label htmlFor="amount" className="text-zinc-300 mb-1.5 block font-medium">
              Amount<span className="text-rose-400 ml-0.5">*</span>
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 z-10">$</span>
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
                      'pl-8 bg-zinc-900 border-zinc-700 text-zinc-100 placeholder:text-zinc-500',
                      'focus:border-teal-500 focus:ring-teal-500/20',
                      errors.amount ? 'border-rose-400 focus:border-rose-400 focus:ring-rose-400/20' : '',
                    ].join(' ')}
                  />
                )}
              />
            </div>
            {errors.amount?.message && (
              <p className="text-sm text-rose-400 mt-1.5">{errors.amount.message}</p>
            )}
            <p className="text-sm text-zinc-400 mt-1.5">
              Enter the amount you receive each payment
            </p>
          </div>

          {/* Frequency */}
          <div>
            <Label htmlFor="frequency" className="text-zinc-300 mb-1.5 block font-medium">
              Frequency<span className="text-rose-400 ml-0.5">*</span>
            </Label>
            <div className="relative">
              <select
                id="frequency"
                {...register('frequency')}
                className={[
                  'w-full bg-zinc-800 border border-zinc-700 rounded-md px-3 py-2 min-h-[44px]',
                  'text-zinc-100',
                  '[&>option]:bg-zinc-800 [&>option]:text-zinc-100',
                  'focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent',
                  'appearance-none pr-10 cursor-pointer',
                  errors.frequency ? 'border-rose-400 focus:ring-rose-400' : '',
                ].join(' ')}
              >
                <option value="" className="text-zinc-500">Select frequency...</option>
                <option value="weekly">Weekly</option>
                <option value="biweekly">Bi-weekly (every 2 weeks)</option>
                <option value="semi-monthly">Semi-monthly (twice a month)</option>
                <option value="monthly">Monthly</option>
                <option value="one-time">One-time payment</option>
                <option value="irregular">Irregular / Variable</option>
              </select>
              <ChevronDown className="w-5 h-5 text-zinc-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            {errors.frequency?.message && (
              <p className="text-sm text-rose-400 mt-1.5">{errors.frequency.message}</p>
            )}
          </div>

          {/* Next Payment Date */}
          <div>
            <Label htmlFor="next_date" className="text-zinc-300 mb-1.5 block font-medium">
              Next Payment Date<span className="text-rose-400 ml-0.5">*</span>
            </Label>
            <Input
              id="next_date"
              type="date"
              {...register('next_date')}
              className={[
                'bg-zinc-800 border-zinc-700 text-zinc-100 cursor-pointer',
                '[color-scheme:dark]',
                errors.next_date ? 'border-rose-400 focus:ring-rose-400' : '',
              ].join(' ')}
            />
            {errors.next_date?.message && (
              <p className="text-sm text-rose-400 mt-1.5">{errors.next_date.message}</p>
            )}
            <p className="text-sm text-zinc-400 mt-1.5">When do you expect the next payment?</p>
          </div>

          {/* Account Link (Optional) */}
          <div>
            <Label htmlFor="account_id" className="text-zinc-300 mb-1.5 block font-medium">
              Deposit Account (Optional)
            </Label>
            <div className="relative">
              <select
                id="account_id"
                {...register('account_id')}
                className={[
                  'w-full bg-zinc-800 border border-zinc-700 rounded-md px-3 py-2 min-h-[44px]',
                  'text-zinc-100',
                  '[&>option]:bg-zinc-800 [&>option]:text-zinc-100',
                  'focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent',
                  'appearance-none pr-10 cursor-pointer',
                ].join(' ')}
              >
                <option value="">No specific account</option>
                {accounts.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.name} ({account.account_type})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-5 h-5 text-zinc-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            <p className="text-sm text-zinc-400 mt-1.5">Which account does this income go into?</p>
          </div>

          {/* Is Active Checkbox */}
          <div className="flex items-start gap-3 p-3 rounded-md bg-zinc-900/50 border border-zinc-700/50">
            <input
              type="checkbox"
              id="is_active"
              {...register('is_active')}
              defaultChecked
              className="mt-1 h-4 w-4 rounded border-zinc-600 bg-zinc-800 text-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:ring-offset-0 cursor-pointer"
            />
            <div>
              <Label
                htmlFor="is_active"
                className="text-zinc-300 cursor-pointer"
              >
                Include in forecast
              </Label>
              <p className="text-sm text-zinc-400 mt-1">
                Uncheck to pause this income without deleting it
              </p>
            </div>
          </div>

          {error && <p className="text-sm text-rose-400">{error}</p>}

          <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-6 border-t border-zinc-700/50">
            <button
              type="button"
              onClick={() => router.push('/dashboard/income')}
              disabled={isLoading}
              className="w-full bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 text-zinc-300 font-medium rounded-md px-4 py-2.5 min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !canAddIncome}
              className="w-full bg-teal-600 hover:bg-teal-500 text-white font-medium rounded-md px-4 py-2.5 min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-teal-500/20 transition-all hover:shadow-teal-500/30"
            >
              {isLoading ? 'Adding...' : 'Add Income'}
            </button>
          </div>
        </form>
      </div>

      {/* Upgrade Modal */}
      <UpgradePrompt
        isOpen={showUpgradeModal}
        onClose={() => {
          setShowUpgradeModal(false);
          // If they close without upgrading and are at limit, go back
          if (!canAddIncome) {
            router.push('/dashboard/income');
          }
        }}
        feature="income"
        currentCount={usage.incomeCount}
        limit={limits.maxIncome}
      />
    </div>
  );
}