export type CashFlowEventType = 'purchase' | 'bill' | 'income';

export type CashFlowEvent = {
  type: CashFlowEventType;
  date: string; // YYYY-MM-DD (local date-only)
  label: string;
  amount: number; // positive for income, negative for outflow
};

export type AffordabilityInput = {
  currentBalance: number;
  purchaseAmount: number;
  purchaseDate: string; // YYYY-MM-DD
  nextIncome: {
    amount: number;
    date: string; // YYYY-MM-DD
  };
  upcomingBills: Array<{
    name?: string;
    amount: number;
    date: string; // YYYY-MM-DD
  }>;
};

export type TimelineDay = {
  date: string; // YYYY-MM-DD
  startingBalance: number;
  endingBalance: number;
  dayNet: number;
  events: CashFlowEvent[];
};

export type AffordabilityResult = {
  canAfford: boolean;
  startDate: string;
  endDate: string;
  currentBalance: number;
  purchaseAmount: number;
  lowestBalance: {
    amount: number;
    date: string;
  };
  timeline: TimelineDay[];
  // Extra info for UX
  overdraftDays: number;
};

function pad2(n: number) {
  return String(n).padStart(2, '0');
}

function localTodayDateOnly(): string {
  const d = new Date();
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

function dateOnlyToLocalDate(dateOnly: string): Date {
  // Parse as local noon to avoid timezone shifting and DST issues.
  const parts = dateOnly.split('-').map(Number);
  const year = parts[0] ?? 0;
  const month = parts[1] ?? 1;
  const day = parts[2] ?? 1;
  return new Date(year, month - 1, day, 12, 0, 0);
}

function localDateToDateOnly(d: Date): string {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

function addDaysDateOnly(dateOnly: string, days: number): string {
  const d = dateOnlyToLocalDate(dateOnly);
  d.setDate(d.getDate() + days);
  return localDateToDateOnly(d);
}

function cmpDateOnly(a: string, b: string): number {
  // YYYY-MM-DD is lexicographically sortable
  if (a === b) return 0;
  return a < b ? -1 : 1;
}

function clampNumber(n: number): number {
  // Avoid weird infinities / NaN leaking into UI.
  if (!Number.isFinite(n)) return 0;
  // Keep numbers reasonable; UI is not meant for extreme values.
  return Math.max(Math.min(n, 1_000_000_000), -1_000_000_000);
}

export function calculateAffordability(input: AffordabilityInput): AffordabilityResult {
  const today = localTodayDateOnly();
  const startDate = today;

  const purchaseAmount = clampNumber(input.purchaseAmount);
  const currentBalance = clampNumber(input.currentBalance);

  const bills: CashFlowEvent[] = (input.upcomingBills ?? [])
    .filter((b) => b && typeof b.date === 'string' && b.date.trim() && Number.isFinite(b.amount))
    .map((b, idx) => ({
      type: 'bill' as const,
      date: b.date,
      label: (b.name && b.name.trim()) || `Bill #${idx + 1}`,
      amount: -Math.abs(clampNumber(b.amount)),
    }));

  const income: CashFlowEvent[] = [
    {
      type: 'income' as const,
      date: input.nextIncome.date,
      label: 'Next income',
      amount: Math.abs(clampNumber(input.nextIncome.amount)),
    },
  ];

  const purchase: CashFlowEvent[] = [
    {
      type: 'purchase' as const,
      date: input.purchaseDate,
      label: 'Purchase',
      amount: -Math.abs(purchaseAmount),
    },
  ];

  const allEvents = [...purchase, ...bills, ...income].filter((e) => e.date && typeof e.date === 'string');
  const maxEventDate = allEvents.reduce((max, e) => (cmpDateOnly(e.date, max) > 0 ? e.date : max), today);

  // A little runway beyond the last event improves UX.
  const endDate = addDaysDateOnly(maxEventDate, 7);

  const byDate = new Map<string, CashFlowEvent[]>();
  for (const e of allEvents) {
    const key = e.date;
    const existing = byDate.get(key);
    if (existing) existing.push(e);
    else byDate.set(key, [e]);
  }

  const timeline: TimelineDay[] = [];
  let balance = currentBalance;
  let lowestAmount = balance;
  let lowestDate = today;
  let overdraftDays = 0;

  let cur = startDate;
  // Iterate inclusive
  while (cmpDateOnly(cur, endDate) <= 0) {
    const startingBalance = balance;
    const events = (byDate.get(cur) ?? []).slice();

    // Apply outflows first to model "worst point" risk.
    events.sort((a, b) => a.amount - b.amount);

    let dayNet = 0;
    let dayLow = balance;

    for (const e of events) {
      const amt = clampNumber(e.amount);
      dayNet += amt;
      balance = clampNumber(balance + amt);
      if (balance < dayLow) dayLow = balance;
    }

    if (dayLow < lowestAmount) {
      lowestAmount = dayLow;
      lowestDate = cur;
    }

    if (dayLow < 0) overdraftDays += 1;

    timeline.push({
      date: cur,
      startingBalance: clampNumber(startingBalance),
      endingBalance: clampNumber(balance),
      dayNet: clampNumber(dayNet),
      events,
    });

    cur = addDaysDateOnly(cur, 1);
  }

  const canAfford = lowestAmount >= 0;

  return {
    canAfford,
    startDate,
    endDate,
    currentBalance,
    purchaseAmount: Math.abs(purchaseAmount),
    lowestBalance: { amount: clampNumber(lowestAmount), date: lowestDate },
    timeline,
    overdraftDays,
  };
}

