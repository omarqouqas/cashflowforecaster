/**
 * Debt Payoff Calculator
 *
 * Calculates payoff schedules for multiple credit cards using
 * Snowball (smallest balance first) or Avalanche (highest APR first) strategies.
 */

import { addMonths } from 'date-fns'
import { calculateMinimumPayment } from '@/lib/types/credit-card'

/**
 * Credit card input for payoff calculations
 */
export interface CreditCardDebt {
  id: string
  name: string
  balance: number
  apr: number
  minimumPaymentPercent?: number
}

/**
 * Per-card payment in a given month
 */
export interface CardPayment {
  cardId: string
  cardName: string
  startingBalance: number
  payment: number
  interest: number
  principal: number
  endingBalance: number
  paidOff: boolean
}

/**
 * Snapshot of all cards for a given month
 */
export interface MonthlySnapshot {
  month: number
  date: Date
  cards: CardPayment[]
  totalPayment: number
  totalBalance: number
  totalInterest: number
}

/**
 * Per-card summary in payoff result
 */
export interface CardPayoffSummary {
  cardId: string
  cardName: string
  initialBalance: number
  apr: number
  paidOffMonth: number
  paidOffDate: Date
  totalInterestPaid: number
}

/**
 * Full payoff calculation result
 */
export interface PayoffResult {
  strategy: 'snowball' | 'avalanche'
  totalMonths: number
  totalInterest: number
  totalPaid: number
  debtFreeDate: Date
  cardSummaries: CardPayoffSummary[]
  schedule: MonthlySnapshot[]
}

/**
 * Comparison between strategies
 */
export interface StrategyComparison {
  snowball: PayoffResult
  avalanche: PayoffResult
  interestSaved: number // Positive means avalanche saves money
  monthsSaved: number   // Positive means avalanche is faster
}

/**
 * Calculate payoff using a specific strategy
 */
function calculatePayoff(
  cards: CreditCardDebt[],
  extraPayment: number,
  strategy: 'snowball' | 'avalanche'
): PayoffResult {
  // Sort cards based on strategy
  const sortedCards = [...cards].sort((a, b) => {
    if (strategy === 'snowball') {
      // Smallest balance first
      return a.balance - b.balance
    } else {
      // Highest APR first
      return b.apr - a.apr
    }
  })

  // Initialize tracking
  const balances = new Map<string, number>()
  const minimumPayments = new Map<string, number>()
  const interestPaid = new Map<string, number>()
  const paidOffMonth = new Map<string, number>()

  for (const card of sortedCards) {
    balances.set(card.id, card.balance)
    minimumPayments.set(card.id, calculateMinimumPayment(card.balance, card.minimumPaymentPercent ?? 2))
    interestPaid.set(card.id, 0)
  }

  const schedule: MonthlySnapshot[] = []
  const startDate = new Date()
  let month = 0
  const maxMonths = 360 // 30 year safety limit

  // Calculate until all cards are paid off or max months reached
  while (month < maxMonths) {
    const totalBalance = Array.from(balances.values()).reduce((sum, b) => sum + b, 0)

    // All paid off?
    if (totalBalance < 0.01) break

    month++
    const monthDate = addMonths(startDate, month)
    const cardPayments: CardPayment[] = []
    let totalMonthInterest = 0
    let totalMonthPayment = 0

    // Calculate available extra payment (grows as cards are paid off)
    let availableExtra = extraPayment
    for (const card of sortedCards) {
      if (balances.get(card.id)! < 0.01 && !paidOffMonth.has(card.id)) {
        // Card was just paid off, its minimum rolls into extra
        continue
      }
      if (paidOffMonth.has(card.id)) {
        // Already paid off - its minimum is now available as extra
        availableExtra += minimumPayments.get(card.id)!
      }
    }

    // Process each card
    for (const card of sortedCards) {
      const currentBalance = balances.get(card.id)!

      // Skip if already paid off
      if (currentBalance < 0.01) {
        if (!paidOffMonth.has(card.id)) {
          paidOffMonth.set(card.id, month - 1)
        }
        continue
      }

      // Calculate interest
      const monthlyRate = card.apr / 100 / 12
      const interest = currentBalance * monthlyRate
      totalMonthInterest += interest
      interestPaid.set(card.id, (interestPaid.get(card.id) ?? 0) + interest)

      // Calculate payment
      const minPayment = Math.min(
        calculateMinimumPayment(currentBalance, card.minimumPaymentPercent ?? 2),
        currentBalance + interest
      )

      // Is this the target card for extra payment?
      const isTargetCard = sortedCards.find(c => balances.get(c.id)! > 0.01)?.id === card.id
      const extraForThisCard = isTargetCard ? availableExtra : 0

      const payment = Math.min(minPayment + extraForThisCard, currentBalance + interest)
      const principal = payment - interest
      const endingBalance = Math.max(0, currentBalance - principal)

      totalMonthPayment += payment
      balances.set(card.id, endingBalance)

      const paidOff = endingBalance < 0.01
      if (paidOff && !paidOffMonth.has(card.id)) {
        paidOffMonth.set(card.id, month)
      }

      cardPayments.push({
        cardId: card.id,
        cardName: card.name,
        startingBalance: currentBalance,
        payment,
        interest,
        principal,
        endingBalance,
        paidOff,
      })
    }

    schedule.push({
      month,
      date: monthDate,
      cards: cardPayments,
      totalPayment: totalMonthPayment,
      totalBalance: Array.from(balances.values()).reduce((sum, b) => sum + b, 0),
      totalInterest: totalMonthInterest,
    })
  }

  // Build card summaries
  const cardSummaries: CardPayoffSummary[] = sortedCards.map(card => ({
    cardId: card.id,
    cardName: card.name,
    initialBalance: card.balance,
    apr: card.apr,
    paidOffMonth: paidOffMonth.get(card.id) ?? month,
    paidOffDate: addMonths(startDate, paidOffMonth.get(card.id) ?? month),
    totalInterestPaid: interestPaid.get(card.id) ?? 0,
  }))

  const totalInterest = Array.from(interestPaid.values()).reduce((sum, i) => sum + i, 0)
  const totalInitialDebt = cards.reduce((sum, c) => sum + c.balance, 0)

  return {
    strategy,
    totalMonths: month,
    totalInterest,
    totalPaid: totalInitialDebt + totalInterest,
    debtFreeDate: addMonths(startDate, month),
    cardSummaries,
    schedule,
  }
}

/**
 * Calculate Snowball payoff (smallest balance first)
 */
export function calculateSnowballPayoff(
  cards: CreditCardDebt[],
  extraPayment: number
): PayoffResult {
  return calculatePayoff(cards, extraPayment, 'snowball')
}

/**
 * Calculate Avalanche payoff (highest APR first)
 */
export function calculateAvalanchePayoff(
  cards: CreditCardDebt[],
  extraPayment: number
): PayoffResult {
  return calculatePayoff(cards, extraPayment, 'avalanche')
}

/**
 * Compare both strategies
 */
export function compareStrategies(
  cards: CreditCardDebt[],
  extraPayment: number
): StrategyComparison {
  const snowball = calculateSnowballPayoff(cards, extraPayment)
  const avalanche = calculateAvalanchePayoff(cards, extraPayment)

  return {
    snowball,
    avalanche,
    interestSaved: snowball.totalInterest - avalanche.totalInterest,
    monthsSaved: snowball.totalMonths - avalanche.totalMonths,
  }
}

/**
 * Get total minimum payment across all cards
 */
export function getTotalMinimumPayment(cards: CreditCardDebt[]): number {
  return cards.reduce((sum, card) => {
    return sum + calculateMinimumPayment(card.balance, card.minimumPaymentPercent ?? 2)
  }, 0)
}

/**
 * Get total debt across all cards
 */
export function getTotalDebt(cards: CreditCardDebt[]): number {
  return cards.reduce((sum, card) => sum + card.balance, 0)
}
