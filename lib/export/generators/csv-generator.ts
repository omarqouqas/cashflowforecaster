// lib/export/generators/csv-generator.ts
// ============================================
// CSV Export Generator
// ============================================

/**
 * Escape a value for CSV format
 * - Wraps in quotes if contains comma, quote, or newline
 * - Escapes quotes by doubling them
 */
function escapeCSV(value: unknown): string {
  if (value === null || value === undefined) {
    return '';
  }

  const str = String(value);

  // Check if value needs escaping
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    // Escape quotes by doubling them and wrap in quotes
    return `"${str.replace(/"/g, '""')}"`;
  }

  return str;
}

/**
 * Generate CSV from an array of objects
 * @param data - Array of objects to convert
 * @param columns - Optional column configuration. If not provided, uses keys from first object
 * @returns CSV string
 */
export function generateCSV(
  data: Record<string, unknown>[],
  columns?: Array<{ key: string; label: string }>
): string {
  if (data.length === 0) {
    return '';
  }

  // Determine columns
  const firstRow = data[0];
  const cols = columns ?? (firstRow ? Object.keys(firstRow).map((key) => ({ key, label: key })) : []);

  // Header row
  const header = cols.map((col) => escapeCSV(col.label)).join(',');

  // Data rows
  const rows = data.map((row) =>
    cols.map((col) => escapeCSV(row[col.key])).join(',')
  );

  return [header, ...rows].join('\n');
}

/**
 * Generate multi-sheet CSV (multiple CSVs concatenated with section headers)
 * Useful for "All Data" exports
 */
export function generateMultiSectionCSV(
  sections: Array<{
    title: string;
    data: Record<string, unknown>[];
    columns?: Array<{ key: string; label: string }>;
  }>
): string {
  const parts: string[] = [];

  for (const section of sections) {
    if (section.data.length === 0) continue;

    // Section header
    parts.push(`# ${section.title}`);
    parts.push('');

    // CSV content
    const csv = generateCSV(section.data, section.columns);
    parts.push(csv);
    parts.push('');
    parts.push('');
  }

  return parts.join('\n');
}

// Column configurations for different data types

export const BILLS_COLUMNS = [
  { key: 'name', label: 'Name' },
  { key: 'amount', label: 'Amount' },
  { key: 'frequency', label: 'Frequency' },
  { key: 'category', label: 'Category' },
  { key: 'due_date', label: 'Due Date' },
  { key: 'is_active', label: 'Active' },
];

export const INCOME_COLUMNS = [
  { key: 'name', label: 'Name' },
  { key: 'amount', label: 'Amount' },
  { key: 'frequency', label: 'Frequency' },
  { key: 'next_date', label: 'Next Date' },
  { key: 'is_active', label: 'Active' },
];

export const ACCOUNTS_COLUMNS = [
  { key: 'name', label: 'Name' },
  { key: 'account_type', label: 'Type' },
  { key: 'current_balance', label: 'Balance' },
  { key: 'currency', label: 'Currency' },
  { key: 'is_spendable', label: 'Spendable' },
];

export const INVOICES_COLUMNS = [
  { key: 'invoice_number', label: 'Invoice #' },
  { key: 'client_name', label: 'Client' },
  { key: 'amount', label: 'Amount' },
  { key: 'due_date', label: 'Due Date' },
  { key: 'status', label: 'Status' },
];

export const FORECAST_COLUMNS = [
  { key: 'date', label: 'Date' },
  { key: 'balance', label: 'Balance' },
  { key: 'income', label: 'Income' },
  { key: 'expenses', label: 'Expenses' },
  { key: 'transactions', label: 'Transactions' },
];

export const MONTHLY_SUMMARY_COLUMNS = [
  { key: 'category', label: 'Category' },
  { key: 'type', label: 'Type' },
  { key: 'name', label: 'Name' },
  { key: 'amount', label: 'Amount' },
  { key: 'frequency', label: 'Frequency' },
  { key: 'monthly_equivalent', label: 'Monthly Equivalent' },
];

export const CATEGORY_SPENDING_COLUMNS = [
  { key: 'category', label: 'Category' },
  { key: 'amount', label: 'Total Amount' },
  { key: 'percentage', label: 'Percentage' },
  { key: 'bill_count', label: 'Number of Bills' },
];
