export type PaymentTerms =
  | 'due_on_receipt'
  | 'net_7'
  | 'net_15'
  | 'net_30'
  | 'net_45'
  | 'net_60'
  | 'net_90'
  | 'custom';

export type ClientPaymentHistory = 'on_time' | 'usually_late' | 'very_late';

export type PaymentPredictorInput = {
  invoiceDate: string; // YYYY-MM-DD
  paymentTerms: PaymentTerms;
  customDays?: number;
  adjustForWeekends: boolean;
  clientHistory: ClientPaymentHistory;
  invoiceAmount?: number; // Optional, for display
  clientName?: string; // Optional, for display
};

export type PaymentPredictorResult = {
  expectedPaymentDate: string; // YYYY-MM-DD
  dayOfWeek: string; // "Tuesday"
  daysFromToday: number; // negative if past
  weeksFromToday: number;
  isPast: boolean;

  // Breakdown
  basePaymentDate: string; // invoiceDate + paymentTermsDays
  weekendAdjustmentDays: number;
  lateClientAdjustmentDays: number;
  totalDaysFromInvoice: number;

  // Original inputs for display
  invoiceDate: string;
  paymentTermsDays: number;
  paymentTermsLabel: string;
};

const PAYMENT_TERMS_DAYS: Record<PaymentTerms, number> = {
  due_on_receipt: 0,
  net_7: 7,
  net_15: 15,
  net_30: 30,
  net_45: 45,
  net_60: 60,
  net_90: 90,
  custom: 0,
};

const PAYMENT_TERMS_LABELS: Record<PaymentTerms, string> = {
  due_on_receipt: 'Due on Receipt',
  net_7: 'Net 7',
  net_15: 'Net 15',
  net_30: 'Net 30',
  net_45: 'Net 45',
  net_60: 'Net 60',
  net_90: 'Net 90',
  custom: 'Custom',
};

const CLIENT_HISTORY_DAYS: Record<ClientPaymentHistory, number> = {
  on_time: 0,
  usually_late: 7,
  very_late: 14,
};

function pad2(n: number) {
  return String(n).padStart(2, '0');
}

function dateOnlyToLocalDate(dateOnly: string): Date {
  // Parse as local midnight to avoid timezone shifting.
  return new Date(`${dateOnly}T00:00:00`);
}

function localDateToDateOnly(d: Date): string {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

function addDaysDateOnly(dateOnly: string, days: number): string {
  const d = dateOnlyToLocalDate(dateOnly);
  d.setDate(d.getDate() + days);
  return localDateToDateOnly(d);
}

function getDayOfWeek(dateOnly: string): string {
  const d = dateOnlyToLocalDate(dateOnly);
  return d.toLocaleDateString('en-US', { weekday: 'long' });
}

function isWeekend(dateOnly: string): boolean {
  const d = dateOnlyToLocalDate(dateOnly);
  const day = d.getDay();
  return day === 0 || day === 6;
}

function nextMondayDateOnly(dateOnly: string): { dateOnly: string; deltaDays: number } {
  const d = dateOnlyToLocalDate(dateOnly);
  const day = d.getDay();
  if (day === 6) {
    // Saturday -> Monday (+2)
    return { dateOnly: localDateToDateOnly(new Date(d.getFullYear(), d.getMonth(), d.getDate() + 2)), deltaDays: 2 };
  }
  if (day === 0) {
    // Sunday -> Monday (+1)
    return { dateOnly: localDateToDateOnly(new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1)), deltaDays: 1 };
  }
  return { dateOnly, deltaDays: 0 };
}

function daysBetweenDateOnly(a: string, b: string): number {
  // Compute using UTC day numbers to avoid DST issues.
  const aParts = a.split('-');
  const bParts = b.split('-');

  const ay = Number(aParts[0]);
  const am = Number(aParts[1]);
  const ad = Number(aParts[2]);

  const by = Number(bParts[0]);
  const bm = Number(bParts[1]);
  const bd = Number(bParts[2]);

  // Fall back to a sane epoch if parsing fails (should not happen for valid YYYY-MM-DD inputs).
  const aUtc = Date.UTC(
    Number.isFinite(ay) ? ay : 1970,
    (Number.isFinite(am) ? am : 1) - 1,
    Number.isFinite(ad) ? ad : 1
  );
  const bUtc = Date.UTC(
    Number.isFinite(by) ? by : 1970,
    (Number.isFinite(bm) ? bm : 1) - 1,
    Number.isFinite(bd) ? bd : 1
  );
  const oneDay = 24 * 60 * 60 * 1000;
  return Math.round((bUtc - aUtc) / oneDay);
}

function localTodayDateOnly(): string {
  const d = new Date();
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

export function calculatePaymentDate(input: PaymentPredictorInput): PaymentPredictorResult {
  const { invoiceDate, paymentTerms, customDays, adjustForWeekends, clientHistory } = input;

  const paymentTermsDays = paymentTerms === 'custom' ? Math.max(0, customDays ?? 0) : PAYMENT_TERMS_DAYS[paymentTerms];

  const basePaymentDate = addDaysDateOnly(invoiceDate, paymentTermsDays);

  let expectedPaymentDate = basePaymentDate;
  let weekendAdjustmentDays = 0;

  if (adjustForWeekends && isWeekend(expectedPaymentDate)) {
    const moved = nextMondayDateOnly(expectedPaymentDate);
    expectedPaymentDate = moved.dateOnly;
    weekendAdjustmentDays = moved.deltaDays;
  }

  const lateClientAdjustmentDays = CLIENT_HISTORY_DAYS[clientHistory] ?? 0;
  if (lateClientAdjustmentDays > 0) {
    expectedPaymentDate = addDaysDateOnly(expectedPaymentDate, lateClientAdjustmentDays);
  }

  const dayOfWeek = getDayOfWeek(expectedPaymentDate);
  const today = localTodayDateOnly();
  const daysFromToday = daysBetweenDateOnly(today, expectedPaymentDate);
  const weeksFromToday = Math.floor(Math.abs(daysFromToday) / 7);
  const isPast = daysFromToday < 0;

  const totalDaysFromInvoice = paymentTermsDays + weekendAdjustmentDays + lateClientAdjustmentDays;

  const paymentTermsLabel =
    paymentTerms === 'custom' ? `Net ${customDays ?? paymentTermsDays}` : PAYMENT_TERMS_LABELS[paymentTerms];

  return {
    expectedPaymentDate,
    dayOfWeek,
    daysFromToday,
    weeksFromToday,
    isPast,
    basePaymentDate,
    weekendAdjustmentDays,
    lateClientAdjustmentDays,
    totalDaysFromInvoice,
    invoiceDate,
    paymentTermsDays,
    paymentTermsLabel,
  };
}

// Helper for multiple invoices
export type InvoiceEntry = PaymentPredictorInput & {
  id: string;
  result?: PaymentPredictorResult;
};

export function sortInvoicesByPaymentDate(invoices: InvoiceEntry[]): InvoiceEntry[] {
  return [...invoices].sort((a, b) => {
    if (!a.result || !b.result) return 0;
    return a.result.expectedPaymentDate.localeCompare(b.result.expectedPaymentDate);
  });
}

