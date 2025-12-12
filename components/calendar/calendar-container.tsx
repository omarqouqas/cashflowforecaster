'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { TimelineRow } from './timeline'
import { DayDetail } from './day-detail'
import { StickyCalendarHeader } from './sticky-header'
import { LowBalanceWarning } from './low-balance-warning'
import type { CalendarDay, Transaction } from '@/lib/calendar/types'

interface CalendarContainerProps {
  calendarData: {
    days: CalendarDay[]
    startingBalance: number
    lowestBalance: number
    lowestBalanceDate: Date
    lowestIn14Days: number
    safeToSpend: number
    totalIncome: number
    totalBills: number
    endingBalance: number
    safetyBuffer: number
    currency?: string
  }
}

function toDate(value: unknown): Date {
  if (value instanceof Date) return value
  if (typeof value === 'string' || typeof value === 'number') return new Date(value)
  // Fallback – should never happen
  return new Date(String(value))
}

function normalizeTransaction(t: Transaction): Transaction {
  return {
    ...t,
    date: toDate((t as any).date),
  }
}

function normalizeDay(day: CalendarDay): CalendarDay {
  return {
    ...day,
    date: toDate((day as any).date),
    income: (day.income || []).map(normalizeTransaction),
    bills: (day.bills || []).map(normalizeTransaction),
  }
}

export function CalendarContainer({ calendarData }: CalendarContainerProps) {
  const [selectedDayIndex, setSelectedDayIndex] = useState<number | null>(null)

  const days = useMemo(() => calendarData.days.map(normalizeDay), [calendarData.days])
  const startingBalance = calendarData.startingBalance
  const lowestBalanceDate = useMemo(() => toDate(calendarData.lowestBalanceDate), [calendarData.lowestBalanceDate])

  const rowWrappersRef = useRef<Array<HTMLDivElement | null>>([])

  const headerProps = useMemo(
    () => ({
      startingBalance: calendarData.startingBalance,
      lowestBalance: calendarData.lowestBalance,
      lowestBalanceDate: toDate(calendarData.lowestBalanceDate),
      lowestIn14Days: calendarData.lowestIn14Days,
      totalIncome: calendarData.totalIncome,
      totalBills: calendarData.totalBills,
      endingBalance: calendarData.endingBalance,
      safetyBuffer: calendarData.safetyBuffer,
      safeToSpend: calendarData.safeToSpend,
      currency: calendarData.currency,
    }),
    [calendarData],
  )

  const dangerDays = useMemo(() => {
    return days
      .map((day, index) => ({
        date: day.date,
        balance: day.balance,
        daysFromNow: index,
        status: day.status,
      }))
      .filter((day) => day.status === 'red' || day.status === 'orange')
  }, [days])

  const showWarning = useMemo(() => {
    const hasOverdraft = days.some((d) => d.status === 'red')
    const hasLowBalanceSoon = days.slice(0, 14).some((d) => d.status === 'orange' || d.status === 'red')
    return hasOverdraft || hasLowBalanceSoon
  }, [days])

  const handleDayClick = (index: number) => {
    setSelectedDayIndex((prev) => (prev === index ? null : index))
  }

  // Escape closes
  useEffect(() => {
    if (selectedDayIndex === null) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedDayIndex(null)
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [selectedDayIndex])

  // Scroll expanded day into view
  useEffect(() => {
    if (selectedDayIndex === null) return
    const el = rowWrappersRef.current[selectedDayIndex]
    if (!el) return

    // Let the DOM render the detail first
    requestAnimationFrame(() => {
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    })
  }, [selectedDayIndex])

  return (
    <div className="flex flex-col min-h-screen">
      <StickyCalendarHeader {...headerProps} />

      {/* Low Balance Warning */}
      {showWarning && (
        <LowBalanceWarning
          dangerDays={dangerDays}
          lowestBalance={calendarData.lowestBalance}
          lowestBalanceDate={lowestBalanceDate}
          currency={calendarData.currency}
        />
      )}

      <div className="flex-1">
        <div className="divide-y divide-zinc-100">
          {days.map((day, index) => (
            <div
              key={day.date.getTime()}
              ref={(node) => {
                rowWrappersRef.current[index] = node
              }}
            >
              <TimelineRow day={day} isToday={index === 0} onClick={() => handleDayClick(index)} />
              {selectedDayIndex === index && (
                <DayDetail
                  day={day}
                  previousBalance={index > 0 ? (days[index - 1]?.balance ?? startingBalance) : startingBalance}
                  onClose={() => setSelectedDayIndex(null)}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export type { CalendarContainerProps }
