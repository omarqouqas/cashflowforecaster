import { requireAuth } from '@/lib/auth/session';
import { createClient } from '@/lib/supabase/server';
import { SuccessMessage } from '@/components/ui/success-message';
import Link from 'next/link';
import { Wallet, TrendingUp, Receipt } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/format';

interface DashboardPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const user = await requireAuth(); // Redirects to /auth/login if not authenticated
  const message = searchParams.message;
  const supabase = await createClient();

  // Fetch account summary
  const { data: accounts } = await supabase
    .from('accounts')
    .select('current_balance, currency')
    .eq('user_id', user.id);

  // Fetch income summary
  const { data: incomes } = await supabase
    .from('income')
    .select('amount, frequency, is_active')
    .eq('user_id', user.id);

  // Calculate totals
  const totalBalance = accounts?.reduce((sum, acc) => sum + (acc.current_balance || 0), 0) || 0;
  const accountCount = accounts?.length || 0;
  // Use the first account's currency, or default to USD
  const currency = accounts?.[0]?.currency || 'USD';

  // Calculate monthly income equivalent
  const calculateMonthlyIncome = (incomes: any[]) => {
    if (!incomes) return 0;

    return incomes.reduce((total, income) => {
      if (!income.is_active) return total;

      switch (income.frequency) {
        case 'weekly':
          return total + (income.amount * 52 / 12);
        case 'biweekly':
          return total + (income.amount * 26 / 12);
        case 'monthly':
          return total + income.amount;
        default:
          return total;
      }
    }, 0);
  };

  const monthlyIncome = calculateMonthlyIncome(incomes || []);
  const incomeCount = incomes?.filter(i => i.is_active).length || 0;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 border border-slate-200 dark:border-slate-700">
          {/* Success Message */}
          {message === 'password-updated' && (
            <div className="mb-6">
              <SuccessMessage message="Password updated successfully" />
            </div>
          )}

          <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">
            Welcome to Cash Flow Forecaster!
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Your 60-day cash flow calendar will appear here soon.
          </p>

          {/* Summary cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Accounts Card */}
            <Link href="/dashboard/accounts">
              <div className="border border-gray-200 dark:border-slate-700 rounded-lg p-6 hover:border-blue-300 dark:hover:border-blue-600 transition-colors cursor-pointer bg-white dark:bg-slate-800 min-h-[200px] flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                    <Wallet className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  {accountCount > 0 && (
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                      {accountCount}
                    </span>
                  )}
                </div>

                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Accounts</h3>

                {accountCount > 0 ? (
                  <>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Total Balance
                    </p>
                    <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                      {formatCurrency(totalBalance, currency)}
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Add your bank accounts</p>
                    <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">Click to add →</p>
                  </>
                )}
              </div>
            </Link>

            {/* Income Card */}
            <Link href="/dashboard/income">
              <div className="border border-gray-200 dark:border-slate-700 rounded-lg p-6 hover:border-green-300 dark:hover:border-green-600 transition-colors cursor-pointer bg-white dark:bg-slate-800 min-h-[200px] flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  {incomeCount > 0 && (
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                      {incomeCount}
                    </span>
                  )}
                </div>

                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Income</h3>

                {incomeCount > 0 ? (
                  <>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Est. Monthly Income
                    </p>
                    <p className="text-xl font-bold text-green-600 dark:text-green-400">
                      {formatCurrency(monthlyIncome, currency)}
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Track income sources</p>
                    <p className="text-xs text-green-600 dark:text-green-400 mt-2">Click to add →</p>
                  </>
                )}
              </div>
            </Link>

            {/* Bills Card */}
            <Link href="/dashboard/bills">
              <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-6 hover:border-blue-300 dark:hover:border-blue-600 transition-colors cursor-pointer bg-white dark:bg-slate-800 min-h-[200px] flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                    <Receipt className="w-6 h-6 text-red-600 dark:text-red-400" />
                  </div>
                </div>

                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Bills</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Coming soon</p>
              </div>
            </Link>
          </div>
        </div>
  );
}

