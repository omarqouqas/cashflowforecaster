'use client';

import { useState, useRef } from 'react';
import { CalendarData, CalendarDay } from '@/lib/calendar/types';
import { format, differenceInDays } from 'date-fns';
import { formatCurrency } from '@/lib/utils/format';
import { cn } from '@/lib/utils';
import { DayCard } from './day-card';
import { DayDetailModal } from './day-detail-modal';
import { BalanceTrendChartInteractive } from './balance-trend-chart-interactive';
import { StickyCalendarHeader } from './sticky-header';
import { TrendingUp, AlertCircle } from 'lucide-react';

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

  // Find next income in the next 14 days
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const next14Days = calendarData.days.filter(day => {
    const dayDate = new Date(day.date);
    dayDate.setHours(0, 0, 0, 0);
    const diff = differenceInDays(dayDate, today);
    return diff >= 0 && diff <= 14;
  });

  const nextIncome = next14Days.find(day => day.income.length > 0);
  const nextIncomeAmount = nextIncome?.income.reduce((sum, inc) => sum + inc.amount, 0) ?? 0;
  const daysUntilIncome = nextIncome ? differenceInDays(new Date(nextIncome.date), today) : null;

  // Find urgent bills (next 7 days)
  const next7Days = calendarData.days.filter(day => {
    const dayDate = new Date(day.date);
    dayDate.setHours(0, 0, 0, 0);
    const diff = differenceInDays(dayDate, today);
    return diff >= 0 && diff <= 7;
  });

  const urgentBills = next7Days.filter(day => day.bills.length > 0);
  const urgentBillsCount = urgentBills.reduce((sum, day) => sum + day.bills.length, 0);
  const urgentBillsTotal = urgentBills.reduce((sum, day) =>
    sum + day.bills.reduce((s, bill) => s + bill.amount, 0), 0
  );

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
        safetyBuffer={buffer}
        onDayClick={handleChartDayClick}
      />

      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 sm:p-4 mt-4">
        {/* Summary Section - What to know at a glance */}
        <div className="mb-6 pb-6 border-b border-zinc-800">
          <h4 className="text-sm font-semibold text-zinc-100 mb-3">
            Quick Summary
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Next Income */}
            {nextIncome && daysUntilIncome !== null ? (
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <p className="text-xs font-medium text-emerald-300 uppercase tracking-wide">
                    Next Income
                  </p>
                </div>
                <p className="text-lg font-bold text-emerald-400 tabular-nums">
                  {formatCurrency(nextIncomeAmount, currency)}
                </p>
                <p className="text-xs text-emerald-300/80 mt-0.5">
                  {daysUntilIncome === 0 ? 'Today' : `in ${daysUntilIncome} day${daysUntilIncome === 1 ? '' : 's'}`}
                  {' • '}
                  {format(nextIncome.date, 'MMM d')}
                </p>
              </div>
            ) : (
              <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="w-4 h-4 text-zinc-400" />
                  <p className="text-xs font-medium text-zinc-400 uppercase tracking-wide">
                    Next Income
                  </p>
                </div>
                <p className="text-sm text-zinc-500">
                  No income in next 14 days
                </p>
              </div>
            )}

            {/* Urgent Bills */}
            {urgentBillsCount > 0 ? (
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <AlertCircle className="w-4 h-4 text-amber-400" />
                  <p className="text-xs font-medium text-amber-300 uppercase tracking-wide">
                    Bills This Week
                  </p>
                </div>
                <p className="text-lg font-bold text-amber-400 tabular-nums">
                  {urgentBillsCount} bill{urgentBillsCount === 1 ? '' : 's'}
                </p>
                <p className="text-xs text-amber-300/80 mt-0.5">
                  {formatCurrency(urgentBillsTotal, currency)} total
                </p>
              </div>
            ) : (
              <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <AlertCircle className="w-4 h-4 text-zinc-400" />
                  <p className="text-xs font-medium text-zinc-400 uppercase tracking-wide">
                    Bills This Week
                  </p>
                </div>
                <p className="text-sm text-zinc-500">
                  No bills in next 7 days
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Legend - Moved to top */}
        <div className="mb-8 pb-6 border-b border-zinc-800">
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

        {/* Month sections */}
        {Object.entries(daysByMonth).map(([monthKey, days], index) => (
          <div
            key={monthKey}
            className="mb-8 last:mb-0 animate-fadeIn"
            style={{
              animationDelay: `${index * 100}ms`,
              animationFillMode: 'backwards'
            }}
          >
            {/* Month header */}
            <h3 className="text-lg font-semibold text-zinc-100 mb-4 pb-1.5 border-b border-zinc-800">
              {monthKey}
            </h3>

            {/* Days grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 2xl:grid-cols-8 gap-3">
              {days.map((day) => {
                // Find the previous day's balance from all days, not just this month
                const globalDayIndex = calendarData.days.findIndex(d => d.date.getTime() === day.date.getTime());
                const previousDayBalance = globalDayIndex > 0
                  ? calendarData.days[globalDayIndex - 1]?.balance ?? calendarData.startingBalance
                  : calendarData.startingBalance;

                return (
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
                      previousDayBalance={previousDayBalance}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        ))}
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

