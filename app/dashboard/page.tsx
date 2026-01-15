import { requireAuth } from '@/lib/auth/session';
import { createClient } from '@/lib/supabase/server';
import { SuccessMessage } from '@/components/ui/success-message';
import Link from 'next/link';
import { Calendar, Receipt, CheckCircle2, Lightbulb, Upload } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/format';
import generateCalendar from '@/lib/calendar/generate';
import { formatDate } from '@/lib/utils';
import { getInvoiceSummary } from '@/lib/actions/invoices';
import { getForecastDaysLimit } from '@/lib/stripe/subscription';
import { differenceInCalendarDays, startOfDay, format } from 'date-fns';
import { ScenarioButton } from '@/components/scenarios/scenario-button';
import { TaxSavingsWidget } from '@/components/dashboard/tax-savings-widget';
import { getQuarterForDate } from '@/lib/tax/calculations';

interface DashboardPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const user = await requireAuth(); // Redirects to /auth/login if not authenticated
  const message = searchParams.message;
  const supabase = await createClient();

  // Fetch accounts, income, bills, and user settings in parallel
  const [accountsResult, incomeResult, billsResult, settingsResult, invoiceSummaryResult, forecastDays] = await Promise.all([
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
      .select('safety_buffer, timezone, tax_rate, tax_tracking_enabled, estimated_tax_q1_paid, estimated_tax_q2_paid, estimated_tax_q3_paid, estimated_tax_q4_paid')
      .eq('user_id', user.id)
      .single(),
    getInvoiceSummary(),
    getForecastDaysLimit(user.id),
  ]);

  const accounts = (accountsResult.data || []) as any;
  const incomes = (incomeResult.data || []) as any;
  const bills = (billsResult.data || []) as any;
  const invoiceSummary = invoiceSummaryResult;

  // Extract settings with type assertion
  const settingsData = settingsResult.data as any;

  // Extract safety buffer with fallback to default
  const safetyBuffer = settingsData?.safety_buffer ?? 500;
  const timezone = settingsData?.timezone ?? null;

  // Extract tax settings
  const taxRate = settingsData?.tax_rate ?? 25.00;
  const taxTrackingEnabled = settingsData?.tax_tracking_enabled ?? false;
  const estimatedTaxQ1Paid = settingsData?.estimated_tax_q1_paid ?? 0;
  const estimatedTaxQ2Paid = settingsData?.estimated_tax_q2_paid ?? 0;
  const estimatedTaxQ3Paid = settingsData?.estimated_tax_q3_paid ?? 0;
  const estimatedTaxQ4Paid = settingsData?.estimated_tax_q4_paid ?? 0;

  // Calculate totals
  const totalBalance = accounts.reduce((sum: number, acc: any) => sum + (acc.current_balance || 0), 0);
  const accountCount = accounts.length;
  // Use the first account's currency, or default to USD
  const currency = accounts[0]?.currency || 'USD';

  // Generate calendar data if user has accounts
  let calendarData = null;
  if (accounts.length > 0) {
    try {
      calendarData = generateCalendar(accounts, incomes, bills, safetyBuffer, timezone ?? undefined, forecastDays);
    } catch (error) {
      console.error('Error generating calendar:', error);
    }
  }

  // (Removed) Low balance warning card — now covered by the dynamic subtitle + forecast card.

  // Calculate monthly income equivalent
  const calculateMonthlyIncome = (incomes: any[]) => {
    if (!incomes) return 0;

    return incomes.reduce((total: number, income: any) => {
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
  const incomeCount = incomes.filter((i: any) => i.is_active !== false).length;

  // Calculate monthly bills equivalent
  const calculateMonthlyBills = (bills: any[]) => {
    if (!bills) return 0;

    return bills.reduce((total: number, bill: any) => {
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
  const activeBillsCount = bills.filter((b: any) => b.is_active).length;

  // Calculate quarterly income for tax tracking
  const calculateQuarterlyIncome = (incomes: any[]): [number, number, number, number] => {
    const currentYear = new Date().getFullYear();
    const quarterTotals: number[] = [0, 0, 0, 0];

    incomes.forEach((income: any) => {
      if (income.is_active === false) return;

      const incomeDate = income.date ? new Date(income.date) : null;

      // For one-time income with a date in current year
      if (income.frequency === 'one-time' && incomeDate && incomeDate.getFullYear() === currentYear) {
        const quarter = getQuarterForDate(incomeDate) - 1;
        quarterTotals[quarter] += income.amount;
      }
      // For recurring income, distribute across all quarters
      else if (income.frequency !== 'one-time' && income.frequency !== 'irregular') {
        const monthlyAmount = (() => {
          switch (income.frequency) {
            case 'weekly': return (income.amount * 52) / 12;
            case 'biweekly': return (income.amount * 26) / 12;
            case 'monthly': return income.amount;
            default: return 0;
          }
        })();
        // Distribute monthly income across all quarters (3 months per quarter)
        const quarterlyAmount = monthlyAmount * 3;
        quarterTotals[0] += quarterlyAmount;
        quarterTotals[1] += quarterlyAmount;
        quarterTotals[2] += quarterlyAmount;
        quarterTotals[3] += quarterlyAmount;
      }
    });

    return quarterTotals as [number, number, number, number];
  };

  const quarterlyIncome = calculateQuarterlyIncome(incomes);
  const totalYearIncome = quarterlyIncome.reduce((sum, q) => sum + q, 0);
  const quarterlyPaid: [number, number, number, number] = [
    estimatedTaxQ1Paid,
    estimatedTaxQ2Paid,
    estimatedTaxQ3Paid,
    estimatedTaxQ4Paid,
  ];

  // Forecast status (for dynamic dashboard subtitle)
  const forecastStatus = (() => {
    if (!calendarData) return null;

    const days = calendarData.days ?? [];
    const negativeDays = days.filter((d) => d.balance < 0);
    const lowBalanceDays = days.filter((d) => d.balance >= 0 && d.balance < safetyBuffer);

    return {
      negativeCount: negativeDays.length,
      lowBalanceCount: lowBalanceDays.length,
      firstNegativeDate: negativeDays[0]?.date ?? null,
    };
  })();

  // Daily Spending Budget until next income
  const dailyBudgetData = (() => {
    if (!calendarData) return null;

    const today = startOfDay(new Date());

    const nextIncome = calendarData.days
      .map((day) => ({
        day,
        daysFromNow: differenceInCalendarDays(startOfDay(day.date), today),
      }))
      .filter((x) => x.daysFromNow >= 0)
      .filter((x) => (x.day.income?.length ?? 0) > 0)
      .sort((a, b) => a.daysFromNow - b.daysFromNow)[0];

    if (!nextIncome) return null;

    const nextIncomeDate = nextIncome.day.date;
    const daysUntilIncome = nextIncome.daysFromNow;

    // Bills due between now and the income date (excluding the income day itself)
    const billsDueUntilIncome = calendarData.days
      .map((day) => ({
        day,
        daysFromNow: differenceInCalendarDays(startOfDay(day.date), today),
        daysFromIncome: differenceInCalendarDays(startOfDay(day.date), startOfDay(nextIncomeDate)),
      }))
      .filter((x) => x.daysFromNow >= 0)
      .filter((x) => x.daysFromIncome < 0)
      .reduce((sum, x) => sum + (x.day.bills ?? []).reduce((s, b) => s + (b.amount ?? 0), 0), 0);

    const remainingAfterBills = totalBalance - billsDueUntilIncome;
    const divisorDays = Math.max(1, daysUntilIncome);
    const dailyBudget = remainingAfterBills / divisorDays;

    return {
      nextIncomeDate,
      daysUntilIncome,
      billsDueUntilIncome,
      remainingAfterBills,
      dailyBudget,
    };
  })();

  const dailyBudgetColorClass = (() => {
    if (!dailyBudgetData) return 'text-zinc-900';
    if (dailyBudgetData.dailyBudget >= 50) return 'text-teal-500';
    if (dailyBudgetData.dailyBudget >= 20) return 'text-amber-500';
    return 'text-rose-500';
  })();

  const formatCurrencyNoCents = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // "Get Back on Track" guidance card (only when forecast goes negative)
  const pathForwardData = (() => {
    if (!calendarData) return null;

    const today = startOfDay(new Date());

    const firstNegative = calendarData.days
      .map((day) => ({
        day,
        daysFromNow: differenceInCalendarDays(startOfDay(day.date), today),
      }))
      .filter((x) => x.daysFromNow >= 0)
      .filter((x) => x.day.balance < 0)
      .sort((a, b) => a.daysFromNow - b.daysFromNow)[0];

    if (!firstNegative) return null;

    const problemDate = firstNegative.day.date;
    const daysUntil = firstNegative.daysFromNow;
    const deficit = Math.abs(firstNegative.day.balance);
    const divisorDays = Math.max(1, daysUntil);
    const dailyReduction = deficit / divisorDays;

    return {
      problemDate,
      daysUntil,
      deficit,
      dailyReduction,
    };
  })();

  // Helper function to get balance color based on status
  const getBalanceColor = (balance: number, buffer: number) => {
    if (balance >= buffer * 2) return 'text-green-600 dark:text-green-400';
    if (balance >= buffer * 1.5) return 'text-yellow-600 dark:text-yellow-400';
    if (balance >= buffer) return 'text-orange-600 dark:text-orange-400';
    return 'text-red-600 dark:text-red-400';
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-4 sm:p-6 border border-slate-200 dark:border-slate-700">
          {/* Success Message */}
          {message === 'password-updated' && (
            <div className="mb-6">
              <SuccessMessage message="Password updated successfully" />
            </div>
          )}

          <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">
            Welcome to Cash Flow Forecaster!
          </h2>
          <div className="mb-6">
            <p
              className={[
                'text-sm font-medium',
                forecastStatus?.negativeCount
                  ? 'text-rose-500'
                  : forecastStatus?.lowBalanceCount
                    ? 'text-amber-500'
                    : forecastStatus
                      ? 'text-teal-500'
                      : 'text-gray-600 dark:text-gray-400',
              ].join(' ')}
            >
              {forecastStatus?.negativeCount ? (
                <>
                  You may overdraft on {forecastStatus.firstNegativeDate ? formatDate(forecastStatus.firstNegativeDate) : 'a future day'}
                  . Let&apos;s fix that.
                </>
              ) : forecastStatus?.lowBalanceCount ? (
                <>Heads up — {forecastStatus.lowBalanceCount} low-balance day{forecastStatus.lowBalanceCount === 1 ? '' : 's'} in the next {forecastDays} days.</>
              ) : forecastStatus ? (
                <>✓ You&apos;re in the green for the next {forecastDays} days.</>
              ) : (
                <>Your {forecastDays}-day cash flow calendar will appear here soon.</>
              )}
            </p>
            <Link href="/dashboard/calendar" className="text-teal-500 text-sm hover:underline">
              View full calendar →
            </Link>
          </div>

          {/* Path Forward (first negative day in forecast) */}
          {pathForwardData && (
            <div className="mb-6">
              <div className="bg-teal-500/10 border border-teal-500/30 rounded-lg p-4 sm:p-5">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <Lightbulb className="w-5 h-5 text-teal-600 dark:text-teal-300" />
                      <span className="font-semibold text-slate-900 dark:text-zinc-100">
                        Your Path Forward
                      </span>
                    </div>

                    <p className="text-sm text-slate-700 dark:text-zinc-200 mt-2">
                      To stay in the green by {format(pathForwardData.problemDate, 'MMM d')}, you could:
                    </p>

                    <div className="mt-3 space-y-2 text-sm">
                      <p className="text-slate-800 dark:text-zinc-100">
                        •{' '}
                        <span className="font-semibold text-teal-700 dark:text-teal-200">
                          Bring in {formatCurrencyNoCents(Math.ceil(pathForwardData.deficit), currency)}
                        </span>{' '}
                        before then
                      </p>
                      <div className="flex items-center gap-3">
                        <div className="h-px flex-1 bg-teal-500/20" />
                        <span className="text-xs uppercase tracking-wide text-teal-700/80 dark:text-teal-200/80">
                          or
                        </span>
                        <div className="h-px flex-1 bg-teal-500/20" />
                      </div>
                      <p className="text-slate-800 dark:text-zinc-100">
                        •{' '}
                        <span className="font-semibold text-teal-700 dark:text-teal-200">
                          {pathForwardData.daysUntil <= 1
                            ? `Cut ${formatCurrencyNoCents(Math.ceil(pathForwardData.deficit), currency)}`
                            : `Cut ${formatCurrencyNoCents(Math.ceil(pathForwardData.dailyReduction), currency)}/day`}
                        </span>{' '}
                        {pathForwardData.daysUntil === 0
                          ? 'from spending today'
                          : pathForwardData.daysUntil === 1
                            ? `from spending tomorrow`
                            : 'from spending'}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-start sm:items-end gap-2 flex-shrink-0">
                    <ScenarioButton variant="nav" source="dashboard" label="Test a Scenario →" />
                    <p className="hidden sm:block text-xs text-slate-600 dark:text-zinc-300 max-w-[200px] text-right">
                      Try a “what if” purchase and see the impact.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Quick Stats (responsive 2x2 on mobile/tablet, 4 across on desktop) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6">
            {/* Daily Budget / Shortfall */}
            <Link href="/dashboard/calendar" className="h-full">
              <div className="border border-zinc-200 bg-white rounded-lg p-4 sm:p-6 cursor-pointer h-full hover:bg-zinc-50 transition-colors">
                <p className="text-sm font-medium text-zinc-500 uppercase tracking-wide">
                  {dailyBudgetData && dailyBudgetData.dailyBudget < 0 ? 'Daily Shortfall' : 'Daily Budget'}
                </p>
                <div className="mt-2">
                  <p className={`text-2xl sm:text-3xl font-semibold tabular-nums tracking-tight ${dailyBudgetColorClass}`}>
                    {dailyBudgetData
                      ? dailyBudgetData.dailyBudget < 0
                        ? `${formatCurrencyNoCents(Math.ceil(Math.abs(dailyBudgetData.dailyBudget)), currency)}/day short`
                        : `${formatCurrencyNoCents(Math.floor(dailyBudgetData.dailyBudget), currency)}/day`
                      : '—'}
                  </p>
                  <p className="text-xs sm:text-sm text-zinc-500 mt-1">
                    {dailyBudgetData
                      ? dailyBudgetData.dailyBudget < 0
                        ? `Need extra income before ${format(dailyBudgetData.nextIncomeDate, 'MMM d')}`
                        : dailyBudgetData.daysUntilIncome === 0
                          ? `until income today`
                          : `until ${format(dailyBudgetData.nextIncomeDate, 'MMM d')} (${dailyBudgetData.daysUntilIncome}d)`
                      : 'Add income to calculate'}
                  </p>
                </div>
              </div>
            </Link>

            {/* Accounts Card */}
            <Link href="/dashboard/accounts" className="h-full">
              <div className="border border-zinc-200 bg-white rounded-lg p-4 sm:p-6 cursor-pointer h-full hover:bg-zinc-50 transition-colors">
                <p className="text-sm font-medium text-zinc-500 uppercase tracking-wide">Accounts</p>
                <div className="mt-2">
                  <p className="text-2xl sm:text-3xl font-semibold tabular-nums tracking-tight text-zinc-900">
                    {formatCurrency(totalBalance, currency)}
                  </p>
                  <p className="text-xs sm:text-sm text-zinc-500 mt-1">
                    {accountCount > 0
                      ? `Across ${accountCount} ${accountCount === 1 ? 'account' : 'accounts'}`
                      : 'Add your bank accounts'}
                  </p>
                </div>
              </div>
            </Link>

            {/* Income Card */}
            <Link href="/dashboard/income" className="h-full">
              <div className="border border-zinc-200 bg-white rounded-lg p-4 sm:p-6 cursor-pointer h-full hover:bg-zinc-50 transition-colors">
                <p className="text-sm font-medium text-zinc-500 uppercase tracking-wide">Income</p>
                <div className="mt-2">
                  <p className="text-2xl sm:text-3xl font-semibold tabular-nums tracking-tight text-emerald-600">
                    {formatCurrency(monthlyIncome, currency)}
                  </p>
                  <p className="text-xs sm:text-sm text-zinc-500 mt-1">
                    {incomeCount > 0
                      ? `From ${incomeCount} ${incomeCount === 1 ? 'source' : 'sources'}`
                      : 'Track income sources'}
                  </p>
                </div>
              </div>
            </Link>

            {/* Bills Card */}
            <Link href="/dashboard/bills" className="h-full">
              <div className="border border-zinc-200 bg-white rounded-lg p-4 sm:p-6 cursor-pointer h-full hover:bg-zinc-50 transition-colors">
                <p className="text-sm font-medium text-zinc-500 uppercase tracking-wide">Bills</p>
                <div className="mt-2">
                  <p className="text-2xl sm:text-3xl font-semibold tabular-nums tracking-tight text-rose-600">
                    {formatCurrency(monthlyBills, currency)}
                  </p>
                  <p className="text-xs sm:text-sm text-zinc-500 mt-1">
                    {activeBillsCount > 0
                      ? `${activeBillsCount} ${activeBillsCount === 1 ? 'active bill' : 'active bills'}`
                      : 'Track your bills'}
                  </p>
                </div>
              </div>
            </Link>
          </div>

          {/* Import Transactions (secondary CTA) */}
          <div className="mb-6">
            <Link href="/dashboard/import" className="block">
              <div className="border border-zinc-200 bg-white rounded-lg p-5 hover:bg-zinc-50 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-zinc-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Upload className="w-5 h-5 text-zinc-700" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-zinc-900">Import Transactions</p>
                    <p className="text-sm text-zinc-600 mt-1">
                      Upload a bank CSV to quickly add bills and income
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* Calendar card (kept separate from the 3 summary cards grid) */}
          {calendarData && (
            <div className="mb-6">
              <Link href="/dashboard/calendar">
                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-5 hover:shadow-sm hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200 cursor-pointer flex flex-col h-full">
                  <div className="flex justify-between items-start mb-3">
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
                    {forecastDays}-Day Forecast
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
          <div className="my-6">
            <ScenarioButton variant="card" source="dashboard" className="p-4 sm:p-6" />
          </div>

          {/* Outstanding invoices */}
          <div className={invoiceSummary.unpaidCount === 0 ? 'hidden sm:block mb-6' : 'mb-6'}>
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

          {/* Tax Savings Tracker Widget */}
          <div className="mb-6">
            <TaxSavingsWidget
              totalIncome={totalYearIncome}
              taxRate={taxRate}
              quarterlyIncome={quarterlyIncome}
              quarterlyPaid={quarterlyPaid}
              enabled={taxTrackingEnabled}
            />
          </div>
        </div>
  );
}

