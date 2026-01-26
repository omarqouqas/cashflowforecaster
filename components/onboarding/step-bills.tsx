'use client'

import { useMemo, useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { showError, showSuccess } from '@/lib/toast'
import { CurrencyInput } from '@/components/ui/currency-input'

export type StepBillRow = {
  id: string
  name: string
  amount: number | undefined
  frequency: 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'annually' | 'one-time'
  due_date: string
  category: 'rent' | 'utilities' | 'subscriptions' | 'insurance' | 'other'
}

type Suggestion = {
  key: string
  name: string
  amount: number
  frequency: StepBillRow['frequency']
  category: StepBillRow['category']
  suggestedDayOfMonth: number
}

const SUGGESTIONS: Suggestion[] = [
  { key: 'rent', name: 'Rent/Mortgage', amount: 1500, frequency: 'monthly', category: 'rent', suggestedDayOfMonth: 1 },
  { key: 'utilities', name: 'Utilities', amount: 150, frequency: 'monthly', category: 'utilities', suggestedDayOfMonth: 15 },
  { key: 'phone', name: 'Phone', amount: 80, frequency: 'monthly', category: 'utilities', suggestedDayOfMonth: 20 },
  { key: 'subs', name: 'Subscriptions', amount: 50, frequency: 'monthly', category: 'subscriptions', suggestedDayOfMonth: 5 },
  { key: 'car', name: 'Car Payment', amount: 400, frequency: 'monthly', category: 'other', suggestedDayOfMonth: 10 },
]

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n))
}

function toISODate(d: Date) {
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

function nextDueDateForDay(dayOfMonth: number) {
  const today = new Date()
  const day = clamp(dayOfMonth, 1, 28)

  const thisMonth = new Date(today.getFullYear(), today.getMonth(), day)
  if (thisMonth >= new Date(today.getFullYear(), today.getMonth(), today.getDate())) {
    return toISODate(thisMonth)
  }

  const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, day)
  return toISODate(nextMonth)
}

function isValidBill(b: StepBillRow) {
  return (
    b.name.trim().length > 0 &&
    b.amount !== undefined &&
    b.amount > 0 &&
    b.due_date.trim().length > 0 &&
    Boolean(b.frequency) &&
    Boolean(b.category)
  )
}

export function StepBills({
  defaultBills,
  onContinue,
  onSkip,
}: {
  defaultBills?: Partial<StepBillRow>[]
  onContinue: (bills: Array<{ name: string; amount: number; frequency: StepBillRow['frequency']; due_date: string; category: string }>) => Promise<void>
  onSkip: () => void
}) {
  const [bills, setBills] = useState<StepBillRow[]>(() => {
    if (!defaultBills?.length) return []

    return defaultBills.map((b, idx) => ({
      id: `${Date.now()}-${idx}`,
      name: b.name ?? '',
      amount: typeof b.amount === 'number' ? b.amount : undefined,
      frequency: (b.frequency as any) ?? 'monthly',
      due_date: b.due_date ?? '',
      category: (b.category as any) ?? 'other',
    }))
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const canContinue = bills.length > 0
  const allValid = useMemo(() => bills.length > 0 && bills.every(isValidBill), [bills])

  const addedSuggestionKeys = useMemo(() => {
    const set = new Set<string>()
    for (const s of SUGGESTIONS) {
      const match = bills.some((b) => b.name === s.name)
      if (match) set.add(s.key)
    }
    return set
  }, [bills])

  function addSuggestion(s: Suggestion) {
    if (addedSuggestionKeys.has(s.key)) return

    setBills((prev) => [
      ...prev,
      {
        id: `${Date.now()}-${s.key}`,
        name: s.name,
        amount: s.amount,
        frequency: s.frequency,
        due_date: nextDueDateForDay(s.suggestedDayOfMonth),
        category: s.category,
      },
    ])
  }

  function addCustom() {
    setBills((prev) => [
      ...prev,
      {
        id: `${Date.now()}-${Math.random()}`,
        name: '',
        amount: undefined,
        frequency: 'monthly',
        due_date: nextDueDateForDay(1),
        category: 'other',
      },
    ])
  }

  function removeBill(id: string) {
    setBills((prev) => prev.filter((b) => b.id !== id))
  }

  async function handleContinue() {
    if (!allValid) return

    setIsSubmitting(true)
    setError(null)

    try {
      await onContinue(
        bills.map((b) => ({
          name: b.name.trim(),
          amount: b.amount ?? 0,
          frequency: b.frequency,
          due_date: b.due_date,
          category: b.category,
        }))
      )
      showSuccess(bills.length === 1 ? 'Bill added' : 'Bills added')
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
        <h2 className="text-xl font-semibold text-zinc-50">What bills do you pay regularly?</h2>
        <p className="mt-1 text-sm text-zinc-400">Add your biggest expenses first</p>

        {/* Suggestions */}
        <div className="mt-6">
          <p className="text-sm font-medium text-zinc-200">Suggestions</p>
          <div className="mt-3 grid grid-cols-1 gap-3">
            {SUGGESTIONS.map((s) => {
              const isAdded = addedSuggestionKeys.has(s.key)
              return (
                <button
                  key={s.key}
                  type="button"
                  onClick={() => addSuggestion(s)}
                  disabled={isAdded}
                  className={[
                    'text-left rounded-xl border px-4 py-4 transition-colors',
                    isAdded
                      ? 'border-zinc-800 bg-zinc-950/40 opacity-60 cursor-not-allowed'
                      : 'border-zinc-800 bg-zinc-950/40 hover:bg-zinc-950/70',
                  ].join(' ')}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-zinc-100">{s.name}</p>
                      <p className="mt-1 text-xs text-zinc-500">
                        ${s.amount.toLocaleString()} / {s.frequency}
                      </p>
                    </div>
                    <span
                      className={[
                        'text-xs font-medium rounded-full px-2 py-1',
                        isAdded ? 'bg-zinc-800 text-zinc-300' : 'bg-teal-500 text-zinc-950',
                      ].join(' ')}
                    >
                      {isAdded ? 'Added' : 'Add'}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>

          <button
            type="button"
            onClick={addCustom}
            className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-teal-400 hover:text-teal-300"
          >
            <Plus className="h-4 w-4" />
            Add custom bill
          </button>
        </div>

        {/* Added bills */}
        <div className="mt-8">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-zinc-200">Added bills</p>
            <p className="text-xs text-zinc-500">{bills.length} total</p>
          </div>

          {bills.length === 0 ? (
            <p className="mt-3 text-sm text-zinc-500">
              Add at least one bill, or skip this step.
            </p>
          ) : (
            <div className="mt-3 space-y-4">
              {bills.map((b) => {
                const ok = isValidBill(b)
                return (
                  <div key={b.id} className="rounded-xl border border-zinc-800 bg-zinc-950/40 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-sm font-semibold text-zinc-100">{b.name || 'New bill'}</p>
                      <button
                        type="button"
                        onClick={() => removeBill(b.id)}
                        className="inline-flex items-center gap-1 text-sm text-zinc-400 hover:text-zinc-200"
                      >
                        <Trash2 className="h-4 w-4" />
                        Remove
                      </button>
                    </div>

                    <div className="mt-4 grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-zinc-200">Name</label>
                        <input
                          value={b.name}
                          onChange={(e) =>
                            setBills((prev) => prev.map((x) => (x.id === b.id ? { ...x, name: e.target.value } : x)))
                          }
                          placeholder="e.g., Rent"
                          className="mt-1 w-full rounded-lg bg-zinc-800 border border-zinc-700 px-3 py-2.5 text-zinc-50 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-zinc-200">Amount</label>
                        <div className="mt-1 relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">$</span>
                          <CurrencyInput
                            value={b.amount}
                            onChange={(val) =>
                              setBills((prev) => prev.map((x) => (x.id === b.id ? { ...x, amount: val } : x)))
                            }
                            placeholder="0.00"
                            className="w-full rounded-lg bg-zinc-800 border border-zinc-700 pl-8 pr-3 py-2.5 text-zinc-50 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-zinc-200">Frequency</label>
                        <select
                          value={b.frequency}
                          onChange={(e) =>
                            setBills((prev) =>
                              prev.map((x) => (x.id === b.id ? { ...x, frequency: e.target.value as StepBillRow['frequency'] } : x))
                            )
                          }
                          className="mt-1 w-full rounded-lg bg-zinc-800 border border-zinc-700 px-3 py-2.5 text-zinc-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        >
                          <option value="weekly">Weekly</option>
                          <option value="biweekly">Bi-weekly</option>
                          <option value="monthly">Monthly</option>
                          <option value="quarterly">Quarterly</option>
                          <option value="annually">Annually</option>
                          <option value="one-time">One-time</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-zinc-200">Next due date</label>
                        <input
                          value={b.due_date}
                          onChange={(e) =>
                            setBills((prev) => prev.map((x) => (x.id === b.id ? { ...x, due_date: e.target.value } : x)))
                          }
                          type="date"
                          className="mt-1 w-full rounded-lg bg-zinc-800 border border-zinc-700 px-3 py-2.5 text-zinc-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-zinc-200">Category</label>
                        <select
                          value={b.category}
                          onChange={(e) =>
                            setBills((prev) =>
                              prev.map((x) => (x.id === b.id ? { ...x, category: e.target.value as StepBillRow['category'] } : x))
                            )
                          }
                          className="mt-1 w-full rounded-lg bg-zinc-800 border border-zinc-700 px-3 py-2.5 text-zinc-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        >
                          <option value="rent">Rent/Mortgage</option>
                          <option value="utilities">Utilities</option>
                          <option value="subscriptions">Subscriptions</option>
                          <option value="insurance">Insurance</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>

                    {!ok && <p className="mt-3 text-xs text-zinc-500">Fill out all fields to continue.</p>}
                  </div>
                )
              })}
            </div>
          )}

          {error && (
            <div className="mt-4 rounded-lg border border-rose-900/40 bg-rose-950/30 px-3 py-2 text-sm text-rose-200">
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
            {isSubmitting ? 'Saving…' : 'See Your Forecast'}
          </button>

          <button
            type="button"
            onClick={onSkip}
            className="mt-3 w-full text-center text-sm text-zinc-500 hover:text-zinc-300"
          >
            Skip for now
          </button>

          {!canContinue && (
            <p className="mt-2 text-center text-xs text-zinc-600">
              To continue without bills, use “Skip for now”.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
