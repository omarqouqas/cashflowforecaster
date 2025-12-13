import { parseISO, startOfDay, isAfter, isBefore, isEqual } from 'date-fns';
import { Transaction } from './types';
import { getNextWeeklyDate, getNextBiweeklyDate, parseLocalDate } from './utils';

const CALENDAR_VERBOSE =
  typeof process !== 'undefined' &&
  typeof process.env !== 'undefined' &&
  process.env.CALENDAR_VERBOSE === 'true';

/**
 * Income record structure for calculating occurrences.
 */
interface IncomeRecord {
  /** Unique identifier for the income source */
  id: string;
  /** Name of the income source */
  name: string;
  /** Amount of the income */
  amount: number;
  /** Frequency: 'weekly', 'biweekly', 'monthly', 'one-time', or 'irregular' */
  frequency: string;
  /** Whether this income source is currently active */
  is_active: boolean | null;
  /** Next occurrence date (start date for recurring income) */
  next_date?: string;
  /** Start date (fallback if next_date is not available) */
  start_date?: string;
  /** End date (optional, stops recurring income after this date) */
  end_date?: string | null;
}

/**
 * Calculates all income transaction occurrences within a date range.
 * 
 * Handles different frequencies:
 * - weekly: every 7 days from next_date, using getNextWeeklyDate helper
 * - biweekly: every 14 days from next_date, using getNextBiweeklyDate helper
 * - monthly: same day each month, handling month-end edge cases (e.g., Jan 31 → Feb 28)
 * - one-time: includes if next_date falls within the range
 * - irregular: returns empty array (cannot predict)
 * 
 * Only includes occurrences if is_active is true.
 * Stops adding occurrences after end_date if it exists and is before endDate.
 * 
 * @param income - The income record to calculate occurrences for
 * @param startDate - Start date of the calendar range (inclusive)
 * @param endDate - End date of the calendar range (inclusive)
 * @returns Array of Transaction objects representing income occurrences
 */
export function calculateIncomeOccurrences(
  income: IncomeRecord,
  startDate: string | Date,
  endDate: string | Date
): Transaction[] {
  // Detailed logging at start
  if (CALENDAR_VERBOSE) {
    console.log('=== Income:', income.name, '===');
    console.log('Amount:', income.amount);
    console.log('Frequency:', income.frequency);
    console.log('Next date:', income.next_date);
    console.log('Is active:', income.is_active);
  }

  // Check if income is active (treat undefined/null as active - default behavior)
  if (CALENDAR_VERBOSE) {
    console.log('Active check:', income.is_active !== false ? 'ACTIVE' : 'INACTIVE');
  }
  if (income.is_active === false) {
    if (CALENDAR_VERBOSE) console.log('Total occurrences:', 0);
    return [];
  }

  // Check if income.next_date exists, fallback to income.start_date
  const startDateValue = income.next_date || income.start_date;
  const dateFieldUsed = income.next_date ? 'next_date' : 'start_date';
  if (CALENDAR_VERBOSE) {
    console.log('Using date field:', dateFieldUsed, 'with value:', startDateValue);
  }

  // Validate the date
  if (!startDateValue) {
    console.error('Invalid date for income:', income.name, '- both next_date and start_date are missing');
    return [];
  }

  const parsedStartDate = parseLocalDate(startDateValue);
  if (isNaN(parsedStartDate.getTime())) {
    console.error('Invalid date for income:', income.name, '- date value is not a valid date:', startDateValue);
    return [];
  }

  // Normalize frequency to handle case and whitespace variations
  const frequency = income.frequency.toLowerCase().trim();

  const rangeStart = typeof startDate === 'string' ? parseISO(startDate) : startDate;
  const rangeEnd = typeof endDate === 'string' ? parseISO(endDate) : endDate;
  const incomeNextDate = parsedStartDate;
  const incomeEndDate = income.end_date ? parseLocalDate(income.end_date) : null;

  const occurrences: Transaction[] = [];
  const rangeStartDay = startOfDay(rangeStart);
  const rangeEndDay = startOfDay(rangeEnd);
  const incomeNextDay = startOfDay(incomeNextDate);

  // If income next_date is after the range end, return empty
  if (isAfter(incomeNextDay, rangeEndDay)) {
    return [];
  }

  // If income has an end_date and it's before the range start, return empty
  if (incomeEndDate && isBefore(incomeEndDate, rangeStartDay)) {
    return [];
  }

  // Determine the effective end date (use income end_date if it's before range end)
  const effectiveEndDate = incomeEndDate && isBefore(incomeEndDate, rangeEndDay)
    ? incomeEndDate
    : rangeEndDay;

  switch (frequency) {
    case 'weekly': {
      if (CALENDAR_VERBOSE) console.log('Processing', frequency, 'income');
      // Start from income.next_date
      let currentDate = incomeNextDay;

      // If next_date is before range start, find first occurrence in range
      if (isBefore(currentDate, rangeStartDay)) {
        currentDate = getNextWeeklyDate(incomeNextDay, rangeStartDay);
      }

      // Add occurrence every 7 days, continue until past effectiveEndDate
      while (!isAfter(currentDate, effectiveEndDate)) {
        if (CALENDAR_VERBOSE) console.log('Added occurrence:', currentDate.toDateString());
        occurrences.push({
          date: new Date(currentDate),
          id: income.id,
          name: income.name,
          amount: income.amount,
          type: 'income',
          frequency: income.frequency,
        });

        // Get next weekly occurrence - create new Date object before incrementing
        currentDate = new Date(currentDate);
        currentDate.setDate(currentDate.getDate() + 7);
      }
      break;
    }

    case 'biweekly': {
      if (CALENDAR_VERBOSE) console.log('Processing', frequency, 'income');
      // Start from income.next_date
      let currentDate = incomeNextDay;

      // If next_date is before range start, find first occurrence in range
      if (isBefore(currentDate, rangeStartDay)) {
        currentDate = getNextBiweeklyDate(incomeNextDay, rangeStartDay);
      }

      if (CALENDAR_VERBOSE) {
        console.log('Starting biweekly loop - currentDate:', currentDate.toDateString());
        console.log('End date:', effectiveEndDate.toDateString());
        console.log('Condition check:', !isAfter(currentDate, effectiveEndDate));
      }

      // Add occurrence every 14 days, continue until past effectiveEndDate
      while (!isAfter(currentDate, effectiveEndDate)) {
        if (CALENDAR_VERBOSE) {
          console.log('INSIDE LOOP - currentDate:', currentDate.toDateString());
          console.log('Added occurrence:', currentDate.toDateString());
        }
        occurrences.push({
          date: new Date(currentDate),
          id: income.id,
          name: income.name,
          amount: income.amount,
          type: 'income',
          frequency: income.frequency,
        });

        // Get next biweekly occurrence - create new Date object before incrementing
        currentDate = new Date(currentDate);
        currentDate.setDate(currentDate.getDate() + 14);
        if (CALENDAR_VERBOSE) console.log('Incremented to:', currentDate.toDateString());
      }
      if (CALENDAR_VERBOSE) console.log('Loop ended - final currentDate:', currentDate.toDateString());
      break;
    }

    case 'monthly': {
      // Use the already-validated parsedStartDate to avoid relying on string formats.
      const baseDate = parsedStartDate;
      const targetDay = baseDate.getDate();

      const initialYear = baseDate.getFullYear();
      const initialMonthIndex = baseDate.getMonth(); // 0-based

      // Ensure initial date is valid for the month (handle month-end edge cases)
      const lastDayOfInitialMonth = new Date(initialYear, initialMonthIndex + 1, 0).getDate();
      const initialDayToUse = Math.min(targetDay, lastDayOfInitialMonth);
      let currentDate = new Date(initialYear, initialMonthIndex, initialDayToUse, 12, 0, 0);
      
      if (CALENDAR_VERBOSE) console.log('Processing monthly income');
      
      // If next_date is before range start, find first occurrence in range
      if (isBefore(startOfDay(currentDate), rangeStartDay)) {
        // Find the next monthly occurrence
        while (currentDate < rangeStartDay) {
          // Increment month with month-end handling
          let nextMonth = currentDate.getMonth() + 1;
          let nextYear = currentDate.getFullYear();
          
          if (nextMonth > 11) {
            nextMonth = 0;
            nextYear++;
          }
          
          const lastDayOfNextMonth = new Date(nextYear, nextMonth + 1, 0).getDate();
          const dayToUse = Math.min(targetDay, lastDayOfNextMonth);
          
          currentDate = new Date(nextYear, nextMonth, dayToUse, 12, 0, 0);
        }
      }
      
      while (currentDate <= effectiveEndDate) {
        if (currentDate >= rangeStartDay) {
          occurrences.push({
            date: new Date(currentDate),
            id: income.id,
            name: income.name,
            amount: income.amount,
            type: 'income',
            frequency: income.frequency
          });
          if (CALENDAR_VERBOSE) console.log('Added occurrence:', currentDate.toDateString());
        }
        
        // Increment month with month-end handling
        let nextMonth = currentDate.getMonth() + 1;
        let nextYear = currentDate.getFullYear();
        
        if (nextMonth > 11) {
          nextMonth = 0;
          nextYear++;
        }
        
        const lastDayOfNextMonth = new Date(nextYear, nextMonth + 1, 0).getDate();
        const dayToUse = Math.min(targetDay, lastDayOfNextMonth);
        
        currentDate = new Date(nextYear, nextMonth, dayToUse, 12, 0, 0);
      }
      
      break;
    }

    case 'one-time': {
      if (CALENDAR_VERBOSE) console.log('Processing', frequency, 'income');
      // Check if next_date is within range [startDate, endDate]
      if (
        (isAfter(incomeNextDay, rangeStartDay) || isEqual(incomeNextDay, rangeStartDay)) &&
        (isBefore(incomeNextDay, rangeEndDay) || isEqual(incomeNextDay, rangeEndDay))
      ) {
        // If yes, add single occurrence
        occurrences.push({
          date: new Date(incomeNextDay),
          id: income.id,
          name: income.name,
          amount: income.amount,
          type: 'income',
          frequency: income.frequency,
        });
      }
      // If no, return empty array (already initialized as empty)
      break;
    }

    case 'irregular': {
      if (CALENDAR_VERBOSE) console.log('Processing', frequency, 'income');
      // Return empty array (cannot predict)
      break;
    }

    default:
      if (CALENDAR_VERBOSE) console.log('Processing', frequency, 'income');
      // Unknown frequency, return empty array
      break;
  }

  if (CALENDAR_VERBOSE) console.log('Total occurrences:', occurrences.length);
  return occurrences;
}
