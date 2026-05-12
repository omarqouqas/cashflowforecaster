import { requireAuth } from '@/lib/auth/session';
import { createClient } from '@/lib/supabase/server';
import generateCalendar from '@/lib/calendar/generate';
import { runMonteCarloSimulation } from '@/lib/calendar/monte-carlo';
import { getInvoiceSummary } from '@/lib/actions/invoices';
import { getUninvoicedSummary } from '@/lib/actions/time-entries';
import { getForecastDaysLimit, getUserSubscription } from '@/lib/stripe/subscription';
import { getQuarterForDate } from '@/lib/tax/calculations';
import { generateAlerts, buildAlertContext } from '@/lib/alerts';
import { generateIncomePatternAnalysis, serializeAnalysis } from '@/lib/forecasting';
import { getReferralStats } from '@/lib/actions/referrals';
import { DashboardContent } from '@/components/dashboard/dashboard-content';
import type { Tables } from '@/types/supabase';

type AccountRecord = Tables<'accounts'>;
type IncomeRecord = Tables<'income'>;
type BillRecord = Tables<'bills'>;
type TransferRecord = Tables<'transfers'> & {
  from_account: { name: string } | null;
  to_account: { name: string } | null;
};
type InvoiceRecord = Pick<Tables<'invoices'>, 'id' | 'invoice_number' | 'client_name' | 'amount' | 'due_date' | 'status'>;
type UserSettings = Tables<'user_settings'>;

interface DashboardPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const user = await requireAuth();
  const message = searchParams.message;
  const checkoutStatus = searchParams.checkout;
  const isLifetimePurchase = searchParams.lifetime === 'true';
  const supabase = await createClient();

  // Fetch accounts, income, bills, transfers, and user settings in parallel
  const [accountsResult, incomeResult, billsResult, transfersResult, settingsResult, invoiceSummaryResult, topInvoicesResult, allInvoicesResult, forecastDays, subscription, incomePatternAnalysis, uninvoicedTimeSummary, referralStatsResult] = await Promise.all([
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
      .from('transfers')
      .select(`
        *,
        from_account:accounts!transfers_from_account_id_fkey(name),
        to_account:accounts!transfers_to_account_id_fkey(name)
      `)
      .eq('user_id', user.id)
      .eq('is_active', true)
      .order('transfer_date', { ascending: true }),
    supabase
      .from('user_settings')
      .select('currency, safety_buffer, timezone, tax_rate, tax_tracking_enabled, estimated_tax_q1_paid, estimated_tax_q2_paid, estimated_tax_q3_paid, estimated_tax_q4_paid, emergency_fund_enabled, emergency_fund_goal_months, emergency_fund_account_id')
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
    // Fetch all unpaid invoices for alerts (no limit)
    supabase
      .from('invoices')
      .select('id, client_name, amount, due_date, status')
      .eq('user_id', user.id)
      .or('status.is.null,status.neq.paid'),
    getForecastDaysLimit(user.id),
    getUserSubscription(user.id),
    generateIncomePatternAnalysis(user.id),
    getUninvoicedSummary(),
    getReferralStats(),
  ]);

  const accounts = (accountsResult.data || []) as AccountRecord[];
  const incomes = (incomeResult.data || []) as IncomeRecord[];
  const bills = (billsResult.data || []) as BillRecord[];
  const invoiceSummary = invoiceSummaryResult;
  const topInvoices = (topInvoicesResult.data || []) as InvoiceRecord[];

  // Process transfers to add account names
  const transfers = ((transfersResult.data || []) as TransferRecord[]).map((t) => ({
    ...t,
    from_account_name: t.from_account?.name,
    to_account_name: t.to_account?.name,
  }));

  // Extract settings with type
  const settingsData = settingsResult.data as UserSettings | null;

  // Extract settings with fallbacks
  const currency = settingsData?.currency ?? 'USD';
  const safetyBuffer = settingsData?.safety_buffer ?? 500;
  const timezone = settingsData?.timezone ?? null;

  // Extract tax settings
  const taxRate = settingsData?.tax_rate ?? 25.00;
  const taxTrackingEnabled = settingsData?.tax_tracking_enabled ?? false;
  const estimatedTaxQ1Paid = settingsData?.estimated_tax_q1_paid ?? 0;
  const estimatedTaxQ2Paid = settingsData?.estimated_tax_q2_paid ?? 0;
  const estimatedTaxQ3Paid = settingsData?.estimated_tax_q3_paid ?? 0;
  const estimatedTaxQ4Paid = settingsData?.estimated_tax_q4_paid ?? 0;

  // Extract emergency fund settings
  const emergencyFundEnabled = settingsData?.emergency_fund_enabled ?? false;
  const emergencyFundGoalMonths = settingsData?.emergency_fund_goal_months ?? 3;
  const emergencyFundAccountId = settingsData?.emergency_fund_account_id ?? null;

  // Find account name if emergency fund has designated account
  const emergencyFundAccountName = emergencyFundAccountId
    ? accounts.find((a) => a.id === emergencyFundAccountId)?.name
    : undefined;

  // Generate calendar data if user has accounts
  let calendarData = null;
  let calendarError: string | null = null;

  if (accounts.length > 0) {
    try {
      calendarData = generateCalendar(accounts, incomes, bills, safetyBuffer, timezone ?? undefined, forecastDays, transfers, emergencyFundAccountId);

      // Run Monte Carlo simulation for probabilistic forecasting
      if (calendarData) {
        const monteCarloResult = runMonteCarloSimulation(calendarData, {
          safetyBuffer,
          simulationCount: 500,
          forecastDays,
        });
        calendarData.monteCarlo = monteCarloResult;
      }
    } catch (error) {
      console.error('Error generating calendar:', error);
      calendarError = 'We couldn\'t generate your forecast. Please try refreshing the page.';
    }
  }

  // Calculate monthly income equivalent
  const calculateMonthlyIncome = (incomes: IncomeRecord[]) => {
    if (!incomes) return 0;

    return incomes.reduce((total, income) => {
      if (income.is_active === false) return total;

      switch (income.frequency) {
        case 'weekly':
          return total + (income.amount * 52 / 12);
        case 'biweekly':
          return total + (income.amount * 26 / 12);
        case 'semi-monthly':
          return total + (income.amount * 2);
        case 'monthly':
          return total + income.amount;
        case 'quarterly':
          return total + income.amount / 3;
        case 'annually':
          return total + income.amount / 12;
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
  const calculateMonthlyBills = (bills: BillRecord[]) => {
    if (!bills) return 0;

    return bills.reduce((total, bill) => {
      if (!bill.is_active) return total;

      switch (bill.frequency) {
        case 'weekly': return total + (bill.amount * 52) / 12;
        case 'biweekly': return total + (bill.amount * 26) / 12;
        case 'semi-monthly': return total + bill.amount * 2;
        case 'monthly': return total + bill.amount;
        case 'quarterly': return total + bill.amount / 3;
        case 'annually': return total + bill.amount / 12;
        case 'one-time': return total;
        default: return total;
      }
    }, 0);
  };

  const monthlyBills = calculateMonthlyBills(bills);
  const activeBillsCount = bills.filter((b) => b.is_active !== false).length;

  // Calculate quarterly income for tax tracking
  const calculateQuarterlyIncome = (incomes: IncomeRecord[]): [number, number, number, number] => {
    const currentYear = new Date().getFullYear();
    const quarterTotals: number[] = [0, 0, 0, 0];

    incomes.forEach((income) => {
      if (income.is_active === false) return;

      const incomeDate = income.next_date ? new Date(income.next_date) : null;

      // One-time income: assign to specific quarter based on date
      if (income.frequency === 'one-time' && incomeDate && incomeDate.getFullYear() === currentYear) {
        const quarter = getQuarterForDate(incomeDate) - 1;
        quarterTotals[quarter]! += income.amount;
      }
      // Annually income: assign full amount to the specific quarter it occurs in
      else if (income.frequency === 'annually' && incomeDate) {
        // Find which quarter the annual payment falls into for current year
        const paymentMonth = incomeDate.getMonth();
        const paymentQuarter = Math.floor(paymentMonth / 3);
        quarterTotals[paymentQuarter]! += income.amount;
      }
      // Quarterly income: assign full amount to each of the 4 quarters it occurs in
      else if (income.frequency === 'quarterly' && incomeDate) {
        // Quarterly payments occur 4 times per year
        // Calculate which quarters based on the start date
        const startMonth = incomeDate.getMonth();
        for (let i = 0; i < 4; i++) {
          const paymentMonth = (startMonth + i * 3) % 12;
          const paymentQuarter = Math.floor(paymentMonth / 3);
          quarterTotals[paymentQuarter]! += income.amount;
        }
      }
      // Regular recurring income (weekly, biweekly, semi-monthly, monthly): spread across all quarters
      else if (income.frequency !== 'one-time' && income.frequency !== 'irregular') {
        const monthlyAmount = (() => {
          switch (income.frequency) {
            case 'weekly': return (income.amount * 52) / 12;
            case 'biweekly': return (income.amount * 26) / 12;
            case 'semi-monthly': return income.amount * 2;
            case 'monthly': return income.amount;
            default: return 0;
          }
        })();
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

  // Generate proactive alerts
  let alerts: ReturnType<typeof generateAlerts> = [];
  if (calendarData) {
    try {
      const alertContext = buildAlertContext({
        safetyBuffer,
        currency,
        calendarDays: calendarData.days,
        riskMetrics: calendarData.monteCarlo?.riskMetrics,
        invoices: allInvoicesResult.data?.map((inv) => ({
          id: inv.id,
          client_name: inv.client_name,
          amount: inv.amount,
          due_date: inv.due_date,
          status: inv.status,
        })),
        bills: bills.map((b) => ({
          id: b.id,
          name: b.name,
          amount: b.amount,
          frequency: b.frequency,
          due_date: b.due_date,
        })),
        income: incomes.map((i) => ({
          id: i.id,
          name: i.name,
          amount: i.amount,
          frequency: i.frequency,
          next_date: i.next_date,
        })),
      });
      alerts = generateAlerts(alertContext);
    } catch (error) {
      console.error('Error generating alerts:', error);
    }
  }

  // Serialize alerts for client component
  const serializedAlerts = alerts.map((alert) => ({
    ...alert,
    createdAt: alert.createdAt.toISOString(),
  }));

  // Serialize income pattern analysis for client component
  const serializedPatternAnalysis = incomePatternAnalysis
    ? serializeAnalysis(incomePatternAnalysis)
    : null;

  // Serialize calendar data for client component
  const serializedCalendarData = calendarData ? {
    days: calendarData.days.map(day => ({
      ...day,
      date: day.date.toISOString(),
      income: day.income.map(t => ({ ...t, date: t.date.toISOString() })),
      bills: day.bills.map(t => ({ ...t, date: t.date.toISOString() })),
      transfers: day.transfers.map(t => ({ ...t, date: t.date.toISOString() })),
    })),
    startingBalance: calendarData.startingBalance,
    lowestBalance: calendarData.lowestBalance,
    lowestBalanceDay: calendarData.lowestBalanceDay.toISOString(),
    safeToSpend: calendarData.safeToSpend,
    // Monte Carlo probabilistic data
    monteCarlo: calendarData.monteCarlo ? {
      days: calendarData.monteCarlo.days.map(day => ({
        ...day,
        date: day.date.toISOString(),
      })),
      riskMetrics: calendarData.monteCarlo.riskMetrics,
      simulationCount: calendarData.monteCarlo.simulationCount,
      computeTimeMs: calendarData.monteCarlo.computeTimeMs,
    } : null,
  } : null;

  return (
    <DashboardContent
      accounts={accounts}
      calendarData={serializedCalendarData ? {
        ...serializedCalendarData,
        days: serializedCalendarData.days.map(day => ({
          ...day,
          date: new Date(day.date),
          income: day.income.map(t => ({ ...t, date: new Date(t.date) })),
          bills: day.bills.map(t => ({ ...t, date: new Date(t.date) })),
          transfers: day.transfers.map(t => ({ ...t, date: new Date(t.date) })),
        })),
        lowestBalanceDay: new Date(serializedCalendarData.lowestBalanceDay),
        monteCarlo: serializedCalendarData.monteCarlo ? {
          ...serializedCalendarData.monteCarlo,
          days: serializedCalendarData.monteCarlo.days.map(day => ({
            ...day,
            date: new Date(day.date),
          })),
        } : undefined,
      } : null}
      monthlyIncome={monthlyIncome}
      monthlyBills={monthlyBills}
      incomeCount={incomeCount}
      activeBillsCount={activeBillsCount}
      safetyBuffer={safetyBuffer}
      invoiceSummary={invoiceSummary}
      topInvoices={topInvoices}
      forecastDays={forecastDays}
      taxData={{
        totalYearIncome,
        taxRate,
        quarterlyIncome,
        quarterlyPaid,
        enabled: taxTrackingEnabled,
      }}
      emergencyFundData={{
        enabled: emergencyFundEnabled,
        goalMonths: emergencyFundGoalMonths,
        accountId: emergencyFundAccountId,
        accountName: emergencyFundAccountName,
      }}
      message={message}
      calendarError={calendarError}
      currency={currency}
      subscriptionTier={subscription.tier}
      checkoutSuccess={checkoutStatus === 'success'}
      isLifetimePurchase={isLifetimePurchase}
      alerts={serializedAlerts}
      incomePatternAnalysis={serializedPatternAnalysis}
      uninvoicedTime={uninvoicedTimeSummary.data ? {
        totalMinutes: uninvoicedTimeSummary.data.uninvoiced_minutes,
        totalAmount: uninvoicedTimeSummary.data.uninvoiced_amount,
        entryCount: uninvoicedTimeSummary.data.entry_count,
      } : null}
      referralStats={referralStatsResult.success ? referralStatsResult.data : null}
    />
  );
}
