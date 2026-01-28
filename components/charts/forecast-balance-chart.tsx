'use client'

import { useId, useMemo } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceDot,
  ReferenceLine,
} from 'recharts'
import { format } from 'date-fns'
import { formatCurrency } from '@/lib/utils/format'
import type { CalendarDay } from '@/lib/calendar/types'

interface ForecastBalanceChartProps {
  days: CalendarDay[]
  currency: string
  lowestBalanceDay: Date
  safetyBuffer: number
}

interface ChartDataPoint {
  date: Date
  dateLabel: string
  balance: number
  isLowest: boolean
}

// Custom tooltip component (defined outside to prevent recreation)
function ChartTooltip({
  active,
  payload,
  currency,
}: {
  active?: boolean
  payload?: Array<{ payload: ChartDataPoint }>
  currency: string
}) {
  if (!active || !payload || !payload.length) return null

  const data = payload[0]?.payload
  if (!data) return null

  return (
    <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-3 shadow-lg">
      <p className="text-sm font-medium text-zinc-100">
        {format(data.date, 'MMM d, yyyy')}
      </p>
      <p className={`text-sm mt-1 font-semibold ${data.balance >= 0 ? 'text-teal-400' : 'text-rose-400'}`}>
        {formatCurrency(data.balance, currency)}
      </p>
      {data.isLowest && (
        <p className="text-xs text-amber-400 mt-1">← Lowest point</p>
      )}
    </div>
  )
}

export function ForecastBalanceChart({
  days,
  currency,
  lowestBalanceDay,
  safetyBuffer,
}: ForecastBalanceChartProps) {
  // Unique ID for gradient to prevent conflicts if multiple charts render
  const gradientId = useId()

  // Transform calendar days into chart data
  const chartData = useMemo(() => {
    // Sample data points to avoid overcrowding (max ~30 points for smooth chart)
    const maxPoints = 30
    const step = Math.max(1, Math.floor(days.length / maxPoints))

    // Find the index of the actual lowest balance day to ensure it's included
    const lowestDayFormatted = format(lowestBalanceDay, 'yyyy-MM-dd')
    const lowestDayIndex = days.findIndex(
      (day) => format(day.date, 'yyyy-MM-dd') === lowestDayFormatted
    )

    const data: ChartDataPoint[] = []
    const addedIndices = new Set<number>()

    for (let i = 0; i < days.length; i += step) {
      const day = days[i]
      if (!day) continue

      addedIndices.add(i)
      data.push({
        date: day.date,
        dateLabel: format(day.date, 'MMM d'),
        balance: day.balance,
        isLowest: i === lowestDayIndex,
      })
    }

    // Always include the actual lowest balance day if not already sampled
    if (lowestDayIndex >= 0 && !addedIndices.has(lowestDayIndex)) {
      const lowestDay = days[lowestDayIndex]
      if (lowestDay) {
        // Find the right position to insert (keep chronological order)
        const insertIndex = data.findIndex((d) => d.date > lowestDay.date)
        const lowestPoint: ChartDataPoint = {
          date: lowestDay.date,
          dateLabel: format(lowestDay.date, 'MMM d'),
          balance: lowestDay.balance,
          isLowest: true,
        }
        if (insertIndex === -1) {
          data.push(lowestPoint)
        } else {
          data.splice(insertIndex, 0, lowestPoint)
        }
        // Mark as added to prevent duplicate when checking last day
        addedIndices.add(lowestDayIndex)
      }
    }

    // Always include the last day (if not already added as lowest or sampled)
    const lastIndex = days.length - 1
    const lastDay = days[lastIndex]
    if (lastDay && !addedIndices.has(lastIndex)) {
      data.push({
        date: lastDay.date,
        dateLabel: format(lastDay.date, 'MMM d'),
        balance: lastDay.balance,
        isLowest: lastIndex === lowestDayIndex,
      })
    }

    return data
  }, [days, lowestBalanceDay])

  // Find the lowest point for the reference dot
  const lowestPoint = useMemo(() => {
    if (chartData.length === 0) return null
    const found = chartData.find(d => d.isLowest)
    if (found) return found
    return chartData.reduce((min, d) =>
      d.balance < min.balance ? d : min, chartData[0]!)
  }, [chartData])

  // Calculate Y-axis domain
  const yDomain = useMemo((): [number, number] => {
    if (chartData.length === 0) return [0, 1000]
    const balances = chartData.map(d => d.balance)
    const min = Math.min(...balances)
    const max = Math.max(...balances)
    const padding = (max - min) * 0.1 || 100
    return [
      Math.floor((min - padding) / 100) * 100,
      Math.ceil((max + padding) / 100) * 100
    ]
  }, [chartData])

  // X-axis ticks - show 4-5 dates
  const xAxisTicks = useMemo(() => {
    if (chartData.length === 0) return []
    if (chartData.length <= 5) {
      return chartData.map(d => d.dateLabel)
    }
    const step = Math.floor(chartData.length / 4)
    const firstItem = chartData[0]
    const ticks: string[] = firstItem ? [firstItem.dateLabel] : []
    for (let i = step; i < chartData.length - 1; i += step) {
      const item = chartData[i]
      if (item) ticks.push(item.dateLabel)
    }
    const lastItem = chartData[chartData.length - 1]
    if (lastItem) {
      ticks.push(lastItem.dateLabel)
    }
    return ticks
  }, [chartData])

  if (days.length === 0) {
    return (
      <div className="h-32 flex items-center justify-center text-zinc-500 text-sm">
        No forecast data available
      </div>
    )
  }

  // Determine gradient colors based on whether balance goes negative
  const hasNegative = chartData.some(d => d.balance < 0)

  return (
    <div className="h-36 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 5, right: 5, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id={`forecastGradient-${gradientId}`} x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor={hasNegative ? '#f43f5e' : '#14b8a6'}
                stopOpacity={0.3}
              />
              <stop
                offset="95%"
                stopColor={hasNegative ? '#f43f5e' : '#14b8a6'}
                stopOpacity={0}
              />
            </linearGradient>
          </defs>

          <XAxis
            dataKey="dateLabel"
            ticks={xAxisTicks}
            stroke="#52525b"
            tick={{ fill: '#a1a1aa', fontSize: 10 }}
            axisLine={{ stroke: '#3f3f46' }}
            tickLine={false}
          />

          <YAxis
            tickFormatter={(value) => {
              const isNegative = value < 0
              const absValue = Math.abs(value)
              if (absValue >= 1000) {
                return `${isNegative ? '-' : ''}$${(absValue / 1000).toFixed(0)}k`
              }
              return `${isNegative ? '-' : ''}$${absValue}`
            }}
            stroke="#52525b"
            tick={{ fill: '#a1a1aa', fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            width={45}
            domain={yDomain}
          />

          <Tooltip
            content={<ChartTooltip currency={currency} />}
            cursor={{ stroke: '#52525b', strokeDasharray: '3 3' }}
          />

          {/* Zero line if there are negative values */}
          {hasNegative && (
            <ReferenceLine y={0} stroke="#f43f5e" strokeDasharray="3 3" strokeOpacity={0.5} />
          )}

          {/* Safety buffer line - only show if within visible Y range */}
          {safetyBuffer > 0 && safetyBuffer >= yDomain[0] && safetyBuffer <= yDomain[1] && (
            <ReferenceLine
              y={safetyBuffer}
              stroke="#eab308"
              strokeDasharray="3 3"
              strokeOpacity={0.4}
            />
          )}

          <Area
            type="monotone"
            dataKey="balance"
            stroke={hasNegative ? '#f43f5e' : '#14b8a6'}
            strokeWidth={2}
            fill={`url(#forecastGradient-${gradientId})`}
          />

          {/* Lowest point marker */}
          {lowestPoint && (
            <ReferenceDot
              x={lowestPoint.dateLabel}
              y={lowestPoint.balance}
              r={5}
              fill={lowestPoint.balance < safetyBuffer ? '#f59e0b' : '#14b8a6'}
              stroke="#18181b"
              strokeWidth={2}
            />
          )}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
