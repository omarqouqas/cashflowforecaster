/**
 * User financial context fetching for AI Natural Language Queries.
 * Fetches and formats user financial data for the LLM system prompt.
 */

import { createClient } from '@/lib/supabase/server';
import generateCalendar from '@/lib/calendar/generate';
import { formatCurrency } from '@/lib/utils/format';
import type { UserFinancialData, UserFinancialContext } from './types';

/**
 * Fetch all financial data for a user from the database.
 */
export async function fetchUserFinancialData(
  userId: string
): Promise<UserFinancialData> {
  const supabase = await createClient();

  // Fetch all data in parallel for performance
  const [accountsResult, incomeResult, billsResult, invoicesResult, settingsResult] =
    await Promise.all([
      supabase.from('accounts').select('*').eq('user_id', userId),
      supabase
        .from('income')
        .select('*')
        .eq('user_id', userId)
        .or('is_active.is.null,is_active.eq.true'),
      supabase
        .from('bills')
        .select('*')
        .eq('user_id', userId)
        .or('is_active.is.null,is_active.eq.true'),
      supabase
        .from('invoices')
        .select('*')
        .eq('user_id', userId)
        .in('status', ['draft', 'sent', 'viewed', 'overdue']),
      supabase
        .from('user_settings')
        .select('currency, safety_buffer, timezone, tax_rate, tax_tracking_enabled, emergency_fund_account_id')
        .eq('user_id', userId)
        .single(),
    ]);

  const accounts = accountsResult.data ?? [];
  const income = incomeResult.data ?? [];
  const bills = billsResult.data ?? [];
  const invoices = invoicesResult.data ?? [];
  const settings = settingsResult.data ?? {
    currency: 'USD',
    safety_buffer: 500,
    timezone: null,
    tax_rate: null,
    tax_tracking_enabled: null,
    emergency_fund_account_id: null,
  };

  return {
    accounts,
    income,
    bills,
    invoices,
    settings: {
      currency: settings.currency ?? 'USD',
      safety_buffer: settings.safety_buffer ?? 500,
      timezone: settings.timezone ?? null,
      tax_rate: settings.tax_rate ?? null,
      tax_tracking_enabled: settings.tax_tracking_enabled ?? null,
      emergency_fund_account_id: settings.emergency_fund_account_id ?? null,
    },
  };
}

/**
 * Build a formatted financial context object for the system prompt.
 */
export function buildFinancialContext(
  userId: string,
  data: UserFinancialData
): UserFinancialContext {
  const { accounts, income, bills, invoices, settings } = data;
  const currency = settings.currency;

  // Calculate spendable balance (excluding emergency fund account)
  const emergencyFundAccountId = settings.emergency_fund_account_id;
  const spendableAccounts = accounts.filter(
    (a) => a.is_spendable !== false && (!emergencyFundAccountId || a.id !== emergencyFundAccountId)
  );
  const spendableBalance = spendableAccounts.reduce(
    (sum, a) => sum + a.current_balance,
    0
  );
  const totalBalance = accounts.reduce((sum, a) => sum + a.current_balance, 0);

  // Generate calendar for forecast data
  let safeToSpend = 0;
  let lowestBalanceAmount = spendableBalance;
  let lowestBalanceDate = new Date().toISOString().split('T')[0] ?? '';
  let calendar: ReturnType<typeof generateCalendar> | null = null;

  try {
    calendar = generateCalendar(
      accounts,
      income,
      bills,
      settings.safety_buffer,
      settings.timezone ?? undefined,
      60,
      [], // transfers
      emergencyFundAccountId
    );
    safeToSpend = calendar.safeToSpend;
    lowestBalanceAmount = calendar.lowestBalance;
    lowestBalanceDate = calendar.lowestBalanceDay.toISOString().split('T')[0] ?? '';
  } catch {
    // Calendar generation might fail with empty data
  }

  // Format accounts summary
  const accountsSummary =
    accounts.length === 0
      ? 'No accounts configured.'
      : accounts
          .map((a) => {
            const type = a.account_type ?? 'account';
            const spendable = a.is_spendable !== false ? '' : ' (non-spendable)';
            return `- ${a.name} (${type}${spendable}): ${formatCurrency(a.current_balance, currency)}`;
          })
          .join('\n');

  // Extract upcoming bills and income from calendar data (next 30 days)
  // The calendar correctly calculates recurring occurrences, so we use it
  // instead of filtering raw due_date/next_date fields
  const calendarDays30 = calendar?.days?.slice(0, 30) ?? [];

  // Collect all bill occurrences from the calendar's 30-day window
  const upcomingBillsFromCalendar = calendarDays30
    .flatMap((day) =>
      (day.bills ?? []).map((b) => ({
        name: b.name,
        amount: b.amount,
        date: b.date,
      }))
    )
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 10);

  const upcomingBills =
    upcomingBillsFromCalendar.length === 0
      ? 'No bills due in the next 30 days.'
      : upcomingBillsFromCalendar
          .map(
            (b) =>
              `- ${b.name}: ${formatCurrency(b.amount, currency)} due ${b.date.toISOString().split('T')[0]}`
          )
          .join('\n');

  // Collect all income occurrences from the calendar's 30-day window
  const upcomingIncomeFromCalendar = calendarDays30
    .flatMap((day) =>
      (day.income ?? []).map((i) => ({
        name: i.name,
        amount: i.amount,
        date: i.date,
      }))
    )
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 10);

  const upcomingIncome =
    upcomingIncomeFromCalendar.length === 0
      ? 'No income expected in the next 30 days.'
      : upcomingIncomeFromCalendar
          .map(
            (i) =>
              `- ${i.name}: ${formatCurrency(i.amount, currency)} expected ${i.date.toISOString().split('T')[0]}`
          )
          .join('\n');

  // Format outstanding invoices
  const outstandingInvoicesList = invoices
    .sort((a, b) => (a.due_date ?? '').localeCompare(b.due_date ?? ''))
    .slice(0, 5);

  const outstandingInvoices =
    outstandingInvoicesList.length === 0
      ? 'No outstanding invoices.'
      : outstandingInvoicesList
          .map((inv) => {
            const status = inv.status === 'overdue' ? ' (OVERDUE)' : '';
            return `- ${inv.client_name}: ${formatCurrency(inv.amount, currency)} due ${inv.due_date}${status}`;
          })
          .join('\n');

  return {
    userId,
    currency,
    timezone: settings.timezone,
    safetyBuffer: settings.safety_buffer,
    taxRate: settings.tax_rate,
    spendableBalance,
    totalBalance,
    safeToSpend,
    lowestBalanceAmount,
    lowestBalanceDate,
    accountsSummary,
    upcomingBills,
    upcomingIncome,
    outstandingInvoices,
  };
}
