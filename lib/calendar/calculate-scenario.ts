import type { CalendarData } from './types';
import { LOW_BALANCE_THRESHOLD } from './constants';
import { getNextMonthlyDate, isSameDay, normalizeToNoon } from './utils';

export interface ScenarioResult {
  canAfford: boolean;
  lowestBalance: number;
  previousLowest: number;
  lowestDate: Date;
  causesOverdraft: boolean;
  causesLowBalance: boolean;
  firstProblemDay: Date | null;
  impactSummary: string;
}

export type ScenarioFrequency = 'one-time' | 'monthly';

export interface ScenarioExpenseInput {
  name?: string;
  amount: number;
  date: Date;
  frequency?: ScenarioFrequency;
}

export interface ScenarioPreviewDay {
  date: Date;
  baselineBalance: number;
  scenarioBalance: number;
  delta: number; // baseline - scenario
}

function dateKey(d: Date): string {
  // Use local calendar day key (not UTC) to match the rest of lib/calendar's noon-based dates.
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function getOccurrenceDatesInRange(params: {
  start: Date;
  end: Date;
  frequency: ScenarioFrequency;
}): Date[] {
  const start = normalizeToNoon(params.start);
  const end = normalizeToNoon(params.end);

  if (params.frequency === 'one-time') {
    return start <= end ? [start] : [];
  }

  const occurrences: Date[] = [];
  const targetDay = start.getDate();
  let current = start;

  while (current <= end) {
    occurrences.push(new Date(current));
    current = getNextMonthlyDate(current, targetDay);
  }

  return occurrences;
}

/**
 * Overlays a hypothetical expense onto an existing `CalendarData` projection and returns
 * the scenario impact result plus a small preview series for visualization.
 *
 * This function is pure (no DB access) and assumes `calendarData.days` are in chronological order.
 */
export function calculateScenario(calendarData: CalendarData, input: ScenarioExpenseInput): {
  result: ScenarioResult;
  preview: ScenarioPreviewDay[];
} {
  const amount = input.amount;
  if (!Number.isFinite(amount) || amount <= 0) {
    const today = calendarData.days[0]?.date ?? new Date();
    return {
      result: {
        canAfford: false,
        lowestBalance: calendarData.lowestBalance,
        previousLowest: calendarData.lowestBalance,
        lowestDate: new Date(today),
        causesOverdraft: false,
        causesLowBalance: false,
        firstProblemDay: null,
        impactSummary: 'Please enter a valid amount.',
      },
      preview: [],
    };
  }

  const days = calendarData.days ?? [];
  if (days.length === 0) {
    const now = new Date();
    return {
      result: {
        canAfford: false,
        lowestBalance: 0,
        previousLowest: 0,
        lowestDate: now,
        causesOverdraft: false,
        causesLowBalance: false,
        firstProblemDay: null,
        impactSummary: 'No calendar data available to calculate impact.',
      },
      preview: [],
    };
  }

  const calendarEnd = normalizeToNoon(days[days.length - 1]!.date);

  const expenseDate = normalizeToNoon(input.date);
  const frequency: ScenarioFrequency = input.frequency ?? 'one-time';

  // If it's outside the forecast window, we still compute with the closest behavior:
  // - occurrences before the calendar start won't impact the displayed range
  // - occurrences after the calendar end won't impact the displayed range
  const occurrences = getOccurrenceDatesInRange({
    start: expenseDate,
    end: calendarEnd,
    frequency,
  });

  const indexByDayKey = new Map<string, number>();
  for (let i = 0; i < days.length; i++) {
    indexByDayKey.set(dateKey(days[i]!.date), i);
  }

  // delta[i] = total extra bill amount applied on that day (positive number),
  // which reduces the balance for that day and all following days via cumulative sum.
  const delta: number[] = new Array(days.length).fill(0);
  for (const occ of occurrences) {
    const idx = indexByDayKey.get(dateKey(occ));
    if (idx == null) continue;
    delta[idx] = (delta[idx] ?? 0) + amount;
  }

  let runningExtra = 0;
  let lowestBalance = Number.POSITIVE_INFINITY;
  let lowestDate = new Date(days[0]!.date);
  let firstProblemDay: Date | null = null;
  let causesOverdraft = false;
  let causesLowBalance = false;

  // Small "preview" window: 7-day slice around the lowest day (or first problem day).
  // We'll compute indices first, then build after we've found the anchor index.
  const scenarioBalances: number[] = new Array(days.length).fill(0);

  for (let i = 0; i < days.length; i++) {
    runningExtra += delta[i] ?? 0;
    const baseline = days[i]!.balance;
    const scenarioBalance = baseline - runningExtra;
    scenarioBalances[i] = scenarioBalance;

    if (scenarioBalance < lowestBalance) {
      lowestBalance = scenarioBalance;
      lowestDate = new Date(days[i]!.date);
    }

    if (scenarioBalance < 0) causesOverdraft = true;
    if (scenarioBalance < LOW_BALANCE_THRESHOLD) causesLowBalance = true;

    if (!firstProblemDay && scenarioBalance < LOW_BALANCE_THRESHOLD) {
      firstProblemDay = new Date(days[i]!.date);
    }
  }

  // Fallback in case something went sideways.
  if (!Number.isFinite(lowestBalance)) {
    lowestBalance = days[0]!.balance;
    lowestDate = new Date(days[0]!.date);
  }

  const canAfford = firstProblemDay == null;

  // Prefer the calendar's computed "previous lowest" but fall back to scanning.
  const previousLowest =
    Number.isFinite(calendarData.lowestBalance) ? calendarData.lowestBalance : Math.min(...days.map((d) => d.balance));

  const impactSummary = (() => {
    const dateLabel = lowestDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    if (canAfford) {
      return `Lowest balance would be ${lowestBalance.toFixed(2)} on ${dateLabel}.`;
    }
    if (causesOverdraft) {
      const when = firstProblemDay
        ? firstProblemDay.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        : dateLabel;
      return `This would cause an overdraft risk starting ${when}. Lowest balance would be ${lowestBalance.toFixed(2)} on ${dateLabel}.`;
    }
    return `This would push your balance below ${LOW_BALANCE_THRESHOLD.toFixed(0)} starting ${
      firstProblemDay
        ? firstProblemDay.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        : dateLabel
    }. Lowest balance would be ${lowestBalance.toFixed(2)} on ${dateLabel}.`;
  })();

  // Anchor preview around first problem day, else around lowest day.
  const anchorIndex = (() => {
    if (firstProblemDay) {
      const idx = days.findIndex((d) => isSameDay(d.date, firstProblemDay));
      if (idx >= 0) return idx;
    }
    const idx = days.findIndex((d) => isSameDay(d.date, lowestDate));
    return idx >= 0 ? idx : 0;
  })();

  const startIdx = Math.max(0, anchorIndex - 3);
  const endIdx = Math.min(days.length - 1, anchorIndex + 3);
  const preview: ScenarioPreviewDay[] = [];
  for (let i = startIdx; i <= endIdx; i++) {
    preview.push({
      date: new Date(days[i]!.date),
      baselineBalance: days[i]!.balance,
      scenarioBalance: scenarioBalances[i]!,
      delta: days[i]!.balance - scenarioBalances[i]!,
    });
  }

  return {
    result: {
      canAfford,
      lowestBalance,
      previousLowest,
      lowestDate,
      causesOverdraft,
      causesLowBalance,
      firstProblemDay,
      impactSummary,
    },
    preview,
  };
}


