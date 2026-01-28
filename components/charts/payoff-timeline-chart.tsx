'use client'

import { useMemo } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts'
import { format, addMonths } from 'date-fns'
import { formatCurrency } from '@/lib/utils/format'
import type { MonthlySnapshot, CardPayoffSummary } from '@/lib/debt-payoff/calculate-payoff'

interface PayoffTimelineChartProps {
  schedule: MonthlySnapshot[]
  cardSummaries: CardPayoffSummary[]
  totalDebt: number
}

interface ChartDataPoint {
  month: number
  date: Date
  balance: number
  label: string
  paidOffCards?: string[]
}

export function PayoffTimelineChart({
  schedule,
  cardSummaries,
  totalDebt,
}: PayoffTimelineChartProps) {
  // Transform schedule into chart data
  const chartData = useMemo(() => {
    const startDate = new Date()

    // Add starting point (month 0)
    const data: ChartDataPoint[] = [
      {
        month: 0,
        date: startDate,
        balance: totalDebt,
        label: format(startDate, 'MMM yy'),
      },
    ]

    // Create a map of which cards are paid off in which month
    const paidOffByMonth = new Map<number, string[]>()
    for (const card of cardSummaries) {
      const existing = paidOffByMonth.get(card.paidOffMonth) || []
      existing.push(card.cardName)
      paidOffByMonth.set(card.paidOffMonth, existing)
    }

    // Add each month from schedule
    for (const snapshot of schedule) {
      data.push({
        month: snapshot.month,
        date: snapshot.date,
        balance: snapshot.totalBalance,
        label: format(snapshot.date, 'MMM yy'),
        paidOffCards: paidOffByMonth.get(snapshot.month),
      })
    }

    return data
  }, [schedule, cardSummaries, totalDebt])

  // Get months where cards are paid off for reference lines
  const payoffMilestones = useMemo(() => {
    return cardSummaries.map(card => ({
      month: card.paidOffMonth,
      cardName: card.cardName,
      date: card.paidOffDate,
    }))
  }, [cardSummaries])

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: ChartDataPoint }> }) => {
    if (!active || !payload || !payload.length) return null

    const data = payload[0]?.payload
    if (!data) return null

    return (
      <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-3 shadow-lg">
        <p className="text-sm font-medium text-zinc-100">
          {format(data.date, 'MMMM yyyy')}
        </p>
        <p className="text-sm text-amber-400 mt-1">
          Balance: {formatCurrency(data.balance, 'USD')}
        </p>
        {data.paidOffCards && data.paidOffCards.length > 0 && (
          <div className="mt-2 pt-2 border-t border-zinc-700">
            <p className="text-xs text-emerald-400">
              🎉 Paid off: {data.paidOffCards.join(', ')}
            </p>
          </div>
        )}
      </div>
    )
  }

  // Calculate tick values for X-axis (show every 3-6 months depending on duration)
  const xAxisTicks = useMemo(() => {
    const totalMonths = schedule.length
    let interval = 3
    if (totalMonths > 24) interval = 6
    if (totalMonths > 48) interval = 12

    const ticks: number[] = [0]
    for (let i = interval; i < totalMonths; i += interval) {
      ticks.push(i)
    }
    if (totalMonths > 0 && !ticks.includes(totalMonths)) {
      ticks.push(totalMonths)
    }
    return ticks
  }, [schedule])

  if (schedule.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-zinc-500">
        No payoff data to display
      </div>
    )
  }

  return (
    <div className="border border-zinc-800 bg-zinc-900 rounded-lg p-4">
      <h3 className="text-sm font-medium text-zinc-300 mb-4">Payoff Timeline</h3>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" vertical={false} />

            <XAxis
              dataKey="month"
              tickFormatter={(month) => {
                const date = addMonths(new Date(), month)
                return format(date, 'MMM yy')
              }}
              ticks={xAxisTicks}
              stroke="#71717a"
              tick={{ fill: '#a1a1aa', fontSize: 11 }}
              axisLine={{ stroke: '#3f3f46' }}
            />

            <YAxis
              tickFormatter={(value) => {
                if (value >= 1000) {
                  const kValue = value / 1000
                  // Use 1 decimal place if needed to avoid duplicates
                  return kValue % 1 === 0 ? `$${kValue.toFixed(0)}k` : `$${kValue.toFixed(1)}k`
                }
                return `$${value}`
              }}
              stroke="#71717a"
              tick={{ fill: '#a1a1aa', fontSize: 11 }}
              axisLine={{ stroke: '#3f3f46' }}
              width={50}
              domain={[0, 'auto']}
              allowDecimals={false}
              tickCount={5}
            />

            <Tooltip content={<CustomTooltip />} />

            {/* Reference lines for card payoff milestones */}
            {payoffMilestones.map((milestone) => (
              <ReferenceLine
                key={milestone.cardName}
                x={milestone.month}
                stroke="#10b981"
                strokeDasharray="4 4"
                strokeOpacity={0.6}
              />
            ))}

            <Area
              type="monotone"
              dataKey="balance"
              stroke="#f59e0b"
              strokeWidth={2}
              fill="url(#balanceGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Legend for milestones */}
      <div className="mt-4 flex flex-wrap gap-3">
        {payoffMilestones.map((milestone) => (
          <div
            key={milestone.cardName}
            className="flex items-center gap-2 text-xs"
          >
            <div className="w-3 h-0.5 bg-emerald-500" style={{ borderStyle: 'dashed' }} />
            <span className="text-zinc-400">
              {milestone.cardName}: {format(milestone.date, 'MMM yyyy')}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
