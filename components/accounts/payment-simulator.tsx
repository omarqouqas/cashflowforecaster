'use client'

import { useState, useMemo } from 'react'
import { X, CreditCard, Calculator } from 'lucide-react'
import { formatCurrency } from '@/lib/utils/format'
import {
  calculateMinimumPayment,
  calculateMonthlyInterest,
  calculatePayoffSchedule,
  getNextPaymentDueDate,
} from '@/lib/types/credit-card'

interface CreditCardAccount {
  id: string
  name: string
  current_balance: number
  currency?: string
  credit_limit?: number | null
  apr?: number | null
  minimum_payment_percent?: number | null
  payment_due_day?: number | null
}

interface PaymentSimulatorProps {
  account: CreditCardAccount
  isOpen: boolean
  onClose: () => void
}

type PaymentOption = 'minimum' | 'statement' | 'custom'

export function PaymentSimulator({ account, isOpen, onClose }: PaymentSimulatorProps) {
  const [selectedOption, setSelectedOption] = useState<PaymentOption>('statement')
  const [customAmount, setCustomAmount] = useState<string>('')

  const currency = account.currency || 'USD'
  const balance = Math.abs(account.current_balance)
  const apr = account.apr ?? 0
  const minPaymentPercent = account.minimum_payment_percent ?? 2
  const paymentDueDay = account.payment_due_day

  // Calculate payment amounts
  const minimumPayment = useMemo(
    () => calculateMinimumPayment(balance, minPaymentPercent),
    [balance, minPaymentPercent]
  )

  const statementBalance = balance

  const customPaymentAmount = useMemo(() => {
    const parsed = parseFloat(customAmount)
    return isNaN(parsed) ? 0 : Math.max(0, Math.min(parsed, balance))
  }, [customAmount, balance])

  // Get the selected payment amount
  const selectedPaymentAmount = useMemo(() => {
    switch (selectedOption) {
      case 'minimum':
        return minimumPayment
      case 'statement':
        return statementBalance
      case 'custom':
        return customPaymentAmount
    }
  }, [selectedOption, minimumPayment, statementBalance, customPaymentAmount])

  // Calculate scenarios for each option
  const scenarios = useMemo(() => {
    const minScenario = calculatePayoffSchedule(balance, apr, minimumPayment)
    const fullScenario = { months: 1, totalInterest: 0, schedule: [] }
    const customScenario =
      customPaymentAmount > 0
        ? calculatePayoffSchedule(balance, apr, customPaymentAmount)
        : { months: 0, totalInterest: 0, schedule: [] }

    return {
      minimum: minScenario,
      statement: fullScenario,
      custom: customScenario,
    }
  }, [balance, apr, minimumPayment, customPaymentAmount])

  // Calculate monthly interest if carrying balance
  const monthlyInterest = useMemo(
    () => calculateMonthlyInterest(balance - selectedPaymentAmount, apr),
    [balance, selectedPaymentAmount, apr]
  )

  // Next payment due date
  const nextDueDate = paymentDueDay ? getNextPaymentDueDate(paymentDueDay) : null

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-500/10 rounded-full flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-zinc-100">Payment Simulator</h2>
              <p className="text-sm text-zinc-400">{account.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-zinc-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Current Balance */}
          <div className="bg-zinc-800/50 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <span className="text-zinc-400">Current Balance</span>
              <span className="text-xl font-bold text-amber-400">
                {formatCurrency(balance, currency)}
              </span>
            </div>
            {apr > 0 && (
              <div className="flex justify-between items-center mt-2 text-sm">
                <span className="text-zinc-500">APR</span>
                <span className="text-zinc-300">{apr}%</span>
              </div>
            )}
            {nextDueDate && (
              <div className="flex justify-between items-center mt-2 text-sm">
                <span className="text-zinc-500">Payment Due</span>
                <span className="text-zinc-300">
                  {nextDueDate.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </div>
            )}
          </div>

          {/* Payment Options */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-zinc-300">Payment Options</h3>

            {/* Minimum Payment */}
            <label
              className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                selectedOption === 'minimum'
                  ? 'border-teal-500 bg-teal-500/10'
                  : 'border-zinc-700 hover:border-zinc-600'
              }`}
            >
              <input
                type="radio"
                name="payment"
                value="minimum"
                checked={selectedOption === 'minimum'}
                onChange={() => setSelectedOption('minimum')}
                className="mt-1 text-teal-500 focus:ring-teal-500"
              />
              <div className="flex-1">
                <div className="flex justify-between">
                  <span className="font-medium text-zinc-100">Minimum Payment</span>
                  <span className="font-semibold text-zinc-100">
                    {formatCurrency(minimumPayment, currency)}
                  </span>
                </div>
                <p className="text-sm text-zinc-400 mt-1">
                  {apr > 0 ? (
                    <>
                      Paid off in {scenarios.minimum.months} months
                      <span className="text-rose-400 ml-1">
                        (+{formatCurrency(scenarios.minimum.totalInterest, currency)} interest)
                      </span>
                    </>
                  ) : (
                    `${minPaymentPercent}% of balance`
                  )}
                </p>
              </div>
            </label>

            {/* Full Statement Balance */}
            <label
              className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                selectedOption === 'statement'
                  ? 'border-teal-500 bg-teal-500/10'
                  : 'border-zinc-700 hover:border-zinc-600'
              }`}
            >
              <input
                type="radio"
                name="payment"
                value="statement"
                checked={selectedOption === 'statement'}
                onChange={() => setSelectedOption('statement')}
                className="mt-1 text-teal-500 focus:ring-teal-500"
              />
              <div className="flex-1">
                <div className="flex justify-between">
                  <span className="font-medium text-zinc-100">Statement Balance</span>
                  <span className="font-semibold text-zinc-100">
                    {formatCurrency(statementBalance, currency)}
                  </span>
                </div>
                <p className="text-sm text-emerald-400 mt-1">No interest charged</p>
              </div>
            </label>

            {/* Custom Amount */}
            <label
              className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                selectedOption === 'custom'
                  ? 'border-teal-500 bg-teal-500/10'
                  : 'border-zinc-700 hover:border-zinc-600'
              }`}
            >
              <input
                type="radio"
                name="payment"
                value="custom"
                checked={selectedOption === 'custom'}
                onChange={() => setSelectedOption('custom')}
                className="mt-1 text-teal-500 focus:ring-teal-500"
              />
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-zinc-100">Custom Amount</span>
                  <div className="relative">
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-zinc-500 text-sm">
                      $
                    </span>
                    <input
                      type="number"
                      value={customAmount}
                      onChange={(e) => {
                        setCustomAmount(e.target.value)
                        setSelectedOption('custom')
                      }}
                      placeholder="0.00"
                      min="0"
                      max={balance}
                      step="0.01"
                      className="w-28 pl-6 pr-2 py-1 text-right bg-zinc-800 border border-zinc-600 rounded text-zinc-100 text-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
                    />
                  </div>
                </div>
                {customPaymentAmount > 0 && apr > 0 && (
                  <p className="text-sm text-zinc-400 mt-1">
                    {customPaymentAmount >= balance ? (
                      <span className="text-emerald-400">No interest charged</span>
                    ) : (
                      <>
                        Paid off in {scenarios.custom.months} months
                        <span className="text-rose-400 ml-1">
                          (+{formatCurrency(scenarios.custom.totalInterest, currency)} interest)
                        </span>
                      </>
                    )}
                  </p>
                )}
              </div>
            </label>
          </div>

          {/* Impact Summary */}
          <div className="bg-zinc-800/50 rounded-lg p-4 space-y-3">
            <h3 className="text-sm font-medium text-zinc-300 flex items-center gap-2">
              <Calculator className="w-4 h-4" />
              Payment Impact
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-zinc-500">Cash Outflow</p>
                <p className="text-lg font-semibold text-zinc-100">
                  -{formatCurrency(selectedPaymentAmount, currency)}
                </p>
              </div>
              <div>
                <p className="text-xs text-zinc-500">Remaining Balance</p>
                <p className="text-lg font-semibold text-zinc-100">
                  {formatCurrency(Math.max(0, balance - selectedPaymentAmount), currency)}
                </p>
              </div>
            </div>

            {apr > 0 && selectedPaymentAmount < balance && (
              <div className="pt-3 border-t border-zinc-700">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">Interest next month</span>
                  <span className="text-rose-400">
                    ~{formatCurrency(monthlyInterest, currency)}
                  </span>
                </div>
              </div>
            )}

            {/* Comparison with minimum payment */}
            {selectedOption !== 'minimum' && apr > 0 && scenarios.minimum.totalInterest > 0 && (
              <div className="pt-3 border-t border-zinc-700">
                <p className="text-sm text-emerald-400">
                  {selectedPaymentAmount >= balance ? (
                    <>
                      You save{' '}
                      <span className="font-semibold">
                        {formatCurrency(scenarios.minimum.totalInterest, currency)}
                      </span>{' '}
                      vs paying minimum
                    </>
                  ) : customPaymentAmount > minimumPayment ? (
                    <>
                      You save{' '}
                      <span className="font-semibold">
                        {formatCurrency(
                          scenarios.minimum.totalInterest - scenarios.custom.totalInterest,
                          currency
                        )}
                      </span>{' '}
                      vs paying minimum
                    </>
                  ) : null}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-900/50">
          <p className="text-xs text-zinc-500 text-center">
            This is an estimate. Actual interest may vary based on your card&apos;s terms.
          </p>
        </div>
      </div>
    </div>
  )
}
