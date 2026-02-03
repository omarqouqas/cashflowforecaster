import { requireAuth } from '@/lib/auth/session';
import { createClient } from '@/lib/supabase/server';
import generateCalendar from '@/lib/calendar/generate';
import { getInvoiceSummary } from '@/lib/actions/invoices';
import { getForecastDaysLimit, getUserSubscription } from '@/lib/stripe/subscription';
import { getQuarterForDate } from '@/lib/tax/calculations';
import { DashboardContent } from '@/components/dashboard/dashboard-content';

interface DashboardPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const user = await requireAuth();
  const message = searchParams.message;
  const checkoutStatus = searchParams.checkout;
  const isLifetimePurchase = searchParams.lifetime === 'true';
  const supabase = await createClient();

  // Fetch accounts, income, bills, and user settings in parallel
  const [accountsResult, incomeResult, billsResult, settingsResult, invoiceSummaryResult, topInvoicesResult, forecastDays, subscription] = await Promise.all([
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
    getForecastDaysLimit(user.id),
    getUserSubscription(user.id),
  ]);

  const accounts = (accountsResult.data || []) as any;
  const incomes = (incomeResult.data || []) as any;
  const bills = (billsResult.data || []) as any;
  const invoiceSummary = invoiceSummaryResult;
  const topInvoices = (topInvoicesResult.data || []) as any;

  // Extract settings with type assertion
  const settingsData = settingsResult.data as any;

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
    ? accounts.find((a: any) => a.id === emergencyFundAccountId)?.name
    : undefined;

  // Generate calendar data if user has accounts
  let calendarData = null;
  let calendarError: string | null = null;
  if (accounts.length > 0) {
    try {
      calendarData = generateCalendar(accounts, incomes, bills, safetyBuffer, timezone ?? undefined, forecastDays);
    } catch (error) {
      console.error('Error generating calendar:', error);
      calendarError = 'We couldn\'t generate your forecast. Please try refreshing the page.';
    }
  }

  // Calculate monthly income equivalent
  const calculateMonthlyIncome = (incomes: any[]) => {
    if (!incomes) return 0;

    return incomes.reduce((total: number, income: any) => {
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
  const activeBillsCount = bills.filter((b: any) => b.is_active).length;

  // Calculate quarterly income for tax tracking
  const calculateQuarterlyIncome = (incomes: any[]): [number, number, number, number] => {
    const currentYear = new Date().getFullYear();
    const quarterTotals: number[] = [0, 0, 0, 0];

    incomes.forEach((income: any) => {
      if (income.is_active === false) return;

      const incomeDate = income.date ? new Date(income.date) : null;

      if (income.frequency === 'one-time' && incomeDate && incomeDate.getFullYear() === currentYear) {
        const quarter = getQuarterForDate(incomeDate) - 1;
        quarterTotals[quarter]! += income.amount;
      }
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

  // Serialize calendar data for client component
  const serializedCalendarData = calendarData ? {
    days: calendarData.days.map(day => ({
      ...day,
      date: day.date.toISOString(),
      income: day.income.map(t => ({ ...t, date: t.date.toISOString() })),
      bills: day.bills.map(t => ({ ...t, date: t.date.toISOString() })),
    })),
    startingBalance: calendarData.startingBalance,
    lowestBalance: calendarData.lowestBalance,
    lowestBalanceDay: calendarData.lowestBalanceDay.toISOString(),
    safeToSpend: calendarData.safeToSpend,
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
        })),
        lowestBalanceDay: new Date(serializedCalendarData.lowestBalanceDay),
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
    />
  );
}
