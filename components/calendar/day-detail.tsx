'use client'

import { Clock, X } from 'lucide-react'
import { CalendarDay } from '@/lib/calendar/types'
import { formatCurrency } from '@/lib/utils/format'

interface DayDetailProps {
  day: CalendarDay
  previousBalance: number
  onClose: () => void
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
  if (balance < 0) return 'text-rose-600'
  switch (status) {
    case 'green':
      return 'text-emerald-600'
    case 'yellow':
      return 'text-amber-600'
    case 'orange':
      return 'text-orange-600'
    case 'red':
      return 'text-rose-600'
    default:
      return 'text-zinc-900'
  }
}

export function DayDetail({ day, previousBalance, onClose }: DayDetailProps) {
  const hasTransactions = day.income.length > 0 || day.bills.length > 0

  return (
    <div className="bg-zinc-50 border-t border-b border-zinc-200 px-4 py-4 shadow-inner">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <p className="text-sm font-medium text-zinc-900">{formatFullDate(day.date)}</p>
        <button
          type="button"
          onClick={onClose}
          className="p-1.5 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-200 rounded-md transition-colors"
          aria-label="Close day details"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Balance Summary */}
      <div className="mt-3">
        <p className="text-sm text-zinc-500">Starting balance: {formatCurrency(previousBalance)}</p>
        <p className={`text-lg font-semibold tabular-nums ${balanceColor(day.status, day.balance)}`}>
          Ending balance: {formatCurrency(day.balance)}
        </p>
      </div>

      {/* Transactions */}
      {!hasTransactions ? (
        <p className="mt-3 text-sm text-zinc-400 italic text-center py-2">No transactions on this day</p>
      ) : (
        <div className="mt-3 divide-y divide-zinc-100">
          {day.income.map((t) => (
            <div key={`inc-${t.id}-${t.date.getTime()}`} className="flex items-center justify-between py-2.5">
              <div className="flex items-center min-w-0">
                <span
                  className={
                    t.status === 'pending'
                      ? 'w-2 h-2 rounded-full border border-emerald-500 border-dashed bg-transparent'
                      : 'w-2 h-2 rounded-full bg-emerald-500'
                  }
                  aria-hidden="true"
                />
                <span className="text-sm text-zinc-900 ml-2 truncate">{t.name}</span>
                {t.status === 'pending' && (
                  <span className="ml-2 inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                    <Clock className="w-3 h-3" />
                    Pending
                  </span>
                )}
              </div>
              <span className="text-sm font-medium tabular-nums text-emerald-600">+{formatCurrency(t.amount)}</span>
            </div>
          ))}

          {day.bills.map((t) => (
            <div key={`bill-${t.id}-${t.date.getTime()}`} className="flex items-center justify-between py-2.5">
              <div className="flex items-center min-w-0">
                <span className="w-2 h-2 rounded-full bg-rose-500" aria-hidden="true" />
                <span className="text-sm text-zinc-900 ml-2 truncate">{t.name}</span>
              </div>
              <span className="text-sm font-medium tabular-nums text-rose-600">-{formatCurrency(Math.abs(t.amount))}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export type { DayDetailProps }
