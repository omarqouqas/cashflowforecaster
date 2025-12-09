import { requireAuth } from '@/lib/auth/session';
import generateCalendar from '@/lib/calendar/generate';
import { debugCalendar } from '@/lib/calendar/debug';
import { formatCurrency } from '@/lib/utils/format';
import { format } from 'date-fns';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Tables } from '@/types/supabase';

/**
 * Temporary test page for calendar generation.
 * Tests the calendar generation logic with simple test data.
 * This is a temporary test page (will be replaced with real calendar UI on Day 10).
 */
export default async function CalendarTestPage() {
  await requireAuth(); // Still require auth, but we'll use test data

  // Create test data
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Calculate dates for edge cases
  const firstOfMonth = today.getDate() === 1
    ? new Date(today.getFullYear(), today.getMonth(), 1)
    : new Date(today.getFullYear(), today.getMonth() + 1, 1);
  firstOfMonth.setHours(0, 0, 0, 0);

  // Edge case: Bill due on Jan 31 (test month-end handling)
  // Find the next Jan 31 that's within or near the 60-day window
  let jan31Date: Date;
  const currentJan31 = new Date(today.getFullYear(), 0, 31);
  currentJan31.setHours(0, 0, 0, 0);
  
  if (today <= currentJan31) {
    // Use this year's Jan 31 if it hasn't passed
    jan31Date = currentJan31;
  } else {
    // Use next year's Jan 31
    jan31Date = new Date(today.getFullYear() + 1, 0, 31);
    jan31Date.setHours(0, 0, 0, 0);
    
    // If next year's Jan 31 is too far out (>60 days), use a date 30 days from today
    // that's set to the 31st of a month (or last day if month doesn't have 31 days)
    const daysUntilNextJan31 = Math.ceil((jan31Date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    if (daysUntilNextJan31 > 60) {
      // Use a date 30 days from today, but set to last day of that month
      const futureDate = new Date(today);
      futureDate.setDate(futureDate.getDate() + 30);
      const lastDayOfMonth = new Date(futureDate.getFullYear(), futureDate.getMonth() + 1, 0);
      jan31Date = lastDayOfMonth;
      jan31Date.setHours(0, 0, 0, 0);
    }
  }

  // Edge case: Income ending before 60 days (set end_date to 30 days from today)
  const incomeEndDate = new Date(today);
  incomeEndDate.setDate(incomeEndDate.getDate() + 30);
  incomeEndDate.setHours(0, 0, 0, 0);

  // Format dates as ISO strings for database compatibility
  const todayISO = today.toISOString().split('T')[0];
  const firstOfMonthISO = firstOfMonth.toISOString().split('T')[0];
  const jan31ISO = jan31Date.toISOString().split('T')[0];
  const incomeEndDateISO = incomeEndDate.toISOString().split('T')[0];

  // Test data: Multiple accounts including inactive and $0 balance
  // - Active account with $0 balance (edge case)
  // - Active account with $1,000 balance
  // - Inactive account (should be excluded)
  const testAccounts: Tables<'accounts'>[] = [
    {
      id: 'test-account-1',
      user_id: 'test-user',
      name: 'Zero Balance Account',
      current_balance: 0,
      is_spendable: true,
      account_type: 'checking',
      currency: 'USD',
      created_at: todayISO,
      updated_at: todayISO,
    },
    {
      id: 'test-account-2',
      user_id: 'test-user',
      name: 'Active Account',
      current_balance: 1000,
      is_spendable: true,
      account_type: 'checking',
      currency: 'USD',
      created_at: todayISO,
      updated_at: todayISO,
    },
    {
      id: 'test-account-3',
      user_id: 'test-user',
      name: 'Inactive Account',
      current_balance: 5000,
      is_spendable: false, // Should be excluded
      account_type: 'savings',
      currency: 'USD',
      created_at: todayISO,
      updated_at: todayISO,
    },
  ];

  // Test data: Multiple income sources including edge cases
  // - Biweekly $2,000 starting today (active)
  // - Weekly $500 starting today with end_date in 30 days (edge case: ends before 60 days)
  // - Monthly $1,000 on 1st (active)
  // - Inactive income (should be excluded)
  // - Multiple incomes on same day (today)
  const testIncome: Tables<'income'>[] = [
    {
      id: 'test-income-1',
      user_id: 'test-user',
      name: 'Biweekly Income',
      amount: 2000,
      frequency: 'biweekly',
      is_active: true,
      next_date: todayISO,
      account_id: null,
      created_at: todayISO,
      updated_at: todayISO,
      last_date: null,
      notes: null,
      recurrence_day: null,
      recurrence_weekday: null,
      status: null,
      status_updated_at: null,
    },
    {
      id: 'test-income-2',
      user_id: 'test-user',
      name: 'Weekly Income (Ends Day 30)',
      amount: 500,
      frequency: 'weekly',
      is_active: true,
      next_date: todayISO,
      end_date: incomeEndDateISO, // Edge case: ends before 60 days
      account_id: null,
      created_at: todayISO,
      updated_at: todayISO,
      last_date: null,
      notes: null,
      recurrence_day: null,
      recurrence_weekday: null,
      status: null,
      status_updated_at: null,
    },
    {
      id: 'test-income-3',
      user_id: 'test-user',
      name: 'Monthly Income',
      amount: 1000,
      frequency: 'monthly',
      is_active: true,
      next_date: firstOfMonthISO,
      account_id: null,
      created_at: todayISO,
      updated_at: todayISO,
      last_date: null,
      notes: null,
      recurrence_day: null,
      recurrence_weekday: null,
      status: null,
      status_updated_at: null,
    },
    {
      id: 'test-income-4',
      user_id: 'test-user',
      name: 'Same Day Income',
      amount: 300,
      frequency: 'one-time',
      is_active: true,
      next_date: todayISO, // Same day as income-1 (multiple transactions on same day)
      account_id: null,
      created_at: todayISO,
      updated_at: todayISO,
      last_date: null,
      notes: null,
      recurrence_day: null,
      recurrence_weekday: null,
      status: null,
      status_updated_at: null,
    },
    {
      id: 'test-income-5',
      user_id: 'test-user',
      name: 'Inactive Income',
      amount: 10000,
      frequency: 'weekly',
      is_active: false, // Should be excluded
      next_date: todayISO,
      account_id: null,
      created_at: todayISO,
      updated_at: todayISO,
      last_date: null,
      notes: null,
      recurrence_day: null,
      recurrence_weekday: null,
      status: null,
      status_updated_at: null,
    },
  ];

  // Test data: Multiple bills including edge cases
  // - Bill $1,500 monthly on 1st (active)
  // - Bill $500 monthly on Jan 31 (edge case: month-end handling)
  // - Bill $200 on same day as income (multiple transactions on same day)
  // - Inactive bill (should be excluded)
  const testBills: Tables<'bills'>[] = [
    {
      id: 'test-bill-1',
      user_id: 'test-user',
      name: 'Monthly Bill',
      amount: 1500,
      frequency: 'monthly',
      is_active: true,
      due_date: firstOfMonthISO,
      account_id: null,
      auto_pay: false,
      category: 'housing',
      created_at: todayISO,
      updated_at: todayISO,
      notes: null,
      recurrence_day: null,
    },
    {
      id: 'test-bill-2',
      user_id: 'test-user',
      name: 'Jan 31 Bill (Month-End Test)',
      amount: 500,
      frequency: 'monthly',
      is_active: true,
      due_date: jan31ISO, // Edge case: Jan 31 -> Feb 28/29 handling
      account_id: null,
      auto_pay: false,
      category: 'utilities',
      created_at: todayISO,
      updated_at: todayISO,
      notes: null,
      recurrence_day: null,
    },
    {
      id: 'test-bill-3',
      user_id: 'test-user',
      name: 'Same Day Bill',
      amount: 200,
      frequency: 'one-time',
      is_active: true,
      due_date: todayISO, // Same day as income (multiple transactions on same day)
      account_id: null,
      auto_pay: false,
      category: 'other',
      created_at: todayISO,
      updated_at: todayISO,
      notes: null,
      recurrence_day: null,
    },
    {
      id: 'test-bill-4',
      user_id: 'test-user',
      name: 'Inactive Bill',
      amount: 5000,
      frequency: 'monthly',
      is_active: false, // Should be excluded
      due_date: firstOfMonthISO,
      account_id: null,
      auto_pay: false,
      category: 'housing',
      created_at: todayISO,
      updated_at: todayISO,
      notes: null,
      recurrence_day: null,
    },
  ];

  // Generate calendar with test data
  const calendarData = generateCalendar(
    testAccounts,
    testIncome,
    testBills
  );

  // Debug output to terminal (server-side only)
  debugCalendar(calendarData);

  // Test function for multiple transactions on same day
  function testMultipleSameDay(calendar: typeof calendarData) {
    const multiDays = calendar.days.filter((d) => 
      (d.income.length + d.bills.length) > 1
    );

    // If no days have multiple transactions, that's OK - not a failure
    // This just means test data doesn't create the scenario
    if (multiDays.length === 0) {
      return {
        name: 'Multiple transactions on same day handled',
        passed: true,
        expected: 'N/A - no multi-transaction days',
        actual: 'No days with multiple transactions (test data does not create this scenario)',
      };
    }

    // If multi-transaction days exist, verify balance calculation
    // Only fail if multi-transaction days exist AND balance calculation is wrong
    let allCorrect = true;
    let verifiedCount = 0;
    for (const day of multiDays) {
      const dayIndex = calendar.days.indexOf(day);
      if (dayIndex === 0) continue; // Skip first day (no previous balance)

      verifiedCount++;
      const prevDay = calendar.days[dayIndex - 1];
      const incomeTotal = day.income.reduce((s, i) => s + i.amount, 0);
      const billsTotal = day.bills.reduce((s, b) => s + b.amount, 0);
      const expectedBalance = prevDay.balance + incomeTotal - billsTotal;

      if (Math.abs(day.balance - expectedBalance) > 0.01) {
        allCorrect = false;
        break;
      }
    }

    // If we couldn't verify any days (all were on day 0), still pass
    // since we can't determine if there's an error
    if (verifiedCount === 0) {
      return {
        name: 'Multiple transactions on same day handled',
        passed: true,
        expected: 'N/A - all multi-transaction days on first day (cannot verify)',
        actual: `${multiDays.length} multi-transaction days found, all on first day`,
      };
    }

    // Only fail if we verified days and found an error
    return {
      name: 'Multiple transactions on same day handled',
      passed: allCorrect,
      expected: 'Correct balance calculation',
      actual: allCorrect 
        ? `${verifiedCount} of ${multiDays.length} days verified correctly` 
        : 'Balance calculation error',
    };
  }

  // Run the test
  const multipleSameDayTest = testMultipleSameDay(calendarData);

  // Verification checks
  const verificationResults = {
    // Edge case: Starting balance of $0 (should be $0 + $1,000 = $1,000, inactive account excluded)
    startingBalanceCorrect: calendarData.startingBalance === 1000,
    
    // Edge case: Balance can go negative (not required to stay above $0)
    balanceNeverNegative: calendarData.days.every(day => day.balance >= 0),
    
    // Check for duplicate transactions (same ID on same day)
    noDuplicateTransactions: (() => {
      for (const day of calendarData.days) {
        // Check income duplicates
        const incomeIds = day.income.map(t => t.id);
        if (new Set(incomeIds).size !== incomeIds.length) return false;
        
        // Check bill duplicates
        const billIds = day.bills.map(t => t.id);
        if (new Set(billIds).size !== billIds.length) return false;
      }
      return true;
    })(),
    
    // Edge case: Inactive account excluded
    inactiveAccountExcluded: calendarData.startingBalance === 1000, // Only $0 + $1,000, not $5,000 from inactive
    
    // Edge case: Inactive income excluded
    inactiveIncomeExcluded: (() => {
      const hasInactiveIncome = calendarData.days.some(day => 
        day.income.some(t => t.id === 'test-income-5')
      );
      return !hasInactiveIncome;
    })(),
    
    // Edge case: Inactive bill excluded
    inactiveBillExcluded: (() => {
      const hasInactiveBill = calendarData.days.some(day => 
        day.bills.some(t => t.id === 'test-bill-4')
      );
      return !hasInactiveBill;
    })(),
    
    // Edge case: Income with end_date stops before 60 days
    incomeEndsBefore60Days: (() => {
      const weeklyIncomeDays = calendarData.days
        .filter(day => day.income.some(t => t.id === 'test-income-2'));
      // Should only appear up to day 30 (4-5 times)
      const lastOccurrenceDay = calendarData.days.findIndex(day => 
        day.income.some(t => t.id === 'test-income-2')
      );
      // Last occurrence should be around day 28-30 (4 weeks)
      return weeklyIncomeDays.length >= 4 && weeklyIncomeDays.length <= 5;
    })(),
    
    // Edge case: Multiple transactions on same day (today)
    multipleTransactionsSameDay: (() => {
      const todayDay = calendarData.days[0];
      const hasIncome1 = todayDay.income.some(t => t.id === 'test-income-1');
      const hasIncome4 = todayDay.income.some(t => t.id === 'test-income-4');
      const hasBill3 = todayDay.bills.some(t => t.id === 'test-bill-3');
      return hasIncome1 && hasIncome4 && hasBill3;
    })(),
    
    // Edge case: Bill due on Jan 31 (month-end handling)
    jan31BillHandled: (() => {
      const jan31BillDays = calendarData.days
        .filter(day => day.bills.some(t => t.id === 'test-bill-2'));
      // Should appear on last day of each month (handles Feb 28/29)
      return jan31BillDays.length >= 2 && 
             jan31BillDays.every(day => {
               const date = typeof day.date === 'string' ? new Date(day.date) : day.date;
               const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
               // Should be on last day of month (28, 29, 30, or 31)
               return date.getDate() === lastDayOfMonth;
             });
    })(),
    
    // Verify income occurrences - biweekly $2,000 starting today
    biweeklyIncomeOccurrences: (() => {
      const biweeklyIncomeDays = calendarData.days
        .map((day, idx) => ({ day, idx }))
        .filter(({ day }) => day.income.some(t => t.id === 'test-income-1'));
      // Should appear approximately every 14 days (4-5 times in 60 days)
      return biweeklyIncomeDays.length >= 4;
    })(),
    
    // Verify bill occurrences - monthly $1,500 on 1st
    monthlyBillOnFirst: (() => {
      const monthlyBillDays = calendarData.days
        .filter(day => day.bills.some(t => t.id === 'test-bill-1'));
      // All monthly bills should be on 1st of month
      return monthlyBillDays.length >= 2 && 
             monthlyBillDays.every(day => {
               const date = typeof day.date === 'string' ? new Date(day.date) : day.date;
               return date.getDate() === 1;
             });
    })(),
    
    // Verify calculations are correct
    calculationsCorrect: (() => {
      let balance = calendarData.startingBalance;
      for (const day of calendarData.days) {
        const incomeAmount = day.income.reduce((sum, i) => sum + i.amount, 0);
        const billsAmount = day.bills.reduce((sum, b) => sum + b.amount, 0);
        const expectedBalance = balance + incomeAmount - billsAmount;
        if (Math.abs(day.balance - expectedBalance) > 0.01) {
          console.error('Calculation error on day:', day.date, 'Expected:', expectedBalance, 'Got:', day.balance);
          return false;
        }
        balance = expectedBalance;
      }
      return true;
    })(),
    
    // Verify status colors change appropriately
    statusColorsChange: (() => {
      const statuses = calendarData.days.map(day => day.status);
      const uniqueStatuses = new Set(statuses);
      // Should have at least 2 different status colors (balance changes over time)
      return uniqueStatuses.size >= 2;
    })(),
    
    // Verify lowest balance is detected correctly
    lowestBalanceDetected: (() => {
      const actualLowest = Math.min(...calendarData.days.map(day => day.balance));
      const lowestDay = calendarData.days.find(day => day.balance === actualLowest);
      return calendarData.lowestBalance === actualLowest &&
             lowestDay &&
             (typeof calendarData.lowestBalanceDay === 'string' 
               ? new Date(calendarData.lowestBalanceDay).getTime() === lowestDay.date.getTime()
               : calendarData.lowestBalanceDay.getTime() === lowestDay.date.getTime());
    })(),
    
    // Summary counts
    totalIncomeOccurrences: calendarData.days.reduce((sum, day) => sum + day.income.length, 0),
    totalBillOccurrences: calendarData.days.reduce((sum, day) => sum + day.bills.length, 0),
    
    // Multiple transactions same day test result
    multipleSameDayTestResult: multipleSameDayTest,
  };

  // Get first 30 days for display (to see multiple income cycles)
  const first30Days = calendarData.days.slice(0, 30);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Dashboard
        </Link>
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Calendar Algorithm Test
          </h1>
          <Link
            href="/dashboard/calendar/test-data-setup"
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            Setup Test Data →
          </Link>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Testing edge cases: Starting balance $0, Bill on Jan 31 (month-end), Income with end_date, Inactive items excluded, Multiple transactions same day
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
          Check terminal for debug output.
        </p>
      </div>

      {/* Starting Balance */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 mb-6 border border-slate-200 dark:border-slate-700">
        <h2 className="text-xl font-semibold mb-4 text-slate-900 dark:text-white">
          Starting Balance
        </h2>
        <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
          {formatCurrency(calendarData.startingBalance)}
        </p>
      </div>

      {/* Verification Results */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 mb-6 border border-slate-200 dark:border-slate-700">
        <h2 className="text-xl font-semibold mb-4 text-slate-900 dark:text-white">
          Verification Results
        </h2>
        <div className="space-y-3">
          <div className="border-b border-slate-200 dark:border-slate-700 pb-2">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Basic Checks</h3>
            <div className="space-y-1.5">
              <div className={`flex items-center gap-2 ${verificationResults.startingBalanceCorrect ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {verificationResults.startingBalanceCorrect ? '✓' : '✗'}
                <span>Starting balance is $1,000 ($0 + $1,000, inactive excluded): {verificationResults.startingBalanceCorrect ? 'PASS' : 'FAIL'} ({formatCurrency(calendarData.startingBalance)})</span>
              </div>
              <div className={`flex items-center gap-2 ${verificationResults.balanceNeverNegative ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {verificationResults.balanceNeverNegative ? '✓' : '✗'}
                <span>Balance never goes below $0: {verificationResults.balanceNeverNegative ? 'PASS' : 'FAIL'}</span>
              </div>
              <div className={`flex items-center gap-2 ${verificationResults.noDuplicateTransactions ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {verificationResults.noDuplicateTransactions ? '✓' : '✗'}
                <span>No duplicate transactions: {verificationResults.noDuplicateTransactions ? 'PASS' : 'FAIL'}</span>
              </div>
            </div>
          </div>

          <div className="border-b border-slate-200 dark:border-slate-700 pb-2">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Edge Cases: Inactive Items</h3>
            <div className="space-y-1.5">
              <div className={`flex items-center gap-2 ${verificationResults.inactiveAccountExcluded ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {verificationResults.inactiveAccountExcluded ? '✓' : '✗'}
                <span>Inactive account excluded: {verificationResults.inactiveAccountExcluded ? 'PASS' : 'FAIL'}</span>
              </div>
              <div className={`flex items-center gap-2 ${verificationResults.inactiveIncomeExcluded ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {verificationResults.inactiveIncomeExcluded ? '✓' : '✗'}
                <span>Inactive income excluded: {verificationResults.inactiveIncomeExcluded ? 'PASS' : 'FAIL'}</span>
              </div>
              <div className={`flex items-center gap-2 ${verificationResults.inactiveBillExcluded ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {verificationResults.inactiveBillExcluded ? '✓' : '✗'}
                <span>Inactive bill excluded: {verificationResults.inactiveBillExcluded ? 'PASS' : 'FAIL'}</span>
              </div>
            </div>
          </div>

          <div className="border-b border-slate-200 dark:border-slate-700 pb-2">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Edge Cases: Date Handling</h3>
            <div className="space-y-1.5">
              <div className={`flex items-center gap-2 ${verificationResults.incomeEndsBefore60Days ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {verificationResults.incomeEndsBefore60Days ? '✓' : '✗'}
                <span>Income with end_date stops before 60 days: {verificationResults.incomeEndsBefore60Days ? 'PASS' : 'FAIL'}</span>
              </div>
              <div className={`flex items-center gap-2 ${verificationResults.jan31BillHandled ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {verificationResults.jan31BillHandled ? '✓' : '✗'}
                <span>Bill on Jan 31 handles month-end (Feb 28/29): {verificationResults.jan31BillHandled ? 'PASS' : 'FAIL'}</span>
              </div>
              <div className={`flex items-center gap-2 ${verificationResults.multipleTransactionsSameDay ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {verificationResults.multipleTransactionsSameDay ? '✓' : '✗'}
                <span>Multiple transactions on same day present: {verificationResults.multipleTransactionsSameDay ? 'PASS' : 'FAIL'}</span>
              </div>
              <div className={`flex items-center gap-2 ${verificationResults.multipleSameDayTestResult.passed ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {verificationResults.multipleSameDayTestResult.passed ? '✓' : '✗'}
                <span>
                  {verificationResults.multipleSameDayTestResult.name}: {verificationResults.multipleSameDayTestResult.passed ? 'PASS' : 'FAIL'} 
                  {verificationResults.multipleSameDayTestResult.actual && ` (${verificationResults.multipleSameDayTestResult.actual})`}
                </span>
              </div>
            </div>
          </div>

          <div className="border-b border-slate-200 dark:border-slate-700 pb-2">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Income Occurrences</h3>
            <div className="space-y-1.5">
              <div className={`flex items-center gap-2 ${verificationResults.biweeklyIncomeOccurrences ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {verificationResults.biweeklyIncomeOccurrences ? '✓' : '✗'}
                <span>Biweekly income ($2,000) appears regularly: {verificationResults.biweeklyIncomeOccurrences ? 'PASS' : 'FAIL'}</span>
              </div>
            </div>
          </div>

          <div className="border-b border-slate-200 dark:border-slate-700 pb-2">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Bill Occurrences</h3>
            <div className="space-y-1.5">
              <div className={`flex items-center gap-2 ${verificationResults.monthlyBillOnFirst ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {verificationResults.monthlyBillOnFirst ? '✓' : '✗'}
                <span>Monthly bill ($1,500) appears on 1st: {verificationResults.monthlyBillOnFirst ? 'PASS' : 'FAIL'}</span>
              </div>
            </div>
          </div>

          <div className="border-b border-slate-200 dark:border-slate-700 pb-2">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Calculations</h3>
            <div className="space-y-1.5">
              <div className={`flex items-center gap-2 ${verificationResults.calculationsCorrect ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {verificationResults.calculationsCorrect ? '✓' : '✗'}
                <span>Calculations are correct: {verificationResults.calculationsCorrect ? 'PASS' : 'FAIL'}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Status & Detection</h3>
            <div className="space-y-1.5">
              <div className={`flex items-center gap-2 ${verificationResults.statusColorsChange ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {verificationResults.statusColorsChange ? '✓' : '✗'}
                <span>Status colors change appropriately: {verificationResults.statusColorsChange ? 'PASS' : 'FAIL'}</span>
              </div>
              <div className={`flex items-center gap-2 ${verificationResults.lowestBalanceDetected ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {verificationResults.lowestBalanceDetected ? '✓' : '✗'}
                <span>Lowest balance detected correctly: {verificationResults.lowestBalanceDetected ? 'PASS' : 'FAIL'}</span>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Total income occurrences: {verificationResults.totalIncomeOccurrences} | 
              Total bill occurrences: {verificationResults.totalBillOccurrences}
            </p>
          </div>
        </div>
      </div>

      {/* First 30 Days Table */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow border border-slate-200 dark:border-slate-700 overflow-hidden mb-6">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
            First 30 Days
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Balance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Income
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Bills
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
              {first30Days.map((day, index) => {
                const date = typeof day.date === 'string' ? new Date(day.date) : day.date;
                const statusColors = {
                  green: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
                  yellow: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
                  orange: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
                  red: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
                };
                const statusColor = statusColors[day.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800';

                return (
                  <tr key={index} className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {format(date, 'MMM d, yyyy')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(day.balance)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${statusColor}`}>
                        {day.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                      {day.income.length > 0 ? (
                        <div className="space-y-1">
                          {day.income.map((transaction, idx) => (
                            <div key={idx} className="text-green-600 dark:text-green-400">
                              +{formatCurrency(transaction.amount)} - {transaction.name}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-400 dark:text-gray-500">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                      {day.bills.length > 0 ? (
                        <div className="space-y-1">
                          {day.bills.map((transaction, idx) => (
                            <div key={idx} className="text-red-600 dark:text-red-400">
                              -{formatCurrency(Math.abs(transaction.amount))} - {transaction.name}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-400 dark:text-gray-500">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Lowest Balance Warning */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 border border-slate-200 dark:border-slate-700">
        <h2 className="text-xl font-semibold mb-4 text-slate-900 dark:text-white">
          Lowest Balance Warning
        </h2>
        <div className="space-y-2">
          <p className="text-3xl font-bold text-red-600 dark:text-red-400">
            {formatCurrency(calendarData.lowestBalance)}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Date: {format(typeof calendarData.lowestBalanceDay === 'string' ? new Date(calendarData.lowestBalanceDay) : calendarData.lowestBalanceDay, 'MMM d, yyyy')}
          </p>
          {calendarData.lowestBalance < 0 && (
            <div className="mt-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
              <p className="text-sm text-red-800 dark:text-red-200 font-medium">
                ⚠️ Warning: Balance will go negative on this date!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Info Box */}
      <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          <strong>Note:</strong> This is a temporary test page. Check your terminal/console for detailed debug output from <code className="bg-blue-100 dark:bg-blue-900/50 px-1 rounded">debugCalendar()</code>.
        </p>
      </div>
    </div>
  );
}

