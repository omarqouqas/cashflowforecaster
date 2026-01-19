import { requireAuth } from '@/lib/auth/session';
import { createClient } from '@/lib/supabase/server';
import { SuccessMessage } from '@/components/ui/success-message';
import Link from 'next/link';
import { Calendar, Receipt, CheckCircle2, Lightbulb, Upload, Wallet, TrendingUp, FileText, DollarSign, Plus } from 'lucide-react';
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
  const [accountsResult, incomeResult, billsResult, settingsResult, invoiceSummaryResult, topInvoicesResult, forecastDays] = await Promise.all([
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
    supabase
      .from('invoices')
      .select('id, invoice_number, client_name, amount, due_date, status')
      .eq('user_id', user.id)
      .or('status.is.null,status.neq.paid')
      .order('due_date', { ascending: true })
      .limit(3),
    getForecastDaysLimit(user.id),
  ]);

  const accounts = (accountsResult.data || []) as any;
  const incomes = (incomeResult.data || []) as any;
  const bills = (billsResult.data || []) as any;
  const invoiceSummary = invoiceSummaryResult;
  const topInvoices = (topInvoicesResult.data || []) as any;

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
        quarterTotals[quarter]! += income.amount;
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
        quarterTotals[0]! += quarterlyAmount;
        quarterTotals[1]! += quarterlyAmount;
        quarterTotals[2]! += quarterlyAmount;
        quarterTotals[3]! += quarterlyAmount;
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
    if (!dailyBudgetData) return 'text-zinc-100';
    if (dailyBudgetData.dailyBudget >= 50) return 'text-teal-400';
    if (dailyBudgetData.dailyBudget >= 20) return 'text-amber-400';
    return 'text-rose-400';
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
    <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-4 sm:p-6">
          {/* Success Message */}
          {message === 'password-updated' && (
            <div className="mb-6">
              <SuccessMessage message="Password updated successfully" />
            </div>
          )}

          <h2 className="text-2xl font-bold mb-6 text-zinc-100">
            Welcome to Cash Flow Forecaster!
          </h2>

          {/* Critical Warning Banner - Overdraft Alert */}
          {forecastStatus?.negativeCount ? (
            <div className="mb-6">
              <div className="border border-rose-500/30 bg-rose-500/10 rounded-lg p-5">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-rose-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-base font-semibold text-rose-300">
                      You may overdraft on {forecastStatus.firstNegativeDate ? formatDate(forecastStatus.firstNegativeDate) : 'a future day'}
                    </p>
                    <p className="text-sm text-rose-400 mt-1">
                      Let&apos;s fix that — check your forecast and adjust spending or income.
                    </p>
                    <Link href="/dashboard/calendar" className="inline-flex items-center text-sm font-medium text-rose-300 hover:text-rose-200 transition-colors mt-2">
                      View full calendar →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ) : forecastStatus?.lowBalanceCount ? (
            <div className="mb-6">
              <div className="border border-amber-500/30 bg-amber-500/10 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-amber-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-amber-300">
                      Heads up — {forecastStatus.lowBalanceCount} low-balance day{forecastStatus.lowBalanceCount === 1 ? '' : 's'} in the next {forecastDays} days
                    </p>
                    <Link href="/dashboard/calendar" className="inline-flex items-center text-sm text-amber-400 hover:text-amber-300 transition-colors mt-1">
                      View calendar →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ) : forecastStatus ? (
            <div className="mb-6">
              <div className="border border-teal-500/30 bg-teal-500/10 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-teal-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-teal-300">
                      ✓ You&apos;re in the green for the next {forecastDays} days
                    </p>
                    <Link href="/dashboard/calendar" className="inline-flex items-center text-sm text-teal-400 hover:text-teal-300 transition-colors mt-1">
                      View calendar →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {/* Path Forward (first negative day in forecast) */}
          {pathForwardData && (
            <div className="mb-6">
              <div className="bg-teal-500/10 border border-teal-500/30 rounded-lg p-5 sm:p-6">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 bg-teal-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <Lightbulb className="w-5 h-5 text-teal-400" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-lg font-semibold text-zinc-100">
                      Your Path Forward
                    </h3>
                    <p className="text-sm text-zinc-300 mt-1">
                      To stay in the green by {format(pathForwardData.problemDate, 'MMM d')}, you could:
                    </p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-3 mb-5">
                  {/* Option 1: Add Income */}
                  <div className="border border-teal-500/20 bg-teal-500/5 rounded-lg p-4">
                    <div className="flex items-start gap-2">
                      <div className="w-6 h-6 bg-teal-500/20 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-teal-300">1</span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-zinc-200">Add Income</p>
                        <p className="text-sm text-teal-300 font-semibold mt-1">
                          {formatCurrencyNoCents(Math.ceil(pathForwardData.deficit), currency)}
                        </p>
                        <p className="text-xs text-zinc-400 mt-0.5">before {format(pathForwardData.problemDate, 'MMM d')}</p>
                      </div>
                    </div>
                  </div>

                  {/* Option 2: Cut Spending */}
                  <div className="border border-teal-500/20 bg-teal-500/5 rounded-lg p-4">
                    <div className="flex items-start gap-2">
                      <div className="w-6 h-6 bg-teal-500/20 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-teal-300">2</span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-zinc-200">Cut Spending</p>
                        <p className="text-sm text-teal-300 font-semibold mt-1">
                          {pathForwardData.daysUntil <= 1
                            ? `${formatCurrencyNoCents(Math.ceil(pathForwardData.deficit), currency)}`
                            : `${formatCurrencyNoCents(Math.ceil(pathForwardData.dailyReduction), currency)}/day`}
                        </p>
                        <p className="text-xs text-zinc-400 mt-0.5">
                          {pathForwardData.daysUntil === 0
                            ? 'from today'
                            : pathForwardData.daysUntil === 1
                              ? 'for tomorrow'
                              : `for ${pathForwardData.daysUntil} days`}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    href="/dashboard/calendar"
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-md transition-colors"
                  >
                    <Calendar className="w-4 h-4" />
                    View Full Forecast
                  </Link>
                  <ScenarioButton variant="nav" source="dashboard" label="Test a Scenario" />
                </div>
              </div>
            </div>
          )}

          {/* Quick Stats (responsive 2x2 on mobile/tablet, 4 across on desktop) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            {/* Daily Budget / Shortfall */}
            <div className="flex flex-col gap-2 h-full">
              <Link href="/dashboard/calendar" className="flex-1">
                <div className="border border-zinc-800 bg-zinc-800 rounded-lg p-4 sm:p-5 cursor-pointer h-full hover:bg-zinc-700/60 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-medium text-zinc-400 uppercase tracking-wide">
                      {dailyBudgetData && dailyBudgetData.dailyBudget < 0 ? 'Daily Shortfall' : 'Daily Budget'}
                    </p>
                    <div className="w-8 h-8 bg-zinc-700/50 rounded-lg flex items-center justify-center">
                      <DollarSign className="w-4 h-4 text-zinc-400" />
                    </div>
                  </div>
                  <div>
                    <p className={`text-2xl sm:text-3xl font-semibold tabular-nums tracking-tight ${dailyBudgetColorClass}`}>
                      {dailyBudgetData
                        ? dailyBudgetData.dailyBudget < 0
                          ? `${formatCurrencyNoCents(Math.ceil(Math.abs(dailyBudgetData.dailyBudget)), currency)}/day short`
                          : `${formatCurrencyNoCents(Math.floor(dailyBudgetData.dailyBudget), currency)}/day`
                        : '—'}
                    </p>
                    <p className="text-xs sm:text-sm text-zinc-400 mt-1">
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
              <Link
                href="/dashboard/calendar"
                className="flex items-center justify-center gap-1.5 px-3 py-2 bg-zinc-700/50 hover:bg-zinc-700 border border-zinc-700 hover:border-teal-500/30 rounded text-xs font-medium text-zinc-300 hover:text-teal-400 transition-colors"
              >
                <Calendar className="w-3.5 h-3.5" />
                View Calendar
              </Link>
            </div>

            {/* Accounts Card */}
            <div className="flex flex-col gap-2 h-full">
              <Link href="/dashboard/accounts" className="flex-1">
                <div className="border border-zinc-800 bg-zinc-800 rounded-lg p-4 sm:p-5 cursor-pointer h-full hover:bg-zinc-700/60 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-medium text-zinc-400 uppercase tracking-wide">Accounts</p>
                    <div className="w-8 h-8 bg-zinc-700/50 rounded-lg flex items-center justify-center">
                      <Wallet className="w-4 h-4 text-zinc-400" />
                    </div>
                  </div>
                  <div>
                    <p className="text-2xl sm:text-3xl font-semibold tabular-nums tracking-tight text-zinc-100">
                      {formatCurrency(totalBalance, currency)}
                    </p>
                    <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                      {accountCount > 0
                        ? `Across ${accountCount} ${accountCount === 1 ? 'account' : 'accounts'}`
                        : 'Add your bank accounts'}
                    </p>
                  </div>
                </div>
              </Link>
              <Link
                href="/dashboard/accounts/new"
                className="flex items-center justify-center gap-1.5 px-3 py-2 bg-zinc-700/50 hover:bg-zinc-700 border border-zinc-700 hover:border-teal-500/30 rounded text-xs font-medium text-zinc-300 hover:text-teal-400 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Account
              </Link>
            </div>

            {/* Income Card */}
            <div className="flex flex-col gap-2 h-full">
              <Link href="/dashboard/income" className="flex-1">
                <div className="border border-zinc-800 bg-zinc-800 rounded-lg p-4 sm:p-5 cursor-pointer h-full hover:bg-zinc-700/60 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-medium text-zinc-400 uppercase tracking-wide">Income</p>
                    <div className="w-8 h-8 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-emerald-400" />
                    </div>
                  </div>
                  <div>
                    <p className="text-2xl sm:text-3xl font-semibold tabular-nums tracking-tight text-emerald-400">
                      {formatCurrency(monthlyIncome, currency)}
                    </p>
                    <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                      {incomeCount > 0
                        ? `From ${incomeCount} ${incomeCount === 1 ? 'source' : 'sources'}`
                        : 'Track income sources'}
                    </p>
                  </div>
                </div>
              </Link>
              <Link
                href="/dashboard/income/new"
                className="flex items-center justify-center gap-1.5 px-3 py-2 bg-zinc-700/50 hover:bg-zinc-700 border border-zinc-700 hover:border-teal-500/30 rounded text-xs font-medium text-zinc-300 hover:text-teal-400 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Income
              </Link>
            </div>

            {/* Bills Card */}
            <div className="flex flex-col gap-2 h-full">
              <Link href="/dashboard/bills" className="flex-1">
                <div className="border border-zinc-800 bg-zinc-800 rounded-lg p-4 sm:p-5 cursor-pointer h-full hover:bg-zinc-700/60 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-medium text-zinc-400 uppercase tracking-wide">Bills</p>
                    <div className="w-8 h-8 bg-rose-500/10 rounded-lg flex items-center justify-center">
                      <FileText className="w-4 h-4 text-rose-400" />
                    </div>
                  </div>
                  <div>
                    <p className="text-2xl sm:text-3xl font-semibold tabular-nums tracking-tight text-rose-400">
                      {formatCurrency(monthlyBills, currency)}
                    </p>
                    <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                      {activeBillsCount > 0
                        ? `${activeBillsCount} ${activeBillsCount === 1 ? 'active bill' : 'active bills'}`
                        : 'Track your bills'}
                    </p>
                  </div>
                </div>
              </Link>
              <Link
                href="/dashboard/bills/new"
                className="flex items-center justify-center gap-1.5 px-3 py-2 bg-zinc-700/50 hover:bg-zinc-700 border border-zinc-700 hover:border-teal-500/30 rounded text-xs font-medium text-zinc-300 hover:text-teal-400 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Bill
              </Link>
            </div>
          </div>

          {/* Import Transactions (secondary CTA) */}
          <div className="mb-6">
            <Link href="/dashboard/import" className="block">
              <div className="border border-zinc-800 bg-zinc-800 rounded-lg p-5 hover:bg-zinc-700/60 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-zinc-700 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Upload className="w-5 h-5 text-zinc-300" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-zinc-100">Import Transactions</p>
                    <p className="text-sm text-zinc-400 mt-1">
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
                <div className="bg-zinc-800 border border-zinc-800 rounded-lg p-6 hover:bg-zinc-700/60 hover:border-teal-500/30 transition-all duration-200 cursor-pointer">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-teal-500/10 rounded-lg flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-teal-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-zinc-100">
                          {forecastDays}-Day Forecast
                        </h3>
                        <p className="text-xs text-zinc-400 mt-0.5">
                          Your cash flow outlook
                        </p>
                      </div>
                    </div>
                    {calendarData.lowestBalance < safetyBuffer ? (
                      <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-300">
                        Warning
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300">
                        Healthy
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-4 py-4 border-t border-b border-zinc-700/50">
                    <div>
                      <p className="text-xs text-zinc-400 mb-1">Lowest Balance</p>
                      <p className={`text-xl sm:text-2xl font-bold ${getBalanceColor(calendarData.lowestBalance, safetyBuffer).replace('dark:', '').replace('text-green-400', 'text-emerald-400').replace('text-yellow-400', 'text-amber-400').replace('text-orange-400', 'text-orange-400').replace('text-red-400', 'text-rose-400')}`}>
                        {formatCurrency(calendarData.lowestBalance, currency)}
                      </p>
                      <p className="text-xs text-zinc-400 mt-1">
                        on {format(calendarData.lowestBalanceDay, 'MMM d')}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-zinc-400 mb-1">Total Income</p>
                      <p className="text-xl sm:text-2xl font-bold text-emerald-400">
                        {formatCurrency(
                          calendarData.days.reduce((sum, day) =>
                            sum + (day.income?.reduce((s, i) => s + (i.amount || 0), 0) || 0), 0
                          ),
                          currency
                        )}
                      </p>
                      <p className="text-xs text-zinc-400 mt-1">
                        {forecastDays} days
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-zinc-400 mb-1">Total Bills</p>
                      <p className="text-xl sm:text-2xl font-bold text-rose-400">
                        {formatCurrency(
                          calendarData.days.reduce((sum, day) =>
                            sum + (day.bills?.reduce((s, b) => s + (b.amount || 0), 0) || 0), 0
                          ),
                          currency
                        )}
                      </p>
                      <p className="text-xs text-zinc-400 mt-1">
                        {forecastDays} days
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-sm text-zinc-400">
                      Click to view day-by-day breakdown
                    </p>
                    <svg className="w-5 h-5 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
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
            <div className="border border-zinc-800 bg-zinc-800 rounded-lg p-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-teal-500/10 rounded-lg flex items-center justify-center">
                    <Receipt className="w-5 h-5 text-teal-400" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-zinc-100">Outstanding Invoices</h3>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      {invoiceSummary.unpaidCount === 0
                        ? 'All caught up'
                        : `${invoiceSummary.unpaidCount} unpaid invoice${invoiceSummary.unpaidCount === 1 ? '' : 's'}`}
                    </p>
                  </div>
                </div>
                {invoiceSummary.overdueCount > 0 && (
                  <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-300">
                    {invoiceSummary.overdueCount} Overdue
                  </span>
                )}
              </div>

              {invoiceSummary.unpaidCount === 0 ? (
                <div className="flex items-center gap-2 text-zinc-300 py-4 border-t border-zinc-700/50">
                  <CheckCircle2 className="w-5 h-5 text-teal-400" />
                  <p className="text-sm font-medium">No outstanding invoices</p>
                </div>
              ) : (
                <>
                  <div className="flex items-baseline justify-between py-3 border-t border-zinc-700/50 mb-4">
                    <p className="text-xs text-zinc-400">Total Outstanding</p>
                    <p className="text-2xl font-bold tabular-nums text-zinc-100">
                      {formatCurrency(invoiceSummary.totalOutstanding, currency)}
                    </p>
                  </div>

                  {topInvoices.length > 0 && (
                    <div className="space-y-2 mb-4">
                      {topInvoices.map((invoice: any) => {
                        const today = new Date();
                        const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
                        const dueDate = new Date(`${invoice.due_date}T00:00:00`);
                        const isOverdue = dueDate < todayMidnight;

                        return (
                          <Link
                            key={invoice.id}
                            href={`/dashboard/invoices/${invoice.id}`}
                            className="flex items-center justify-between p-3 bg-zinc-900 rounded-md hover:bg-zinc-700/60 transition-colors border border-zinc-800 hover:border-teal-500/30"
                          >
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium text-zinc-100 truncate">
                                {invoice.client_name}
                              </p>
                              <p className="text-xs text-zinc-400 mt-0.5">
                                {invoice.invoice_number || 'No number'} • Due {format(dueDate, 'MMM d')}
                                {isOverdue && <span className="text-rose-400 ml-1 font-medium">Overdue</span>}
                              </p>
                            </div>
                            <p className={`text-sm font-semibold tabular-nums ml-3 ${isOverdue ? 'text-rose-400' : 'text-zinc-100'}`}>
                              {formatCurrency(invoice.amount, currency)}
                            </p>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </>
              )}

              <Link
                href="/dashboard/invoices"
                className="inline-flex items-center text-sm font-medium text-teal-400 hover:text-teal-300 transition-colors"
              >
                View all invoices →
              </Link>
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

