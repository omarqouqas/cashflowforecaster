import { parseISO, isAfter, isBefore, addMonths, setDate, endOfMonth } from 'date-fns';
import { TransferTransaction } from './types';
import { parseLocalDate, normalizeToNoon } from './utils';

/**
 * Transfer record structure for calculating occurrences.
 */
interface TransferRecord {
  id: string;
  description: string | null;
  amount: number;
  frequency: string;
  is_active: boolean | null;
  transfer_date: string;
  recurrence_day: number | null;
  from_account_id: string;
  to_account_id: string;
  from_account_name?: string;
  to_account_name?: string;
}

/**
 * Calculates all transfer transaction occurrences within a date range.
 *
 * Handles different frequencies similar to bills:
 * - weekly: every 7 days from transfer_date
 * - biweekly: every 14 days from transfer_date
 * - semi-monthly: twice per month
 * - monthly: same day each month, handling month-end edge cases
 * - quarterly: every 3 months
 * - annually: every 12 months
 * - one-time: includes if transfer_date falls within the range
 *
 * @param transfer - The transfer record to calculate occurrences for
 * @param startDate - Start date of the calendar range (inclusive)
 * @param endDate - End date of the calendar range (inclusive)
 * @returns Array of TransferTransaction objects representing transfer occurrences
 */
export function calculateTransferOccurrences(
  transfer: TransferRecord,
  startDate: string | Date,
  endDate: string | Date
): TransferTransaction[] {
  // Return empty array if transfer is not active
  if (!transfer.is_active) {
    return [];
  }

  const rangeStart = typeof startDate === 'string' ? parseISO(startDate) : startDate;
  const rangeEnd = typeof endDate === 'string' ? parseISO(endDate) : endDate;
  const transferDate = parseLocalDate(transfer.transfer_date);

  const occurrences: TransferTransaction[] = [];
  const rangeStartDay = normalizeToNoon(rangeStart);
  const rangeEndDay = normalizeToNoon(rangeEnd);
  const transferDay = normalizeToNoon(transferDate);

  // If transfer date is after the range end, return empty
  if (isAfter(transferDay, rangeEndDay)) {
    return [];
  }

  const name = transfer.description || 'Transfer';

  switch (transfer.frequency) {
    case 'weekly': {
      let currentDate = new Date(transferDay);

      if (isBefore(currentDate, rangeStartDay)) {
        const daysDiff = Math.floor((rangeStartDay.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
        const weeksToAdd = Math.ceil(daysDiff / 7);
        currentDate.setDate(currentDate.getDate() + (weeksToAdd * 7));
      }

      while (currentDate <= rangeEndDay) {
        occurrences.push({
          date: normalizeToNoon(currentDate),
          id: transfer.id,
          name,
          amount: transfer.amount,
          type: 'transfer',
          frequency: transfer.frequency,
          from_account_id: transfer.from_account_id,
          from_account_name: transfer.from_account_name,
          to_account_id: transfer.to_account_id,
          to_account_name: transfer.to_account_name,
        });

        currentDate = new Date(currentDate);
        currentDate.setDate(currentDate.getDate() + 7);
      }
      break;
    }

    case 'biweekly': {
      let currentDate = new Date(transferDay);

      if (isBefore(currentDate, rangeStartDay)) {
        const daysDiff = Math.floor((rangeStartDay.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
        const periodsToAdd = Math.ceil(daysDiff / 14);
        currentDate.setDate(currentDate.getDate() + (periodsToAdd * 14));
      }

      while (currentDate <= rangeEndDay) {
        occurrences.push({
          date: normalizeToNoon(currentDate),
          id: transfer.id,
          name,
          amount: transfer.amount,
          type: 'transfer',
          frequency: transfer.frequency,
          from_account_id: transfer.from_account_id,
          from_account_name: transfer.from_account_name,
          to_account_id: transfer.to_account_id,
          to_account_name: transfer.to_account_name,
        });

        currentDate = new Date(currentDate);
        currentDate.setDate(currentDate.getDate() + 14);
      }
      break;
    }

    case 'semi-monthly':
    case 'semimonthly': {
      const primaryDay = transferDay.getDate();
      const secondaryDay = primaryDay <= 15 ? primaryDay + 15 : primaryDay - 15;

      let currentYear = transferDay.getFullYear();
      let currentMonth = transferDay.getMonth();

      if (isBefore(transferDay, rangeStartDay)) {
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

      while (true) {
        const monthEnd = endOfMonth(new Date(currentYear, currentMonth, 1)).getDate();

        // Primary day
        const adjustedPrimaryDay = Math.min(primaryDay, monthEnd);
        let primaryDate = normalizeToNoon(new Date(currentYear, currentMonth, adjustedPrimaryDay));

        if (!isBefore(primaryDate, rangeStartDay) && !isAfter(primaryDate, rangeEndDay)) {
          occurrences.push({
            date: primaryDate,
            id: transfer.id,
            name,
            amount: transfer.amount,
            type: 'transfer',
            frequency: transfer.frequency,
            from_account_id: transfer.from_account_id,
            from_account_name: transfer.from_account_name,
            to_account_id: transfer.to_account_id,
            to_account_name: transfer.to_account_name,
          });
        }

        // Secondary day
        const adjustedSecondaryDay = Math.min(secondaryDay, monthEnd);
        let secondaryDate = normalizeToNoon(new Date(currentYear, currentMonth, adjustedSecondaryDay));

        if (!isBefore(secondaryDate, rangeStartDay) && !isAfter(secondaryDate, rangeEndDay)) {
          occurrences.push({
            date: secondaryDate,
            id: transfer.id,
            name,
            amount: transfer.amount,
            type: 'transfer',
            frequency: transfer.frequency,
            from_account_id: transfer.from_account_id,
            from_account_name: transfer.from_account_name,
            to_account_id: transfer.to_account_id,
            to_account_name: transfer.to_account_name,
          });
        }

        // Move to next month
        currentMonth++;
        if (currentMonth > 11) {
          currentMonth = 0;
          currentYear++;
        }

        // Check if we've passed the range
        if (new Date(currentYear, currentMonth, 1) > rangeEndDay) {
          break;
        }
      }
      break;
    }

    case 'monthly': {
      const targetDay = transfer.recurrence_day || transferDay.getDate();
      let currentDate = new Date(transferDay);

      if (isBefore(currentDate, rangeStartDay)) {
        const monthsDiff = (rangeStartDay.getFullYear() - currentDate.getFullYear()) * 12 +
                          (rangeStartDay.getMonth() - currentDate.getMonth());
        currentDate = addMonths(currentDate, monthsDiff);

        if (isBefore(currentDate, rangeStartDay)) {
          currentDate = addMonths(currentDate, 1);
        }
      }

      while (!isAfter(currentDate, rangeEndDay)) {
        const monthEnd = endOfMonth(currentDate).getDate();
        const adjustedDay = Math.min(targetDay, monthEnd);
        const occurrenceDate = normalizeToNoon(setDate(currentDate, adjustedDay));

        if (!isBefore(occurrenceDate, rangeStartDay) && !isAfter(occurrenceDate, rangeEndDay)) {
          occurrences.push({
            date: occurrenceDate,
            id: transfer.id,
            name,
            amount: transfer.amount,
            type: 'transfer',
            frequency: transfer.frequency,
            from_account_id: transfer.from_account_id,
            from_account_name: transfer.from_account_name,
            to_account_id: transfer.to_account_id,
            to_account_name: transfer.to_account_name,
          });
        }

        currentDate = addMonths(currentDate, 1);
      }
      break;
    }

    case 'quarterly': {
      const targetDay = transfer.recurrence_day || transferDay.getDate();
      let currentDate = new Date(transferDay);

      if (isBefore(currentDate, rangeStartDay)) {
        const monthsDiff = (rangeStartDay.getFullYear() - currentDate.getFullYear()) * 12 +
                          (rangeStartDay.getMonth() - currentDate.getMonth());
        const quartersToAdd = Math.ceil(monthsDiff / 3);
        currentDate = addMonths(currentDate, quartersToAdd * 3);

        if (isBefore(currentDate, rangeStartDay)) {
          currentDate = addMonths(currentDate, 3);
        }
      }

      while (!isAfter(currentDate, rangeEndDay)) {
        const monthEnd = endOfMonth(currentDate).getDate();
        const adjustedDay = Math.min(targetDay, monthEnd);
        const occurrenceDate = normalizeToNoon(setDate(currentDate, adjustedDay));

        if (!isBefore(occurrenceDate, rangeStartDay) && !isAfter(occurrenceDate, rangeEndDay)) {
          occurrences.push({
            date: occurrenceDate,
            id: transfer.id,
            name,
            amount: transfer.amount,
            type: 'transfer',
            frequency: transfer.frequency,
            from_account_id: transfer.from_account_id,
            from_account_name: transfer.from_account_name,
            to_account_id: transfer.to_account_id,
            to_account_name: transfer.to_account_name,
          });
        }

        currentDate = addMonths(currentDate, 3);
      }
      break;
    }

    case 'annually': {
      const targetDay = transfer.recurrence_day || transferDay.getDate();
      let currentDate = new Date(transferDay);

      if (isBefore(currentDate, rangeStartDay)) {
        const yearsDiff = rangeStartDay.getFullYear() - currentDate.getFullYear();
        currentDate = addMonths(currentDate, yearsDiff * 12);

        if (isBefore(currentDate, rangeStartDay)) {
          currentDate = addMonths(currentDate, 12);
        }
      }

      while (!isAfter(currentDate, rangeEndDay)) {
        const monthEnd = endOfMonth(currentDate).getDate();
        const adjustedDay = Math.min(targetDay, monthEnd);
        const occurrenceDate = normalizeToNoon(setDate(currentDate, adjustedDay));

        if (!isBefore(occurrenceDate, rangeStartDay) && !isAfter(occurrenceDate, rangeEndDay)) {
          occurrences.push({
            date: occurrenceDate,
            id: transfer.id,
            name,
            amount: transfer.amount,
            type: 'transfer',
            frequency: transfer.frequency,
            from_account_id: transfer.from_account_id,
            from_account_name: transfer.from_account_name,
            to_account_id: transfer.to_account_id,
            to_account_name: transfer.to_account_name,
          });
        }

        currentDate = addMonths(currentDate, 12);
      }
      break;
    }

    case 'one-time':
    default: {
      // For one-time transfers, include if within range
      if (!isBefore(transferDay, rangeStartDay) && !isAfter(transferDay, rangeEndDay)) {
        occurrences.push({
          date: transferDay,
          id: transfer.id,
          name,
          amount: transfer.amount,
          type: 'transfer',
          frequency: transfer.frequency,
          from_account_id: transfer.from_account_id,
          from_account_name: transfer.from_account_name,
          to_account_id: transfer.to_account_id,
          to_account_name: transfer.to_account_name,
        });
      }
      break;
    }
  }

  return occurrences;
}
