'use client';

import { CalendarDay } from '@/lib/calendar/types';
import { formatCurrency } from '@/lib/utils/format';
import { format } from 'date-fns';
import { TrendingUp, TrendingDown, AlertCircle, MousePointer2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMemo, useState, useRef, useCallback } from 'react';

interface BalanceTrendChartInteractiveProps {
  days: CalendarDay[];
  startingBalance: number;
  lowestBalance: number;
  safetyBuffer: number;
  onDayClick?: (dayIndex: number) => void; // Callback when user clicks a day
}

/**
 * Interactive BalanceTrendChart - Enhanced with hover tooltips and click navigation
 *
 * Features:
 * - Hover to see exact balance and date
 * - Click anywhere on the chart to jump to that day
 * - Smooth cursor tracking
 * - Responsive touch support
 */
export function BalanceTrendChartInteractive({
  days,
  startingBalance,
  lowestBalance,
  safetyBuffer,
  onDayClick,
}: BalanceTrendChartInteractiveProps) {
  const [hoveredDayIndex, setHoveredDayIndex] = useState<number | null>(null);
  const [cursorPosition, setCursorPosition] = useState<{ x: number; y: number } | null>(null);
  const chartRef = useRef<HTMLDivElement>(null);

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
      return { x, y, balance: day.balance, date: day.date, index };
    });

    // Create SVG path string
    const pathD = points
      .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`)
      .join(' ');

    // Create area fill path
    const areaPathD = `${pathD} L ${width} ${height} L 0 ${height} Z`;

    // Calculate reference lines
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

  // Handle mouse/touch move over chart
  const handleChartInteraction = useCallback(
    (clientX: number, clientY: number) => {
      if (!chartRef.current || !chartData) return;

      const rect = chartRef.current.getBoundingClientRect();
      const x = ((clientX - rect.left) / rect.width) * 100;
      const y = ((clientY - rect.top) / rect.height) * 100;

      // Find closest day based on X position
      const dayIndex = Math.round((x / 100) * (days.length - 1));
      const clampedIndex = Math.max(0, Math.min(dayIndex, days.length - 1));

      setHoveredDayIndex(clampedIndex);
      setCursorPosition({ x: clientX - rect.left, y: clientY - rect.top });
    },
    [chartData, days.length]
  );

  const handleMouseMove = (e: React.MouseEvent) => {
    handleChartInteraction(e.clientX, e.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      handleChartInteraction(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const handleMouseLeave = () => {
    setHoveredDayIndex(null);
    setCursorPosition(null);
  };

  const handleClick = () => {
    if (hoveredDayIndex !== null && onDayClick) {
      onDayClick(hoveredDayIndex);
    }
  };

  if (!chartData) return null;

  const hoveredDay = hoveredDayIndex !== null ? days[hoveredDayIndex] : null;
  const hoveredPoint = hoveredDayIndex !== null ? chartData.points[hoveredDayIndex] : null;

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 mb-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-zinc-100 mb-1 flex items-center gap-2">
            Balance Forecast
            <MousePointer2 className="w-4 h-4 text-zinc-400" />
          </h3>
          <p className="text-sm text-zinc-400">
            {days.length}-day projection • Click to jump to date
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
      <div
        ref={chartRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseLeave}
        onClick={handleClick}
        className={cn(
          'relative w-full h-48 sm:h-56 bg-zinc-800/50 rounded-lg p-4 overflow-hidden',
          onDayClick && 'cursor-pointer'
        )}
      >
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute inset-4 w-[calc(100%-2rem)] h-[calc(100%-2rem)]"
        >
          {/* Gradient definitions */}
          <defs>
            <linearGradient id="balanceGradientInteractive" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgb(20 184 166)" stopOpacity="0.3" />
              <stop offset="100%" stopColor="rgb(20 184 166)" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Zero line */}
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
          <path d={chartData.areaPathD} fill="url(#balanceGradientInteractive)" />

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

          {/* Hover indicator line */}
          {hoveredPoint && (
            <line
              x1={hoveredPoint.x}
              y1="0"
              x2={hoveredPoint.x}
              y2="100"
              stroke="rgb(20 184 166)"
              strokeWidth="0.8"
              strokeDasharray="2,2"
              opacity="0.6"
            />
          )}

          {/* Hover point */}
          {hoveredPoint && (
            <circle
              cx={hoveredPoint.x}
              cy={hoveredPoint.y}
              r="2"
              fill="rgb(20 184 166)"
              className="drop-shadow-[0_0_6px_rgba(20,184,166,0.8)]"
            />
          )}

          {/* Today marker */}
          {chartData.todayX !== null && hoveredDayIndex !== days.findIndex((d) => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const dayDate = new Date(d.date);
            dayDate.setHours(0, 0, 0, 0);
            return dayDate.getTime() === today.getTime();
          }) && (
            <line
              x1={chartData.todayX}
              y1="0"
              x2={chartData.todayX}
              y2="100"
              stroke="rgb(20 184 166)"
              strokeWidth="0.5"
              strokeDasharray="2,2"
              opacity="0.4"
            />
          )}

          {/* Lowest balance point */}
          {chartData.lowestPoint && hoveredDayIndex !== days.findIndex(d => d.balance === lowestBalance) && (
            <g>
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

        {/* Hover tooltip */}
        {hoveredDay && cursorPosition && (
          <div
            className="absolute z-10 pointer-events-none"
            style={{
              left: cursorPosition.x,
              top: cursorPosition.y,
              transform: 'translate(-50%, -120%)',
            }}
          >
            <div className="bg-zinc-950/95 border border-zinc-700 rounded-lg px-3 py-2 shadow-lg backdrop-blur-sm min-w-[180px]">
              <p className="text-xs font-medium text-zinc-400 mb-1">
                {format(hoveredDay.date, 'EEE, MMM d, yyyy')}
              </p>
              <p className={cn(
                'text-lg font-semibold tabular-nums',
                hoveredDay.balance >= safetyBuffer * 2 ? 'text-emerald-400' :
                hoveredDay.balance >= safetyBuffer ? 'text-amber-400' :
                hoveredDay.balance >= 0 ? 'text-orange-400' : 'text-rose-400'
              )}>
                {formatCurrency(hoveredDay.balance)}
              </p>
              {hoveredDay.income.length + hoveredDay.bills.length > 0 && (
                <div className="mt-2 pt-2 border-t border-zinc-800 space-y-1">
                  {hoveredDay.income.length > 0 && (
                    <p className="text-xs text-emerald-400">
                      +{formatCurrency(hoveredDay.income.reduce((sum, t) => sum + t.amount, 0))} income
                    </p>
                  )}
                  {hoveredDay.bills.length > 0 && (
                    <p className="text-xs text-rose-400">
                      -{formatCurrency(hoveredDay.bills.reduce((sum, t) => sum + t.amount, 0))} bills
                    </p>
                  )}
                </div>
              )}
              {onDayClick && (
                <p className="text-xs text-zinc-500 mt-2 italic">Click to view</p>
              )}
            </div>
          </div>
        )}

        {/* Today label */}
        {chartData.todayX !== null && !hoveredDay && (
          <div
            className="absolute top-2 bg-teal-500/20 border border-teal-500/30 text-teal-200 px-2 py-0.5 rounded-full text-xs font-medium"
            style={{ left: `calc(${chartData.todayX}% + 1rem)` }}
          >
            Today
          </div>
        )}

        {/* Lowest point label */}
        {chartData.lowestPoint && !hoveredDay && (
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
