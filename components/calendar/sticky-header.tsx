import { formatCurrency } from '@/lib/utils/format'
import { InfoTooltip } from '@/components/ui/tooltip'
import Link from 'next/link'
import { Pencil } from 'lucide-react'

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
  forecastDays?: number
}

/**
 * Format forecast period for display
 * e.g., 60 -> "Next 60 days", 365 -> "Next 12 months"
 */
function formatForecastPeriod(days: number): string {
  if (days === 365) {
    return 'Next 12 months'
  }
  if (days === 90) {
    return 'Next 3 months'
  }
  return `Next ${days} days`
}

function formatShortDate(date: Date) {
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}

/**
 * Get the currency symbol for a given currency code
 */
function getCurrencySymbol(currency: string): string {
  try {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
    // Format 0 and extract the symbol (removes the "0")
    return formatter.format(0).replace(/[\d\s]/g, '').trim()
  } catch {
    return '$'
  }
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
  forecastDays = 60,
}: StickyHeaderProps) {
  const forecastPeriodLabel = formatForecastPeriod(forecastDays)
  const lowestBalanceColor = lowestBalance < 0 ? 'text-rose-400' : 'text-amber-400'
  const safeToSpendIsZero = safeToSpend <= 0

  // Split safe to spend into whole and decimal parts for styling
  const safeToSpendStr = safeToSpend.toFixed(2)
  const [rawWhole, decimal] = safeToSpendStr.split('.')
  // Format whole part with commas for thousands
  const wholePart = Number(rawWhole).toLocaleString('en-US')
  const currencySymbol = getCurrencySymbol(currency)

  return (
    <div className="sticky top-0 z-20 bg-zinc-950/80 backdrop-blur-sm border-b border-zinc-800 px-3 py-3 sm:px-4 sm:py-4">
      <div className="max-w-full mx-auto">
        {/* Safe to Spend - Hero Card (Desktop) */}
        <div
          className={[
            'hidden sm:block relative overflow-hidden mb-4 p-6 border rounded-2xl',
            safeToSpendIsZero
              ? 'bg-gradient-to-br from-amber-500/10 via-zinc-900 to-zinc-900 border-amber-500/20'
              : 'bg-gradient-to-br from-emerald-500/10 via-zinc-900 to-zinc-900 border-emerald-500/20',
          ].join(' ')}
        >
          {/* Subtle glow effect */}
          <div className={[
            'absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none',
            safeToSpendIsZero ? 'bg-amber-500/5' : 'bg-emerald-500/5'
          ].join(' ')} />

          <div className="relative">
            <div className="flex items-center gap-2 mb-2">
              <span
                className={[
                  'text-sm font-semibold uppercase tracking-wider',
                  safeToSpendIsZero ? 'text-amber-400' : 'text-emerald-400',
                ].join(' ')}
              >
                Safe to Spend
              </span>
              <InfoTooltip
                content={
                  <div className="space-y-3">
                    <h4 className="text-base font-semibold text-white pb-2 border-b border-zinc-700">
                      How is this calculated?
                    </h4>
                    <p className="text-zinc-300 text-sm">
                      This is how much you can spend today without your balance ever dropping below your
                      safety buffer in the next 14 days.
                    </p>
                    <div className="pt-2 border-t border-zinc-700 text-xs space-y-1.5">
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
                      <div className="flex justify-between pt-1.5 border-t border-zinc-700">
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

            <div className="flex items-baseline gap-1">
              <span
                className={[
                  'text-5xl md:text-6xl font-bold tabular-nums tracking-tight',
                  safeToSpendIsZero ? 'text-amber-100' : 'text-zinc-50',
                ].join(' ')}
              >
                {currencySymbol}{wholePart}
              </span>
              <span className="text-2xl font-semibold text-zinc-400 tabular-nums">
                .{decimal}
              </span>
            </div>

            <p className={['text-sm mt-2', safeToSpendIsZero ? 'text-amber-300/80' : 'text-zinc-500'].join(' ')}>
              {safeToSpendIsZero ? (
                'No room for extra spending right now'
              ) : (
                <>
                  Without going below your{' '}
                  <Link
                    href="/dashboard/settings#safety-buffer"
                    className="inline-flex items-center gap-1 text-zinc-400 hover:text-emerald-400 transition-colors"
                  >
                    {formatCurrency(safetyBuffer, currency)} buffer
                    <Pencil className="w-3 h-3" />
                  </Link>
                </>
              )}
            </p>
          </div>
        </div>

        {/* Stats Row - Mobile: 2x2 grid, Desktop: 4 columns */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5">
          {/* Safe to Spend (mobile-only, compact) */}
          <div
            className={[
              'sm:hidden relative overflow-hidden border rounded-xl p-4 min-w-0',
              safeToSpendIsZero
                ? 'bg-gradient-to-br from-amber-500/10 via-zinc-900 to-zinc-900 border-amber-500/20'
                : 'bg-gradient-to-br from-emerald-500/10 via-zinc-900 to-zinc-900 border-emerald-500/20',
            ].join(' ')}
          >
            <div className="flex items-center gap-1.5">
              <p
                className={[
                  'text-xs font-semibold uppercase tracking-wide',
                  safeToSpendIsZero ? 'text-amber-400' : 'text-emerald-400',
                ].join(' ')}
              >
                Safe to Spend
              </p>
              <InfoTooltip
                content={
                  <div className="space-y-3">
                    <h4 className="text-base font-semibold text-white pb-2 border-b border-zinc-700">
                      How is this calculated?
                    </h4>
                    <p className="text-zinc-300 text-sm">
                      This is how much you can spend today without your balance ever dropping below your
                      safety buffer in the next 14 days.
                    </p>
                  </div>
                }
              />
            </div>
            <p
              className={[
                'text-xl font-bold tabular-nums tracking-tight mt-1.5 whitespace-nowrap',
                safeToSpendIsZero ? 'text-amber-100' : 'text-emerald-300',
              ].join(' ')}
            >
              {formatCurrency(safeToSpend, currency)}
            </p>
          </div>

          {/* Starting - Desktop only */}
          <div className="hidden sm:block border border-zinc-800 bg-zinc-900/50 rounded-xl px-4 py-5 min-w-0 hover:border-zinc-700 hover:bg-zinc-900 transition-all">
            <p className="text-xs font-medium text-zinc-400 uppercase tracking-wide">STARTING</p>
            <p className="text-xl font-bold tabular-nums tracking-tight text-zinc-100 mt-1.5 whitespace-nowrap">
              {formatCurrency(startingBalance, currency)}
            </p>
            <p className="text-xs text-zinc-500 mt-1">Today</p>
          </div>

          {/* Lowest - Always visible */}
          <div className="border border-zinc-800 bg-zinc-900/50 rounded-xl p-4 sm:px-4 sm:py-5 min-w-0 hover:border-zinc-700 hover:bg-zinc-900 transition-all">
            <p className="text-xs font-medium text-zinc-400 uppercase tracking-wide">LOWEST</p>
            <p className={`text-lg sm:text-xl font-bold tabular-nums tracking-tight mt-1.5 whitespace-nowrap ${lowestBalanceColor}`}>
              {formatCurrency(lowestBalance, currency)}
            </p>
            <p className="text-xs text-zinc-500 mt-1">{formatShortDate(lowestBalanceDate)}</p>
          </div>

          {/* Income - Always visible */}
          <div className="border border-zinc-800 bg-zinc-900/50 rounded-xl p-4 sm:px-4 sm:py-5 min-w-0 hover:border-zinc-700 hover:bg-zinc-900 transition-all">
            <p className="text-xs font-medium text-zinc-400 uppercase tracking-wide">INCOME</p>
            <p className="text-lg sm:text-xl font-bold tabular-nums tracking-tight text-emerald-400 mt-1.5 whitespace-nowrap">
              {formatCurrency(totalIncome, currency)}
            </p>
            <p className="text-xs text-zinc-500 mt-1 truncate">{forecastPeriodLabel}</p>
          </div>

          {/* Bills - Always visible */}
          <div className="border border-zinc-800 bg-zinc-900/50 rounded-xl p-4 sm:px-4 sm:py-5 min-w-0 hover:border-zinc-700 hover:bg-zinc-900 transition-all">
            <p className="text-xs font-medium text-zinc-400 uppercase tracking-wide">BILLS</p>
            <p className="text-lg sm:text-xl font-bold tabular-nums tracking-tight text-rose-400 mt-1.5 whitespace-nowrap">
              {formatCurrency(totalBills, currency)}
            </p>
            <p className="text-xs text-zinc-500 mt-1 truncate">End: {formatCurrency(endingBalance, currency)}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
