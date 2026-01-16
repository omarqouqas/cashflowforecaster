'use client';

import { CalendarDay } from '@/lib/calendar/types';
import { formatCurrency } from '@/lib/utils/format';
import { format } from 'date-fns';
import { TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMemo } from 'react';

interface BalanceTrendChartProps {
  days: CalendarDay[];
  startingBalance: number;
  lowestBalance: number;
  safetyBuffer: number;
  currency?: string;
}

/**
 * BalanceTrendChart - Lightweight CSS/SVG balance visualization
 *
 * Shows balance trend over forecast period with:
 * - Line chart showing daily balance
 * - Color zones (safe/caution/danger)
 * - Today marker
 * - Lowest balance indicator
 * - Safety buffer reference line
 */
export function BalanceTrendChart({
  days,
  startingBalance,
  lowestBalance,
  safetyBuffer,
  currency = 'USD',
}: BalanceTrendChartProps) {
  // Calculate chart dimensions and data points
  const chartData = useMemo(() => {
    if (days.length === 0) return null;

    const balances = days.map((d) => d.balance);
    const maxBalance = Math.max(...balances, startingBalance);
    const minBalance = Math.min(...balances, lowestBalance);

    // Add padding to chart bounds
    const padding = (maxBalance - minBalance) * 0.15 || 500;
    const chartMax = maxBalance + padding;
    const chartMin = Math.min(minBalance - padding, 0);
    const range = chartMax - chartMin;

    // Generate SVG path points
    const width = 100; // percentage-based
    const height = 100;
    const points = days.map((day, index) => {
      const x = (index / (days.length - 1)) * width;
      const y = height - ((day.balance - chartMin) / range) * height;
      return { x, y, balance: day.balance, date: day.date };
    });

    // Create SVG path string
    const pathD = points
      .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`)
      .join(' ');

    // Create area fill path (close the path at bottom)
    const areaPathD = `${pathD} L ${width} ${height} L 0 ${height} Z`;

    // Calculate safety buffer line position
    const safetyBufferY = height - ((safetyBuffer - chartMin) / range) * height;
    const zeroLineY = height - ((0 - chartMin) / range) * height;

    // Find today's index
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayIndex = days.findIndex((d) => {
      const dayDate = new Date(d.date);
      dayDate.setHours(0, 0, 0, 0);
      return dayDate.getTime() === today.getTime();
    });
    const todayX = todayIndex >= 0 ? (todayIndex / (days.length - 1)) * width : null;

    // Find lowest balance point
    const lowestIndex = days.findIndex((d) => d.balance === lowestBalance);
    const lowestPoint = lowestIndex >= 0 ? points[lowestIndex] : null;

    // Calculate overall trend
    const endBalance = balances[balances.length - 1];
    const balanceChange = endBalance - startingBalance;
    const isPositiveTrend = balanceChange > 0;

    return {
      points,
      pathD,
      areaPathD,
      safetyBufferY,
      zeroLineY,
      todayX,
      lowestPoint,
      chartMax,
      chartMin,
      range,
      balanceChange,
      isPositiveTrend,
      endBalance,
    };
  }, [days, startingBalance, lowestBalance, safetyBuffer]);

  if (!chartData) return null;

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 mb-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-zinc-100 mb-1">
            Balance Forecast
          </h3>
          <p className="text-sm text-zinc-400">
            {days.length}-day projection
          </p>
        </div>

        {/* Trend indicator */}
        <div className="flex items-center gap-2">
          {chartData.isPositiveTrend ? (
            <>
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              <div className="text-right">
                <p className="text-sm font-semibold text-emerald-400">
                  +{formatCurrency(Math.abs(chartData.balanceChange))}
                </p>
                <p className="text-xs text-zinc-400">Net change</p>
              </div>
            </>
          ) : (
            <>
              <TrendingDown className="w-5 h-5 text-rose-400" />
              <div className="text-right">
                <p className="text-sm font-semibold text-rose-400">
                  -{formatCurrency(Math.abs(chartData.balanceChange))}
                </p>
                <p className="text-xs text-zinc-400">Net change</p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Chart Container */}
      <div className="relative w-full h-48 sm:h-56 bg-zinc-800/50 rounded-lg p-4 overflow-hidden">
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute inset-4 w-[calc(100%-2rem)] h-[calc(100%-2rem)]"
        >
          {/* Gradient definitions */}
          <defs>
            <linearGradient id="balanceGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgb(20 184 166)" stopOpacity="0.3" />
              <stop offset="100%" stopColor="rgb(20 184 166)" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Zero line (if visible) */}
          {chartData.zeroLineY >= 0 && chartData.zeroLineY <= 100 && (
            <line
              x1="0"
              y1={chartData.zeroLineY}
              x2="100"
              y2={chartData.zeroLineY}
              stroke="rgb(244 63 94)"
              strokeWidth="0.5"
              strokeDasharray="2,2"
              opacity="0.5"
            />
          )}

          {/* Safety buffer line */}
          {chartData.safetyBufferY >= 0 && chartData.safetyBufferY <= 100 && (
            <line
              x1="0"
              y1={chartData.safetyBufferY}
              x2="100"
              y2={chartData.safetyBufferY}
              stroke="rgb(251 191 36)"
              strokeWidth="0.5"
              strokeDasharray="3,3"
              opacity="0.4"
            />
          )}

          {/* Area fill */}
          <path
            d={chartData.areaPathD}
            fill="url(#balanceGradient)"
          />

          {/* Balance line */}
          <path
            d={chartData.pathD}
            fill="none"
            stroke="rgb(20 184 166)"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="drop-shadow-[0_0_8px_rgba(20,184,166,0.4)]"
          />

          {/* Today marker */}
          {chartData.todayX !== null && (
            <line
              x1={chartData.todayX}
              y1="0"
              x2={chartData.todayX}
              y2="100"
              stroke="rgb(20 184 166)"
              strokeWidth="0.5"
              strokeDasharray="2,2"
              opacity="0.6"
            />
          )}

          {/* Lowest balance point indicator */}
          {chartData.lowestPoint && (
            <g>
              {/* Pulse ring */}
              <circle
                cx={chartData.lowestPoint.x}
                cy={chartData.lowestPoint.y}
                r="2"
                fill="none"
                stroke="rgb(244 63 94)"
                strokeWidth="0.5"
                opacity="0.4"
                className="animate-ping"
              />
              {/* Point */}
              <circle
                cx={chartData.lowestPoint.x}
                cy={chartData.lowestPoint.y}
                r="1.5"
                fill="rgb(244 63 94)"
                className="drop-shadow-[0_0_4px_rgba(244,63,94,0.8)]"
              />
            </g>
          )}
        </svg>

        {/* Today label (overlay) */}
        {chartData.todayX !== null && (
          <div
            className="absolute top-2 bg-teal-500/20 border border-teal-500/30 text-teal-200 px-2 py-0.5 rounded-full text-xs font-medium"
            style={{ left: `calc(${chartData.todayX}% + 1rem)` }}
          >
            Today
          </div>
        )}

        {/* Lowest point label (overlay) */}
        {chartData.lowestPoint && (
          <div
            className="absolute flex items-center gap-1 bg-rose-500/20 border border-rose-500/30 text-rose-200 px-2 py-0.5 rounded-full text-xs font-medium"
            style={{
              left: `calc(${chartData.lowestPoint.x}% + 1rem)`,
              top: `calc(${chartData.lowestPoint.y}% + 1rem)`,
              transform: 'translateY(-100%)',
            }}
          >
            <AlertCircle className="w-3 h-3" />
            Lowest: {formatCurrency(lowestBalance)}
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-0.5 bg-teal-500 rounded-full" />
          <span className="text-zinc-400">Balance trend</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-0.5 bg-amber-400 rounded-full opacity-40" style={{ borderTop: '1px dashed currentColor', height: 0 }} />
          <span className="text-zinc-400">Safety buffer</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-rose-500 rounded-full" />
          <span className="text-zinc-400">Lowest point</span>
        </div>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-zinc-800">
        <div>
          <p className="text-xs text-zinc-400 mb-1">Starting</p>
          <p className="text-sm font-semibold text-zinc-100 tabular-nums">
            {formatCurrency(startingBalance)}
          </p>
        </div>
        <div>
          <p className="text-xs text-zinc-400 mb-1">Ending</p>
          <p className={cn(
            'text-sm font-semibold tabular-nums',
            chartData.isPositiveTrend ? 'text-emerald-400' : 'text-rose-400'
          )}>
            {formatCurrency(chartData.endBalance)}
          </p>
        </div>
        <div>
          <p className="text-xs text-zinc-400 mb-1">Lowest</p>
          <p className="text-sm font-semibold text-rose-400 tabular-nums">
            {formatCurrency(lowestBalance)}
          </p>
        </div>
      </div>
    </div>
  );
}
