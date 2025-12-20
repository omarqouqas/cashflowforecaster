'use client'

import { CalendarDay } from '@/lib/calendar/types'
import { formatCurrency } from '@/lib/utils/format'
import { getBalanceStatus } from '@/lib/calendar/constants'
import { isToday } from 'date-fns'
import { AlertTriangle } from 'lucide-react'

export interface CalendarTimelineProps {
  days: CalendarDay[]
  onDayClick: (day: CalendarDay) => void
}

export interface TimelineRowProps {
  day: CalendarDay
  isToday?: boolean
  onClick: () => void
}

function statusBarClass(status: CalendarDay['status']) {
  switch (status) {
    case 'green':
      return 'bg-emerald-500'
    case 'yellow':
      return 'bg-amber-400'
    case 'orange':
      return 'bg-orange-500'
    case 'red':
      return 'bg-rose-500'
    default:
      return 'bg-zinc-300'
  }
}

function formatMonthDay(date: Date) {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function formatDow(date: Date) {
  return date
    .toLocaleDateString('en-US', { weekday: 'short' })
    .toUpperCase()
}

function incomeDotClass(status?: string | null) {
  if (status === 'pending') {
    return 'w-2 h-2 rounded-full border border-emerald-500 border-dashed bg-transparent'
  }
  return 'w-2 h-2 rounded-full bg-emerald-500'
}

export function TimelineRow({ day, isToday: isTodayProp, onClick }: TimelineRowProps) {
  const today = isTodayProp ?? isToday(day.date)

  const incomeTotal = day.income.reduce((sum, t) => sum + t.amount, 0)
  const billsTotal = day.bills.reduce((sum, t) => sum + t.amount, 0)

  const hasIncome = incomeTotal > 0
  const hasBills = billsTotal > 0

  const balanceStatus = getBalanceStatus(day.balance)
  const isNegative = balanceStatus === 'negative'
  const isLowBalance = balanceStatus === 'low'
  const showWarning = isNegative || isLowBalance

  const rowBase =
    'w-full flex items-start px-4 py-3 cursor-pointer text-left rounded-lg border min-h-[72px] sm:min-h-[64px] transition-colors transition-transform active:scale-[0.98] active:bg-zinc-700/70'
  const rowBgClass = isNegative
    ? 'bg-rose-500/20'
    : isLowBalance
      ? 'bg-amber-500/10'
      : 'bg-zinc-800'

  // Preserve today styling: teal ring + teal border priority (even if low/negative)
  const rowBorderClass = today
    ? 'border-teal-500'
    : isNegative
      ? 'border-rose-500'
      : isLowBalance
        ? 'border-amber-500/50'
        : 'border-zinc-700'

  const balanceClass = isNegative
    ? 'text-rose-400 font-semibold'
    : isLowBalance
      ? 'text-amber-400'
      : 'text-zinc-100'

  // Today indicator takes priority for the left status bar color
  const statusBar = today ? 'bg-teal-500' : statusBarClass(day.status)

  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        rowBase,
        rowBgClass,
        rowBorderClass,
        today ? 'ring-1 ring-teal-500/50' : 'hover:bg-zinc-700/50',
      ].join(' ')}
    >
      {/* Status Indicator */}
      <div className={`w-1 h-10 rounded-full mr-3 ${statusBar}`} />

      {/* Date Column */}
      <div className="w-14 flex-shrink-0 text-left">
        {today ? (
          <>
            <p className="text-xs font-medium text-teal-500 uppercase tracking-wide">Today</p>
            <p className="text-sm font-semibold text-zinc-100">{formatMonthDay(day.date)}</p>
          </>
        ) : (
          <>
            <p className="text-xs font-medium text-zinc-400 uppercase tracking-wide">{formatDow(day.date)}</p>
            <p className="text-sm font-medium text-zinc-200">{formatMonthDay(day.date)}</p>
          </>
        )}
      </div>

      {/* Transaction Indicators */}
      <div className="flex-1 flex items-center gap-2 px-3 min-w-0">
        {hasIncome || hasBills ? (
          <>
            {hasIncome && (
              <span className="text-xs text-zinc-300 tabular-nums">
                +{formatCurrency(incomeTotal)}
              </span>
            )}
            {hasBills && (
              <span className="text-xs text-zinc-300 tabular-nums">
                -{formatCurrency(billsTotal)}
              </span>
            )}

            {/* Dots (one per transaction, capped for clutter) */}
            <div className="hidden sm:flex items-center gap-1 flex-wrap">
              {day.income.slice(0, 3).map((t) => (
                <span
                  key={`inc-${t.id}-${t.date.getTime()}`}
                  className={incomeDotClass(t.status)}
                  aria-hidden="true"
                />
              ))}
              {day.income.length > 3 && (
                <span className="text-xs text-zinc-400">+{day.income.length - 3}</span>
              )}
              {day.bills.slice(0, 3).map((t) => (
                <span
                  key={`bill-${t.id}-${t.date.getTime()}`}
                  className="w-2 h-2 rounded-full bg-rose-500"
                  aria-hidden="true"
                />
              ))}
              {day.bills.length > 3 && (
                <span className="text-xs text-zinc-400">+{day.bills.length - 3}</span>
              )}
            </div>
          </>
        ) : (
          <span className="text-xs text-zinc-500 italic">No transactions</span>
        )}
      </div>

      {/* Balance */}
      <div className="text-right flex-shrink-0">
        <div className="flex flex-col items-end">
          <div className={`flex items-center gap-1.5 text-base tabular-nums ${balanceClass}`}>
            {showWarning && (
              <AlertTriangle
                className={`w-4 h-4 ${isNegative ? 'text-rose-400' : 'text-amber-400'}`}
                aria-hidden="true"
              />
            )}
            <span>{formatCurrency(day.balance)}</span>
          </div>
          {isNegative && (
            <p className="text-xs text-rose-300 mt-0.5">Overdraft risk</p>
          )}
        </div>
      </div>
    </button>
  )
}

export function CalendarTimeline({ days, onDayClick }: CalendarTimelineProps) {
  return (
    <div className="space-y-2">
      {days.map((day) => (
        <TimelineRow key={day.date.getTime()} day={day} onClick={() => onDayClick(day)} />
      ))}
    </div>
  )
}
