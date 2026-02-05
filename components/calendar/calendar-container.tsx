'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { TimelineRow } from './timeline'
import { DayDetail } from './day-detail'
import { StickyCalendarHeader } from './sticky-header'
import { LowBalanceWarning } from './low-balance-warning'
import { BillCollisionWarning } from './bill-collision-warning'
import { BalanceTrendChartInteractive } from './balance-trend-chart-interactive'
import type { CalendarDay, Transaction } from '@/lib/calendar/types'
import type { CollisionSummary } from '@/lib/calendar/detect-collisions'
import { isToday } from 'date-fns'

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
    collisions: CollisionSummary
    forecastDays?: number
  }
}

function toDate(value: unknown): Date {
  if (value instanceof Date) return value
  if (typeof value === 'string' || typeof value === 'number') return new Date(value)
  // Fallback – should never happen
  return new Date(String(value))
}

// Server components serialize Date objects as strings, so we need to normalize them
type SerializedDate = Date | string | number

function normalizeTransaction(t: Transaction): Transaction {
  return {
    ...t,
    date: toDate((t as { date: SerializedDate }).date),
  }
}

function normalizeDay(day: CalendarDay): CalendarDay {
  return {
    ...day,
    date: toDate((day as { date: SerializedDate }).date),
    income: (day.income || []).map(normalizeTransaction),
    bills: (day.bills || []).map(normalizeTransaction),
  }
}

function normalizeCollisions(collisions: CollisionSummary): CollisionSummary {
  return {
    ...collisions,
    collisions: (collisions?.collisions ?? []).map((c) => ({
      ...c,
      date: toDate((c as { date: SerializedDate }).date),
    })),
    highestCollisionDate: collisions?.highestCollisionDate
      ? toDate((collisions.highestCollisionDate as SerializedDate))
      : null,
  }
}

function formatMinutesAgo(from: Date, now: Date): string {
  const diffMs = Math.max(0, now.getTime() - from.getTime())
  const mins = Math.floor(diffMs / 60_000)
  if (mins <= 0) return 'just now'
  if (mins === 1) return '1 minute ago'
  return `${mins} minutes ago`
}

export function CalendarContainer({ calendarData }: CalendarContainerProps) {
  const [selectedDayIndex, setSelectedDayIndex] = useState<number | null>(null)
  const [isScrolledToTop, setIsScrolledToTop] = useState(true)
  const [showRefreshIndicator, setShowRefreshIndicator] = useState(false)
  const [lastUpdatedAt, setLastUpdatedAt] = useState<Date | null>(null)
  const [now, setNow] = useState(() => new Date())

  const days = useMemo(() => calendarData.days.map(normalizeDay), [calendarData.days])
  const collisions = useMemo(
    () => normalizeCollisions(calendarData.collisions),
    [calendarData.collisions],
  )
  const startingBalance = calendarData.startingBalance
  const lowestBalanceDate = useMemo(() => toDate(calendarData.lowestBalanceDate), [calendarData.lowestBalanceDate])

  const rowWrappersRef = useRef<Array<HTMLDivElement | null>>([])
  const scrollRef = useRef<HTMLDivElement | null>(null)

  const todayIndex = useMemo(() => {
    return days.findIndex((d) => isToday(d.date))
  }, [days])

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
      forecastDays: calendarData.forecastDays,
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

  // Handle chart click - scroll to and expand that day
  const handleChartDayClick = (dayIndex: number) => {
    const el = rowWrappersRef.current[dayIndex]
    if (!el) return

    // Scroll to the day row
    el.scrollIntoView({ behavior: 'smooth', block: 'center' })

    // Expand the detail after a brief delay
    setTimeout(() => {
      setSelectedDayIndex(dayIndex)
    }, 300)
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

  // Auto-scroll today into view on mount
  useEffect(() => {
    if (todayIndex < 0) return
    const el = rowWrappersRef.current[todayIndex]
    if (!el) return
    requestAnimationFrame(() => {
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    })
    // run once per days load
  }, [todayIndex])

  const dataRevisionKey = useMemo(() => {
    const first = days[0]?.date?.getTime() ?? 0
    const last = days[days.length - 1]?.date?.getTime() ?? 0
    return [
      first,
      last,
      calendarData.startingBalance,
      calendarData.lowestBalance,
      toDate(calendarData.lowestBalanceDate).getTime(),
      calendarData.lowestIn14Days,
      calendarData.totalIncome,
      calendarData.totalBills,
      calendarData.endingBalance,
      calendarData.safetyBuffer,
      calendarData.safeToSpend,
      calendarData.currency ?? 'USD',
    ].join(':')
  }, [
    days,
    calendarData.startingBalance,
    calendarData.lowestBalance,
    calendarData.lowestBalanceDate,
    calendarData.lowestIn14Days,
    calendarData.totalIncome,
    calendarData.totalBills,
    calendarData.endingBalance,
    calendarData.safetyBuffer,
    calendarData.safeToSpend,
    calendarData.currency,
  ])

  // Track "last updated" and show a subtle refresh indicator when data changes.
  useEffect(() => {
    setLastUpdatedAt(new Date())
    setShowRefreshIndicator(true)
    const t = window.setTimeout(() => setShowRefreshIndicator(false), 1200)
    return () => window.clearTimeout(t)
  }, [dataRevisionKey])

  // Keep relative timestamp fresh.
  useEffect(() => {
    const t = window.setInterval(() => setNow(new Date()), 60_000)
    return () => window.clearInterval(t)
  }, [])

  return (
    <div className="flex flex-col bg-zinc-900 text-zinc-100">
      <StickyCalendarHeader {...headerProps} />

      {/* Balance Trend Chart - Interactive */}
      <div className="px-4 pt-4">
        <BalanceTrendChartInteractive
          days={days}
          startingBalance={calendarData.startingBalance}
          safetyBuffer={calendarData.safetyBuffer}
          onDayClick={handleChartDayClick}
          currency={calendarData.currency}
        />
      </div>

      {/* Low Balance Warning */}
      {showWarning && (
        <LowBalanceWarning
          dangerDays={dangerDays}
          lowestBalance={calendarData.lowestBalance}
          lowestBalanceDate={lowestBalanceDate}
          currency={calendarData.currency}
        />
      )}

      {/* Bill Collision Warning */}
      <BillCollisionWarning collisions={collisions} currency={calendarData.currency} />

      <div
        ref={scrollRef}
        onScroll={(e) => {
          const top = (e.currentTarget?.scrollTop ?? 0) <= 2
          // Avoid setState spam while scrolling
          setIsScrolledToTop((prev) => (prev === top ? prev : top))
        }}
        className={[
          'relative overflow-y-auto',
          'overscroll-y-contain',
          // Keep this feeling app-like inside the card without hard-locking height.
          'max-h-[calc(100vh-14rem)] sm:max-h-[calc(100vh-16rem)]',
        ].join(' ')}
      >
        {/* Subtle refresh indicator (only visible when user is at the top). */}
        {isScrolledToTop && showRefreshIndicator && (
          <div className="pointer-events-none sticky top-0 z-30 px-4 pt-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-950/70 px-2.5 py-1 text-[11px] text-zinc-400 backdrop-blur-sm">
              <span
                className="h-3 w-3 animate-spin rounded-full border border-zinc-500 border-t-transparent"
                aria-hidden="true"
              />
              <span>Refreshing…</span>
            </div>
          </div>
        )}

        <div className="space-y-2 p-4">
          {days.map((day, index) => (
            <div
              key={day.date.getTime()}
              ref={(node) => {
                rowWrappersRef.current[index] = node
              }}
            >
              <TimelineRow day={day} isToday={index === todayIndex} onClick={() => handleDayClick(index)} currency={calendarData.currency} />
              {selectedDayIndex === index && (
                <DayDetail
                  day={day}
                  previousBalance={index > 0 ? (days[index - 1]?.balance ?? startingBalance) : startingBalance}
                  onClose={() => setSelectedDayIndex(null)}
                  currency={calendarData.currency}
                />
              )}
            </div>
          ))}
        </div>

        <div className="px-4 pb-4">
          {lastUpdatedAt ? (
            <p className="text-[11px] text-zinc-500">
              Last updated: <span className="tabular-nums">{formatMinutesAgo(lastUpdatedAt, now)}</span>
            </p>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export type { CalendarContainerProps }
