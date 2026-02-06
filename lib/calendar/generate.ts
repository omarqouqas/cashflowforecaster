/**
 * Main calendar generation function for cash flow forecasting.
 *
 * This module generates a 60-day calendar projection by:
 * 1. Calculating starting balance from active accounts
 * 2. Generating all income and bill occurrences
 * 3. Generating all transfer occurrences
 * 4. Projecting daily balances forward
 * 5. Identifying the lowest balance day
 */

import { CalendarData, CalendarDay } from './types';
import { calculateIncomeOccurrences } from './calculate-income';
import { calculateBillOccurrences } from './calculate-bills';
import { calculateAllCCPayments } from './calculate-cc-payments';
import { calculateTransferOccurrences } from './calculate-transfers';
import { addDays, isSameDay, getStatusColor, getTodayAtNoon } from './utils';
import { detectBillCollisions } from './detect-collisions';
import { Tables } from '@/types/supabase';

const CALENDAR_VERBOSE =
  typeof process !== 'undefined' &&
  typeof process.env !== 'undefined' &&
  process.env.CALENDAR_VERBOSE === 'true';

/**
 * Account record structure for calendar generation.
 */
type AccountRecord = Tables<'accounts'>;

/**
 * Income record structure for calendar generation.
 */
type IncomeRecord = Tables<'income'>;

/**
 * Bill record structure for calendar generation.
 */
type BillRecord = Tables<'bills'>;

/**
 * Transfer record structure for calendar generation.
 */
type TransferRecord = Tables<'transfers'> & {
  from_account_name?: string;
  to_account_name?: string;
};

function getTodayAtNoonForTimezone(timezone?: string): Date {
  if (!timezone) return getTodayAtNoon();

  try {
    const now = new Date();
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).formatToParts(now);

    const year = Number(parts.find((p) => p.type === 'year')?.value);
    const month = Number(parts.find((p) => p.type === 'month')?.value);
    const day = Number(parts.find((p) => p.type === 'day')?.value);

    if (!Number.isFinite(year) || !Number.isFinite(month) || !Number.isFinite(day)) {
      return getTodayAtNoon();
    }

    // Construct a local Date at noon for the calendar day in the user's timezone.
    // This avoids midnight/DST edge cases while aligning the "day" with the user's configured timezone.
    return new Date(year, month - 1, day, 12, 0, 0, 0);
  } catch {
    // Invalid timezone (RangeError) or Intl limitations
    return getTodayAtNoon();
  }
}

/**
 * Generates a 60-day cash flow calendar projection.
 *
 * This function:
 * 1. Calculates the starting balance from all active accounts
 * 2. Generates a 60-day date array starting from today
 * 3. Calculates all income occurrences within the date range
 * 4. Calculates all bill occurrences within the date range
 * 5. Calculates all transfer occurrences within the date range
 * 6. Projects daily balances by applying income, bills, and transfers chronologically
 * 7. Identifies the lowest balance day
 * 8. Applies status colors based on the safety buffer threshold
 *
 * @param accounts - Array of account records (uses is_spendable to determine active accounts)
 * @param income - Array of income source records
 * @param bills - Array of bill records
 * @param safetyBuffer - The minimum safety buffer amount for status color calculation (default: 500)
 * @param timezone - Optional user timezone for date calculations
 * @param forecastDays - Number of days to forecast (default: 60)
 * @param transfers - Optional array of transfer records for inter-account transfers
 * @returns CalendarData object containing forecast days of projected cash flow
 *
 * @throws {Error} If accounts array is empty or invalid
 * @throws {Error} If date calculations fail
 */
export default function generateCalendar(
  accounts: AccountRecord[],
  income: IncomeRecord[],
  bills: BillRecord[],
  safetyBuffer: number = 500,
  timezone?: string,
  forecastDays: number = 60,
  transfers: TransferRecord[] = []
): CalendarData {
  try {
    // Step 1: Calculate starting balance
    // Sum all active account balances
    // Note: Database schema uses is_spendable (not is_active) and current_balance (not balance)
    // Filtering to include accounts where is_spendable is true or null (treating null as active)
    const startingBalance = accounts
      .filter((a) => a.is_spendable !== false)
      .reduce((sum, a) => sum + a.current_balance, 0);

    // Step 2: Generate forecast date array
    const today = getTodayAtNoonForTimezone(timezone);

    const dates: Date[] = [];
    const daysToGenerate = Number.isFinite(forecastDays) && forecastDays > 0 ? Math.floor(forecastDays) : 60;
    for (let i = 0; i < daysToGenerate; i++) {
      dates.push(addDays(today, i));
    }

    const endDate = dates[dates.length - 1];
    if (!endDate) {
      throw new Error('Failed to generate calendar dates: endDate is undefined');
    }

    // Step 3: Calculate all income occurrences for the entire forecast period
    const allIncomeOccurrences = income
      .filter(inc => inc.is_active !== false)
      .flatMap(inc => calculateIncomeOccurrences(inc as any, today, endDate));
    if (CALENDAR_VERBOSE) console.log('Total income occurrences:', allIncomeOccurrences.length);

    // Step 4: Calculate all bill occurrences for the entire forecast period
    const regularBillOccurrences = bills
      .filter(bill => bill.is_active !== false)
      .flatMap(bill => calculateBillOccurrences(bill as any, today, endDate));
    if (CALENDAR_VERBOSE) console.log('Regular bill occurrences:', regularBillOccurrences.length);

    // Step 4b: Calculate credit card payment occurrences
    // Credit card payments are generated based on payment_due_day for each CC account
    const ccPaymentOccurrences = calculateAllCCPayments(accounts as any, today, endDate);
    if (CALENDAR_VERBOSE) console.log('CC payment occurrences:', ccPaymentOccurrences.length);

    // Combine regular bills and CC payments
    const allBillOccurrences = [...regularBillOccurrences, ...ccPaymentOccurrences];
    if (CALENDAR_VERBOSE) console.log('Total bill occurrences:', allBillOccurrences.length);

    // Step 4c: Calculate transfer occurrences
    // Build a map of account IDs to their spendable status for efficient lookup
    const accountSpendableMap = new Map<string, boolean>();
    accounts.forEach(a => {
      accountSpendableMap.set(a.id, a.is_spendable !== false);
    });

    const allTransferOccurrences = transfers
      .filter(t => t.is_active !== false)
      .flatMap(t => calculateTransferOccurrences({
        ...t,
        from_account_name: t.from_account_name,
        to_account_name: t.to_account_name,
      }, today, endDate));
    if (CALENDAR_VERBOSE) console.log('Transfer occurrences:', allTransferOccurrences.length);

    // Step 5: Project daily balances using reduce to build array incrementally
    const days = dates.reduce((acc, date, index) => {
      const previousBalance = index === 0 ? startingBalance : acc[index - 1]!.balance;

      // Find income for this specific day
      const incomeToday = allIncomeOccurrences.filter(occ => isSameDay(occ.date, date));

      // Find bills for this specific day
      const billsToday = allBillOccurrences.filter(occ => isSameDay(occ.date, date));

      // Find transfers for this specific day
      const transfersToday = allTransferOccurrences.filter(occ => isSameDay(occ.date, date));

      // Calculate totals (with NaN protection)
      const incomeAmount = incomeToday.reduce((sum, i) => {
        const amount = Number.isFinite(i.amount) ? i.amount : 0;
        return sum + amount;
      }, 0);
      const billsAmount = billsToday.reduce((sum, b) => {
        const amount = Number.isFinite(b.amount) ? b.amount : 0;
        return sum + amount;
      }, 0);

      // Calculate transfer impact on spendable cash
      // Transfer affects cash flow when crossing the spendable/non-spendable boundary:
      // - From spendable to non-spendable: decreases cash (like a CC payment)
      // - From non-spendable to spendable: increases cash (rare, but possible)
      // - Between two spendable accounts: no net effect on total cash
      let transferOutAmount = 0;
      let transferInAmount = 0;
      for (const transfer of transfersToday) {
        const fromSpendable = accountSpendableMap.get(transfer.from_account_id) ?? false;
        const toSpendable = accountSpendableMap.get(transfer.to_account_id) ?? false;
        const amount = Number.isFinite(transfer.amount) ? transfer.amount : 0;

        if (fromSpendable && !toSpendable) {
          // Money leaving spendable accounts (e.g., paying CC)
          transferOutAmount += amount;
        } else if (!fromSpendable && toSpendable) {
          // Money entering spendable accounts (e.g., CC refund to checking)
          transferInAmount += amount;
        }
        // If both spendable or both non-spendable, no net effect on total cash
      }

      // Debug logging for multiple transactions on same day
      if (incomeToday.length > 1 || billsToday.length > 1 || transfersToday.length > 0) {
        if (CALENDAR_VERBOSE) {
          console.log(
            'Multi-transaction day:',
            date.toDateString(),
            'Income:',
            incomeToday.length,
            'Bills:',
            billsToday.length,
            'Transfers:',
            transfersToday.length,
            'Total income:',
            incomeAmount,
            'Total bills:',
            billsAmount,
            'Transfer out:',
            transferOutAmount,
            'Transfer in:',
            transferInAmount
          );
        }
      }

      // Calculate new balance
      const balance = previousBalance + incomeAmount - billsAmount + transferInAmount - transferOutAmount;

      // Determine status using the safety buffer
      const status = getStatusColor(balance, safetyBuffer);
      if (CALENDAR_VERBOSE) {
        console.log('Day', index, date.toDateString(), 'Bal:', balance.toFixed(0), 'Status:', status);
      }

      acc.push({
        date: new Date(date),
        balance,
        income: incomeToday,
        bills: billsToday,
        transfers: transfersToday,
        status,
      });

      return acc;
    }, [] as CalendarDay[]);

    // Step 6: Find lowest balance day
    let lowestBalance = startingBalance;
    let lowestBalanceDay = today;
    for (const day of days) {
      if (day.balance < lowestBalance) {
        lowestBalance = day.balance;
        lowestBalanceDay = new Date(day.date);
      }
    }

    // Step 7: Safe to Spend (next 14 days)
    // safeToSpend = lowestBalanceInNext14Days - safetyBuffer (capped at 0)
    const next14Days = days.slice(0, 14);
    const lowestIn14Days =
      next14Days.length === 0 ? startingBalance : Math.min(...next14Days.map((d) => d.balance));
    const safeToSpend = Math.max(0, lowestIn14Days - safetyBuffer);

    // Step 8: Detect bill collisions (multiple bills due on the same day)
    const collisions = detectBillCollisions(days);

    // Step 9: Return CalendarData
    return {
      days,
      startingBalance,
      lowestBalance,
      lowestBalanceDay,
      safeToSpend,
      collisions,
    };
  } catch (error) {
    console.error('Error generating calendar:', error);
    throw new Error(
      `Failed to generate calendar: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}
