/**
 * Credit Card Payment Occurrence Calculator
 *
 * Generates payment due date occurrences for credit card accounts.
 * These are treated like bills in the cash flow forecast.
 */

import { Transaction } from './types'
import { addMonths } from './utils'

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
    account.payment_due_day <= 28 &&
    account.current_balance > 0 // Only generate payments if there's a balance
  )
}

/**
 * Get the next payment due date for a credit card
 */
function getNextPaymentDate(paymentDueDay: number, startDate: Date): Date {
  const year = startDate.getFullYear()
  const month = startDate.getMonth()
  const day = startDate.getDate()

  // If we're past the payment day this month, next payment is next month
  if (day > paymentDueDay) {
    return new Date(year, month + 1, paymentDueDay, 12, 0, 0, 0)
  }

  // Payment is this month
  return new Date(year, month, paymentDueDay, 12, 0, 0, 0)
}

/**
 * Calculate credit card payment occurrences for the forecast period.
 *
 * For each credit card with a payment_due_day:
 * - Generate monthly payment due dates
 * - Amount is the current balance (simplified - in reality would be statement balance)
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

  const occurrences: Transaction[] = []
  const paymentDueDay = account.payment_due_day!
  const balance = account.current_balance

  // Get the first payment date
  let paymentDate = getNextPaymentDate(paymentDueDay, startDate)

  // Generate monthly payment occurrences
  while (paymentDate <= endDate) {
    occurrences.push({
      id: `cc-payment-${account.id}-${paymentDate.toISOString().slice(0, 7)}`,
      name: `💳 ${account.name} Payment`,
      amount: balance, // Full balance as payment amount (simplified)
      type: 'bill',
      frequency: 'monthly',
      date: new Date(paymentDate),
      status: 'pending',
    })

    // Move to next month
    paymentDate = addMonths(paymentDate, 1)
  }

  return occurrences
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
