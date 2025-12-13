'use client'

import { CalendarDay } from '@/lib/calendar/types'
import { formatCurrency } from '@/lib/utils/format'

export interface CalendarTimelineProps {
  days: CalendarDay[]
  onDayClick: (day: CalendarDay) => void
}

export interface TimelineRowProps {
  day: CalendarDay
  isToday?: boolean
  onClick: () => void
}

function isToday(date: Date) {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  const t = new Date()
  t.setHours(0, 0, 0, 0)
  return d.getTime() === t.getTime()
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

function statusTextClass(status: CalendarDay['status']) {
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

  const balanceClass = day.balance < 0 ? 'text-rose-600' : statusTextClass(day.status)

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-start px-4 py-3 hover:bg-zinc-50 transition-colors cursor-pointer min-h-[64px] text-left"
    >
      {/* Status Indicator */}
      <div className={`w-1 h-10 rounded-full mr-3 ${statusBarClass(day.status)}`} />

      {/* Date Column */}
      <div className="w-14 flex-shrink-0 text-left">
        {today ? (
          <>
            <p className="text-xs font-medium text-teal-600 uppercase tracking-wide">Today</p>
            <p className="text-sm font-semibold text-teal-600">{formatMonthDay(day.date)}</p>
          </>
        ) : (
          <>
            <p className="text-xs font-medium text-zinc-400 uppercase tracking-wide">{formatDow(day.date)}</p>
            <p className="text-sm font-medium text-zinc-900">{formatMonthDay(day.date)}</p>
          </>
        )}
      </div>

      {/* Transaction Indicators */}
      <div className="flex-1 flex items-center gap-2 px-3 min-w-0">
        {hasIncome || hasBills ? (
          <>
            {hasIncome && (
              <span className="text-xs text-zinc-500 tabular-nums">
                +{formatCurrency(incomeTotal)}
              </span>
            )}
            {hasBills && (
              <span className="text-xs text-zinc-500 tabular-nums">
                -{formatCurrency(billsTotal)}
              </span>
            )}

            {/* Dots (one per transaction, capped for clutter) */}
            <div className="flex items-center gap-1 flex-wrap">
              {day.income.slice(0, 3).map((t) => (
                <span
                  key={`inc-${t.id}-${t.date.getTime()}`}
                  className={incomeDotClass(t.status)}
                  aria-hidden="true"
                />
              ))}
              {day.income.length > 3 && (
                <span className="text-xs text-zinc-500">+{day.income.length - 3}</span>
              )}
              {day.bills.slice(0, 3).map((t) => (
                <span
                  key={`bill-${t.id}-${t.date.getTime()}`}
                  className="w-2 h-2 rounded-full bg-rose-500"
                  aria-hidden="true"
                />
              ))}
              {day.bills.length > 3 && (
                <span className="text-xs text-zinc-500">+{day.bills.length - 3}</span>
              )}
            </div>
          </>
        ) : (
          <span className="text-xs text-zinc-400 italic">No transactions</span>
        )}
      </div>

      {/* Balance */}
      <div className="text-right flex-shrink-0">
        <p className={`text-base font-semibold tabular-nums ${balanceClass}`}>
          {formatCurrency(day.balance)}
        </p>
      </div>
    </button>
  )
}

export function CalendarTimeline({ days, onDayClick }: CalendarTimelineProps) {
  return (
    <div className="divide-y divide-zinc-100">
      {days.map((day) => (
        <TimelineRow key={day.date.getTime()} day={day} onClick={() => onDayClick(day)} />
      ))}
    </div>
  )
}
