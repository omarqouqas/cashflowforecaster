/**
 * Credit Card Payment Occurrence Calculator
 *
 * Generates payment due date occurrences for credit card accounts.
 * These are treated like bills in the cash flow forecast.
 */

import { Transaction } from './types'

/**
 * Account with credit card fields
 */
interface CreditCardAccount {
  id: string
  name: string
  account_type: string | null
  current_balance: number
  credit_limit?: number | null
  apr?: number | null
  payment_due_day?: number | null
  statement_close_day?: number | null
}

/**
 * Check if an account is a credit card with payment tracking enabled
 */
export function isCreditCardWithPaymentDay(account: CreditCardAccount): boolean {
  return (
    account.account_type === 'credit_card' &&
    typeof account.payment_due_day === 'number' &&
    account.payment_due_day >= 1 &&
    account.payment_due_day <= 31 &&
    account.current_balance > 0 // Only generate payments if there's a balance
  )
}

/**
 * Get the last day of a month
 */
function getLastDayOfMonth(year: number, month: number): number {
  // Day 0 of next month = last day of current month
  return new Date(year, month + 1, 0).getDate()
}

/**
 * Get the next payment due date for a credit card
 * Handles months with fewer days (e.g., payment day 31 in February becomes 28/29)
 */
function getNextPaymentDate(paymentDueDay: number, startDate: Date): Date {
  const year = startDate.getFullYear()
  const month = startDate.getMonth()
  const day = startDate.getDate()

  // Cap payment day at last day of current month
  const lastDayThisMonth = getLastDayOfMonth(year, month)
  const effectiveDayThisMonth = Math.min(paymentDueDay, lastDayThisMonth)

  // If we're past the payment day this month, next payment is next month
  if (day > effectiveDayThisMonth) {
    const nextMonth = month + 1
    const nextYear = nextMonth > 11 ? year + 1 : year
    const actualNextMonth = nextMonth % 12
    const lastDayNextMonth = getLastDayOfMonth(nextYear, actualNextMonth)
    const effectiveDayNextMonth = Math.min(paymentDueDay, lastDayNextMonth)
    return new Date(nextYear, actualNextMonth, effectiveDayNextMonth, 12, 0, 0, 0)
  }

  // Payment is this month
  return new Date(year, month, effectiveDayThisMonth, 12, 0, 0, 0)
}

/**
 * Calculate credit card payment occurrences for the forecast period.
 *
 * Strategy: Only show the NEXT payment due date with current balance.
 * We don't project future months because:
 * - We don't know what the user will charge
 * - We don't know if they'll pay full balance or minimum
 * - Projecting the same balance monthly would overstate cash outflow
 *
 * @param account - Credit card account record
 * @param startDate - Start of forecast period
 * @param endDate - End of forecast period
 * @returns Array of Transaction objects representing CC payment due dates
 */
export function calculateCCPaymentOccurrences(
  account: CreditCardAccount,
  startDate: Date,
  endDate: Date
): Transaction[] {
  // Skip if not a credit card or no payment day configured
  if (!isCreditCardWithPaymentDay(account)) {
    return []
  }

  const paymentDueDay = account.payment_due_day!
  const balance = account.current_balance

  // Get the next payment date
  const paymentDate = getNextPaymentDate(paymentDueDay, startDate)

  // Only include if within forecast period
  if (paymentDate > endDate) {
    return []
  }

  // Return single payment occurrence for the next due date
  return [{
    id: `cc-payment-${account.id}-${paymentDate.toISOString().slice(0, 7)}`,
    name: `💳 ${account.name} Payment`,
    amount: balance,
    type: 'bill',
    frequency: 'once', // Changed from 'monthly' - this is a one-time forecast
    date: new Date(paymentDate),
    status: 'pending',
  }]
}

/**
 * Calculate all credit card payment occurrences from multiple accounts.
 *
 * @param accounts - Array of account records (will filter for credit cards)
 * @param startDate - Start of forecast period
 * @param endDate - End of forecast period
 * @returns Array of all CC payment Transaction objects
 */
export function calculateAllCCPayments(
  accounts: CreditCardAccount[],
  startDate: Date,
  endDate: Date
): Transaction[] {
  return accounts
    .filter(isCreditCardWithPaymentDay)
    .flatMap((account) => calculateCCPaymentOccurrences(account, startDate, endDate))
}
