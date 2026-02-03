/**
 * YNAB CSV Parser
 *
 * Handles YNAB (You Need A Budget) CSV export formats:
 * - Basic: Date,Payee,Category,Memo,Outflow,Inflow
 * - Register: Account,Flag,Date,Payee,Category,Memo,Outflow,Inflow,Cleared
 */

import { parseCsv, parseUsAmount, parseUsDateToIsoDate } from './parse-csv';

export type YnabCsvFormat = 'basic' | 'register' | 'unknown';

export type YnabTransaction = {
  date: string; // ISO format YYYY-MM-DD
  payee: string; // Maps to description
  category: string | null;
  memo: string | null;
  amount: number; // Combined: Inflow positive, Outflow negative
  account: string | null; // Only in register format
  flag: string | null; // Only in register format
  cleared: string | null; // Only in register format
  rawRow: string[];
  rowIndex: number;
};

export type YnabParseError = {
  row: number;
  message: string;
};

export type YnabParseResult = {
  format: YnabCsvFormat;
  transactions: YnabTransaction[];
  errors: YnabParseError[];
};

// YNAB Basic format headers (case-insensitive)
const YNAB_BASIC_HEADERS = ['date', 'payee', 'category', 'memo', 'outflow', 'inflow'];

// YNAB Register format headers (case-insensitive)
const YNAB_REGISTER_HEADERS = ['account', 'flag', 'date', 'payee', 'category', 'memo', 'outflow', 'inflow', 'cleared'];

function normalizeHeader(h: string): string {
  return h.trim().toLowerCase().replace(/\s+/g, ' ');
}

function headersMatch(headers: string[], expected: string[]): boolean {
  if (headers.length < expected.length) return false;

  const normalized = headers.map(normalizeHeader);
  return expected.every((exp) => normalized.includes(exp));
}

/**
 * Detect if the headers match a YNAB export format
 */
export function detectYnabFormat(headers: string[]): YnabCsvFormat {
  // Check register format first (more specific)
  if (headersMatch(headers, YNAB_REGISTER_HEADERS)) {
    return 'register';
  }

  // Check basic format
  if (headersMatch(headers, YNAB_BASIC_HEADERS)) {
    return 'basic';
  }

  return 'unknown';
}

/**
 * Quick check if CSV looks like a YNAB export
 */
export function isYnabCsv(headers: string[]): boolean {
  return detectYnabFormat(headers) !== 'unknown';
}

/**
 * Get column indices for YNAB format
 */
function getYnabColumnIndices(headers: string[], format: YnabCsvFormat): {
  date: number;
  payee: number;
  category: number;
  memo: number;
  outflow: number;
  inflow: number;
  account: number | null;
  flag: number | null;
  cleared: number | null;
} | null {
  const normalized = headers.map(normalizeHeader);

  const dateIdx = normalized.indexOf('date');
  const payeeIdx = normalized.indexOf('payee');
  const categoryIdx = normalized.indexOf('category');
  const memoIdx = normalized.indexOf('memo');
  const outflowIdx = normalized.indexOf('outflow');
  const inflowIdx = normalized.indexOf('inflow');

  // Required columns
  if (dateIdx === -1 || payeeIdx === -1 || outflowIdx === -1 || inflowIdx === -1) {
    return null;
  }

  // Optional columns for register format
  const accountIdx = format === 'register' ? normalized.indexOf('account') : null;
  const flagIdx = format === 'register' ? normalized.indexOf('flag') : null;
  const clearedIdx = format === 'register' ? normalized.indexOf('cleared') : null;

  return {
    date: dateIdx,
    payee: payeeIdx,
    category: categoryIdx !== -1 ? categoryIdx : -1,
    memo: memoIdx !== -1 ? memoIdx : -1,
    outflow: outflowIdx,
    inflow: inflowIdx,
    account: accountIdx !== -1 ? accountIdx : null,
    flag: flagIdx !== -1 ? flagIdx : null,
    cleared: clearedIdx !== -1 ? clearedIdx : null,
  };
}

/**
 * Parse YNAB date with support for multiple formats
 * YNAB supports: MM/DD/YYYY, DD/MM/YYYY, YYYY-MM-DD
 */
function parseYnabDate(value: string): string | null {
  const v = value.trim();
  if (!v) return null;

  // Try existing parser first (handles MM/DD/YYYY, YYYY-MM-DD)
  const result = parseUsDateToIsoDate(v);
  if (result) return result;

  // Try DD/MM/YYYY format (common in non-US YNAB)
  // Heuristic: if first number > 12, assume DD/MM/YYYY
  const dmyMatch = v.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/);
  if (dmyMatch) {
    const first = Number(dmyMatch[1]);
    const second = Number(dmyMatch[2]);
    const yyRaw = Number(dmyMatch[3]);
    const yyyy = yyRaw < 100 ? 2000 + yyRaw : yyRaw;

    // If first > 12, it must be DD/MM
    if (first > 12) {
      const dd = first;
      const mm = second;
      if (mm < 1 || mm > 12 || dd < 1 || dd > 31) return null;
      const mmStr = String(mm).padStart(2, '0');
      const ddStr = String(dd).padStart(2, '0');
      return `${yyyy}-${mmStr}-${ddStr}`;
    }
  }

  return null;
}

/**
 * Combine Outflow and Inflow into a single signed amount
 * Inflow = positive (income)
 * Outflow = negative (expense)
 */
function combineOutflowInflow(outflowRaw: string, inflowRaw: string): number {
  const outflow = parseUsAmount(outflowRaw || '0') || 0;
  const inflow = parseUsAmount(inflowRaw || '0') || 0;

  // Inflow is positive, Outflow is negative
  return inflow - outflow;
}

/**
 * Suggest action (income or bill) based on YNAB category
 */
export function suggestActionFromCategory(category: string | null, amount: number): 'income' | 'bill' {
  // If no category, fall back to amount-based detection
  if (!category) {
    return amount >= 0 ? 'income' : 'bill';
  }

  const lowerCategory = category.toLowerCase();

  // Income categories
  const incomePatterns = [
    'income',
    'salary',
    'wages',
    'freelance',
    'consulting',
    'payment received',
    'inflow',
    'deposit',
    'refund',
    'reimbursement',
    'bonus',
    'dividend',
    'interest',
  ];

  for (const pattern of incomePatterns) {
    if (lowerCategory.includes(pattern)) {
      return 'income';
    }
  }

  // Default to amount-based detection
  return amount >= 0 ? 'income' : 'bill';
}

/**
 * Parse YNAB CSV export into transactions
 */
export function parseYnabCsv(text: string): YnabParseResult {
  const { headers, rows } = parseCsv(text);

  if (headers.length === 0) {
    return {
      format: 'unknown',
      transactions: [],
      errors: [{ row: 0, message: 'No headers found in CSV' }],
    };
  }

  const format = detectYnabFormat(headers);

  if (format === 'unknown') {
    return {
      format: 'unknown',
      transactions: [],
      errors: [{ row: 0, message: 'CSV does not match YNAB export format. Expected columns: Date, Payee, Category, Memo, Outflow, Inflow' }],
    };
  }

  const indices = getYnabColumnIndices(headers, format);

  if (!indices) {
    return {
      format,
      transactions: [],
      errors: [{ row: 0, message: 'Could not find required YNAB columns (Date, Payee, Outflow, Inflow)' }],
    };
  }

  const transactions: YnabTransaction[] = [];
  const errors: YnabParseError[] = [];

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    if (!row) continue;

    const rowNumber = i + 2; // +2 for header row + 1-indexed

    // Get raw values
    const dateRaw = row[indices.date] ?? '';
    const payeeRaw = row[indices.payee] ?? '';
    const categoryRaw = indices.category !== -1 ? (row[indices.category] ?? '') : '';
    const memoRaw = indices.memo !== -1 ? (row[indices.memo] ?? '') : '';
    const outflowRaw = row[indices.outflow] ?? '';
    const inflowRaw = row[indices.inflow] ?? '';

    // Parse date
    const date = parseYnabDate(dateRaw);
    if (!date) {
      errors.push({ row: rowNumber, message: `Invalid date: "${dateRaw}"` });
      continue;
    }

    // Parse payee (required)
    const payee = payeeRaw.trim();
    if (!payee) {
      errors.push({ row: rowNumber, message: 'Missing payee' });
      continue;
    }

    // Combine outflow/inflow
    const amount = combineOutflowInflow(outflowRaw, inflowRaw);

    // Skip zero-amount transactions (transfers often show as 0)
    if (amount === 0 && !outflowRaw.trim() && !inflowRaw.trim()) {
      continue;
    }

    // Build transaction
    const transaction: YnabTransaction = {
      date,
      payee,
      category: categoryRaw.trim() || null,
      memo: memoRaw.trim() || null,
      amount,
      account: indices.account !== null ? (row[indices.account] ?? '').trim() || null : null,
      flag: indices.flag !== null ? (row[indices.flag] ?? '').trim() || null : null,
      cleared: indices.cleared !== null ? (row[indices.cleared] ?? '').trim() || null : null,
      rawRow: row,
      rowIndex: i,
    };

    transactions.push(transaction);
  }

  return {
    format,
    transactions,
    errors,
  };
}
