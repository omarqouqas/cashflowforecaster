/**
 * Credit Card Types
 *
 * Type definitions for credit card specific fields on accounts.
 * These extend the base account type with CC-specific properties.
 */

import type { Tables } from '@/types/supabase'

/**
 * Base Account type from Supabase
 */
type BaseAccount = Tables<'accounts'>

/**
 * Credit Card specific fields
 * These are added to accounts with type 'credit_card'
 */
export interface CreditCardFields {
  credit_limit: number | null
  apr: number | null
  minimum_payment_percent: number | null
  statement_close_day: number | null
  payment_due_day: number | null
}

/**
 * Account with Credit Card fields
 * Extends base account with optional CC fields
 */
export type AccountWithCreditCard = BaseAccount & Partial<CreditCardFields>

/**
 * Credit Card Account (fully typed)
 * Use when you know the account is a credit card
 */
export type CreditCardAccount = BaseAccount & CreditCardFields & {
  account_type: 'credit_card'
}

/**
 * Type guard to check if an account is a credit card
 */
export function isCreditCardAccount(account: BaseAccount): account is CreditCardAccount {
  return account.account_type === 'credit_card'
}

/**
 * Calculate minimum payment amount
 */
export function calculateMinimumPayment(
  balance: number,
  minimumPaymentPercent: number = 2
): number {
  const absBalance = Math.abs(balance)
  if (absBalance <= 0) return 0

  // Minimum payment is typically the greater of:
  // - A fixed amount (e.g., $25)
  // - A percentage of the balance
  // But never more than the total balance owed
  const percentPayment = absBalance * (minimumPaymentPercent / 100)
  const minPayment = Math.max(25, percentPayment)
  return Math.min(absBalance, minPayment)
}

/**
 * Calculate credit utilization percentage
 */
export function calculateUtilization(
  balance: number,
  creditLimit: number
): number {
  if (creditLimit <= 0) return 0
  // Balance is typically negative for credit cards (debt)
  const usage = Math.abs(balance)
  return (usage / creditLimit) * 100
}

/**
 * Get utilization status for display
 */
export function getUtilizationStatus(utilization: number): {
  level: 'good' | 'moderate' | 'high' | 'critical'
  color: string
  message: string
} {
  if (utilization <= 10) {
    return {
      level: 'good',
      color: 'emerald',
      message: 'Excellent utilization'
    }
  }
  if (utilization <= 30) {
    return {
      level: 'good',
      color: 'emerald',
      message: 'Good utilization'
    }
  }
  if (utilization <= 50) {
    return {
      level: 'moderate',
      color: 'amber',
      message: 'Moderate utilization'
    }
  }
  if (utilization <= 75) {
    return {
      level: 'high',
      color: 'orange',
      message: 'High utilization - may affect credit score'
    }
  }
  return {
    level: 'critical',
    color: 'rose',
    message: 'Very high utilization - likely affecting credit score'
  }
}

/**
 * Calculate interest for a billing period
 * @param balance Current balance (as positive number)
 * @param apr Annual Percentage Rate (e.g., 24.99)
 * @param days Number of days in billing period (default 30)
 */
export function calculateMonthlyInterest(
  balance: number,
  apr: number,
  days: number = 30
): number {
  if (balance <= 0 || apr <= 0) return 0
  const dailyRate = apr / 100 / 365
  return balance * dailyRate * days
}

/**
 * Calculate payoff schedule
 * @param balance Current balance
 * @param apr Annual Percentage Rate
 * @param monthlyPayment Fixed monthly payment amount
 * @returns Object with months to payoff, total interest, schedule, and whether payoff is possible
 */
export function calculatePayoffSchedule(
  balance: number,
  apr: number,
  monthlyPayment: number
): {
  months: number
  totalInterest: number
  schedule: Array<{ month: number; payment: number; interest: number; principal: number; balance: number }>
  canPayOff: boolean
} {
  const schedule: Array<{ month: number; payment: number; interest: number; principal: number; balance: number }> = []
  let currentBalance = Math.abs(balance)
  let totalInterest = 0
  let month = 0
  const monthlyRate = apr / 100 / 12

  // Check if payment covers at least the first month's interest
  // If not, the balance will grow and payoff is impossible
  const firstMonthInterest = currentBalance * monthlyRate
  if (monthlyPayment <= firstMonthInterest && apr > 0) {
    // Payment doesn't cover interest - will never pay off
    return {
      months: Infinity,
      totalInterest: Infinity,
      schedule: [],
      canPayOff: false
    }
  }

  // Safety limit to prevent infinite loops
  const maxMonths = 360 // 30 years

  while (currentBalance > 0.01 && month < maxMonths) {
    month++
    const interest = currentBalance * monthlyRate
    totalInterest += interest

    const actualPayment = Math.min(monthlyPayment, currentBalance + interest)
    const principal = actualPayment - interest
    currentBalance = Math.max(0, currentBalance - principal)

    schedule.push({
      month,
      payment: actualPayment,
      interest,
      principal,
      balance: currentBalance
    })
  }

  return {
    months: month,
    totalInterest,
    schedule,
    canPayOff: true
  }
}

/**
 * Get the last day of a month
 */
function getLastDayOfMonth(year: number, month: number): number {
  // Day 0 of next month = last day of current month
  return new Date(year, month + 1, 0).getDate()
}

/**
 * Get next statement close date based on statement_close_day
 * Handles months with fewer days (e.g., day 31 in February becomes 28/29)
 */
export function getNextStatementCloseDate(statementCloseDay: number): Date {
  const today = new Date()
  const currentMonth = today.getMonth()
  const currentYear = today.getFullYear()
  const currentDay = today.getDate()

  // Cap statement day at last day of current month
  const lastDayThisMonth = getLastDayOfMonth(currentYear, currentMonth)
  const effectiveDayThisMonth = Math.min(statementCloseDay, lastDayThisMonth)

  if (currentDay <= effectiveDayThisMonth) {
    // Statement closes this month
    return new Date(currentYear, currentMonth, effectiveDayThisMonth)
  } else {
    // Statement closes next month
    const nextMonth = currentMonth + 1
    const nextYear = nextMonth > 11 ? currentYear + 1 : currentYear
    const actualNextMonth = nextMonth % 12
    const lastDayNextMonth = getLastDayOfMonth(nextYear, actualNextMonth)
    const effectiveDayNextMonth = Math.min(statementCloseDay, lastDayNextMonth)
    return new Date(nextYear, actualNextMonth, effectiveDayNextMonth)
  }
}

/**
 * Get next payment due date based on payment_due_day
 * Handles months with fewer days (e.g., day 31 in February becomes 28/29)
 */
export function getNextPaymentDueDate(paymentDueDay: number): Date {
  const today = new Date()
  const currentMonth = today.getMonth()
  const currentYear = today.getFullYear()
  const currentDay = today.getDate()

  // Cap payment day at last day of current month
  const lastDayThisMonth = getLastDayOfMonth(currentYear, currentMonth)
  const effectiveDayThisMonth = Math.min(paymentDueDay, lastDayThisMonth)

  if (currentDay <= effectiveDayThisMonth) {
    // Payment due this month
    return new Date(currentYear, currentMonth, effectiveDayThisMonth)
  } else {
    // Payment due next month
    const nextMonth = currentMonth + 1
    const nextYear = nextMonth > 11 ? currentYear + 1 : currentYear
    const actualNextMonth = nextMonth % 12
    const lastDayNextMonth = getLastDayOfMonth(nextYear, actualNextMonth)
    const effectiveDayNextMonth = Math.min(paymentDueDay, lastDayNextMonth)
    return new Date(nextYear, actualNextMonth, effectiveDayNextMonth)
  }
}
