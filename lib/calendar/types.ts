/**
 * Calendar-related type definitions for cash flow forecasting.
 */

/**
 * Represents a transaction (income or bill) in the calendar.
 * 
 * @interface Transaction
 */
export interface Transaction {
  /** Unique identifier for the transaction */
  id: string;
  /** Name or description of the transaction */
  name: string;
  /** Transaction amount */
  amount: number;
  /** Type of transaction - either income or bill */
  type: 'income' | 'bill';
  /** Frequency of the transaction (e.g., 'daily', 'weekly', 'monthly', 'yearly') */
  frequency: string;
  /** Date when this transaction occurs */
  date: Date;
}

/**
 * Represents a single day in the calendar with its financial data.
 * 
 * @interface CalendarDay
 */
export interface CalendarDay {
  /** The date for this calendar day */
  date: Date;
  /** Account balance at the end of this day */
  balance: number;
  /** Array of income transactions occurring on this day */
  income: Transaction[];
  /** Array of bill transactions occurring on this day */
  bills: Transaction[];
  /** Status indicator for this day - color-coded financial health status */
  status: 'green' | 'yellow' | 'orange' | 'red';
}

/**
 * Complete calendar data structure containing all days and summary information.
 * 
 * @interface CalendarData
 */
export interface CalendarData {
  /** Array of calendar days with their financial data */
  days: CalendarDay[];
  /** Starting balance at the beginning of the calendar period */
  startingBalance: number;
  /** The lowest balance reached during the calendar period */
  lowestBalance: number;
  /** The date when the lowest balance occurred */
  lowestBalanceDay: Date;
  /**
   * How much money the user can safely spend today without going below
   * their safety buffer before the next income (or within a 14-day horizon).
   */
  safeToSpend: number;
}

