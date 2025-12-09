/**
 * Main calendar generation function for cash flow forecasting.
 * 
 * This module generates a 60-day calendar projection by:
 * 1. Calculating starting balance from active accounts
 * 2. Generating all income and bill occurrences
 * 3. Projecting daily balances forward
 * 4. Identifying the lowest balance day
 */

import { CalendarData, CalendarDay, Transaction } from './types';
import { calculateIncomeOccurrences } from './calculate-income';
import { calculateBillOccurrences } from './calculate-bills';
import { addDays, isSameDay, getStatusColor } from './utils';
import { Tables } from '@/types/supabase';

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
 * Generates a 60-day cash flow calendar projection.
 * 
 * This function:
 * 1. Calculates the starting balance from all active accounts
 * 2. Generates a 60-day date array starting from today
 * 3. Calculates all income occurrences within the date range
 * 4. Calculates all bill occurrences within the date range
 * 5. Projects daily balances by applying income and bills chronologically
 * 6. Identifies the lowest balance day
 * 7. Applies status colors based on the safety buffer threshold
 * 
 * @param accounts - Array of account records (uses is_spendable to determine active accounts)
 * @param income - Array of income source records
 * @param bills - Array of bill records
 * @param safetyBuffer - The minimum safety buffer amount for status color calculation (default: 500)
 * @returns CalendarData object containing 60 days of projected cash flow
 * 
 * @throws {Error} If accounts array is empty or invalid
 * @throws {Error} If date calculations fail
 */
export default function generateCalendar(
  accounts: AccountRecord[],
  income: IncomeRecord[],
  bills: BillRecord[],
  safetyBuffer: number = 500
): CalendarData {
  try {
    // Step 1: Calculate starting balance
    // Sum all active account balances
    // Note: Database schema uses is_spendable (not is_active) and current_balance (not balance)
    // Filtering to include accounts where is_spendable is true or null (treating null as active)
    const startingBalance = accounts
      .filter((a) => a.is_spendable !== false)
      .reduce((sum, a) => sum + a.current_balance, 0);

    // Step 2: Generate 60-day date array
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to start of day

    const dates: Date[] = [];
    for (let i = 0; i < 60; i++) {
      dates.push(addDays(today, i));
    }

    const endDate = dates[dates.length - 1];

    // Step 3: Calculate all income occurrences for the entire 60-day period
    const allIncomeOccurrences = income
      .filter(inc => inc.is_active !== false)
      .flatMap(inc => calculateIncomeOccurrences(inc, today, endDate));
    console.log('Total income occurrences:', allIncomeOccurrences.length);

    // Step 4: Calculate all bill occurrences for the entire 60-day period
    const allBillOccurrences = bills
      .filter(bill => bill.is_active !== false)
      .flatMap(bill => calculateBillOccurrences(bill, today, endDate));
    console.log('Total bill occurrences:', allBillOccurrences.length);

    // Step 5: Project daily balances using reduce to build array incrementally
    const days = dates.reduce((acc, date, index) => {
      const previousBalance = index === 0 ? startingBalance : acc[index - 1].balance;

      // Find income for this specific day
      const incomeToday = allIncomeOccurrences.filter(occ => isSameDay(occ.date, date));

      // Find bills for this specific day
      const billsToday = allBillOccurrences.filter(occ => isSameDay(occ.date, date));

      // Calculate totals
      const incomeAmount = incomeToday.reduce((sum, i) => sum + i.amount, 0);
      const billsAmount = billsToday.reduce((sum, b) => sum + b.amount, 0);

      // Debug logging for multiple transactions on same day
      if (incomeToday.length > 1 || billsToday.length > 1) {
        console.log('Multi-transaction day:', date.toDateString(), 'Income:', incomeToday.length, 'Bills:', billsToday.length, 'Total income:', incomeAmount, 'Total bills:', billsAmount);
      }

      // Calculate new balance
      const balance = previousBalance + incomeAmount - billsAmount;

      // Determine status using the safety buffer
      const status = getStatusColor(balance, safetyBuffer);
      console.log('Day', index, date.toDateString(), 'Bal:', balance.toFixed(0), 'Status:', status);

      acc.push({
        date: new Date(date),
        balance,
        income: incomeToday,
        bills: billsToday,
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

    // Step 7: Return CalendarData
    return {
      days,
      startingBalance,
      lowestBalance,
      lowestBalanceDay,
    };
  } catch (error) {
    console.error('Error generating calendar:', error);
    throw new Error(
      `Failed to generate calendar: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}
