import { parseISO, isAfter, isBefore, isEqual } from 'date-fns';
import { Transaction } from './types';
import { getNextWeeklyDate, getNextBiweeklyDate, parseLocalDate, normalizeToNoon } from './utils';

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
  /** Frequency: 'weekly', 'biweekly', 'semi-monthly', 'monthly', 'one-time', or 'irregular' */
  frequency: string;
  /** Whether this income source is currently active */
  is_active: boolean | null;
  /** Optional status for invoice-linked income (e.g., 'pending' | 'confirmed') */
  status?: string | null;
  /** Optional linked invoice id (for invoice-linked income) */
  invoice_id?: string | null;
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
 * - semi-monthly: twice per month (e.g., 1st & 15th, or 15th & last day)
 * - monthly: same day each month, handling month-end edge cases (e.g., Jan 31 → Feb 28)
 * - quarterly: every 3 months from next_date on the same day of month
 * - annually: every 12 months from next_date on the same month and day each year
 * - one-time: includes if next_date falls within the range
 * - irregular: shows once on next_date (user updates next_date when they know the next payment)
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
  // Use noon to avoid timezone shifts when dates are serialized
  const rangeStartDay = normalizeToNoon(rangeStart);
  const rangeEndDay = normalizeToNoon(rangeEnd);
  const incomeNextDay = normalizeToNoon(incomeNextDate);

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
          date: normalizeToNoon(currentDate),
          id: income.id,
          name: income.name,
          amount: income.amount,
          type: 'income',
          frequency: income.frequency,
          status: income.status ?? null,
          invoice_id: income.invoice_id ?? null,
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
          date: normalizeToNoon(currentDate),
          id: income.id,
          name: income.name,
          amount: income.amount,
          type: 'income',
          frequency: income.frequency,
          status: income.status ?? null,
          invoice_id: income.invoice_id ?? null,
        });

        // Get next biweekly occurrence - create new Date object before incrementing
        currentDate = new Date(currentDate);
        currentDate.setDate(currentDate.getDate() + 14);
        if (CALENDAR_VERBOSE) console.log('Incremented to:', currentDate.toDateString());
      }
      if (CALENDAR_VERBOSE) console.log('Loop ended - final currentDate:', currentDate.toDateString());
      break;
    }

    case 'semi-monthly':
    case 'semimonthly': {
      // Semi-monthly: twice per month
      // Common patterns: 1st & 15th, or 15th & last day of month
      // We use the user's next_date to determine the pattern:
      // - If day is 1-15: occurrences on that day and that day + 15 (capped at month end)
      // - If day is 16-31: occurrences on that day and that day - 15
      if (CALENDAR_VERBOSE) console.log('Processing semi-monthly income');
      
      const baseDate = parsedStartDate;
      const primaryDay = baseDate.getDate();
      
      // Calculate the secondary day (the other payment in the month)
      // If primary is 1-15, secondary is primary + 15 (e.g., 1st -> 16th, 15th -> 30th)
      // If primary is 16-31, secondary is primary - 15 (e.g., 16th -> 1st, 30th -> 15th)
      const secondaryDay = primaryDay <= 15 ? primaryDay + 15 : primaryDay - 15;
      
      // Start from the beginning of the month containing the base date
      let currentYear = baseDate.getFullYear();
      let currentMonth = baseDate.getMonth();
      
      // If next_date is before range start, advance to the correct month
      if (isBefore(incomeNextDay, rangeStartDay)) {
        const monthsDiff = (rangeStartDay.getFullYear() - currentYear) * 12 + 
                          (rangeStartDay.getMonth() - currentMonth);
        currentMonth += monthsDiff;
        currentYear += Math.floor(currentMonth / 12);
        currentMonth = currentMonth % 12;
        if (currentMonth < 0) {
          currentMonth += 12;
          currentYear -= 1;
        }
      }
      
      // Generate occurrences for up to 24 months (to cover 365-day forecast)
      for (let monthOffset = 0; monthOffset < 24; monthOffset++) {
        const year = currentYear + Math.floor((currentMonth + monthOffset) / 12);
        const month = (currentMonth + monthOffset) % 12;
        
        // Get last day of this month
        const lastDayOfMonth = new Date(year, month + 1, 0).getDate();
        
        // Calculate both payment dates for this month
        const day1 = Math.min(primaryDay, lastDayOfMonth);
        const day2 = Math.min(secondaryDay, lastDayOfMonth);
        
        // Sort them so we process in chronological order
        const [firstDay, secondDay] = day1 < day2 ? [day1, day2] : [day2, day1];
        
        // First occurrence of the month
        const firstDate = new Date(year, month, firstDay, 12, 0, 0);
        if (!isBefore(firstDate, rangeStartDay) && !isAfter(firstDate, effectiveEndDate)) {
          occurrences.push({
            date: normalizeToNoon(firstDate),
            id: income.id,
            name: income.name,
            amount: income.amount,
            type: 'income',
            frequency: income.frequency,
            status: income.status ?? null,
            invoice_id: income.invoice_id ?? null,
          });
          if (CALENDAR_VERBOSE) console.log('Added semi-monthly occurrence:', firstDate.toDateString());
        }
        
        // Second occurrence of the month
        const secondDate = new Date(year, month, secondDay, 12, 0, 0);
        if (!isBefore(secondDate, rangeStartDay) && !isAfter(secondDate, effectiveEndDate)) {
          occurrences.push({
            date: normalizeToNoon(secondDate),
            id: income.id,
            name: income.name,
            amount: income.amount,
            type: 'income',
            frequency: income.frequency,
            status: income.status ?? null,
            invoice_id: income.invoice_id ?? null,
          });
          if (CALENDAR_VERBOSE) console.log('Added semi-monthly occurrence:', secondDate.toDateString());
        }
        
        // Stop if we've passed the effective end date
        if (isAfter(new Date(year, month + 1, 1), effectiveEndDate)) {
          break;
        }
      }
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
      if (isBefore(normalizeToNoon(currentDate), rangeStartDay)) {
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
            date: normalizeToNoon(currentDate),
            id: income.id,
            name: income.name,
            amount: income.amount,
            type: 'income',
            frequency: income.frequency,
            status: income.status ?? null,
            invoice_id: income.invoice_id ?? null,
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

    case 'quarterly': {
      // Quarterly: every 3 months from next_date
      const baseDate = parsedStartDate;
      const targetDay = baseDate.getDate();

      let currentYear = baseDate.getFullYear();
      let currentMonth = baseDate.getMonth();

      // Get initial date with month-end handling
      const lastDayOfInitialMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
      const initialDayToUse = Math.min(targetDay, lastDayOfInitialMonth);
      let currentDate = new Date(currentYear, currentMonth, initialDayToUse, 12, 0, 0);

      if (CALENDAR_VERBOSE) console.log('Processing quarterly income');

      // If next_date is before range start, find first occurrence in range
      while (isBefore(normalizeToNoon(currentDate), rangeStartDay)) {
        currentMonth += 3;
        if (currentMonth > 11) {
          currentYear += Math.floor(currentMonth / 12);
          currentMonth = currentMonth % 12;
        }
        const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const dayToUse = Math.min(targetDay, lastDayOfMonth);
        currentDate = new Date(currentYear, currentMonth, dayToUse, 12, 0, 0);
      }

      while (currentDate <= effectiveEndDate) {
        if (currentDate >= rangeStartDay) {
          occurrences.push({
            date: normalizeToNoon(currentDate),
            id: income.id,
            name: income.name,
            amount: income.amount,
            type: 'income',
            frequency: income.frequency,
            status: income.status ?? null,
            invoice_id: income.invoice_id ?? null,
          });
          if (CALENDAR_VERBOSE) console.log('Added quarterly occurrence:', currentDate.toDateString());
        }

        // Increment by 3 months with month-end handling
        currentMonth += 3;
        if (currentMonth > 11) {
          currentYear += Math.floor(currentMonth / 12);
          currentMonth = currentMonth % 12;
        }
        const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const dayToUse = Math.min(targetDay, lastDayOfMonth);
        currentDate = new Date(currentYear, currentMonth, dayToUse, 12, 0, 0);
      }

      break;
    }

    case 'annually': {
      // Annually: every 12 months from next_date
      const baseDate = parsedStartDate;
      const targetDay = baseDate.getDate();
      const targetMonth = baseDate.getMonth();

      let currentYear = baseDate.getFullYear();

      // Get initial date with month-end handling (for Feb 29 edge case)
      const lastDayOfInitialMonth = new Date(currentYear, targetMonth + 1, 0).getDate();
      const initialDayToUse = Math.min(targetDay, lastDayOfInitialMonth);
      let currentDate = new Date(currentYear, targetMonth, initialDayToUse, 12, 0, 0);

      if (CALENDAR_VERBOSE) console.log('Processing annually income');

      // If next_date is before range start, find first occurrence in range
      while (isBefore(normalizeToNoon(currentDate), rangeStartDay)) {
        currentYear++;
        const lastDayOfMonth = new Date(currentYear, targetMonth + 1, 0).getDate();
        const dayToUse = Math.min(targetDay, lastDayOfMonth);
        currentDate = new Date(currentYear, targetMonth, dayToUse, 12, 0, 0);
      }

      while (currentDate <= effectiveEndDate) {
        if (currentDate >= rangeStartDay) {
          occurrences.push({
            date: normalizeToNoon(currentDate),
            id: income.id,
            name: income.name,
            amount: income.amount,
            type: 'income',
            frequency: income.frequency,
            status: income.status ?? null,
            invoice_id: income.invoice_id ?? null,
          });
          if (CALENDAR_VERBOSE) console.log('Added annually occurrence:', currentDate.toDateString());
        }

        // Increment by 1 year with month-end handling
        currentYear++;
        const lastDayOfMonth = new Date(currentYear, targetMonth + 1, 0).getDate();
        const dayToUse = Math.min(targetDay, lastDayOfMonth);
        currentDate = new Date(currentYear, targetMonth, dayToUse, 12, 0, 0);
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
          date: normalizeToNoon(incomeNextDay),
          id: income.id,
          name: income.name,
          amount: income.amount,
          type: 'income',
          frequency: income.frequency,
          status: income.status ?? null,
          invoice_id: income.invoice_id ?? null,
        });
      }
      // If no, return empty array (already initialized as empty)
      break;
    }

    case 'irregular': {
      if (CALENDAR_VERBOSE) console.log('Processing', frequency, 'income');
      // Show irregular income on its next_date as a one-time occurrence
      // User can update next_date when they know the next payment
      if (
        (isAfter(incomeNextDay, rangeStartDay) || isEqual(incomeNextDay, rangeStartDay)) &&
        (isBefore(incomeNextDay, rangeEndDay) || isEqual(incomeNextDay, rangeEndDay))
      ) {
        occurrences.push({
          date: normalizeToNoon(incomeNextDay),
          id: income.id,
          name: income.name,
          amount: income.amount,
          type: 'income',
          frequency: income.frequency,
          status: income.status ?? null,
          invoice_id: income.invoice_id ?? null,
        });
      }
      break;
    }

    default:
      // Log warning for unknown frequency (always, not just verbose mode)
      console.warn(
        `[Calendar] Unknown income frequency "${frequency}" for "${income.name}" (ID: ${income.id}). ` +
        'This income will not appear in the forecast.'
      );
      break;
  }

  if (CALENDAR_VERBOSE) console.log('Total occurrences:', occurrences.length);
  return occurrences;
}
