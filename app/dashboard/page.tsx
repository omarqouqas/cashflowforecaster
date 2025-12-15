import { requireAuth } from '@/lib/auth/session';
import { createClient } from '@/lib/supabase/server';
import { SuccessMessage } from '@/components/ui/success-message';
import Link from 'next/link';
import { Calendar, Receipt, CheckCircle2, AlertTriangle } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/format';
import generateCalendar from '@/lib/calendar/generate';
import { formatDate } from '@/lib/utils';
import { getInvoiceSummary } from '@/lib/actions/invoices';
import { differenceInCalendarDays, startOfDay } from 'date-fns';
import { LOW_BALANCE_THRESHOLD } from '@/lib/calendar/constants';
import { ScenarioButton } from '@/components/scenarios/scenario-button';

interface DashboardPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const user = await requireAuth(); // Redirects to /auth/login if not authenticated
  const message = searchParams.message;
  const supabase = await createClient();

  // Fetch accounts, income, bills, and user settings in parallel
  const [accountsResult, incomeResult, billsResult, settingsResult, invoiceSummaryResult] = await Promise.all([
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
      .select('safety_buffer, timezone')
      .eq('user_id', user.id)
      .single(),
    getInvoiceSummary(),
  ]);

  const accounts = accountsResult.data || [];
  const incomes = incomeResult.data || [];
  const bills = billsResult.data || [];
  const invoiceSummary = invoiceSummaryResult;

  // Extract safety buffer with fallback to default
  const safetyBuffer = settingsResult.data?.safety_buffer ?? 500;
  const timezone = settingsResult.data?.timezone ?? null;

  // Calculate totals
  const totalBalance = accounts.reduce((sum, acc) => sum + (acc.current_balance || 0), 0);
  const accountCount = accounts.length;
  // Use the first account's currency, or default to USD
  const currency = accounts[0]?.currency || 'USD';

  // Generate calendar data if user has accounts
  let calendarData = null;
  if (accounts.length > 0) {
    try {
      calendarData = generateCalendar(accounts, incomes, bills, safetyBuffer, timezone ?? undefined);
    } catch (error) {
      console.error('Error generating calendar:', error);
    }
  }

  const lowBalanceWarning = (() => {
    if (!calendarData) return null;

    const today = startOfDay(new Date());
    const upcoming = calendarData.days
      .map((day) => ({
        day,
        daysFromNow: differenceInCalendarDays(startOfDay(day.date), today),
      }))
      .filter((x) => x.daysFromNow >= 0 && x.daysFromNow < 14)
      .filter((x) => x.day.balance < LOW_BALANCE_THRESHOLD)
      .sort((a, b) => a.day.balance - b.day.balance)[0];

    if (!upcoming) return null;
    return { amount: upcoming.day.balance, date: upcoming.day.date };
  })();

  // Calculate monthly income equivalent
  const calculateMonthlyIncome = (incomes: any[]) => {
    if (!incomes) return 0;

    return incomes.reduce((total, income) => {
      // Treat NULL as active (legacy rows) – only exclude explicitly deactivated rows.
      if (income.is_active === false) return total;

      switch (income.frequency) {
        case 'weekly':
          return total + (income.amount * 52 / 12);
        case 'biweekly':
          return total + (income.amount * 26 / 12);
        case 'monthly':
          return total + income.amount;
        case 'one-time':
        case 'irregular':
          return total;
        default:
          return total;
      }
    }, 0);
  };

  const monthlyIncome = calculateMonthlyIncome(incomes);
  const incomeCount = incomes.filter((i) => i.is_active !== false).length;

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

          {/* Low balance warning (next 14 days) */}
          {lowBalanceWarning && (
            <div className="mb-6">
              <div className="bg-amber-500/10 border border-amber-500/50 rounded-lg p-4">
                <div className="flex items-center gap-2 text-amber-400">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="font-medium">Low balance warning</span>
                </div>
                <p className="text-slate-700 dark:text-zinc-300 text-sm mt-1">
                  Your balance may drop to {formatCurrency(lowBalanceWarning.amount, currency)} on{' '}
                  {formatDate(lowBalanceWarning.date)}
                </p>
                <Link href="/dashboard/calendar" className="text-teal-500 text-sm hover:underline">
                  View calendar →
                </Link>
              </div>
            </div>
          )}

          {/* Calendar card (kept separate from the 3 summary cards grid) */}
          {calendarData && (
            <div className="mb-6">
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
            </div>
          )}

          {/* "Can I Afford It?" scenario tester */}
          <div className="mb-6">
            <ScenarioButton variant="card" source="dashboard" />
          </div>

          {/* Outstanding invoices */}
          <div className="mb-6">
            <div className="border border-zinc-200 bg-white rounded-lg p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-zinc-500 uppercase tracking-wide">
                    Outstanding Invoices
                  </p>
                  {invoiceSummary.unpaidCount === 0 ? (
                    <div className="mt-2 flex items-center gap-2 text-zinc-600">
                      <CheckCircle2 className="w-5 h-5 text-teal-700" />
                      <p className="text-base font-medium">No outstanding invoices</p>
                    </div>
                  ) : (
                    <div className="mt-2">
                      <p className="text-3xl font-semibold tabular-nums tracking-tight text-zinc-900">
                        {formatCurrency(invoiceSummary.totalOutstanding, currency)}
                      </p>
                      <p className="text-sm text-zinc-500 mt-1">
                        {invoiceSummary.unpaidCount} unpaid invoice{invoiceSummary.unpaidCount === 1 ? '' : 's'}
                        {invoiceSummary.overdueCount > 0 && (
                          <span className="ml-2 text-rose-600 font-medium">
                            {invoiceSummary.overdueCount} overdue
                          </span>
                        )}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col items-end gap-3">
                  <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                    <Receipt className="w-6 h-6 text-teal-700" />
                  </div>
                  <Link
                    href="/dashboard/invoices"
                    className="text-sm font-medium text-teal-700 hover:text-teal-800"
                  >
                    View all →
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Summary cards (Minimalist Utility) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {/* Accounts Card */}
            <Link href="/dashboard/accounts">
              <div className="border border-zinc-200 bg-white rounded-lg p-6 cursor-pointer h-full hover:bg-zinc-50 transition-colors">
                <p className="text-sm font-medium text-zinc-500 uppercase tracking-wide">Accounts</p>
                <div className="mt-2">
                  <p className="text-3xl font-semibold tabular-nums tracking-tight text-zinc-900">
                    {formatCurrency(totalBalance, currency)}
                  </p>
                  <p className="text-sm text-zinc-500 mt-1">
                    {accountCount > 0
                      ? `Across ${accountCount} ${accountCount === 1 ? 'account' : 'accounts'}`
                      : 'Add your bank accounts'}
                  </p>
                </div>
              </div>
            </Link>

            {/* Income Card */}
            <Link href="/dashboard/income">
              <div className="border border-zinc-200 bg-white rounded-lg p-6 cursor-pointer h-full hover:bg-zinc-50 transition-colors">
                <p className="text-sm font-medium text-zinc-500 uppercase tracking-wide">Income</p>
                <div className="mt-2">
                  <p className="text-3xl font-semibold tabular-nums tracking-tight text-emerald-600">
                    {formatCurrency(monthlyIncome, currency)}
                  </p>
                  <p className="text-sm text-zinc-500 mt-1">
                    {incomeCount > 0
                      ? `From ${incomeCount} ${incomeCount === 1 ? 'source' : 'sources'}`
                      : 'Track income sources'}
                  </p>
                </div>
              </div>
            </Link>

            {/* Bills Card */}
            <Link href="/dashboard/bills">
              <div className="border border-zinc-200 bg-white rounded-lg p-6 cursor-pointer h-full hover:bg-zinc-50 transition-colors">
                <p className="text-sm font-medium text-zinc-500 uppercase tracking-wide">Bills</p>
                <div className="mt-2">
                  <p className="text-3xl font-semibold tabular-nums tracking-tight text-rose-600">
                    {formatCurrency(monthlyBills, currency)}
                  </p>
                  <p className="text-sm text-zinc-500 mt-1">
                    {activeBillsCount > 0
                      ? `${activeBillsCount} ${activeBillsCount === 1 ? 'active bill' : 'active bills'}`
                      : 'Track your bills'}
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>
  );
}

