'use client';

import { useState, useRef } from 'react';
import { CalendarData, CalendarDay } from '@/lib/calendar/types';
import { format } from 'date-fns';
import { formatCurrency } from '@/lib/utils/format';
import { cn } from '@/lib/utils';
import { DayCard } from './day-card';
import { DayDetailModal } from './day-detail-modal';
import { BalanceTrendChartInteractive } from './balance-trend-chart-interactive';
import { StickyCalendarHeader } from './sticky-header';

interface CalendarViewProps {
  calendarData: CalendarData;
  safetyBuffer?: number;
  lowestIn14Days: number;
  totalIncome: number;
  totalBills: number;
  endingBalance: number;
  currency?: string;
}

/**
 * CalendarView component - displays the 60-day calendar grid
 *
 * Shows balance trend chart and groups days by month in a responsive grid.
 * Clicking a day opens a detail modal.
 */
export function CalendarView({
  calendarData,
  safetyBuffer,
  lowestIn14Days,
  totalIncome,
  totalBills,
  endingBalance,
  currency = 'USD',
}: CalendarViewProps) {
  const [selectedDay, setSelectedDay] = useState<CalendarDay | null>(null);
  const dayRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Calculate thresholds based on safety buffer
  const buffer = safetyBuffer ?? 500;
  const thresholds = {
    safe: buffer * 2,
    caution: buffer * 1.5,
    low: buffer,
  };

  // Group days by month using reduce
  const daysByMonth = calendarData.days.reduce((acc, day) => {
    const monthKey = format(day.date, 'MMMM yyyy'); // e.g., "December 2024"
    if (!acc[monthKey]) {
      acc[monthKey] = [];
    }
    acc[monthKey].push(day);
    return acc;
  }, {} as Record<string, CalendarDay[]>);

  // Check if a day is the lowest balance day
  const isLowestDay = (day: CalendarDay) => {
    const dayDate = new Date(day.date);
    dayDate.setHours(0, 0, 0, 0);
    const lowestDate = new Date(calendarData.lowestBalanceDay);
    lowestDate.setHours(0, 0, 0, 0);
    return dayDate.getTime() === lowestDate.getTime();
  };

  // Handle chart click - scroll to and open that day
  const handleChartDayClick = (dayIndex: number) => {
    const day = calendarData.days[dayIndex];
    if (!day) return;

    const dayKey = day.date.getTime().toString();
    const dayElement = dayRefs.current[dayKey];

    if (dayElement) {
      // Scroll to the day card
      dayElement.scrollIntoView({ behavior: 'smooth', block: 'center' });

      // Open the modal after a brief delay for smooth UX
      setTimeout(() => {
        setSelectedDay(day);
      }, 300);
    }
  };

  return (
    <>
      {/* Sticky Header */}
      <StickyCalendarHeader
        startingBalance={calendarData.startingBalance}
        lowestBalance={calendarData.lowestBalance}
        lowestBalanceDate={calendarData.lowestBalanceDay}
        lowestIn14Days={lowestIn14Days}
        totalIncome={totalIncome}
        totalBills={totalBills}
        endingBalance={endingBalance}
        safetyBuffer={buffer}
        safeToSpend={calendarData.safeToSpend}
        currency={currency}
      />

      {/* Balance Trend Chart - Interactive */}
      <BalanceTrendChartInteractive
        days={calendarData.days}
        startingBalance={calendarData.startingBalance}
        lowestBalance={calendarData.lowestBalance}
        safetyBuffer={buffer}
        onDayClick={handleChartDayClick}
      />

      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 sm:p-6 mt-6">
        {/* Month sections */}
        {Object.entries(daysByMonth).map(([monthKey, days], index) => (
          <div
            key={monthKey}
            className="mb-10 last:mb-0 animate-fadeIn"
            style={{
              animationDelay: `${index * 100}ms`,
              animationFillMode: 'backwards'
            }}
          >
            {/* Month header */}
            <h3 className="text-xl font-semibold text-zinc-100 mb-5 pb-2 border-b border-zinc-800">
              {monthKey}
            </h3>

            {/* Days grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-4">
              {days.map((day) => (
                <div
                  key={day.date.getTime()}
                  ref={(el) => {
                    dayRefs.current[day.date.getTime().toString()] = el;
                  }}
                  className="h-full"
                >
                  <DayCard
                    day={day}
                    isLowestDay={isLowestDay(day)}
                    onClick={() => setSelectedDay(day)}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Legend */}
        <div className="mt-8 pt-6 border-t border-zinc-800">
          <h4 className="text-sm font-semibold text-zinc-100 mb-3">
            Balance Status
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <LegendItem
              color="green"
              label="Safe"
              description={`${formatCurrency(thresholds.safe)}+`}
            />
            <LegendItem
              color="yellow"
              label="Caution"
              description={`${formatCurrency(thresholds.caution)}+`}
            />
            <LegendItem
              color="orange"
              label="Low"
              description={`${formatCurrency(thresholds.low)}+`}
            />
            <LegendItem
              color="red"
              label="Danger"
              description={`Below ${formatCurrency(thresholds.low)}`}
            />
          </div>
        </div>
      </div>

      {/* Day Detail Modal */}
      {selectedDay && (
        <DayDetailModal
          day={selectedDay}
          onClose={() => setSelectedDay(null)}
        />
      )}
    </>
  );
}


/**
 * LegendItem component - displays a single legend entry
 */
interface LegendItemProps {
  color: 'green' | 'yellow' | 'orange' | 'red';
  label: string;
  description: string;
}

function LegendItem({ color, label, description }: LegendItemProps) {
  const indicatorColors = {
    green: 'bg-emerald-500',
    yellow: 'bg-amber-400',
    orange: 'bg-orange-500',
    red: 'bg-rose-500',
  };

  const textColors = {
    green: 'text-emerald-700',
    yellow: 'text-amber-700',
    orange: 'text-orange-700',
    red: 'text-rose-700',
  };

  return (
    <div className="border border-zinc-800 rounded-lg p-3 bg-zinc-800">
      <div className="flex items-center gap-2 mb-1">
        <div className={cn('w-3 h-3 rounded-full', indicatorColors[color])} />
        <span className={cn('text-sm font-semibold', textColors[color])}>{label}</span>
      </div>
      <p className="text-xs text-zinc-400">{description}</p>
    </div>
  );
}

