'use client';

import { CalendarDay } from '@/lib/calendar/types';
import { formatCurrency } from '@/lib/utils/format';
import { format } from 'date-fns';
import { TrendingUp, TrendingDown, MousePointer2 } from 'lucide-react';
import { useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';

interface BalanceTrendChartInteractiveProps {
  days: CalendarDay[];
  startingBalance: number;
  safetyBuffer: number;
  onDayClick?: (dayIndex: number) => void;
}

/**
 * Beautiful BalanceTrendChart inspired by modern financial dashboards
 *
 * Features:
 * - Smooth gradient area chart
 * - Interactive tooltips
 * - Professional styling
 * - Reference lines for key thresholds
 */
export function BalanceTrendChartInteractive({
  days,
  startingBalance,
  safetyBuffer,
  onDayClick,
}: BalanceTrendChartInteractiveProps) {
  // Prepare chart data
  const chartData = useMemo(() => {
    if (days.length === 0) return [];

    return days.map((day, index) => ({
      index,
      date: day.date,
      balance: day.balance,
      income: day.income.reduce((sum, t) => sum + t.amount, 0),
      bills: day.bills.reduce((sum, t) => sum + t.amount, 0),
      formattedDate: format(day.date, 'MMM d'),
      fullDate: format(day.date, 'EEE, MMM d, yyyy'),
    }));
  }, [days]);

  // Calculate trend
  const endBalance = days[days.length - 1]?.balance ?? startingBalance;
  const balanceChange = endBalance - startingBalance;
  const isPositiveTrend = balanceChange > 0;

  // Find today's date for marker
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayData = chartData.find((d) => {
    const dayDate = new Date(d.date);
    dayDate.setHours(0, 0, 0, 0);
    return dayDate.getTime() === today.getTime();
  });

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload || !payload[0]) return null;

    const data = payload[0].payload;
    const balance = data.balance;

    return (
      <div className="bg-zinc-900/98 border border-zinc-700/80 rounded-xl px-4 py-3 shadow-2xl backdrop-blur-md">
        <p className="text-xs font-medium text-zinc-400 mb-2">{data.fullDate}</p>
        <p
          className={`text-xl font-bold tabular-nums mb-2 ${
            balance >= safetyBuffer * 2
              ? 'text-emerald-400'
              : balance >= safetyBuffer
              ? 'text-amber-400'
              : balance >= 0
              ? 'text-orange-400'
              : 'text-rose-400'
          }`}
        >
          {formatCurrency(balance)}
        </p>
        {(data.income > 0 || data.bills > 0) && (
          <div className="space-y-1 pt-2 border-t border-zinc-800">
            {data.income > 0 && (
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs text-zinc-400">Income</span>
                <span className="text-sm font-semibold text-emerald-400">
                  +{formatCurrency(data.income)}
                </span>
              </div>
            )}
            {data.bills > 0 && (
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs text-zinc-400">Bills</span>
                <span className="text-sm font-semibold text-rose-400">
                  -{formatCurrency(data.bills)}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const handleClick = (data: any) => {
    if (data && data.activePayload && onDayClick) {
      const index = data.activePayload[0].payload.index;
      onDayClick(index);
    }
  };

  return (
    <div className="bg-zinc-900/50 border border-zinc-800/60 rounded-xl p-6 mb-6 backdrop-blur-sm">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-zinc-100 mb-1 flex items-center gap-2">
            Balance Forecast
            <MousePointer2 className="w-4 h-4 text-zinc-500" />
          </h3>
          <p className="text-sm text-zinc-500">{days.length}-day projection • Hover & click chart to view day</p>
        </div>

        {/* Trend indicator */}
        <div className="flex items-center gap-3 bg-zinc-800/40 rounded-lg px-4 py-2 border border-zinc-700/50">
          {isPositiveTrend ? (
            <>
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              <div className="text-right">
                <p className="text-base font-bold text-emerald-400">
                  +{formatCurrency(Math.abs(balanceChange))}
                </p>
                <p className="text-xs text-zinc-500">Net change</p>
              </div>
            </>
          ) : (
            <>
              <TrendingDown className="w-5 h-5 text-rose-400" />
              <div className="text-right">
                <p className="text-base font-bold text-rose-400">
                  -{formatCurrency(Math.abs(balanceChange))}
                </p>
                <p className="text-xs text-zinc-500">Net change</p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Chart */}
      <div className="w-full -mx-2">
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 10, bottom: 0 }}
            onClick={handleClick}
            className={onDayClick ? 'cursor-pointer' : ''}
          >
            <defs>
              <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgb(16, 185, 129)" stopOpacity={0.4} />
                <stop offset="50%" stopColor="rgb(59, 130, 246)" stopOpacity={0.2} />
                <stop offset="100%" stopColor="rgb(139, 92, 246)" stopOpacity={0.05} />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="rgb(63, 63, 70)" opacity={0.2} vertical={false} />

            <XAxis
              dataKey="formattedDate"
              stroke="rgb(113, 113, 122)"
              tick={{ fill: 'rgb(161, 161, 170)', fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: 'rgb(63, 63, 70)', strokeWidth: 1 }}
              interval="preserveStartEnd"
              minTickGap={40}
            />

            <YAxis
              stroke="rgb(113, 113, 122)"
              tick={{ fill: 'rgb(161, 161, 170)', fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: 'rgb(63, 63, 70)', strokeWidth: 1 }}
              tickFormatter={(value) => formatCurrency(value, 'USD', true)}
              width={60}
            />

            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgb(20, 184, 166)', strokeWidth: 2, strokeDasharray: '5 5', opacity: 0.5 }} />

            {/* Safety buffer line */}
            <ReferenceLine
              y={safetyBuffer}
              stroke="rgb(251, 191, 36)"
              strokeDasharray="5 5"
              strokeWidth={1.5}
              opacity={0.6}
              label={{
                value: 'Safety Buffer',
                position: 'insideTopRight',
                fill: 'rgb(251, 191, 36)',
                fontSize: 10,
                fontWeight: 600,
              }}
            />

            {/* Zero line */}
            <ReferenceLine
              y={0}
              stroke="rgb(244, 63, 94)"
              strokeDasharray="3 3"
              strokeWidth={1.5}
              opacity={0.5}
            />

            {/* Today marker */}
            {todayData && (
              <ReferenceLine
                x={todayData.formattedDate}
                stroke="rgb(99, 102, 241)"
                strokeDasharray="4 4"
                strokeWidth={1.5}
                opacity={0.4}
                label={{
                  value: 'Today',
                  position: 'top',
                  fill: 'rgb(99, 102, 241)',
                  fontSize: 10,
                  fontWeight: 600,
                  offset: 10,
                }}
              />
            )}

            <Area
              type="monotone"
              dataKey="balance"
              stroke="rgb(16, 185, 129)"
              strokeWidth={2.5}
              fill="url(#balanceGradient)"
              fillOpacity={1}
              activeDot={{
                r: 5,
                fill: 'rgb(16, 185, 129)',
                stroke: 'rgb(0, 0, 0)',
                strokeWidth: 2,
                filter: 'url(#glow)',
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-3 gap-3 mt-6 text-xs">
        <div className="flex items-center gap-2 bg-zinc-800/30 rounded-lg px-3 py-2 border border-zinc-700/30">
          <div className="w-8 h-1 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full" />
          <span className="text-zinc-400">Balance trend</span>
        </div>
        <div className="flex items-center gap-2 bg-zinc-800/30 rounded-lg px-3 py-2 border border-zinc-700/30">
          <svg width="32" height="4" viewBox="0 0 32 4">
            <line x1="0" y1="2" x2="32" y2="2" stroke="rgb(251, 191, 36)" strokeWidth="2" strokeDasharray="4 2" />
          </svg>
          <span className="text-zinc-400">Safety buffer</span>
        </div>
        <div className="flex items-center gap-2 bg-zinc-800/30 rounded-lg px-3 py-2 border border-zinc-700/30">
          <svg width="32" height="4" viewBox="0 0 32 4">
            <line x1="0" y1="2" x2="32" y2="2" stroke="rgb(244, 63, 94)" strokeWidth="2" strokeDasharray="3 2" />
          </svg>
          <span className="text-zinc-400">Zero line</span>
        </div>
      </div>
    </div>
  );
}
