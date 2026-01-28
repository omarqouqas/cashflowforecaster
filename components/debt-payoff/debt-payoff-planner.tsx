'use client'

import { useState, useMemo } from 'react'
import { CreditCard, TrendingDown, Calculator, Zap, Target, CheckCircle2, AlertTriangle, Plus, ArrowRight, BarChart3 } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { formatCurrency } from '@/lib/utils/format'
import { CurrencyInput } from '@/components/ui/currency-input'
import {
  compareStrategies,
  getTotalMinimumPayment,
  getTotalDebt,
  type CreditCardDebt,
  type PayoffResult,
} from '@/lib/debt-payoff/calculate-payoff'
import { PayoffTimelineChart } from '@/components/charts/payoff-timeline-chart'

interface CreditCardInput {
  id: string
  name: string
  balance: number
  apr: number
  minimumPaymentPercent?: number
  creditLimit?: number | null
}

interface DebtPayoffPlannerProps {
  cards: CreditCardInput[]
  currency?: string
  totalCreditCardCount?: number
}

export function DebtPayoffPlanner({ cards, currency = 'USD', totalCreditCardCount = 0 }: DebtPayoffPlannerProps) {
  const [extraPayment, setExtraPayment] = useState<number | undefined>(100)
  const [selectedStrategy, setSelectedStrategy] = useState<'snowball' | 'avalanche'>('snowball')

  // Transform cards to the calculation format
  const creditCards: CreditCardDebt[] = useMemo(() =>
    cards.map(card => ({
      id: card.id,
      name: card.name,
      balance: card.balance,
      apr: card.apr,
      minimumPaymentPercent: card.minimumPaymentPercent,
    })),
    [cards]
  )

  // Calculate totals
  const totalDebt = useMemo(() => getTotalDebt(creditCards), [creditCards])
  const totalMinimum = useMemo(() => getTotalMinimumPayment(creditCards), [creditCards])

  // Check for cards with 0% APR (might be missing data)
  const zeroAprCards = useMemo(() =>
    cards.filter(card => card.apr === 0 || card.apr === null || card.apr === undefined),
    [cards]
  )

  // Compare strategies
  const comparison = useMemo(() => {
    if (creditCards.length === 0) return null
    return compareStrategies(creditCards, extraPayment ?? 0)
  }, [creditCards, extraPayment])

  // Get selected strategy result
  const selectedResult: PayoffResult | null = useMemo(() => {
    if (!comparison) return null
    return selectedStrategy === 'snowball' ? comparison.snowball : comparison.avalanche
  }, [comparison, selectedStrategy])

  // Empty state - differentiate between "no cards added" vs "all cards paid off"
  if (cards.length === 0) {
    // Scenario A: User has credit cards, but all have $0 balance (truly debt-free)
    if (totalCreditCardCount > 0) {
      return (
        <div className="border border-zinc-800 bg-zinc-900 rounded-lg p-8 text-center">
          <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-emerald-400" />
          </div>
          <h2 className="text-xl font-semibold text-zinc-100 mb-2">You&apos;re Debt Free!</h2>
          <p className="text-zinc-400 max-w-md mx-auto">
            All your credit cards have a $0 balance. Keep up the great work!
          </p>
          <Link
            href="/dashboard/accounts"
            className="inline-flex items-center gap-2 mt-6 text-sm text-teal-400 hover:text-teal-300 transition-colors"
          >
            View your accounts
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )
    }

    // Scenario B: User has NO credit cards added at all - show feature preview
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-zinc-100">Debt Payoff Planner</h1>

        <div className="border border-zinc-800 bg-zinc-900 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-amber-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <TrendingDown className="w-6 h-6 text-amber-400" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-zinc-100 mb-2">
                Plan Your Path to Debt Freedom
              </h2>
              <p className="text-zinc-400 text-sm mb-4">
                Add your credit cards to unlock powerful debt payoff strategies.
                Compare Snowball vs Avalanche methods and see exactly when you&apos;ll be debt-free.
              </p>
            </div>
          </div>

          {/* Feature preview */}
          <div className="mt-6 grid sm:grid-cols-3 gap-4">
            <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700/50">
              <div className="w-8 h-8 bg-teal-500/10 rounded-full flex items-center justify-center mb-3">
                <Calculator className="w-4 h-4 text-teal-400" />
              </div>
              <h3 className="text-sm font-medium text-zinc-200 mb-1">Compare Strategies</h3>
              <p className="text-xs text-zinc-500">
                See which method saves you more money and time
              </p>
            </div>
            <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700/50">
              <div className="w-8 h-8 bg-emerald-500/10 rounded-full flex items-center justify-center mb-3">
                <BarChart3 className="w-4 h-4 text-emerald-400" />
              </div>
              <h3 className="text-sm font-medium text-zinc-200 mb-1">Visual Timeline</h3>
              <p className="text-xs text-zinc-500">
                Watch your debt decrease month by month
              </p>
            </div>
            <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700/50">
              <div className="w-8 h-8 bg-amber-500/10 rounded-full flex items-center justify-center mb-3">
                <Target className="w-4 h-4 text-amber-400" />
              </div>
              <h3 className="text-sm font-medium text-zinc-200 mb-1">Payoff Milestones</h3>
              <p className="text-xs text-zinc-500">
                Know exactly when each card will be paid off
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-6 pt-6 border-t border-zinc-700/50">
            <Link
              href="/dashboard/accounts/new?type=credit_card"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-500 text-white text-sm font-medium rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Your First Credit Card
            </Link>
            <p className="text-xs text-zinc-500 mt-3">
              Add at least 2 credit cards to compare payoff strategies
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Single card - show feature preview and encourage adding more cards
  if (cards.length === 1) {
    const card = cards[0]!
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-zinc-100">Debt Payoff Planner</h1>

        {/* Current card info */}
        <div className="border border-zinc-800 bg-zinc-900 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-amber-500/10 rounded-full flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-zinc-100">{card.name}</h2>
              <p className="text-sm text-zinc-400">Your only credit card with a balance</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-xs text-zinc-500">Balance</p>
              <p className="text-xl font-bold text-amber-400">{formatCurrency(card.balance, currency)}</p>
            </div>
            <div>
              <p className="text-xs text-zinc-500">APR</p>
              <p className="text-xl font-bold text-zinc-100">
                {card.apr != null ? `${card.apr}%` : <span className="text-zinc-500">Not set</span>}
              </p>
            </div>
          </div>

          {/* Warning if APR is missing */}
          {(card.apr === 0 || card.apr == null) && (
            <div className="flex items-start gap-2 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg mb-4">
              <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-300">
                {card.apr === 0
                  ? "This card has 0% APR. If this isn't a promotional rate, update it in account settings for accurate calculations."
                  : "APR not set. Update your account settings for accurate interest calculations."
                }
              </p>
            </div>
          )}

          <p className="text-sm text-zinc-400">
            For single-card debt, use the <span className="text-teal-400">Payment Simulator</span> on your account card to explore payment options.
          </p>
        </div>

        {/* Feature preview - what you get with 2+ cards */}
        <div className="border border-teal-500/30 bg-teal-500/5 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-teal-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
              <BarChart3 className="w-6 h-6 text-teal-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-zinc-100 mb-2">
                Unlock Smart Debt Strategies
              </h3>
              <p className="text-sm text-zinc-400 mb-4">
                Add another credit card to compare <span className="text-teal-400 font-medium">Snowball</span> vs <span className="text-teal-400 font-medium">Avalanche</span> payoff strategies and see exactly how much interest you can save.
              </p>

              {/* Feature benefits */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
                <div className="flex items-start gap-2">
                  <Target className="w-4 h-4 text-teal-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-zinc-300">Compare payoff strategies</span>
                </div>
                <div className="flex items-start gap-2">
                  <TrendingDown className="w-4 h-4 text-teal-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-zinc-300">See interest savings</span>
                </div>
                <div className="flex items-start gap-2">
                  <BarChart3 className="w-4 h-4 text-teal-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-zinc-300">Visual payoff timeline</span>
                </div>
                <div className="flex items-start gap-2">
                  <Calculator className="w-4 h-4 text-teal-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-zinc-300">Optimal payment order</span>
                </div>
              </div>

              {/* CTA */}
              <Link
                href="/dashboard/accounts/new?type=credit_card"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-medium rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Another Credit Card
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Why 2+ cards explanation */}
        <p className="text-xs text-zinc-500 text-center">
          The Debt Payoff Planner compares strategies for paying off multiple cards. With one card, there&apos;s nothing to compare — just pay it off as fast as you can!
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-zinc-100">Debt Payoff Planner</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-1">
            <CreditCard className="w-4 h-4 text-amber-400" />
            <p className="text-xs font-medium text-amber-300 uppercase tracking-wide">Total Debt</p>
          </div>
          <p className="text-2xl font-bold text-amber-300 tabular-nums">
            {formatCurrency(totalDebt, currency)}
          </p>
          <p className="text-xs text-amber-400/70 mt-1">{cards.length} credit cards</p>
        </div>

        <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-1">
            <TrendingDown className="w-4 h-4 text-zinc-400" />
            <p className="text-xs font-medium text-zinc-400 uppercase tracking-wide">Minimum Payments</p>
          </div>
          <p className="text-2xl font-bold text-zinc-100 tabular-nums">
            {formatCurrency(totalMinimum, currency)}/mo
          </p>
          <p className="text-xs text-zinc-500 mt-1">Combined minimum due</p>
        </div>
      </div>

      {/* Warning for 0% APR cards */}
      {zeroAprCards.length > 0 && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-300">
                {zeroAprCards.length === 1 ? '1 card has' : `${zeroAprCards.length} cards have`} 0% APR
              </p>
              <p className="text-xs text-amber-400/70 mt-1">
                {zeroAprCards.map(c => c.name).join(', ')} — If this isn&apos;t a promotional rate, please update the APR in your account settings for accurate calculations.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Extra Payment Input */}
      <div className="border border-zinc-800 bg-zinc-900 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <Calculator className="w-4 h-4 text-teal-400" />
          <h3 className="text-sm font-medium text-zinc-300">Extra Monthly Payment</h3>
        </div>
        <p className="text-sm text-zinc-400 mb-3">
          How much extra can you pay each month above the minimum payments?
        </p>
        <div className="relative max-w-xs">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 z-10">$</span>
          <CurrencyInput
            value={extraPayment}
            onChange={setExtraPayment}
            placeholder="100.00"
            className="pl-8 bg-zinc-800 border-zinc-700 text-zinc-100"
          />
        </div>
        <p className="text-xs text-zinc-500 mt-2">
          Total monthly payment: {formatCurrency(totalMinimum + (extraPayment ?? 0), currency)}
        </p>
      </div>

      {/* Strategy Comparison */}
      {comparison && (
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-zinc-300">Choose Your Strategy</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Snowball Strategy */}
            <button
              onClick={() => setSelectedStrategy('snowball')}
              className={`text-left border rounded-lg p-4 transition-all ${
                selectedStrategy === 'snowball'
                  ? 'border-teal-500 bg-teal-500/10'
                  : 'border-zinc-700 bg-zinc-900 hover:border-zinc-600'
              }`}
            >
              <div className="flex items-center gap-2 mb-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  selectedStrategy === 'snowball' ? 'bg-teal-500/20' : 'bg-zinc-800'
                }`}>
                  <Target className={`w-4 h-4 ${selectedStrategy === 'snowball' ? 'text-teal-400' : 'text-zinc-400'}`} />
                </div>
                <div>
                  <h4 className="font-semibold text-zinc-100">Snowball</h4>
                  <p className="text-xs text-zinc-500">Smallest balance first</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">Debt-free by</span>
                  <span className="text-zinc-100 font-medium">
                    {format(comparison.snowball.debtFreeDate, 'MMM yyyy')}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">Total interest</span>
                  <span className="text-rose-400 font-medium">
                    {formatCurrency(comparison.snowball.totalInterest, currency)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">Total paid</span>
                  <span className="text-zinc-100">
                    {formatCurrency(comparison.snowball.totalPaid, currency)}
                  </span>
                </div>
              </div>

              <p className="text-xs text-zinc-500 mt-3">
                Quick wins to stay motivated
              </p>
            </button>

            {/* Avalanche Strategy */}
            <button
              onClick={() => setSelectedStrategy('avalanche')}
              className={`text-left border rounded-lg p-4 transition-all ${
                selectedStrategy === 'avalanche'
                  ? 'border-teal-500 bg-teal-500/10'
                  : 'border-zinc-700 bg-zinc-900 hover:border-zinc-600'
              }`}
            >
              <div className="flex items-center gap-2 mb-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  selectedStrategy === 'avalanche' ? 'bg-teal-500/20' : 'bg-zinc-800'
                }`}>
                  <Zap className={`w-4 h-4 ${selectedStrategy === 'avalanche' ? 'text-teal-400' : 'text-zinc-400'}`} />
                </div>
                <div>
                  <h4 className="font-semibold text-zinc-100">Avalanche</h4>
                  <p className="text-xs text-zinc-500">Highest APR first</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">Debt-free by</span>
                  <span className="text-zinc-100 font-medium">
                    {format(comparison.avalanche.debtFreeDate, 'MMM yyyy')}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">Total interest</span>
                  <span className="text-rose-400 font-medium">
                    {formatCurrency(comparison.avalanche.totalInterest, currency)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">Total paid</span>
                  <span className="text-zinc-100">
                    {formatCurrency(comparison.avalanche.totalPaid, currency)}
                  </span>
                </div>
              </div>

              {comparison.interestSaved > 0 && (
                <p className="text-xs text-emerald-400 mt-3">
                  Saves {formatCurrency(comparison.interestSaved, currency)} in interest
                </p>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Payoff Timeline Chart */}
      {selectedResult && selectedResult.schedule.length > 0 && (
        <PayoffTimelineChart
          schedule={selectedResult.schedule}
          cardSummaries={selectedResult.cardSummaries}
          totalDebt={totalDebt}
          currency={currency}
        />
      )}

      {/* Payoff Order */}
      {selectedResult && (
        <div className="border border-zinc-800 bg-zinc-900 rounded-lg p-4">
          <h3 className="text-sm font-medium text-zinc-300 mb-4">
            Payoff Order ({selectedStrategy === 'snowball' ? 'Snowball' : 'Avalanche'})
          </h3>

          <div className="space-y-3">
            {selectedResult.cardSummaries.map((card, index) => (
              <div
                key={card.cardId}
                className="flex items-center gap-4 p-3 bg-zinc-800/50 rounded-lg"
              >
                <div className="w-8 h-8 bg-amber-500/10 rounded-full flex items-center justify-center text-amber-400 font-bold text-sm">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-zinc-100 truncate">{card.cardName}</p>
                  <p className="text-xs text-zinc-500">
                    {formatCurrency(card.initialBalance, currency)} at {card.apr}% APR
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-zinc-100">
                    {format(card.paidOffDate, 'MMM yyyy')}
                  </p>
                  <p className="text-xs text-rose-400">
                    +{formatCurrency(card.totalInterestPaid, currency)} interest
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-zinc-700">
            <div className="flex justify-between items-center">
              <span className="text-zinc-400">Total time to debt-free</span>
              <span className="text-lg font-bold text-emerald-400">
                {selectedResult.totalMonths} months
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
