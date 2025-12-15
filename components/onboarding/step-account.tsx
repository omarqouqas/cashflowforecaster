'use client'

import { useMemo, useState } from 'react'
import { showError, showSuccess } from '@/lib/toast'

export type StepAccountValues = {
  name: string
  account_type: 'checking' | 'savings'
  current_balance: string
}

export function StepAccount({
  accountNumber,
  totalAccounts,
  defaultValues,
  continueLabel,
  onContinue,
  onSkip,
}: {
  accountNumber: number
  totalAccounts: number
  defaultValues?: Partial<StepAccountValues>
  continueLabel?: string
  onContinue: (values: { name: string; account_type: 'checking' | 'savings'; current_balance: number }) => Promise<void>
  onSkip: () => void
}) {
  const [name, setName] = useState(defaultValues?.name ?? 'Checking')
  const [accountType, setAccountType] = useState<StepAccountValues['account_type']>(
    defaultValues?.account_type ?? 'checking'
  )
  const [balance, setBalance] = useState(defaultValues?.current_balance ?? '')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const parsedBalance = useMemo(() => {
    if (balance.trim() === '') return null
    const n = Number(balance)
    return Number.isFinite(n) ? n : null
  }, [balance])

  const canContinue = name.trim().length > 0 && parsedBalance !== null

  async function handleContinue() {
    if (!canContinue || parsedBalance === null) return
    setIsSubmitting(true)
    setError(null)

    try {
      await onContinue({
        name: name.trim(),
        account_type: accountType,
        current_balance: parsedBalance,
      })
      showSuccess('Account added!')
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
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-zinc-50">Let&apos;s start with your main account</h2>
            <p className="mt-1 text-sm text-zinc-400">
              Add <span className="text-zinc-200 font-medium">{totalAccounts} accounts</span> so we can build a complete forecast.
            </p>
          </div>

          <div className="shrink-0">
            <span className="inline-flex items-center rounded-full border border-zinc-800 bg-zinc-950/40 px-2.5 py-1 text-xs font-medium text-zinc-300">
              Account {accountNumber}/{totalAccounts}
            </span>
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-950/40 px-4 py-3">
          <p className="text-sm text-zinc-300">
            {accountNumber === 1 ? (
              <>
                This is typically your <span className="text-zinc-100 font-medium">Checking</span> account.
              </>
            ) : (
              <>
                Great — now add your <span className="text-zinc-100 font-medium">second account</span> (often Savings).
              </>
            )}
          </p>
        </div>

        <div className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-200">Account name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Checking"
              className="mt-1 w-full rounded-lg bg-zinc-800 border border-zinc-700 px-3 py-2.5 text-zinc-50 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-200">Account type</label>
            <select
              value={accountType}
              onChange={(e) => setAccountType(e.target.value as StepAccountValues['account_type'])}
              className="mt-1 w-full rounded-lg bg-zinc-800 border border-zinc-700 px-3 py-2.5 text-zinc-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              <option value="checking">Checking</option>
              <option value="savings">Savings</option>
            </select>
          </div>

          <div>
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
              />
            </div>
            <p className="mt-1 text-xs text-zinc-500">Enter your current account balance</p>
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
            {isSubmitting ? 'Saving…' : continueLabel ?? 'Continue'}
          </button>

          <button
            type="button"
            onClick={onSkip}
            className="mt-3 w-full text-center text-sm text-zinc-500 hover:text-zinc-300"
          >
            {accountNumber === totalAccounts ? 'Skip adding the second account' : 'Skip for now'}
          </button>
        </div>
      </div>
    </div>
  )
}
