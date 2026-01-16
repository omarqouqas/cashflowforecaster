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
          }}
          safetyBuffer={calendarData.safetyBuffer}
        />
      </div>

      {/* Mobile: Timeline Layout */}
      <div className="md:hidden">
        <CalendarContainer calendarData={calendarData} />
      </div>
    </>
  );
}
