'use client';

import { CalendarView } from './calendar-view';
import { CalendarContainer } from './calendar-container';
import type { CalendarContainerProps } from './calendar-container';

/**
 * CalendarHybridView - Responsive calendar layout
 *
 * Desktop (≥ md): Grid layout with month grouping
 * Mobile (< md): Timeline vertical scrolling layout
 *
 * Provides the best experience for each screen size.
 */
export function CalendarHybridView({ calendarData }: CalendarContainerProps) {
  // Calculate required props for sticky header
  const lowestIn14Days = Math.min(
    ...calendarData.days.slice(0, 14).map((d) => d.balance)
  );

  const totalIncome = calendarData.days
    .reduce((sum, day) => sum + day.income.reduce((s, t) => s + t.amount, 0), 0);

  const totalBills = calendarData.days
    .reduce((sum, day) => sum + day.bills.reduce((s, t) => s + t.amount, 0), 0);

  const endingBalance = calendarData.days[calendarData.days.length - 1]?.balance ?? calendarData.startingBalance;

  return (
    <>
      {/* Desktop: Grid Layout */}
      <div className="hidden md:block">
        <CalendarView
          calendarData={{
            days: calendarData.days,
            startingBalance: calendarData.startingBalance,
            lowestBalance: calendarData.lowestBalance,
            lowestBalanceDay: calendarData.lowestBalanceDate,
            safeToSpend: calendarData.safeToSpend,
            collisions: calendarData.collisions,
          }}
          safetyBuffer={calendarData.safetyBuffer}
          lowestIn14Days={lowestIn14Days}
          totalIncome={totalIncome}
          totalBills={totalBills}
          endingBalance={endingBalance}
        />
      </div>

      {/* Mobile: Timeline Layout */}
      <div className="md:hidden">
        <CalendarContainer calendarData={calendarData} />
      </div>
    </>
  );
}
