'use client'

import { useMemo, useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { showError, showSuccess } from '@/lib/toast'

type Frequency = 'weekly' | 'biweekly' | 'semi-monthly' | 'monthly' | 'one-time'

export type QuickSetupValues = {
  balance: number
  income?: {
    name: string
    amount: number
    frequency: Frequency
    next_date: string
  }
}

export function StepQuickSetup({
  onContinue,
  onSkip,
}: {
  onContinue: (values: QuickSetupValues) => Promise<void>
  onSkip: () => void
}) {
  // Account state
  const [balance, setBalance] = useState('')

  // Income state
  const [showIncome, setShowIncome] = useState(false)
  const [incomeName, setIncomeName] = useState('Salary')
  const [incomeAmount, setIncomeAmount] = useState('')
  const [frequency, setFrequency] = useState<Frequency>('biweekly')
  const [nextDate, setNextDate] = useState('')

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const parsedBalance = useMemo(() => {
    if (balance.trim() === '') return null
    const n = Number(balance)
    return Number.isFinite(n) ? n : null
  }, [balance])

  const parsedIncomeAmount = useMemo(() => {
    if (incomeAmount.trim() === '') return null
    const n = Number(incomeAmount)
    return Number.isFinite(n) && n > 0 ? n : null
  }, [incomeAmount])

  // Balance is required, income is optional
  const canContinue = parsedBalance !== null
  const incomeComplete = showIncome
    ? incomeName.trim().length > 0 && parsedIncomeAmount !== null && nextDate.trim().length > 0
    : true

  async function handleContinue() {
    if (!canContinue || parsedBalance === null) return
    if (showIncome && !incomeComplete) return

    setIsSubmitting(true)
    setError(null)

    try {
      const values: QuickSetupValues = {
        balance: parsedBalance,
      }

      if (showIncome && parsedIncomeAmount !== null && nextDate) {
        values.income = {
          name: incomeName.trim(),
          amount: parsedIncomeAmount,
          frequency,
          next_date: nextDate,
        }
      }

      await onContinue(values)
      showSuccess('Setup saved!')
    } catch (e: any) {
      const message = e?.message ?? 'Something went wrong.'
      showError(message)
      setError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="relative">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        {/* Balance Section */}
        <div>
          <h2 className="text-xl font-semibold text-zinc-50">What&apos;s your current balance?</h2>
          <p className="mt-1 text-sm text-zinc-400">
            Enter your main checking account balance to start forecasting.
          </p>
        </div>

        <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-950/40 px-4 py-3">
          <p className="text-sm text-zinc-300">
            Use today&apos;s balance from your bank app. You can add more accounts later.
          </p>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-zinc-200">
            Current balance <span className="text-rose-400">*</span>
          </label>
          <div className="mt-1 relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">$</span>
            <input
              value={balance}
              onChange={(e) => setBalance(e.target.value)}
              inputMode="decimal"
              type="number"
              step="0.01"
              placeholder="0.00"
              className="w-full rounded-lg bg-zinc-800 border border-zinc-700 pl-8 pr-3 py-2.5 text-zinc-50 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              required
              autoFocus
            />
          </div>
        </div>

        {/* Divider */}
        <div className="my-6 border-t border-zinc-800" />

        {/* Income Section (Collapsible) */}
        <div>
          <button
            type="button"
            onClick={() => setShowIncome(!showIncome)}
            className="w-full flex items-center justify-between text-left"
          >
            <div>
              <h3 className="text-lg font-semibold text-zinc-50">When do you get paid?</h3>
              <p className="mt-0.5 text-sm text-zinc-500">Optional - add your main income source</p>
            </div>
            {showIncome ? (
              <ChevronUp className="h-5 w-5 text-zinc-400" />
            ) : (
              <ChevronDown className="h-5 w-5 text-zinc-400" />
            )}
          </button>

          {showIncome && (
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-200">Income name</label>
                <input
                  value={incomeName}
                  onChange={(e) => setIncomeName(e.target.value)}
                  placeholder="Salary"
                  className="mt-1 w-full rounded-lg bg-zinc-800 border border-zinc-700 px-3 py-2.5 text-zinc-50 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-200">
                  Amount per paycheck <span className="text-rose-400">*</span>
                </label>
                <div className="mt-1 relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">$</span>
                  <input
                    value={incomeAmount}
                    onChange={(e) => setIncomeAmount(e.target.value)}
                    type="number"
                    step="0.01"
                    inputMode="decimal"
                    placeholder="0.00"
                    className="w-full rounded-lg bg-zinc-800 border border-zinc-700 pl-8 pr-3 py-2.5 text-zinc-50 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
                <p className="mt-1 text-xs text-zinc-500">After taxes (take-home pay)</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-200">How often?</label>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {([
                    { value: 'weekly', label: 'Weekly' },
                    { value: 'biweekly', label: 'Every 2 weeks' },
                    { value: 'semi-monthly', label: 'Twice a month' },
                    { value: 'monthly', label: 'Monthly' },
                  ] as const).map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setFrequency(opt.value)}
                      className={[
                        'rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors',
                        frequency === opt.value
                          ? 'border-teal-500 bg-teal-500/10 text-teal-400'
                          : 'border-zinc-700 bg-zinc-800 text-zinc-300 hover:border-zinc-600',
                      ].join(' ')}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-200">
                  Next payday <span className="text-rose-400">*</span>
                </label>
                <input
                  value={nextDate}
                  onChange={(e) => setNextDate(e.target.value)}
                  type="date"
                  className="mt-1 w-full rounded-lg bg-zinc-800 border border-zinc-700 px-3 py-2.5 text-zinc-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              {showIncome && !incomeComplete && (
                <p className="text-xs text-zinc-500">
                  Fill out all income fields, or collapse this section to continue without income.
                </p>
              )}
            </div>
          )}
        </div>

        {error && (
          <div className="mt-4 rounded-lg border border-rose-900/40 bg-rose-950/30 px-3 py-2 text-sm text-rose-200">
            {error}
          </div>
        )}
      </div>

      {/* Fixed footer */}
      <div className="fixed bottom-0 left-0 right-0 z-10 border-t border-zinc-800 bg-zinc-950/90 backdrop-blur">
        <div className="mx-auto w-full max-w-lg px-4 py-4">
          <button
            type="button"
            onClick={handleContinue}
            disabled={!canContinue || (showIncome && !incomeComplete) || isSubmitting}
            className={[
              'w-full rounded-xl bg-teal-500 text-zinc-950 font-semibold py-3.5',
              'transition-colors',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'hover:bg-teal-400',
              'focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-zinc-950',
            ].join(' ')}
          >
            {isSubmitting ? 'Saving...' : 'Continue'}
          </button>

          <button
            type="button"
            onClick={onSkip}
            className="mt-3 w-full text-center text-sm text-zinc-500 hover:text-zinc-300"
          >
            Skip for now
          </button>
        </div>
      </div>
    </div>
  )
}
