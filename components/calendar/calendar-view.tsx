'use client';

import { useState } from 'react';
import { CalendarData, CalendarDay } from '@/lib/calendar/types';
import { format } from 'date-fns';
import { formatCurrency } from '@/lib/utils/format';
import { cn } from '@/lib/utils';
import { DayCard } from './day-card';
import { DayDetailModal } from './day-detail-modal';

interface CalendarViewProps {
  calendarData: CalendarData;
  safetyBuffer?: number;
}

/**
 * CalendarView component - displays the 60-day calendar grid
 * 
 * Groups days by month and displays them in a responsive grid.
 * Clicking a day opens a detail modal.
 */
export function CalendarView({ calendarData, safetyBuffer }: CalendarViewProps) {
  const [selectedDay, setSelectedDay] = useState<CalendarDay | null>(null);

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

  return (
    <>
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-6">
        {/* Month sections */}
        {Object.entries(daysByMonth).map(([monthKey, days]) => (
          <div key={monthKey} className="mb-8 last:mb-0">
            {/* Month header */}
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
              {monthKey}
            </h3>

            {/* Days grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-3">
              {days.map((day) => (
                <DayCard
                  key={day.date.getTime()}
                  day={day}
                  isLowestDay={isLowestDay(day)}
                  onClick={() => setSelectedDay(day)}
                />
              ))}
            </div>
          </div>
        ))}

        {/* Legend */}
        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
          <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">
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
  const colorClasses = {
    green: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
    yellow: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
    orange: 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800',
    red: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
  };

  const indicatorColors = {
    green: 'bg-green-500 dark:bg-green-400',
    yellow: 'bg-yellow-500 dark:bg-yellow-400',
    orange: 'bg-orange-500 dark:bg-orange-400',
    red: 'bg-red-500 dark:bg-red-400',
  };

  const textColors = {
    green: 'text-green-700 dark:text-green-300',
    yellow: 'text-yellow-700 dark:text-yellow-300',
    orange: 'text-orange-700 dark:text-orange-300',
    red: 'text-red-700 dark:text-red-300',
  };

  return (
    <div className={cn('border rounded-lg p-3', colorClasses[color])}>
      <div className="flex items-center gap-2 mb-1">
        <div className={cn('w-3 h-3 rounded-full', indicatorColors[color])} />
        <span className={cn('text-sm font-semibold', textColors[color])}>{label}</span>
      </div>
      <p className="text-xs text-slate-600 dark:text-slate-400">{description}</p>
    </div>
  );
}

