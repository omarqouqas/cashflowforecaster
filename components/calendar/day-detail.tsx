'use client'

import { AlertTriangle, Clock, Layers, X } from 'lucide-react'
import { CalendarDay } from '@/lib/calendar/types'
import { formatCurrency } from '@/lib/utils/format'
import { getBalanceStatus } from '@/lib/calendar/constants'

interface DayDetailProps {
  day: CalendarDay
  previousBalance: number
  onClose: () => void
  currency?: string
}

function formatFullDate(date: Date) {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

function balanceColor(status: CalendarDay['status'], balance: number) {
  if (balance < 0) return 'text-rose-400'
  switch (status) {
    case 'green':
      return 'text-emerald-400'
    case 'yellow':
      return 'text-amber-400'
    case 'orange':
      return 'text-orange-400'
    case 'red':
      return 'text-rose-400'
    default:
      return 'text-zinc-100'
  }
}

export function DayDetail({ day, previousBalance, onClose, currency = 'USD' }: DayDetailProps) {
  const hasTransactions = day.income.length > 0 || day.bills.length > 0
  const balanceStatus = getBalanceStatus(day.balance)
  const showWarning = balanceStatus === 'low' || balanceStatus === 'negative'
  const isOverdraft = balanceStatus === 'negative'
  const hasBillCollision = day.bills.length >= 2
  const collisionTotal = day.bills.reduce((sum, b) => sum + (b.amount ?? 0), 0)

  return (
    <div className="bg-zinc-900 border-t border-b border-zinc-800 px-4 py-4 shadow-inner">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <p className="text-sm font-medium text-zinc-100">{formatFullDate(day.date)}</p>
        <button
          type="button"
          onClick={onClose}
          className="p-2.5 -m-1 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-md transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
          aria-label="Close day details"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Warning Banner */}
      {showWarning && (
        <div
          className={`mt-3 rounded-lg border p-3 ${
            isOverdraft
              ? 'bg-rose-500/10 border-rose-500/50'
              : 'bg-amber-500/10 border-amber-500/50'
          }`}
        >
          <div className="flex items-start gap-2">
            <AlertTriangle
              className={`w-4 h-4 mt-0.5 ${isOverdraft ? 'text-rose-400' : 'text-amber-400'}`}
              aria-hidden="true"
            />
            <p className={`text-sm ${isOverdraft ? 'text-rose-200' : 'text-amber-200'}`}>
              ⚠️ {isOverdraft ? 'Overdraft risk' : 'Low balance day'} - consider adjusting bills or adding income
            </p>
          </div>
        </div>
      )}

      {/* Collision Banner (inside content) */}
      {hasBillCollision && (
        <div className="mt-3 rounded-lg border border-amber-500/50 bg-amber-500/10 p-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <Layers className="w-4 h-4 text-amber-400 mt-0.5" aria-hidden="true" />
            <p className="text-sm text-amber-200">
              ⚠️ Multiple bills due today - {day.bills.length} bills totaling {formatCurrency(collisionTotal, currency)}
            </p>
          </div>
        </div>
      )}

      {/* Balance Summary */}
      <div className="mt-3">
        <p className="text-sm text-zinc-400">Starting balance: {formatCurrency(previousBalance, currency)}</p>
        <p className={`text-lg font-semibold tabular-nums ${balanceColor(day.status, day.balance)}`}>
          Ending balance: {formatCurrency(day.balance, currency)}
        </p>
      </div>

      {/* Transactions */}
      {!hasTransactions ? (
        <p className="mt-3 text-sm text-zinc-500 italic text-center py-2">No transactions on this day</p>
      ) : (
        <div className="mt-4 space-y-2">
          {day.income.map((t) => (
            <div
              key={`inc-${t.id}-${t.date.getTime()}`}
              className="flex items-center justify-between gap-3 rounded-lg border border-zinc-800 bg-zinc-800 px-3 py-2.5 hover:bg-zinc-700/60 transition-colors border-l-2 border-l-teal-500"
            >
              <div className="flex items-center min-w-0">
                <span
                  className={
                    t.status === 'pending'
                      ? 'w-2 h-2 rounded-full border border-emerald-400 border-dashed bg-transparent'
                      : 'w-2 h-2 rounded-full bg-emerald-400'
                  }
                  aria-hidden="true"
                />
                <span className="text-sm text-zinc-300 ml-2 truncate">{t.name}</span>
                {t.status === 'pending' && (
                  <span className="ml-2 inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-200">
                    <Clock className="w-3 h-3" />
                    Pending
                  </span>
                )}
              </div>
              <span className="text-sm font-medium tabular-nums text-emerald-400">
                +{formatCurrency(t.amount, currency)}
              </span>
            </div>
          ))}

          {day.bills.map((t) => (
            <div
              key={`bill-${t.id}-${t.date.getTime()}`}
              className="flex items-center justify-between gap-3 rounded-lg border border-zinc-800 bg-zinc-800 px-3 py-2.5 hover:bg-zinc-700/60 transition-colors border-l-2 border-l-rose-500"
            >
              <div className="flex items-center min-w-0">
                <span className="w-2 h-2 rounded-full bg-rose-400" aria-hidden="true" />
                <span className="text-sm text-zinc-300 ml-2 truncate">{t.name}</span>
              </div>
              <span className="text-sm font-medium tabular-nums text-rose-400">
                -{formatCurrency(Math.abs(t.amount), currency)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export type { DayDetailProps }
