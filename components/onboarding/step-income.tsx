'use client'

import { useMemo, useState } from 'react'
import { showError, showSuccess } from '@/lib/toast'

type Frequency = 'weekly' | 'biweekly' | 'monthly' | 'one-time'

export function StepIncome({
  onContinue,
  onSkip,
}: {
  onContinue: (income: { name: string; amount: number; frequency: Frequency; next_date: string }) => Promise<void>
  onSkip: () => void
}) {
  const [name, setName] = useState('Salary')
  const [amount, setAmount] = useState('')
  const [frequency, setFrequency] = useState<Frequency>('biweekly')
  const [nextDate, setNextDate] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const parsedAmount = useMemo(() => {
    if (amount.trim() === '') return null
    const n = Number(amount)
    return Number.isFinite(n) && n > 0 ? n : null
  }, [amount])

  const canContinue = name.trim().length > 0 && parsedAmount !== null && nextDate.trim().length > 0

  async function handleContinue() {
    if (!canContinue || parsedAmount === null) return
    setIsSubmitting(true)
    setError(null)

    try {
      await onContinue({
        name: name.trim(),
        amount: parsedAmount,
        frequency,
        next_date: nextDate,
      })
      showSuccess('Income added!')
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
        <h2 className="text-xl font-semibold text-zinc-50">When do you get paid?</h2>
        <p className="mt-1 text-sm text-zinc-400">
          Add your main source of income. You can add more later.
        </p>

        <div className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-200">Income name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
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
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                type="number"
                step="0.01"
                inputMode="decimal"
                placeholder="0.00"
                className="w-full rounded-lg bg-zinc-800 border border-zinc-700 pl-8 pr-3 py-2.5 text-zinc-50 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                autoFocus
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
                { value: 'monthly', label: 'Monthly' },
                { value: 'one-time', label: 'One-time' },
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
            <p className="mt-1 text-xs text-zinc-500">When will you receive your next payment?</p>
          </div>

          {error && (
            <div className="rounded-lg border border-rose-900/40 bg-rose-950/30 px-3 py-2 text-sm text-rose-200">
              {error}
            </div>
          )}
        </div>
      </div>

      {/* Fixed footer */}
      <div className="fixed bottom-0 left-0 right-0 z-10 border-t border-zinc-800 bg-zinc-950/90 backdrop-blur">
        <div className="mx-auto w-full max-w-lg px-4 py-4">
          <button
            type="button"
            onClick={handleContinue}
            disabled={!canContinue || isSubmitting}
            className={[
              'w-full rounded-xl bg-teal-500 text-zinc-950 font-semibold py-3.5',
              'transition-colors',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'hover:bg-teal-400',
              'focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-zinc-950',
            ].join(' ')}
          >
            {isSubmitting ? 'Saving…' : 'Continue'}
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