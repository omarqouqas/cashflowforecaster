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
        isOverdraft ? 'bg-rose-50 border-rose-200' : 'bg-amber-50 border-amber-200'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-full ${isOverdraft ? 'bg-rose-100' : 'bg-amber-100'}`}>
          {isOverdraft ? (
            <AlertTriangle className={`w-5 h-5 text-rose-600`} />
          ) : (
            <TrendingDown className={`w-5 h-5 text-amber-600`} />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className={`font-semibold ${isOverdraft ? 'text-rose-800' : 'text-amber-800'}`}>
            {isOverdraft ? 'Overdraft Warning' : 'Low Balance Alert'}
          </h3>

          <p className={`text-sm mt-1 ${isOverdraft ? 'text-rose-700' : 'text-amber-700'}`}>
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
            <p className={`text-sm mt-2 ${isOverdraft ? 'text-rose-600' : 'text-amber-600'}`}>
              {dangerDays.length} low-balance days in the next 60 days
            </p>
          )}

          {firstDangerDay.daysFromNow <= 7 && (
            <p className={`text-xs mt-2 font-medium ${isOverdraft ? 'text-rose-800' : 'text-amber-800'}`}>
              {firstDangerDay.daysFromNow === 0
                ? '⚠️ This is today!'
                : firstDangerDay.daysFromNow === 1
                  ? '⚠️ Tomorrow!'
                  : `⚠️ Only ${firstDangerDay.daysFromNow} days away`}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
