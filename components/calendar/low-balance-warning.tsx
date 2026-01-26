'use client'

import { AlertTriangle, TrendingDown } from 'lucide-react'
import { formatCurrency } from '@/lib/utils/format'

interface LowBalanceWarningProps {
  dangerDays: Array<{
    date: Date
    balance: number
    daysFromNow: number
  }>
  lowestBalance: number
  lowestBalanceDate: Date
  currency?: string
}

function formatShortDate(date: Date) {
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}

export function LowBalanceWarning({
  dangerDays,
  lowestBalance,
  lowestBalanceDate,
  currency = 'USD',
}: LowBalanceWarningProps) {
  if (dangerDays.length === 0) return null

  const isOverdraft = lowestBalance < 0
  const firstDangerDay = dangerDays[0]

  return (
    <div
      className={`mx-4 mb-4 p-4 rounded-lg border ${
        isOverdraft ? 'bg-rose-500/10 border-rose-500/30' : 'bg-amber-500/10 border-amber-500/30'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-full ${isOverdraft ? 'bg-rose-500/15' : 'bg-amber-500/15'}`}>
          {isOverdraft ? (
            <AlertTriangle className={`w-5 h-5 text-rose-300`} />
          ) : (
            <TrendingDown className={`w-5 h-5 text-amber-300`} />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className={`font-semibold ${isOverdraft ? 'text-rose-100' : 'text-amber-100'}`}>
            {isOverdraft ? 'Overdraft Warning' : 'Low Balance Alert'}
          </h3>

          <p className={`text-sm mt-1 ${isOverdraft ? 'text-rose-200' : 'text-amber-200'}`}>
            {isOverdraft ? (
              <>
                Your balance will go negative on <strong>{formatShortDate(lowestBalanceDate)}</strong> (
                {formatCurrency(lowestBalance, currency)})
              </>
            ) : (
              <>
                Your balance will drop to <strong>{formatCurrency(lowestBalance, currency)}</strong> on{' '}
                {formatShortDate(lowestBalanceDate)}
              </>
            )}
          </p>

          {dangerDays.length > 1 && (
            <p className={`text-sm mt-2 ${isOverdraft ? 'text-rose-200' : 'text-amber-200'}`}>
              {dangerDays.length} low-balance days in your forecast
            </p>
          )}

          {firstDangerDay && firstDangerDay.daysFromNow <= 7 && (
            <p className={`text-xs mt-2 font-medium ${isOverdraft ? 'text-rose-100' : 'text-amber-100'}`}>
              {firstDangerDay.daysFromNow === 0
                ? 'This is today!'
                : firstDangerDay.daysFromNow === 1
                  ? 'Tomorrow!'
                  : `Only ${firstDangerDay.daysFromNow} days away`}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
