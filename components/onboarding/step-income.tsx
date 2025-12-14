'use client'

import { useMemo, useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'

export type StepIncomeRow = {
  id: string
  name: string
  amount: string
  frequency: 'weekly' | 'biweekly' | 'monthly' | 'one-time'
  next_date: string
}

function isValidRow(row: StepIncomeRow) {
  const amount = Number(row.amount)
  return (
    row.name.trim().length > 0 &&
    Number.isFinite(amount) &&
    amount > 0 &&
    Boolean(row.frequency) &&
    row.next_date.trim().length > 0
  )
}

export function StepIncome({
  defaultRows,
  onContinue,
  onSkip,
}: {
  defaultRows?: Partial<StepIncomeRow>[]
  onContinue: (rows: Array<{ name: string; amount: number; frequency: StepIncomeRow['frequency']; next_date: string }>) => Promise<void>
  onSkip: () => void
}) {
  const [rows, setRows] = useState<StepIncomeRow[]>(() => {
    const seed = defaultRows?.length
      ? defaultRows
      : [{ name: 'Salary', amount: '', frequency: 'biweekly' as const, next_date: '' }]

    return seed.map((r, idx) => ({
      id: `${Date.now()}-${idx}`,
      name: r.name ?? (idx === 0 ? 'Salary' : 'Primary Income'),
      amount: r.amount ?? '',
      frequency: (r.frequency as any) ?? 'biweekly',
      next_date: r.next_date ?? '',
    }))
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const allValid = useMemo(() => rows.every(isValidRow), [rows])

  function addRow() {
    setRows((prev) => [
      ...prev,
      {
        id: `${Date.now()}-${Math.random()}`,
        name: 'Additional Income',
        amount: '',
        frequency: 'monthly',
        next_date: '',
      },
    ])
  }

  function removeRow(id: string) {
    setRows((prev) => prev.filter((r) => r.id !== id))
  }

  async function handleContinue() {
    if (!allValid) return

    setIsSubmitting(true)
    setError(null)

    try {
      await onContinue(
        rows.map((r) => ({
          name: r.name.trim(),
          amount: Number(r.amount),
          frequency: r.frequency,
          next_date: r.next_date,
        }))
      )
    } catch (e: any) {
      setError(e?.message ?? 'Something went wrong.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="relative">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-zinc-50">When do you get paid?</h2>
        <p className="mt-1 text-sm text-zinc-400">Add your main source of income</p>

        <div className="mt-6 space-y-6">
          {rows.map((row, idx) => {
            const rowValid = isValidRow(row)
            return (
              <div key={row.id} className="rounded-xl border border-zinc-800 bg-zinc-950/40 p-4">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-medium text-zinc-200">
                    {idx === 0 ? 'Primary income' : `Income ${idx + 1}`}
                  </p>
                  {rows.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeRow(row.id)}
                      className="inline-flex items-center gap-1 text-sm text-zinc-400 hover:text-zinc-200"
                    >
                      <Trash2 className="h-4 w-4" />
                      Remove
                    </button>
                  )}
                </div>

                <div className="mt-4 grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-200">Income name</label>
                    <input
                      value={row.name}
                      onChange={(e) =>
                        setRows((prev) =>
                          prev.map((r) => (r.id === row.id ? { ...r, name: e.target.value } : r))
                        )
                      }
                      placeholder={idx === 0 ? 'Salary' : 'Primary Income'}
                      className="mt-1 w-full rounded-lg bg-zinc-800 border border-zinc-700 px-3 py-2.5 text-zinc-50 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-200">Amount</label>
                    <div className="mt-1 relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">$</span>
                      <input
                        value={row.amount}
                        onChange={(e) =>
                          setRows((prev) =>
                            prev.map((r) => (r.id === row.id ? { ...r, amount: e.target.value } : r))
                          )
                        }
                        type="number"
                        step="0.01"
                        inputMode="decimal"
                        placeholder="0.00"
                        className="w-full rounded-lg bg-zinc-800 border border-zinc-700 pl-8 pr-3 py-2.5 text-zinc-50 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-200">Frequency</label>
                    <select
                      value={row.frequency}
                      onChange={(e) =>
                        setRows((prev) =>
                          prev.map((r) =>
                            r.id === row.id ? { ...r, frequency: e.target.value as StepIncomeRow['frequency'] } : r
                          )
                        )
                      }
                      className="mt-1 w-full rounded-lg bg-zinc-800 border border-zinc-700 px-3 py-2.5 text-zinc-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    >
                      <option value="weekly">Weekly</option>
                      <option value="biweekly">Bi-weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="one-time">One-time</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-200">Next payment date</label>
                    <input
                      value={row.next_date}
                      onChange={(e) =>
                        setRows((prev) =>
                          prev.map((r) => (r.id === row.id ? { ...r, next_date: e.target.value } : r))
                        )
                      }
                      type="date"
                      className="mt-1 w-full rounded-lg bg-zinc-800 border border-zinc-700 px-3 py-2.5 text-zinc-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {!rowValid && (
                  <p className="mt-3 text-xs text-zinc-500">
                    Fill out all fields to continue.
                  </p>
                )}
              </div>
            )
          })}

          <button
            type="button"
            onClick={addRow}
            className="inline-flex items-center gap-2 text-sm font-medium text-teal-400 hover:text-teal-300"
          >
            <Plus className="h-4 w-4" />
            Add another income
          </button>

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
            disabled={!allValid || isSubmitting}
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
