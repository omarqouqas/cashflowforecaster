import { parseISO, isAfter, isBefore, isEqual, addMonths, getDate, setDate, endOfMonth } from 'date-fns';
import { Transaction } from './types';
import { parseLocalDate, normalizeToNoon } from './utils';

/**
 * Bill record structure for calculating occurrences.
 */
interface BillRecord {
  /** Unique identifier for the bill */
  id: string;
  /** Name of the bill */
  name: string;
  /** Amount of the bill */
  amount: number;
  /** Frequency: 'weekly', 'biweekly', 'semi-monthly', 'monthly', 'quarterly', 'annually', or 'one-time' */
  frequency: string;
  /** Whether this bill is currently active */
  is_active: boolean | null;
  /** Due date (first occurrence date for recurring bills) */
  due_date: string;
}

/**
 * Calculates all bill transaction occurrences within a date range.
 * 
 * Handles different frequencies:
 * - weekly: every 7 days from due_date
 * - biweekly: every 14 days from due_date
 * - semi-monthly: twice per month (e.g., 1st & 15th, or 15th & last day)
 * - monthly: same day each month from due_date, handling month-end edge cases (e.g., Jan 31 → Feb 28)
 * - quarterly: every 3 months from due_date on the same day of month, handling month-end edge cases
 * - annually: every 12 months from due_date on the same month and day each year
 * - one-time: includes if due_date falls within the range [startDate, endDate]
 * 
 * Only includes occurrences if is_active is true.
 * For first occurrence, if due_date is before startDate, calculates next occurrence.
 * 
 * @param bill - The bill record to calculate occurrences for
 * @param startDate - Start date of the calendar range (inclusive)
 * @param endDate - End date of the calendar range (inclusive)
 * @returns Array of Transaction objects representing bill occurrences
 */
export function calculateBillOccurrences(
  bill: BillRecord,
  startDate: string | Date,
  endDate: string | Date
): Transaction[] {
  // Return empty array if bill is explicitly inactive
  // Note: null is treated as active (default behavior) to match generate.ts filtering
  if (bill.is_active === false) {
    return [];
  }

  const rangeStart = typeof startDate === 'string' ? parseISO(startDate) : startDate;
  const rangeEnd = typeof endDate === 'string' ? parseISO(endDate) : endDate;
  const billDueDate = parseLocalDate(bill.due_date);

  const occurrences: Transaction[] = [];
  // Use noon to avoid timezone shifts when dates are serialized
  const rangeStartDay = normalizeToNoon(rangeStart);
  const rangeEndDay = normalizeToNoon(rangeEnd);
  const billDueDay = normalizeToNoon(billDueDate);

  // If bill due date is after the range end, return empty
  if (isAfter(billDueDay, rangeEndDay)) {
    return [];
  }

  switch (bill.frequency) {
    case 'weekly': {
      // Start from bill.due_date
      let currentDate = new Date(billDueDay);

      // If due_date is before range start, find first occurrence in range
      if (isBefore(currentDate, rangeStartDay)) {
        // Calculate days difference and find next weekly occurrence
        const daysDiff = Math.floor((rangeStartDay.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
        const weeksToAdd = Math.ceil(daysDiff / 7);
        currentDate.setDate(currentDate.getDate() + (weeksToAdd * 7));
      }

      // Add occurrence every 7 days until past rangeEndDay
      while (currentDate <= rangeEndDay) {
        occurrences.push({
          date: normalizeToNoon(currentDate),
          id: bill.id,
          name: bill.name,
          amount: bill.amount,
          type: 'bill',
          frequency: bill.frequency,
        });

        currentDate = new Date(currentDate);
        currentDate.setDate(currentDate.getDate() + 7);
      }
      break;
    }

    case 'biweekly': {
      // Start from bill.due_date
      let currentDate = new Date(billDueDay);

      // If due_date is before range start, find first occurrence in range
      if (isBefore(currentDate, rangeStartDay)) {
        // Calculate days difference and find next biweekly occurrence
        const daysDiff = Math.floor((rangeStartDay.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
        const periodsToAdd = Math.ceil(daysDiff / 14);
        currentDate.setDate(currentDate.getDate() + (periodsToAdd * 14));
      }

      // Add occurrence every 14 days until past rangeEndDay
      while (currentDate <= rangeEndDay) {
        occurrences.push({
          date: normalizeToNoon(currentDate),
          id: bill.id,
          name: bill.name,
          amount: bill.amount,
          type: 'bill',
          frequency: bill.frequency,
        });

        currentDate = new Date(currentDate);
        currentDate.setDate(currentDate.getDate() + 14);
      }
      break;
    }

    case 'semi-monthly':
    case 'semimonthly': {
      // Semi-monthly: twice per month
      // Common patterns: 1st & 15th, or 15th & last day of month
      // We use the user's due_date to determine the pattern
      const primaryDay = billDueDay.getDate();

      // Calculate the secondary day (the other payment in the month)
      const secondaryDay = primaryDay <= 15 ? primaryDay + 15 : primaryDay - 15;

      // Start from the beginning of the month containing the due date
      let currentYear = billDueDay.getFullYear();
      let currentMonth = billDueDay.getMonth();

      // If due_date is before range start, advance to the correct month
      if (isBefore(billDueDay, rangeStartDay)) {
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

        // First occurrence of the month (use noon to avoid timezone shifts)
        const firstDate = new Date(year, month, firstDay, 12, 0, 0);
        if (!isBefore(firstDate, rangeStartDay) && !isAfter(firstDate, rangeEndDay)) {
          occurrences.push({
            date: normalizeToNoon(firstDate),
            id: bill.id,
            name: bill.name,
            amount: bill.amount,
            type: 'bill',
            frequency: bill.frequency,
          });
        }

        // Second occurrence of the month
        const secondDate = new Date(year, month, secondDay, 12, 0, 0);
        if (!isBefore(secondDate, rangeStartDay) && !isAfter(secondDate, rangeEndDay)) {
          occurrences.push({
            date: normalizeToNoon(secondDate),
            id: bill.id,
            name: bill.name,
            amount: bill.amount,
            type: 'bill',
            frequency: bill.frequency,
          });
        }

        // Stop if we've passed the range end date
        if (isAfter(new Date(year, month + 1, 1), rangeEndDay)) {
          break;
        }
      }
      break;
    }

    case 'monthly': {
      // Avoid `split('T')[0]` returning `string | undefined` in TS typings.
      // `toISOString()` is always `YYYY-MM-DDTHH:mm:ss.sssZ`, so slicing is safe here.
      const dateStr = bill.due_date ?? billDueDay.toISOString().slice(0, 10);
      const parts = dateStr.split('-').map(Number);
      const year = parts[0];
      const month = parts[1];
      const day = parts[2];

      // Validate we have valid date parts
      // Note: this function calculates occurrences for a single bill, so we "skip" by breaking out
      // of this frequency handler, resulting in no monthly occurrences being added.
      if (year == null || month == null || day == null) {
        break;
      }
      if (!year || !month || !day || Number.isNaN(year) || Number.isNaN(month) || Number.isNaN(day)) {
        break;
      }

      // Start with the due day
      const targetDay = day;

      // Ensure initial date is valid for the month (handle month-end edge cases)
      const lastDayOfInitialMonth = new Date(year, month, 0).getDate();
      const initialDayToUse = Math.min(targetDay, lastDayOfInitialMonth);
      let currentDate = new Date(year, month - 1, initialDayToUse, 12, 0, 0);

      // If due_date is before startDate, calculate next occurrence
      if (isBefore(billDueDay, rangeStartDay)) {
        // Find the next monthly occurrence
        while (currentDate < rangeStartDay) {
          // Increment month
          let nextMonth = currentDate.getMonth() + 1;
          let nextYear = currentDate.getFullYear();

          // Handle year rollover
          if (nextMonth > 11) {
            nextMonth = 0;
            nextYear++;
          }

          // Get last day of next month
          const lastDayOfNextMonth = new Date(nextYear, nextMonth + 1, 0).getDate();

          // Use target day OR last day of month (whichever is smaller)
          const dayToUse = Math.min(targetDay, lastDayOfNextMonth);

          currentDate = new Date(nextYear, nextMonth, dayToUse, 12, 0, 0);
        }
      }

      // Add occurrence on same day each month
      // Handle month-end edge cases
      // Continue until past endDate
      while (currentDate <= rangeEndDay) {
        if (currentDate >= rangeStartDay) {
          occurrences.push({
            date: normalizeToNoon(currentDate),
            id: bill.id,
            name: bill.name,
            amount: bill.amount,
            type: 'bill',
            frequency: bill.frequency,
          });
        }

        // Increment month - THIS IS THE KEY FIX
        let nextMonth = currentDate.getMonth() + 1;
        let nextYear = currentDate.getFullYear();

        // Handle year rollover
        if (nextMonth > 11) {
          nextMonth = 0;
          nextYear++;
        }

        // Get last day of next month
        const lastDayOfNextMonth = new Date(nextYear, nextMonth + 1, 0).getDate();

        // Use target day OR last day of month (whichever is smaller)
        const dayToUse = Math.min(targetDay, lastDayOfNextMonth);

        currentDate = new Date(nextYear, nextMonth, dayToUse, 12, 0, 0);
      }

      break;
    }

    case 'quarterly': {
      // Start from bill.due_date
      // Get day of month from due_date
      const dayOfMonth = getDate(billDueDay);
      let currentDate: Date;

      // If due_date is before startDate, calculate next occurrence
      if (isBefore(billDueDay, rangeStartDay)) {
        // Find the next quarterly occurrence (every 3 months)
        currentDate = new Date(billDueDay);
        while (isBefore(currentDate, rangeStartDay)) {
          // Handle month-end edge cases when adding 3 months
          // First, add 3 months
          currentDate = addMonths(currentDate, 3);
          // Then ensure we're on the correct day, handling month-end edge cases
          const lastDayOfMonth = getDate(endOfMonth(currentDate));
          const actualDay = dayOfMonth > lastDayOfMonth ? lastDayOfMonth : dayOfMonth;
          currentDate = setDate(currentDate, actualDay);
        }
      } else {
        // Start from the due_date if it's in range
        currentDate = new Date(billDueDay);
      }

      // Add occurrence every 3 months
      // Use same day of month (handle month-end)
      // Continue until past endDate
      while (!isAfter(currentDate, rangeEndDay)) {
        // Handle month-end edge case: if day doesn't exist in month, use last day
        const lastDayOfMonth = getDate(endOfMonth(currentDate));
        const actualDay = dayOfMonth > lastDayOfMonth ? lastDayOfMonth : dayOfMonth;
        const occurrenceDate = setDate(new Date(currentDate), actualDay);

        // Ensure we're still in range after adjusting for month-end
        if (isAfter(occurrenceDate, rangeEndDay)) {
          break;
        }

        occurrences.push({
          date: normalizeToNoon(occurrenceDate),
          id: bill.id,
          name: bill.name,
          amount: bill.amount,
          type: 'bill',
          frequency: bill.frequency,
        });

        // Move to next quarter (3 months) and handle month-end
        currentDate = addMonths(currentDate, 3);
        const nextLastDayOfMonth = getDate(endOfMonth(currentDate));
        const nextActualDay = dayOfMonth > nextLastDayOfMonth ? nextLastDayOfMonth : dayOfMonth;
        currentDate = setDate(currentDate, nextActualDay);
      }
      break;
    }

    case 'annually': {
      // Start from bill.due_date
      // Get day and month from due_date
      const dayOfMonth = getDate(billDueDay);
      const monthOfYear = billDueDay.getMonth();
      let currentDate: Date;

      // If due_date is before startDate, calculate next occurrence
      if (isBefore(billDueDay, rangeStartDay)) {
        // Find the next annual occurrence (every 12 months)
        currentDate = new Date(billDueDay);
        while (isBefore(currentDate, rangeStartDay)) {
          currentDate = addMonths(currentDate, 12);
        }
        // Ensure we're in the correct month and handle month-end
        currentDate.setMonth(monthOfYear);
        const lastDayOfMonth = getDate(endOfMonth(currentDate));
        const actualDay = dayOfMonth > lastDayOfMonth ? lastDayOfMonth : dayOfMonth;
        currentDate = setDate(currentDate, actualDay);
      } else {
        // Start from the due_date if it's in range
        currentDate = new Date(billDueDay);
      }

      // Add occurrence every 12 months
      // Same month and day each year
      // Likely only 1 occurrence in 60 days
      // Continue until past endDate
      while (!isAfter(currentDate, rangeEndDay)) {
        // Handle month-end edge case: if day doesn't exist in month, use last day
        const lastDayOfMonth = getDate(endOfMonth(currentDate));
        const actualDay = dayOfMonth > lastDayOfMonth ? lastDayOfMonth : dayOfMonth;
        const occurrenceDate = setDate(new Date(currentDate), actualDay);

        // Ensure we're still in range after adjusting for month-end
        if (isAfter(occurrenceDate, rangeEndDay)) {
          break;
        }

        occurrences.push({
          date: normalizeToNoon(occurrenceDate),
          id: bill.id,
          name: bill.name,
          amount: bill.amount,
          type: 'bill',
          frequency: bill.frequency,
        });

        // Move to next year (12 months)
        currentDate = addMonths(currentDate, 12);
        // Ensure we're in the correct month and handle month-end
        currentDate.setMonth(monthOfYear);
        const nextLastDayOfMonth = getDate(endOfMonth(currentDate));
        const nextActualDay = dayOfMonth > nextLastDayOfMonth ? nextLastDayOfMonth : dayOfMonth;
        currentDate = setDate(currentDate, nextActualDay);
      }
      break;
    }

    case 'one-time': {
      // Check if due_date is within range [startDate, endDate]
      if (
        (isAfter(billDueDay, rangeStartDay) || isEqual(billDueDay, rangeStartDay)) &&
        (isBefore(billDueDay, rangeEndDay) || isEqual(billDueDay, rangeEndDay))
      ) {
        // If yes, add single occurrence
        occurrences.push({
          date: normalizeToNoon(billDueDay),
          id: bill.id,
          name: bill.name,
          amount: bill.amount,
          type: 'bill',
          frequency: bill.frequency,
        });
      }
      // If no, return empty array (already initialized as empty)
      break;
    }

    default:
      // Unknown frequency, return empty array
      break;
  }

  return occurrences;
}

