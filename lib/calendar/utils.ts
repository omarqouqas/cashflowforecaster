/**
 * Calendar utility functions for date calculations and formatting.
 */

/**
 * Returns today's date at local noon (12:00:00.000).
 * Noon is used throughout the calendar system to avoid DST/timezone edge cases
 * that can shift midnight dates to the previous/next day when serialized.
 */
export function getTodayAtNoon(): Date {
  const today = new Date();
  today.setHours(12, 0, 0, 0);
  return today;
}

/**
 * Normalizes a date to local noon (12:00:00.000) on the same calendar day.
 * Returns a new Date instance and does not mutate the input.
 */
export function normalizeToNoon(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0, 0);
}

/**
 * Parses a date-only string (YYYY-MM-DD) as local midnight, not UTC.
 * This prevents timezone shifts that would show the wrong day.
 * 
 * Uses noon (12:00:00) instead of midnight to avoid Daylight Saving Time edge cases.
 * 
 * @param dateString - Date string in YYYY-MM-DD format
 * @returns Date object at local noon
 */
export function parseLocalDate(dateString: string): Date {
  // With `noUncheckedIndexedAccess`, split() parts are possibly undefined.
  // Also, callers rely on invalid inputs producing an Invalid Date (NaN time),
  // so we return `new Date(NaN)` instead of throwing.
  const match = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(dateString.trim());
  if (!match) return new Date(NaN);

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  return new Date(year, month - 1, day, 12, 0, 0); // Use noon to avoid DST issues
}

/**
 * Checks if two dates represent the same calendar day.
 * Compares year, month, and day only (ignores time).
 * 
 * @param date1 - First date to compare
 * @param date2 - Second date to compare
 * @returns True if both dates are on the same calendar day, false otherwise
 */
export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

/**
 * Adds a specified number of days to a date.
 * Returns a new date without mutating the original.
 * 
 * @param date - The starting date
 * @param days - Number of days to add (can be negative to subtract)
 * @returns New Date object with the specified days added
 */
export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * Formats a date for calendar display.
 * Returns formatted date like "Mon, Dec 9".
 * 
 * @param date - The date to format
 * @returns Formatted date string (e.g., "Mon, Dec 9")
 */
export function formatCalendarDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Gets the next monthly occurrence of a specific day of the month.
 * Handles month-end edge cases (e.g., Jan 31 → Feb 28).
 * If the target day doesn't exist in the month, uses the last day of that month.
 * 
 * @param currentDate - The reference date to calculate from
 * @param targetDay - The day of the month (1-31) to find the next occurrence of
 * @returns Date object representing the next monthly occurrence
 */
export function getNextMonthlyDate(currentDate: Date, targetDay: number): Date {
  const result = normalizeToNoon(currentDate);
  const currentDay = result.getDate();
  
  // If we're before the target day this month, try to use this month
  if (currentDay < targetDay) {
    const testDate = normalizeToNoon(new Date(result.getFullYear(), result.getMonth(), targetDay));
    
    // Check if the target day exists in this month
    if (testDate.getMonth() === result.getMonth()) {
      return testDate;
    }
    
    // If target day doesn't exist (e.g., Feb 31), use last day of current month
    const lastDayOfMonth = new Date(result.getFullYear(), result.getMonth() + 1, 0, 12, 0, 0, 0);
    return lastDayOfMonth;
  }
  
  // Otherwise, move to next month
  result.setMonth(result.getMonth() + 1);
  result.setDate(targetDay);
  result.setHours(12, 0, 0, 0);
  
  // Check if target day exists in next month
  if (result.getDate() !== targetDay) {
    // Target day doesn't exist (e.g., Feb 31), use last day of next month
    const lastDayOfNextMonth = new Date(result.getFullYear(), result.getMonth() + 1, 0, 12, 0, 0, 0);
    return lastDayOfNextMonth;
  }
  
  return result;
}

/**
 * Gets the next weekly occurrence from a start date.
 * Calculates days since start, rounds up to the next 7-day interval.
 * 
 * @param startDate - The original start date
 * @param currentDate - The current date to calculate from
 * @returns Date object representing the next weekly occurrence
 */
export function getNextWeeklyDate(startDate: Date, currentDate: Date): Date {
  const start = normalizeToNoon(startDate);
  const current = normalizeToNoon(currentDate);
  
  // Calculate days difference
  const daysDiff = Math.floor((current.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  
  // Calculate how many complete weeks have passed
  const weeksPassed = Math.floor(daysDiff / 7);
  
  // Next occurrence is one week after the last complete week
  const nextDate = addDays(start, (weeksPassed + 1) * 7);
  
  // If the calculated next date is today or in the past, add one more week
  if (nextDate <= current) {
    return addDays(nextDate, 7);
  }
  
  return nextDate;
}

/**
 * Gets the next biweekly occurrence from a start date.
 * Calculates days since start, rounds up to the next 14-day interval.
 * 
 * @param startDate - The original start date
 * @param currentDate - The current date to calculate from
 * @returns Date object representing the next biweekly occurrence
 */
export function getNextBiweeklyDate(startDate: Date, currentDate: Date): Date {
  const start = normalizeToNoon(startDate);
  const current = normalizeToNoon(currentDate);
  
  // Calculate days difference
  const daysDiff = Math.floor((current.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  
  // Calculate how many complete biweekly periods have passed
  const periodsPassed = Math.floor(daysDiff / 14);
  
  // Next occurrence is one period (14 days) after the last complete period
  const nextDate = addDays(start, (periodsPassed + 1) * 14);
  
  // If the calculated next date is today or in the past, add one more period
  if (nextDate <= current) {
    return addDays(nextDate, 14);
  }
  
  return nextDate;
}

/**
 * Returns status color based on balance thresholds relative to a safety buffer.
 * 
 * The safety buffer represents the minimum balance a user wants to maintain.
 * Status colors are calculated as multiples of this buffer:
 * 
 * - Green (safe): balance >= safetyBuffer * 2
 * - Yellow (caution): balance >= safetyBuffer * 1.5
 * - Orange (low): balance >= safetyBuffer
 * - Red (danger): balance < safetyBuffer
 * 
 * @param balance - The account balance to evaluate
 * @param safetyBuffer - The minimum safety buffer amount (default: 500)
 * @returns Status color: 'green' | 'yellow' | 'orange' | 'red'
 * 
 * @example
 * // With default $500 safety buffer:
 * getStatusColor(1000) // 'green' (>= $1000)
 * getStatusColor(750)  // 'yellow' (>= $750)
 * getStatusColor(500)  // 'orange' (>= $500)
 * getStatusColor(200)  // 'red' (< $500)
 * 
 * @example
 * // With $200 safety buffer (tight budget):
 * getStatusColor(400, 200) // 'green' (>= $400)
 * getStatusColor(300, 200) // 'yellow' (>= $300)
 * getStatusColor(200, 200) // 'orange' (>= $200)
 * getStatusColor(100, 200) // 'red' (< $200)
 */
export function getStatusColor(balance: number, safetyBuffer: number = 500): 'green' | 'yellow' | 'orange' | 'red' {
  if (balance >= safetyBuffer * 2) {
    return 'green';
  } else if (balance >= safetyBuffer * 1.5) {
    return 'yellow';
  } else if (balance >= safetyBuffer) {
    return 'orange';
  } else {
    return 'red';
  }
}
