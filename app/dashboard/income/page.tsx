// app/dashboard/income/page.tsx
// ============================================
// Income Page - With Feature Gating
// ============================================

import { requireAuth } from '@/lib/auth/session';
import { createClient } from '@/lib/supabase/server';
import { Tables } from '@/types/supabase';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { TrendingUp, ArrowLeft, Sparkles } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/format';
import { IncomeCard } from '@/components/income/income-card';
import { getUserUsageStats } from '@/lib/stripe/feature-gate';
import { GatedAddButton } from '@/components/subscription/gated-add-button';

type Income = Tables<'income'>;

interface IncomePageProps {
  searchParams: { success?: string };
}

export default async function IncomePage({ searchParams }: IncomePageProps) {
  const user = await requireAuth();
  const supabase = await createClient();

  // Fetch income and usage stats in parallel
  const [incomeResult, usageStats] = await Promise.all([
    supabase
      .from('income')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false }),
    getUserUsageStats(user.id),
  ]);

  const { data: incomes, error } = incomeResult;

  if (error) {
    console.error('Error fetching income:', error);
  }

  const success = searchParams?.success;

  // Calculate total monthly income
  const calculateMonthlyIncome = (incomesList: Income[]): number => {
    return incomesList.reduce((total, income) => {
      if (income.is_active === false) return total;

      switch (income.frequency) {
        case 'weekly':
          return total + (income.amount * 52) / 12;
        case 'biweekly':
          return total + (income.amount * 26) / 12;
        case 'monthly':
          return total + income.amount;
        case 'irregular':
          return total;
        case 'one-time':
          return total;
        default:
          return total;
      }
    }, 0);
  };

  const monthlyTotal = calculateMonthlyIncome(incomes || []);
  const activeIncomes = incomes?.filter((i) => i.is_active !== false) || [];

  // Feature gating
  const { current: incomeCount, limit: incomeLimit } = usageStats.income;
  const isAtLimit = incomeLimit !== Infinity && incomeCount >= incomeLimit;
  const isNearLimit = incomeLimit !== Infinity && incomeCount >= incomeLimit - 2 && !isAtLimit;

  return (
    <>
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Dashboard
        </Link>
      </div>

      {/* Page Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Income Sources</h2>
            {/* Usage indicator */}
            {incomeLimit !== Infinity && (
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                isAtLimit 
                  ? 'bg-amber-100 text-amber-700' 
                  : isNearLimit
                    ? 'bg-amber-50 text-amber-600'
                    : 'bg-zinc-100 text-zinc-600'
              }`}>
                {incomeCount}/{incomeLimit}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Track your regular and one-time income
          </p>
        </div>
        <GatedAddButton
          href="/dashboard/income/new"
          feature="income"
          currentCount={incomeCount}
          limit={incomeLimit}
        />
      </div>

      {/* Upgrade Banner - Show when at or near limit */}
      {(isAtLimit || isNearLimit) && (
        <div className={`rounded-lg p-4 mb-6 ${
          isAtLimit 
            ? 'bg-amber-50 border border-amber-200' 
            : 'bg-blue-50 border border-blue-200'
        }`}>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${
                isAtLimit ? 'bg-amber-100' : 'bg-blue-100'
              }`}>
                <Sparkles className={`w-5 h-5 ${
                  isAtLimit ? 'text-amber-600' : 'text-blue-600'
                }`} />
              </div>
              <div>
                <p className={`font-medium ${
                  isAtLimit ? 'text-amber-900' : 'text-blue-900'
                }`}>
                  {isAtLimit 
                    ? "You've reached your income sources limit" 
                    : `${incomeLimit - incomeCount} income sources remaining`}
                </p>
                <p className={`text-sm ${
                  isAtLimit ? 'text-amber-700' : 'text-blue-700'
                }`}>
                  {isAtLimit 
                    ? 'Upgrade to Pro for unlimited income tracking' 
                    : 'Upgrade anytime for unlimited tracking'}
                </p>
              </div>
            </div>
            <Link
              href="/#pricing"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isAtLimit
                  ? 'bg-amber-600 hover:bg-amber-700 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              Upgrade
            </Link>
          </div>
        </div>
      )}

      {/* Success Messages */}
      {success === 'income-created' && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 mb-6">
          <p className="text-sm text-green-800 dark:text-green-200">
            ✓ Income source added successfully
          </p>
        </div>
      )}
      {success === 'income-updated' && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 mb-6">
          <p className="text-sm text-green-800 dark:text-green-200">
            ✓ Income source updated successfully
          </p>
        </div>
      )}
      {success === 'income-deleted' && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 mb-6">
          <p className="text-sm text-green-800 dark:text-green-200">
            ✓ Income source deleted successfully
          </p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
          <p className="text-sm text-red-800 dark:text-red-200">
            Error loading income sources. Please try refreshing the page.
          </p>
        </div>
      )}

      {/* Summary Section */}
      {!error && incomes && incomes.length > 0 && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-sm text-gray-600 dark:text-gray-400">Estimated Monthly Income</p>
                <button
                  type="button"
                  className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                  title="This is your average monthly income. Biweekly and weekly income is converted to a monthly equivalent (26 biweekly payments per year ÷ 12 months)."
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                {formatCurrency(monthlyTotal)}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                From {activeIncomes.length} active source{activeIncomes.length !== 1 ? 's' : ''}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 italic">
                * Biweekly = 26 payments/year ÷ 12 months
              </p>
            </div>
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <TrendingUp className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      {!error && (
        <>
          {!incomes || incomes.length === 0 ? (
            /* Empty State */
            <div className="text-center py-12">
              <TrendingUp className="w-10 h-10 mx-auto mb-3 text-zinc-400" />
              <p className="text-zinc-500">
                No income sources yet
              </p>
              <p className="text-sm text-zinc-500 mt-1 mb-6">
                Add your salary, freelance work, or other income sources to track your cash flow
              </p>
              <Link href="/dashboard/income/new">
                <Button variant="primary">Add Your First Income Source</Button>
              </Link>
            </div>
          ) : (
            /* Income List */
            <div className="space-y-3">
              {incomes.map((income) => (
                <IncomeCard key={income.id} income={income} />
              ))}
            </div>
          )}
        </>
      )}
    </>
  );
}