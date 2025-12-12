import { requireAuth } from '@/lib/auth/session';
import { createClient } from '@/lib/supabase/server';
import { SuccessMessage } from '@/components/ui/success-message';
import Link from 'next/link';
import { Wallet, TrendingUp, Receipt, Calendar } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/format';
import generateCalendar from '@/lib/calendar/generate';
import { formatDate } from '@/lib/utils';

interface DashboardPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const user = await requireAuth(); // Redirects to /auth/login if not authenticated
  const message = searchParams.message;
  const supabase = await createClient();

  // Fetch accounts, income, bills, and user settings in parallel
  const [accountsResult, incomeResult, billsResult, settingsResult] = await Promise.all([
    supabase
      .from('accounts')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false }),
    supabase
      .from('income')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false }),
    supabase
      .from('bills')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false }),
    supabase
      .from('user_settings')
      .select('safety_buffer')
      .eq('user_id', user.id)
      .single(),
  ]);

  const accounts = accountsResult.data || [];
  const incomes = incomeResult.data || [];
  const bills = billsResult.data || [];

  // Extract safety buffer with fallback to default
  const safetyBuffer = settingsResult.data?.safety_buffer ?? 500;

  // Calculate totals
  const totalBalance = accounts.reduce((sum, acc) => sum + (acc.current_balance || 0), 0);
  const accountCount = accounts.length;
  // Use the first account's currency, or default to USD
  const currency = accounts[0]?.currency || 'USD';

  // Generate calendar data if user has accounts
  let calendarData = null;
  if (accounts.length > 0) {
    try {
      calendarData = generateCalendar(accounts, incomes, bills, safetyBuffer);
    } catch (error) {
      console.error('Error generating calendar:', error);
    }
  }

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

  const monthlyIncome = calculateMonthlyIncome(incomes);
  const incomeCount = incomes.filter(i => i.is_active).length;

  // Calculate monthly bills equivalent
  const calculateMonthlyBills = (bills: any[]) => {
    if (!bills) return 0;

    return bills.reduce((total, bill) => {
      if (!bill.is_active) return total;

      switch (bill.frequency) {
        case 'weekly': return total + (bill.amount * 52) / 12;
        case 'biweekly': return total + (bill.amount * 26) / 12;
        case 'monthly': return total + bill.amount;
        case 'quarterly': return total + bill.amount / 3;
        case 'annually': return total + bill.amount / 12;
        case 'one-time': return total;
        default: return total;
      }
    }, 0);
  };

  const monthlyBills = calculateMonthlyBills(bills);
  const activeBillsCount = bills.filter(b => b.is_active).length;

  // Helper function to get balance color based on status
  const getBalanceColor = (balance: number, buffer: number) => {
    if (balance >= buffer * 2) return 'text-green-600 dark:text-green-400';
    if (balance >= buffer * 1.5) return 'text-yellow-600 dark:text-yellow-400';
    if (balance >= buffer) return 'text-orange-600 dark:text-orange-400';
    return 'text-red-600 dark:text-red-400';
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 border border-slate-200 dark:border-slate-700">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Calendar Card */}
            {calendarData && (
              <Link href="/dashboard/calendar">
                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-6 hover:shadow-sm hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200 cursor-pointer flex flex-col h-full">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    {calendarData.lowestBalance < safetyBuffer ? (
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400">
                        Warning
                      </span>
                    ) : (
                      <span className="w-0 h-0"></span>
                    )}
                  </div>

                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    60-Day Forecast
                  </h3>

                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Lowest Balance
                  </p>
                  <p className={`text-3xl font-bold mb-2 ${getBalanceColor(calendarData.lowestBalance, safetyBuffer)}`}>
                    {formatCurrency(calendarData.lowestBalance, currency)}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Lowest on {formatDate(calendarData.lowestBalanceDay)}
                  </p>
                </div>
              </Link>
            )}

            {/* Accounts Card */}
            <Link href="/dashboard/accounts">
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-6 hover:shadow-sm hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200 cursor-pointer flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                    <Wallet className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  {accountCount > 0 ? (
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                      {accountCount}
                    </span>
                  ) : (
                    <span className="w-0 h-0"></span>
                  )}
                </div>

                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Accounts</h3>

                {accountCount > 0 ? (
                  <>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Current Balance
                    </p>
                    <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                      {formatCurrency(totalBalance, currency)}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Across {accountCount} {accountCount === 1 ? 'account' : 'accounts'}
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Add your bank accounts
                    </p>
                    <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                      $0
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Click to add →
                    </p>
                  </>
                )}
              </div>
            </Link>

            {/* Income Card */}
            <Link href="/dashboard/income">
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-6 hover:shadow-sm hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200 cursor-pointer flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  {incomeCount > 0 ? (
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                      {incomeCount}
                    </span>
                  ) : (
                    <span className="w-0 h-0"></span>
                  )}
                </div>

                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Income</h3>

                {incomeCount > 0 ? (
                  <>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Monthly Income
                    </p>
                    <p className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                      {formatCurrency(monthlyIncome, currency)}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      From {incomeCount} {incomeCount === 1 ? 'source' : 'sources'}
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Track income sources
                    </p>
                    <p className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                      $0
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Click to add →
                    </p>
                  </>
                )}
              </div>
            </Link>

            {/* Bills Card */}
            <Link href="/dashboard/bills">
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-6 hover:shadow-sm hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200 cursor-pointer flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                    <Receipt className="w-6 h-6 text-red-600 dark:text-red-400" />
                  </div>
                  {activeBillsCount > 0 ? (
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                      {activeBillsCount}
                    </span>
                  ) : (
                    <span className="w-0 h-0"></span>
                  )}
                </div>

                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Bills</h3>

                {activeBillsCount > 0 ? (
                  <>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Monthly Bills
                    </p>
                    <p className="text-3xl font-bold text-red-600 dark:text-red-400 mb-2">
                      {formatCurrency(monthlyBills, currency)}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {activeBillsCount} {activeBillsCount === 1 ? 'active bill' : 'active bills'}
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Track your bills
                    </p>
                    <p className="text-3xl font-bold text-red-600 dark:text-red-400 mb-2">
                      $0
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Click to add →
                    </p>
                  </>
                )}
              </div>
            </Link>
          </div>
        </div>
  );
}

