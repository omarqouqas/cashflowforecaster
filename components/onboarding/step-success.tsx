'use client'

import Link from 'next/link'
import { CheckCircle2 } from 'lucide-react'

function formatMoney(amount: number, currency = 'USD') {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      maximumFractionDigits: 2,
    }).format(amount)
  } catch {
    return `$${amount.toFixed(2)}`
  }
}

export function StepSuccess({
  startingBalance,
  billsTracked,
  currency = 'USD',
  onSeeForecast,
  onGoDashboard,
}: {
  startingBalance: number | null
  billsTracked: number
  currency?: string
  onSeeForecast: () => Promise<void> | void
  onGoDashboard: () => Promise<void> | void
}) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
      <div className="flex items-center justify-center">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-teal-500/20 blur-xl" />
          <CheckCircle2 className="relative h-16 w-16 text-teal-400" />
        </div>
      </div>

      <h2 className="mt-6 text-center text-2xl font-semibold text-zinc-50">You&apos;re all set!</h2>
      <p className="mt-2 text-center text-sm text-zinc-400">Your 60-day cash flow forecast is ready</p>

      <div className="mt-6 rounded-xl border border-zinc-800 bg-zinc-950/40 p-4">
        <p className="text-xs font-medium text-zinc-500 uppercase tracking-wide">Preview</p>
        <div className="mt-3 grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-zinc-500">Starting balance</p>
            <p className="mt-1 text-lg font-semibold text-zinc-100 tabular-nums">
              {startingBalance === null ? 'Not set' : formatMoney(startingBalance, currency)}
            </p>
          </div>
          <div>
            <p className="text-xs text-zinc-500">Bills tracked</p>
            <p className="mt-1 text-lg font-semibold text-zinc-100 tabular-nums">{billsTracked}</p>
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        <button
          type="button"
          onClick={() => onSeeForecast()}
          className={[
            'w-full rounded-xl bg-teal-500 text-zinc-950 font-semibold py-3.5',
            'transition-colors hover:bg-teal-400',
            'focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-zinc-950',
          ].join(' ')}
        >
          See Your Forecast
        </button>

        <button
          type="button"
          onClick={() => onGoDashboard()}
          className={[
            'w-full rounded-xl border border-zinc-800 bg-zinc-950/40 text-zinc-100 font-semibold py-3.5',
            'transition-colors hover:bg-zinc-950/70',
            'focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-zinc-950',
          ].join(' ')}
        >
          Go to Dashboard
        </button>

        <p className="text-center text-xs text-zinc-500">
          You can always add more accounts, income, and bills later.
        </p>

        {/* Hidden links for prefetch + accessibility */}
        <div className="sr-only">
          <Link href="/dashboard/calendar">Calendar</Link>
          <Link href="/dashboard">Dashboard</Link>
        </div>
      </div>
    </div>
  )
}
