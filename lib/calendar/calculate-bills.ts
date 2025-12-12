import { parseISO, startOfDay, isAfter, isBefore, isEqual, addMonths, getDate, setDate, endOfMonth } from 'date-fns';
import { Transaction } from './types';
import { parseLocalDate } from './utils';

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
  /** Frequency: 'weekly', 'biweekly', 'monthly', 'quarterly', 'annually', or 'one-time' */
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
  // Return empty array if bill is not active
  if (!bill.is_active) {
    return [];
  }

  const rangeStart = typeof startDate === 'string' ? parseISO(startDate) : startDate;
  const rangeEnd = typeof endDate === 'string' ? parseISO(endDate) : endDate;
  const billDueDate = parseLocalDate(bill.due_date);

  const occurrences: Transaction[] = [];
  const rangeStartDay = startOfDay(rangeStart);
  const rangeEndDay = startOfDay(rangeEnd);
  const billDueDay = startOfDay(billDueDate);

  // If bill due date is after the range end, return empty
  if (isAfter(billDueDay, rangeEndDay)) {
    return [];
  }

  switch (bill.frequency) {
    case 'weekly': {
      // Start from bill.due_date
      let currentDate = billDueDay;

      // If due_date is before range start, find first occurrence in range
      if (isBefore(currentDate, rangeStartDay)) {
        // Calculate days difference and find next weekly occurrence
        const daysDiff = Math.floor((rangeStartDay.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
        const weeksToAdd = Math.ceil(daysDiff / 7);
        currentDate = new Date(currentDate);
        currentDate.setDate(currentDate.getDate() + (weeksToAdd * 7));
      }

      // Add occurrence every 7 days until past rangeEndDay
      while (currentDate <= rangeEndDay) {
        occurrences.push({
          date: new Date(currentDate),
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
      let currentDate = billDueDay;

      // If due_date is before range start, find first occurrence in range
      if (isBefore(currentDate, rangeStartDay)) {
        // Calculate days difference and find next biweekly occurrence
        const daysDiff = Math.floor((rangeStartDay.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
        const periodsToAdd = Math.ceil(daysDiff / 14);
        currentDate = new Date(currentDate);
        currentDate.setDate(currentDate.getDate() + (periodsToAdd * 14));
      }

      // Add occurrence every 14 days until past rangeEndDay
      while (currentDate <= rangeEndDay) {
        occurrences.push({
          date: new Date(currentDate),
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

    case 'monthly': {
      // Avoid `split('T')[0]` returning `string | undefined` in TS typings.
      // `toISOString()` is always `YYYY-MM-DDTHH:mm:ss.sssZ`, so slicing is safe here.
      const dateStr = bill.due_date ?? billDueDay.toISOString().slice(0, 10);
      const [year, month, day] = dateStr.split('-').map(Number);
      
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
            date: new Date(currentDate),
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
          date: new Date(occurrenceDate),
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
          date: new Date(occurrenceDate),
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
          date: new Date(billDueDay),
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

