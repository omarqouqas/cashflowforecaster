import { formatCurrency } from '@/lib/utils/format'
import { InfoTooltip } from '@/components/ui/tooltip'

export interface StickyHeaderProps {
  startingBalance: number
  lowestBalance: number
  lowestBalanceDate: Date
  lowestIn14Days: number
  totalIncome: number
  totalBills: number
  endingBalance: number
  safetyBuffer: number
  safeToSpend: number
  currency?: string
}

function formatShortDate(date: Date) {
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}

export function StickyCalendarHeader({
  startingBalance,
  lowestBalance,
  lowestBalanceDate,
  lowestIn14Days,
  safeToSpend,
  totalIncome,
  totalBills,
  endingBalance,
  safetyBuffer,
  currency = 'USD',
}: StickyHeaderProps) {
  const lowestBalanceColor = lowestBalance < 0 ? 'text-rose-400' : 'text-zinc-100'
  const safeToSpendIsZero = safeToSpend <= 0

  return (
    <div className="sticky top-0 z-20 bg-zinc-950/80 backdrop-blur-sm border-b border-zinc-800 px-3 py-3 sm:px-4 sm:py-4">
      <div className="max-w-7xl mx-auto">
        {/* Safe to Spend - Hero metric */}
        <div
          className={[
            'hidden sm:block mb-4 p-4 border rounded-lg',
            safeToSpendIsZero
              ? 'bg-amber-500/10 border-amber-500/30'
              : 'bg-teal-500/10 border-teal-500/30',
          ].join(' ')}
        >
          <div className="flex items-center gap-1">
            <p
              className={[
                'text-xs font-medium uppercase tracking-wide',
                safeToSpendIsZero ? 'text-amber-200' : 'text-teal-200',
              ].join(' ')}
            >
              Safe to Spend
            </p>
            <InfoTooltip
              content={
                <div className="space-y-2">
                  <p className="font-medium text-white">How is this calculated?</p>
                  <p className="text-zinc-300">
                    This is how much you can spend today without your balance ever dropping below your
                    safety buffer in the next 14 days.
                  </p>
                  <div className="pt-2 border-t border-zinc-700 text-xs space-y-1">
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Lowest balance (14 days):</span>
                      <span className="text-zinc-200 tabular-nums">
                        {formatCurrency(lowestIn14Days, currency)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Safety buffer:</span>
                      <span className="text-zinc-200 tabular-nums">− {formatCurrency(safetyBuffer, currency)}</span>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-zinc-700">
                      <span className="text-zinc-300 font-medium">Safe to spend:</span>
                      <span className="text-white font-medium tabular-nums">
                        {formatCurrency(safeToSpend, currency)}
                      </span>
                    </div>
                  </div>
                </div>
              }
            />
          </div>
          <p
            className={[
              'text-3xl font-bold tabular-nums tracking-tight mt-1',
              safeToSpendIsZero ? 'text-amber-100' : 'text-teal-200',
            ].join(' ')}
          >
            {formatCurrency(safeToSpend, currency)}
          </p>
          <p className={['text-sm mt-1', safeToSpendIsZero ? 'text-amber-200' : 'text-teal-300'].join(' ')}>
            {safeToSpendIsZero
              ? 'No room for extra spending right now'
              : `Without going below your ${formatCurrency(safetyBuffer, currency)} buffer`}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Safe to Spend (mobile-only, compact) */}
          <div
            className={[
              'sm:hidden border rounded-lg p-3 min-w-0',
              safeToSpendIsZero
                ? 'bg-amber-500/10 border-amber-500/30'
                : 'bg-teal-500/10 border-teal-500/30',
            ].join(' ')}
          >
            <div className="flex items-center gap-1">
              <p
                className={[
                  'text-xs font-medium uppercase tracking-wide',
                  safeToSpendIsZero ? 'text-amber-200' : 'text-teal-200',
                ].join(' ')}
              >
                Safe to Spend
              </p>
              <InfoTooltip
                content={
                  <div className="space-y-2">
                    <p className="font-medium text-white">How is this calculated?</p>
                    <p className="text-zinc-300">
                      This is how much you can spend today without your balance ever dropping below your
                      safety buffer in the next 14 days.
                    </p>
                    <div className="pt-2 border-t border-zinc-700 text-xs space-y-1">
                      <div className="flex justify-between">
                        <span className="text-zinc-400">Lowest balance (14 days):</span>
                        <span className="text-zinc-200 tabular-nums">
                          {formatCurrency(lowestIn14Days, currency)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-400">Safety buffer:</span>
                        <span className="text-zinc-200 tabular-nums">− {formatCurrency(safetyBuffer, currency)}</span>
                      </div>
                      <div className="flex justify-between pt-1 border-t border-zinc-700">
                        <span className="text-zinc-300 font-medium">Safe to spend:</span>
                        <span className="text-white font-medium tabular-nums">
                          {formatCurrency(safeToSpend, currency)}
                        </span>
                      </div>
                    </div>
                  </div>
                }
              />
            </div>
            <p
              className={[
                'text-xl font-bold tabular-nums tracking-tight mt-1',
                safeToSpendIsZero ? 'text-amber-100' : 'text-teal-200',
              ].join(' ')}
            >
              {formatCurrency(safeToSpend, currency)}
            </p>
          </div>

          {/* Starting */}
          <div className="hidden sm:block border border-zinc-800 bg-zinc-900 rounded-lg p-3 sm:p-4 min-w-0">
            <p className="text-xs font-medium text-zinc-400 uppercase tracking-wide">STARTING</p>
            <p className="text-lg font-semibold tabular-nums tracking-tight text-zinc-100 mt-1">
              {formatCurrency(startingBalance, currency)}
            </p>
            <p className="text-sm text-zinc-400 mt-1">Today</p>
          </div>

          {/* Lowest */}
          <div className="border border-zinc-800 bg-zinc-900 rounded-lg p-3 sm:p-4 min-w-0">
            <p className="text-xs font-medium text-zinc-400 uppercase tracking-wide">LOWEST</p>
            <p className={`text-lg font-semibold tabular-nums tracking-tight mt-1 ${lowestBalanceColor}`}>
              {formatCurrency(lowestBalance, currency)}
            </p>
            <p className="text-sm text-zinc-400 mt-1">{formatShortDate(lowestBalanceDate)}</p>
          </div>

          {/* Income */}
          <div className="hidden sm:block border border-zinc-800 bg-zinc-900 rounded-lg p-3 sm:p-4 min-w-0">
            <p className="text-xs font-medium text-zinc-400 uppercase tracking-wide">INCOME</p>
            <p className="text-lg font-semibold tabular-nums tracking-tight text-emerald-400 mt-1">
              {formatCurrency(totalIncome, currency)}
            </p>
            <p className="text-sm text-zinc-400 mt-1">Next 60 days</p>
          </div>

          {/* Bills */}
          <div className="hidden sm:block border border-zinc-800 bg-zinc-900 rounded-lg p-3 sm:p-4 min-w-0">
            <p className="text-xs font-medium text-zinc-400 uppercase tracking-wide">BILLS</p>
            <p className="text-lg font-semibold tabular-nums tracking-tight text-rose-400 mt-1">
              {formatCurrency(totalBills, currency)}
            </p>
            <p className="text-sm text-zinc-400 mt-1">End: {formatCurrency(endingBalance, currency)}</p>
          </div>
        </div>

        {/* Mobile: keep header compact, allow expanding for extra metrics */}
        <details className="group sm:hidden mt-2">
          <summary className="list-none cursor-pointer select-none">
            <div className="flex items-center justify-center gap-2 text-xs text-zinc-400">
              <span>Tap for more</span>
              <svg
                className="h-4 w-4 transition-transform group-open:rotate-180"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.168l3.71-3.938a.75.75 0 1 1 1.08 1.04l-4.24 4.5a.75.75 0 0 1-1.08 0l-4.24-4.5a.75.75 0 0 1 .02-1.06Z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </summary>
          <div className="mt-2 grid grid-cols-2 gap-3">
            <div className="border border-zinc-800 bg-zinc-900 rounded-lg p-3 min-w-0">
              <p className="text-xs font-medium text-zinc-400 uppercase tracking-wide">STARTING</p>
              <p className="text-lg font-semibold tabular-nums tracking-tight text-zinc-100 mt-1">
                {formatCurrency(startingBalance, currency)}
              </p>
              <p className="text-sm text-zinc-400 mt-1">Today</p>
            </div>

            <div className="border border-zinc-800 bg-zinc-900 rounded-lg p-3 min-w-0">
              <p className="text-xs font-medium text-zinc-400 uppercase tracking-wide">INCOME</p>
              <p className="text-lg font-semibold tabular-nums tracking-tight text-emerald-400 mt-1">
                {formatCurrency(totalIncome, currency)}
              </p>
              <p className="text-sm text-zinc-400 mt-1">Next 60 days</p>
            </div>

            <div className="border border-zinc-800 bg-zinc-900 rounded-lg p-3 min-w-0 col-span-2">
              <p className="text-xs font-medium text-zinc-400 uppercase tracking-wide">BILLS</p>
              <p className="text-lg font-semibold tabular-nums tracking-tight text-rose-400 mt-1">
                {formatCurrency(totalBills, currency)}
              </p>
              <p className="text-sm text-zinc-400 mt-1">End: {formatCurrency(endingBalance, currency)}</p>
              <p className="text-sm text-zinc-400 mt-1">Safety buffer: {formatCurrency(safetyBuffer, currency)}</p>
            </div>
          </div>
        </details>

        <p className="hidden sm:block mt-3 text-sm text-zinc-400">
          Safety buffer: {formatCurrency(safetyBuffer, currency)}
        </p>
      </div>
    </div>
  )
}
