'use client';

import * as React from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import {
  Calendar,
  Receipt,
  CheckCircle2,
  Upload,
  Wallet,
  TrendingUp,
  FileText,
  DollarSign,
  Plus,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils/format';
import { ForecastBalanceChart } from '@/components/charts/forecast-balance-chart';
import { SuccessMessage } from '@/components/ui/success-message';
import { ScenarioButton } from '@/components/scenarios/scenario-button';
import { TaxSavingsWidget } from '@/components/dashboard/tax-savings-widget';
import { EmergencyFundWidget } from '@/components/dashboard/emergency-fund-widget';
import {
  DashboardFilterBar,
  useDashboardFilters,
} from './dashboard-filters';
import type { CalendarDay } from '@/lib/calendar/types';
import { trackDashboardViewed } from '@/lib/posthog/events';

interface Account {
  id: string;
  name: string;
  account_type: string;
  current_balance: number;
  is_spendable?: boolean | null;
  currency?: string;
  updated_at?: string;
}

interface Invoice {
  id: string;
  invoice_number: string | null;
  client_name: string;
  amount: number;
  due_date: string;
  status: string | null;
}

interface InvoiceSummary {
  unpaidCount: number;
  overdueCount: number;
  totalOutstanding: number;
}

interface CalendarData {
  days: CalendarDay[];
  startingBalance: number;
  lowestBalance: number;
  lowestBalanceDay: Date;
  safeToSpend: number;
}

interface DashboardContentProps {
  accounts: Account[];
  calendarData: CalendarData | null;
  monthlyIncome: number;
  monthlyBills: number;
  incomeCount: number;
  activeBillsCount: number;
  safetyBuffer: number;
  invoiceSummary: InvoiceSummary;
  topInvoices: Invoice[];
  forecastDays: number;
  taxData: {
    totalYearIncome: number;
    taxRate: number;
    quarterlyIncome: [number, number, number, number];
    quarterlyPaid: [number, number, number, number];
    enabled: boolean;
  };
  emergencyFundData: {
    enabled: boolean;
    goalMonths: number;
    accountId: string | null;
    accountName?: string;
  };
  message?: string | string[];
  calendarError?: string | null;
}

/**
 * DashboardContent - Client component that wraps dashboard with filters
 *
 * Receives pre-fetched data from the server component and applies
 * client-side filtering based on forecast horizon and account selection.
 */
export function DashboardContent({
  accounts,
  calendarData,
  monthlyIncome,
  monthlyBills,
  incomeCount,
  activeBillsCount,
  safetyBuffer,
  invoiceSummary,
  topInvoices,
  forecastDays,
  taxData,
  emergencyFundData,
  message,
  calendarError,
}: DashboardContentProps) {
  const { filters, setFilters, visibleFilters, setVisibleFilters } = useDashboardFilters(undefined, forecastDays);
  const currency = accounts[0]?.currency || 'USD';
  const trackedRef = React.useRef(false);

  // Track dashboard view once on mount
  React.useEffect(() => {
    if (!trackedRef.current) {
      trackedRef.current = true;
      trackDashboardViewed({
        accountCount: accounts.length,
        totalBalance: accounts.reduce((sum, acc) => sum + (acc.current_balance || 0), 0),
        upcomingBillsCount: activeBillsCount,
        pendingIncomeCount: incomeCount,
      });
    }
  }, [accounts, activeBillsCount, incomeCount]);

  // Filter accounts based on selection
  const filteredAccounts = React.useMemo(() => {
    if (filters.selectedAccountIds.length === 0) {
      return accounts;
    }
    return accounts.filter((acc) => filters.selectedAccountIds.includes(acc.id));
  }, [accounts, filters.selectedAccountIds]);

  // Recalculate total balance based on filtered accounts
  const totalBalance = React.useMemo(() => {
    return filteredAccounts.reduce(
      (sum, acc) => sum + (acc.current_balance || 0),
      0
    );
  }, [filteredAccounts]);

  // Filter calendar days based on horizon
  const filteredCalendarDays = React.useMemo(() => {
    if (!calendarData) return null;
    const horizonDays = parseInt(filters.forecastHorizon, 10);
    return calendarData.days.slice(0, horizonDays);
  }, [calendarData, filters.forecastHorizon]);

  // Recalculate forecast metrics based on filtered days
  const forecastMetrics = React.useMemo(() => {
    if (!filteredCalendarDays || filteredCalendarDays.length === 0) {
      return null;
    }

    const negativeDays = filteredCalendarDays.filter((d) => d.balance < 0);
    const lowBalanceDays = filteredCalendarDays.filter(
      (d) => d.balance >= 0 && d.balance < safetyBuffer
    );
    const lowestBalance = Math.min(...filteredCalendarDays.map((d) => d.balance));
    const lowestBalanceDay =
      filteredCalendarDays.find((d) => d.balance === lowestBalance)?.date ??
      new Date();

    // Total income/bills in the filtered horizon
    const totalIncome = filteredCalendarDays.reduce(
      (sum, day) =>
        sum + (day.income?.reduce((s, i) => s + (i.amount || 0), 0) || 0),
      0
    );
    const totalBills = filteredCalendarDays.reduce(
      (sum, day) =>
        sum + (day.bills?.reduce((s, b) => s + (b.amount || 0), 0) || 0),
      0
    );

    return {
      negativeCount: negativeDays.length,
      lowBalanceCount: lowBalanceDays.length,
      firstNegativeDate: negativeDays[0]?.date ?? null,
      lowestBalance,
      lowestBalanceDay,
      totalIncome,
      totalBills,
    };
  }, [filteredCalendarDays, safetyBuffer]);

  // Daily budget calculation
  const dailyBudgetData = React.useMemo(() => {
    if (!filteredCalendarDays) return null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const nextIncome = filteredCalendarDays
      .map((day, index) => ({
        day,
        daysFromNow: index,
      }))
      .filter((x) => (x.day.income?.length ?? 0) > 0)
      .sort((a, b) => a.daysFromNow - b.daysFromNow)[0];

    if (!nextIncome) return null;

    const nextIncomeDate = nextIncome.day.date;
    const daysUntilIncome = nextIncome.daysFromNow;

    const billsDueUntilIncome = filteredCalendarDays
      .slice(0, daysUntilIncome)
      .reduce(
        (sum, day) =>
          sum + (day.bills ?? []).reduce((s, b) => s + (b.amount ?? 0), 0),
        0
      );

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
  }, [filteredCalendarDays, totalBalance]);

  const dailyBudgetColorClass = (() => {
    if (!dailyBudgetData) return 'text-zinc-100';
    if (dailyBudgetData.dailyBudget >= 50) return 'text-teal-400';
    if (dailyBudgetData.dailyBudget >= 20) return 'text-amber-400';
    return 'text-rose-400';
  })();

  const formatCurrencyNoCents = (amount: number, curr: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: curr,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getBalanceColor = (balance: number, buffer: number) => {
    if (balance >= buffer * 2) return 'text-emerald-400';
    if (balance >= buffer * 1.5) return 'text-amber-400';
    if (balance >= buffer) return 'text-orange-400';
    return 'text-rose-400';
  };

  const horizonDays = parseInt(filters.forecastHorizon, 10);

  // Format horizon period for display (e.g., 365 -> "12 months", 90 -> "90 days")
  const formatHorizonPeriod = (days: number): string => {
    if (days === 365) return '12 months';
    if (days === 90) return '3 months';
    return `${days} days`;
  };

  // Format horizon for titles (e.g., 365 -> "12-Month", 90 -> "90-Day")
  const formatHorizonTitle = (days: number): string => {
    if (days === 365) return '12-Month';
    if (days === 90) return '3-Month';
    return `${days}-Day`;
  };

  const horizonPeriod = formatHorizonPeriod(horizonDays);
  const horizonTitle = formatHorizonTitle(horizonDays);

  return (
    <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-4 sm:p-6">
      {/* Success Message */}
      {message === 'password-updated' && (
        <div className="mb-6">
          <SuccessMessage message="Password updated successfully" />
        </div>
      )}

      {/* Filters Panel */}
      <div className="mb-6">
        <DashboardFilterBar
          filters={filters}
          onChange={setFilters}
          accounts={accounts}
          maxForecastDays={forecastDays}
          visibleFilters={visibleFilters}
          onVisibleFiltersChange={setVisibleFilters}
        />
      </div>

      {/* Calendar Generation Error */}
      {calendarError && (
        <div className="mb-6">
          <div className="border border-rose-500/30 bg-rose-500/10 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-rose-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-4 h-4 text-rose-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-rose-300">{calendarError}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="inline-flex items-center text-sm text-rose-400 hover:text-rose-300 transition-colors mt-2 underline"
                >
                  Refresh page
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Critical Warning Banner - Overdraft Alert */}
      {forecastMetrics?.negativeCount ? (
        <div className="mb-6">
          <div className="border border-rose-500/30 bg-rose-500/10 rounded-lg p-5">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-rose-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-5 h-5 text-rose-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-base font-semibold text-rose-300">
                  You may overdraft on{' '}
                  {forecastMetrics.firstNegativeDate
                    ? format(forecastMetrics.firstNegativeDate, 'MMM d')
                    : 'a future day'}
                </p>
                <p className="text-sm text-rose-400 mt-1">
                  Let&apos;s fix that — check your forecast and adjust spending
                  or income.
                </p>
                <Link
                  href="/dashboard/calendar"
                  className="inline-flex items-center text-sm font-medium text-rose-300 hover:text-rose-200 transition-colors mt-2"
                >
                  View full calendar →
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : forecastMetrics?.lowBalanceCount ? (
        <div className="mb-6">
          <div className="border border-amber-500/30 bg-amber-500/10 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-amber-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-4 h-4 text-amber-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-amber-300">
                  Heads up — {forecastMetrics.lowBalanceCount} low-balance day
                  {forecastMetrics.lowBalanceCount === 1 ? '' : 's'} in the next{' '}
                  {horizonPeriod}
                </p>
                <Link
                  href="/dashboard/calendar"
                  className="inline-flex items-center text-sm text-amber-400 hover:text-amber-300 transition-colors mt-1"
                >
                  View calendar →
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : forecastMetrics ? (
        <div className="mb-6">
          <div className="border border-teal-500/30 bg-teal-500/10 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-teal-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-4 h-4 text-teal-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-teal-300">
                  ✓ You&apos;re in the green for the next {horizonPeriod}
                </p>
                <Link
                  href="/dashboard/calendar"
                  className="inline-flex items-center text-sm text-teal-400 hover:text-teal-300 transition-colors mt-1"
                >
                  View calendar →
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {/* Daily Budget */}
        <div className="flex flex-col gap-2 h-full">
          <Link href="/dashboard/calendar" className="flex-1">
            <div className="border border-zinc-800 bg-zinc-800 rounded-lg p-4 sm:p-5 cursor-pointer h-full hover:bg-zinc-700/60 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-medium text-zinc-400 uppercase tracking-wide">
                  {dailyBudgetData && dailyBudgetData.dailyBudget < 0
                    ? 'Daily Shortfall'
                    : 'Daily Budget'}
                </p>
                <div className="w-8 h-8 bg-zinc-700/50 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-4 h-4 text-zinc-400" />
                </div>
              </div>
              <div>
                <p
                  className={`text-xl sm:text-2xl md:text-3xl font-semibold tabular-nums tracking-tight ${dailyBudgetColorClass}`}
                >
                  {dailyBudgetData
                    ? dailyBudgetData.dailyBudget < 0
                      ? `${formatCurrencyNoCents(
                          Math.ceil(Math.abs(dailyBudgetData.dailyBudget)),
                          currency
                        )}/day short`
                      : `${formatCurrencyNoCents(
                          Math.floor(dailyBudgetData.dailyBudget),
                          currency
                        )}/day`
                    : '—'}
                </p>
                <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                  {dailyBudgetData
                    ? dailyBudgetData.dailyBudget < 0
                      ? `Need extra income before ${format(
                          dailyBudgetData.nextIncomeDate,
                          'MMM d'
                        )}`
                      : dailyBudgetData.daysUntilIncome === 0
                      ? `until income today`
                      : `until ${format(
                          dailyBudgetData.nextIncomeDate,
                          'MMM d'
                        )} (${dailyBudgetData.daysUntilIncome}d)`
                    : 'Add income to calculate'}
                </p>
              </div>
            </div>
          </Link>
          <Link
            href="/dashboard/settings"
            className="flex items-center justify-center gap-1.5 px-3 py-2 bg-zinc-700/50 hover:bg-zinc-700 border border-zinc-700 hover:border-teal-500/30 rounded text-xs font-medium text-zinc-300 hover:text-teal-400 transition-colors"
          >
            Adjust Buffer
          </Link>
        </div>

        {/* Accounts Card */}
        <div className="flex flex-col gap-2 h-full">
          <Link href="/dashboard/accounts" className="flex-1">
            <div className="border border-zinc-800 bg-zinc-800 rounded-lg p-4 sm:p-5 cursor-pointer h-full hover:bg-zinc-700/60 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-medium text-zinc-400 uppercase tracking-wide">
                  Accounts
                </p>
                <div className="w-8 h-8 bg-zinc-700/50 rounded-lg flex items-center justify-center">
                  <Wallet className="w-4 h-4 text-zinc-400" />
                </div>
              </div>
              <div className="min-w-0">
                <p className="text-xl sm:text-2xl md:text-3xl font-semibold tabular-nums tracking-tight text-zinc-100">
                  {formatCurrency(totalBalance, currency)}
                </p>
                <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                  {filteredAccounts.length > 0
                    ? `Across ${filteredAccounts.length} ${
                        filteredAccounts.length === 1 ? 'account' : 'accounts'
                      }`
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
                <p className="text-xs font-medium text-zinc-400 uppercase tracking-wide">
                  Income
                </p>
                <div className="w-8 h-8 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                </div>
              </div>
              <div className="min-w-0">
                <p className="text-xl sm:text-2xl md:text-3xl font-semibold tabular-nums tracking-tight text-emerald-400">
                  {formatCurrency(monthlyIncome, currency)}
                  <span className="text-xs sm:text-sm md:text-base font-normal text-emerald-400/70">/mo</span>
                </p>
                <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                  {incomeCount > 0
                    ? `From ${incomeCount} ${
                        incomeCount === 1 ? 'source' : 'sources'
                      }`
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
                <p className="text-xs font-medium text-zinc-400 uppercase tracking-wide">
                  Bills
                </p>
                <div className="w-8 h-8 bg-rose-500/10 rounded-lg flex items-center justify-center">
                  <FileText className="w-4 h-4 text-rose-400" />
                </div>
              </div>
              <div className="min-w-0">
                <p className="text-xl sm:text-2xl md:text-3xl font-semibold tabular-nums tracking-tight text-rose-400">
                  {formatCurrency(monthlyBills, currency)}
                  <span className="text-xs sm:text-sm md:text-base font-normal text-rose-400/70">/mo</span>
                </p>
                <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                  {activeBillsCount > 0
                    ? `${activeBillsCount} ${
                        activeBillsCount === 1 ? 'active bill' : 'active bills'
                      }`
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

      {/* Calendar Forecast Card */}
      {forecastMetrics && (
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
                      {horizonTitle} Forecast
                    </h3>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      Your cash flow outlook
                    </p>
                  </div>
                </div>
                {forecastMetrics.lowestBalance < safetyBuffer ? (
                  <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-300">
                    Warning
                  </span>
                ) : (
                  <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300">
                    Healthy
                  </span>
                )}
              </div>

              {/* Forecast Chart */}
              {filteredCalendarDays && filteredCalendarDays.length > 0 && (
                <div className="py-4 border-t border-zinc-700/50">
                  <ForecastBalanceChart
                    days={filteredCalendarDays}
                    currency={currency}
                    lowestBalanceDay={forecastMetrics.lowestBalanceDay}
                    safetyBuffer={safetyBuffer}
                  />
                </div>
              )}

              <div className="grid grid-cols-3 gap-2 sm:gap-4 py-4 border-t border-b border-zinc-700/50">
                <div className="min-w-0">
                  <p className="text-xs text-zinc-400 mb-1">Lowest Balance</p>
                  <p
                    className={`text-base sm:text-xl md:text-2xl font-bold truncate ${getBalanceColor(
                      forecastMetrics.lowestBalance,
                      safetyBuffer
                    )}`}
                  >
                    {formatCurrency(forecastMetrics.lowestBalance, currency)}
                  </p>
                  <p className="text-xs text-zinc-400 mt-1">
                    on {format(forecastMetrics.lowestBalanceDay, 'MMM d')}
                  </p>
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-zinc-400 mb-1">Total Income</p>
                  <p className="text-base sm:text-xl md:text-2xl font-bold text-emerald-400 truncate">
                    {formatCurrency(forecastMetrics.totalIncome, currency)}
                  </p>
                  <p className="text-xs text-zinc-400 mt-1">{horizonPeriod}</p>
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-zinc-400 mb-1">Total Bills</p>
                  <p className="text-base sm:text-xl md:text-2xl font-bold text-rose-400 truncate">
                    {formatCurrency(forecastMetrics.totalBills, currency)}
                  </p>
                  <p className="text-xs text-zinc-400 mt-1">{horizonPeriod}</p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm text-zinc-400">
                  Click to view day-by-day breakdown
                </p>
                <svg
                  className="w-5 h-5 text-teal-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          </Link>
        </div>
      )}

      {/* Outstanding Invoices */}
      <div
        className={
          invoiceSummary.unpaidCount === 0 ? 'hidden sm:block mb-6' : 'mb-6'
        }
      >
        <div className="border border-zinc-800 bg-zinc-800 rounded-lg p-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-teal-500/10 rounded-lg flex items-center justify-center">
                <Receipt className="w-5 h-5 text-teal-400" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-zinc-100">
                  Outstanding Invoices
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  {invoiceSummary.unpaidCount === 0
                    ? 'All caught up'
                    : `${invoiceSummary.unpaidCount} unpaid invoice${
                        invoiceSummary.unpaidCount === 1 ? '' : 's'
                      }`}
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
                  {topInvoices.map((invoice) => {
                    const today = new Date();
                    const todayMidnight = new Date(
                      today.getFullYear(),
                      today.getMonth(),
                      today.getDate()
                    );
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
                            {invoice.invoice_number || 'No number'} • Due{' '}
                            {format(dueDate, 'MMM d')}
                            {isOverdue && (
                              <span className="text-rose-400 ml-1 font-medium">
                                Overdue
                              </span>
                            )}
                          </p>
                        </div>
                        <p
                          className={`text-sm font-semibold tabular-nums ml-3 ${
                            isOverdue ? 'text-rose-400' : 'text-zinc-100'
                          }`}
                        >
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

      {/* Tax Savings Widget */}
      <div className="mb-6">
        <TaxSavingsWidget
          totalIncome={taxData.totalYearIncome}
          taxRate={taxData.taxRate}
          quarterlyIncome={taxData.quarterlyIncome}
          quarterlyPaid={taxData.quarterlyPaid}
          enabled={taxData.enabled}
        />
      </div>

      {/* Emergency Fund Widget */}
      <div className="mb-6">
        <EmergencyFundWidget
          enabled={emergencyFundData.enabled}
          goalMonths={emergencyFundData.goalMonths}
          monthlyExpenses={monthlyBills}
          currentBalance={
            emergencyFundData.accountId
              ? accounts.find((a) => a.id === emergencyFundData.accountId)?.current_balance ?? 0
              : totalBalance
          }
          accountName={
            emergencyFundData.accountId
              ? accounts.find((a) => a.id === emergencyFundData.accountId)?.name
              : undefined
          }
        />
      </div>

      {/* Tools Section */}
      {/* Scenario Tester */}
      <div className="mb-6">
        <ScenarioButton variant="card" source="dashboard" className="p-4 sm:p-6" />
      </div>

      {/* Import Transactions */}
      <div className="mb-6">
        <Link href="/dashboard/import" className="block">
          <div className="border border-zinc-800 bg-zinc-800 rounded-lg p-5 hover:bg-zinc-700/60 transition-colors">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-zinc-700 rounded-lg flex items-center justify-center flex-shrink-0">
                <Upload className="w-5 h-5 text-zinc-300" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-zinc-100">
                  Import Transactions
                </p>
                <p className="text-sm text-zinc-400 mt-1">
                  Upload a bank CSV to quickly add bills and income
                </p>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
