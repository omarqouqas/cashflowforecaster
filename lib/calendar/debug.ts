import { format } from 'date-fns';
import { CalendarData } from './types';
import { formatCurrency } from '../utils/format';

/**
 * Status emoji mapping
 */
const STATUS_EMOJI: Record<string, string> = {
  green: '🟢',
  yellow: '🟡',
  orange: '🟠',
  red: '🔴',
};

/**
 * Debug utility for calendar data (development only).
 * 
 * Logs comprehensive information about the calendar including:
 * - Starting balance
 * - First 14 days with all transactions
 * - Lowest balance and when it occurred
 * - Summary statistics for 60 days
 * 
 * Uses emojis for visual clarity:
 * - 🟢 Green status
 * - 🟡 Yellow status
 * - 🟠 Orange status
 * - 🔴 Red status
 * - 💵 Income transactions
 * - 💸 Bill transactions
 * 
 * @param calendarData - The calendar data to debug
 */
export function debugCalendar(calendarData: CalendarData): void {
  console.log('\n' + '='.repeat(80));
  console.log('📅 CALENDAR DEBUG (Development Only)');
  console.log('='.repeat(80) + '\n');

  // 1. Starting Balance
  console.log('💰 STARTING BALANCE');
  console.log(`   ${formatCurrency(calendarData.startingBalance)}\n`);

  // 2. First 14 Days
  console.log('📆 FIRST 14 DAYS');
  console.log('-'.repeat(80));
  
  const first14Days = calendarData.days.slice(0, 14);
  first14Days.forEach((day) => {
    const dateStr = format(day.date, 'MMM d, yyyy');
    const statusEmoji = STATUS_EMOJI[day.status] || '⚪';
    const balanceStr = formatCurrency(day.balance);
    
    console.log(`\n${dateStr} ${statusEmoji} Balance: ${balanceStr}`);
    
    // Income transactions
    if (day.income.length > 0) {
      day.income.forEach((income) => {
        console.log(`   💵 ${formatCurrency(income.amount)} - ${income.name}`);
      });
    }
    
    // Bill transactions
    if (day.bills.length > 0) {
      day.bills.forEach((bill) => {
        console.log(`   💸 ${formatCurrency(bill.amount)} - ${bill.name}`);
      });
    }
  });

  // 3. Lowest Balance
  console.log('\n\n📉 LOWEST BALANCE');
  console.log('-'.repeat(80));
  const lowestStatusEmoji = STATUS_EMOJI[calendarData.days.find(d => 
    d.date.getTime() === calendarData.lowestBalanceDay.getTime()
  )?.status || 'red'] || '🔴';
  console.log(`   ${lowestStatusEmoji} ${formatCurrency(calendarData.lowestBalance)}`);
  console.log(`   Day: ${format(calendarData.lowestBalanceDay, 'MMM d, yyyy')}\n`);

  // 4. Summary Statistics (60 days)
  console.log('📊 SUMMARY STATISTICS (60 Days)');
  console.log('-'.repeat(80));
  
  const totalIncome = calendarData.days.reduce(
    (sum, day) => sum + day.income.reduce((s, t) => s + t.amount, 0),
    0
  );
  const totalBills = calendarData.days.reduce(
    (sum, day) => sum + day.bills.reduce((s, t) => s + t.amount, 0),
    0
  );
  
  const finalBalance = calendarData.days[59]?.balance ?? calendarData.days[calendarData.days.length - 1]?.balance ?? 0;
  const netChange = finalBalance - calendarData.startingBalance;

  console.log(`   💵 Total Income: ${formatCurrency(totalIncome)}`);
  console.log(`   💸 Total Bills: ${formatCurrency(totalBills)}`);
  console.log(`   📈 Net Change: ${formatCurrency(netChange)}`);
  console.log(`   💰 Final Balance (Day 59): ${formatCurrency(finalBalance)}`);

  console.log('\n' + '='.repeat(80) + '\n');
}

