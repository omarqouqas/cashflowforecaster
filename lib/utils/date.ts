/**
 * Date calculation utilities for recurring payments
 */

export type FrequencyType =
  | 'weekly'
  | 'biweekly'
  | 'semi-monthly'
  | 'monthly'
  | 'quarterly'
  | 'annually'
  | 'one-time'
  | 'irregular';

/**
 * Calculate the actual next occurrence date for a recurring item (income or bill).
 * If the stored date is in the past, this function advances it forward based on
 * the frequency until it reaches a future date.
 *
 * @param nextDate - The stored next_date string from the database
 * @param frequency - The payment frequency (weekly, monthly, etc.)
 * @returns The actual next occurrence Date
 */
export function getActualNextDate(
  nextDate: string,
  frequency: string | null | undefined
): Date {
  const storedDate = new Date(nextDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // If the stored date is in the future, use it
  if (storedDate >= today) {
    return storedDate;
  }

  // Otherwise, calculate the next occurrence
  const freq = (frequency ?? 'monthly').toLowerCase();
  let currentDate = new Date(storedDate);

  switch (freq) {
    case 'weekly':
      while (currentDate < today) {
        currentDate.setDate(currentDate.getDate() + 7);
      }
      break;

    case 'biweekly':
      while (currentDate < today) {
        currentDate.setDate(currentDate.getDate() + 14);
      }
      break;

    case 'semi-monthly': {
      // Semi-monthly: twice per month (e.g., 1st & 15th)
      const semiMonthlyDay = storedDate.getDate();
      while (currentDate < today) {
        if (semiMonthlyDay <= 15) {
          // If original is 1st-15th, next is either 15th+ or 1st of next month
          if (currentDate.getDate() <= 15) {
            currentDate.setDate(semiMonthlyDay + 15);
          } else {
            currentDate.setMonth(currentDate.getMonth() + 1);
            currentDate.setDate(semiMonthlyDay);
          }
        } else {
          // If original is 16th+, next is either 1st-15th of next month or same day next month
          if (currentDate.getDate() >= 16) {
            currentDate.setMonth(currentDate.getMonth() + 1);
            currentDate.setDate(semiMonthlyDay - 15);
          } else {
            currentDate.setDate(semiMonthlyDay);
          }
        }
      }
      break;
    }

    case 'monthly': {
      const targetDay = storedDate.getDate();
      while (currentDate < today) {
        let nextMonth = currentDate.getMonth() + 1;
        let nextYear = currentDate.getFullYear();

        if (nextMonth > 11) {
          nextMonth = 0;
          nextYear++;
        }

        const lastDayOfNextMonth = new Date(nextYear, nextMonth + 1, 0).getDate();
        const dayToUse = Math.min(targetDay, lastDayOfNextMonth);

        currentDate = new Date(nextYear, nextMonth, dayToUse);
      }
      break;
    }

    case 'quarterly': {
      const quarterlyTargetDay = storedDate.getDate();
      while (currentDate < today) {
        let nextMonth = currentDate.getMonth() + 3;
        let nextYear = currentDate.getFullYear();

        while (nextMonth > 11) {
          nextMonth -= 12;
          nextYear++;
        }

        const lastDayOfMonth = new Date(nextYear, nextMonth + 1, 0).getDate();
        const dayToUse = Math.min(quarterlyTargetDay, lastDayOfMonth);

        currentDate = new Date(nextYear, nextMonth, dayToUse);
      }
      break;
    }

    case 'annually': {
      const annualTargetDay = storedDate.getDate();
      const annualTargetMonth = storedDate.getMonth();
      while (currentDate < today) {
        const nextYear = currentDate.getFullYear() + 1;
        const lastDayOfMonth = new Date(nextYear, annualTargetMonth + 1, 0).getDate();
        const dayToUse = Math.min(annualTargetDay, lastDayOfMonth);

        currentDate = new Date(nextYear, annualTargetMonth, dayToUse);
      }
      break;
    }

    case 'one-time':
    case 'irregular':
      // For one-time and irregular, just return the stored date
      return storedDate;

    default:
      return storedDate;
  }

  return currentDate;
}
