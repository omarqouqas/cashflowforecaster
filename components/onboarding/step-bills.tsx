'use client'

import { useMemo, useState, useEffect } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { showError, showSuccess } from '@/lib/toast'
import { CurrencyInput } from '@/components/ui/currency-input'
import { createClient } from '@/lib/supabase/client'
import { seedDefaultCategories } from '@/lib/actions/manage-categories'
import { DEFAULT_CATEGORIES, type UserCategory } from '@/lib/categories/constants'

export type StepBillRow = {
  id: string
  name: string
  amount: number | undefined
  frequency: 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'annually' | 'one-time'
  due_date: string
  category: string
}

type Suggestion = {
  key: string
  name: string
  amount: number
  frequency: StepBillRow['frequency']
  category: string
  suggestedDayOfMonth: number
}

const SUGGESTIONS: Suggestion[] = [
  { key: 'rent', name: 'Rent/Mortgage', amount: 1500, frequency: 'monthly', category: 'Rent/Mortgage', suggestedDayOfMonth: 1 },
  { key: 'utilities', name: 'Utilities', amount: 150, frequency: 'monthly', category: 'Utilities', suggestedDayOfMonth: 15 },
  { key: 'phone', name: 'Phone', amount: 80, frequency: 'monthly', category: 'Utilities', suggestedDayOfMonth: 20 },
  { key: 'subs', name: 'Subscriptions', amount: 50, frequency: 'monthly', category: 'Subscriptions', suggestedDayOfMonth: 5 },
  { key: 'car', name: 'Car Payment', amount: 400, frequency: 'monthly', category: 'Other', suggestedDayOfMonth: 10 },
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

function getLastDayOfMonth(year: number, month: number) {
  // Day 0 of next month = last day of current month
  return new Date(year, month + 1, 0).getDate()
}

function nextDueDateForDay(dayOfMonth: number) {
  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth()

  // Clamp to valid range 1-31, then to actual month length
  const requestedDay = clamp(dayOfMonth, 1, 31)
  const lastDayThisMonth = getLastDayOfMonth(year, month)
  const day = Math.min(requestedDay, lastDayThisMonth)

  const thisMonth = new Date(year, month, day)
  if (thisMonth >= new Date(year, month, today.getDate())) {
    return toISODate(thisMonth)
  }

  // For next month, also clamp to that month's last day
  const lastDayNextMonth = getLastDayOfMonth(year, month + 1)
  const nextMonthDay = Math.min(requestedDay, lastDayNextMonth)
  const nextMonth = new Date(year, month + 1, nextMonthDay)
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
      category: b.category ?? 'Other',
    }))
  })

  const [categories, setCategories] = useState<UserCategory[]>([])
  const [categoriesLoading, setCategoriesLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch or seed categories for this user
  useEffect(() => {
    async function loadCategories() {
      setCategoriesLoading(true)
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        setCategoriesLoading(false)
        return
      }

      // First try to fetch existing categories
      let { data: cats } = await supabase
        .from('user_categories')
        .select('*')
        .eq('user_id', user.id)
        .order('sort_order', { ascending: true })

      // If no categories exist, seed defaults and retry fetch
      if (!cats || cats.length === 0) {
        await seedDefaultCategories()

        // Retry fetch with a small delay to ensure DB commit
        let retries = 3
        while (retries > 0 && (!cats || cats.length === 0)) {
          await new Promise(resolve => setTimeout(resolve, 100))
          const { data: seededCats } = await supabase
            .from('user_categories')
            .select('*')
            .eq('user_id', user.id)
            .order('sort_order', { ascending: true })
          cats = seededCats
          retries--
        }
      }

      // If still no categories after retries, show error
      if (!cats || cats.length === 0) {
        setError('Failed to load categories. Please refresh the page.')
      }

      setCategories((cats || []) as UserCategory[])
      setCategoriesLoading(false)
    }

    loadCategories()
  }, [])

  const canContinue = bills.length > 0 && !categoriesLoading
  const allValid = useMemo(() => bills.length > 0 && bills.every(isValidBill), [bills])

  const addedSuggestionKeys = useMemo(() => {
    const set = new Set<string>()
    for (const s of SUGGESTIONS) {
      // Case-insensitive comparison for matching suggestions
      const match = bills.some((b) => b.name.toLowerCase() === s.name.toLowerCase())
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
    // Default to 'Other' category, or first user category if available
    const defaultCategory = categories.find(c => c.name.toLowerCase() === 'other')?.name
      ?? categories[0]?.name
      ?? DEFAULT_CATEGORIES.find(c => c.name === 'Other')?.name
      ?? 'Other'

    setBills((prev) => [
      ...prev,
      {
        id: `${Date.now()}-${Math.random()}`,
        name: '',
        amount: undefined,
        frequency: 'monthly',
        due_date: nextDueDateForDay(1),
        category: defaultCategory,
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
                              prev.map((x) => (x.id === b.id ? { ...x, category: e.target.value } : x))
                            )
                          }
                          className="mt-1 w-full rounded-lg bg-zinc-800 border border-zinc-700 px-3 py-2.5 text-zinc-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        >
                          {categories.length > 0 ? (
                            categories.map((cat) => (
                              <option key={cat.id} value={cat.name}>
                                {cat.name}
                              </option>
                            ))
                          ) : (
                            // Fallback to defaults if categories not loaded yet
                            DEFAULT_CATEGORIES.map((cat) => (
                              <option key={cat.name} value={cat.name}>
                                {cat.name}
                              </option>
                            ))
                          )}
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
