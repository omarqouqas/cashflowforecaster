// lib/export/generators/excel-generator.ts
// ============================================
// Excel (.xlsx) Export Generator
// Requires Pro subscription
// ============================================

import * as XLSX from 'xlsx';

/**
 * Generate an Excel workbook with a single sheet
 */
export function generateExcel(
  data: Record<string, unknown>[],
  sheetName: string = 'Export'
): Buffer {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  // Generate buffer
  const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
  return buffer;
}

/**
 * Generate an Excel workbook with multiple sheets
 * Great for "All Data" exports where each data type gets its own sheet
 */
export function generateMultiSheetExcel(
  sheets: Array<{
    name: string;
    data: Record<string, unknown>[];
    columns?: Array<{ key: string; label: string }>;
  }>
): Buffer {
  const workbook = XLSX.utils.book_new();

  for (const sheet of sheets) {
    if (sheet.data.length === 0) continue;

    // If columns provided, reorder/rename the data
    let sheetData = sheet.data;
    if (sheet.columns) {
      sheetData = sheet.data.map((row) => {
        const newRow: Record<string, unknown> = {};
        for (const col of sheet.columns!) {
          newRow[col.label] = row[col.key];
        }
        return newRow;
      });
    }

    const worksheet = XLSX.utils.json_to_sheet(sheetData);

    // Auto-size columns (approximate)
    const colWidths = getColumnWidths(sheetData);
    worksheet['!cols'] = colWidths;

    // Sanitize sheet name (max 31 chars, no special chars)
    const safeName = sheet.name.slice(0, 31).replace(/[\\/*?[\]]/g, '');
    XLSX.utils.book_append_sheet(workbook, worksheet, safeName);
  }

  const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
  return buffer;
}

/**
 * Calculate approximate column widths based on content
 */
function getColumnWidths(data: Record<string, unknown>[]): Array<{ wch: number }> {
  if (data.length === 0) return [];

  const firstRow = data[0];
  if (!firstRow) return [];

  const keys = Object.keys(firstRow);

  return keys.map((key) => {
    // Start with header length
    let maxWidth = key.length;

    // Check each row's value length
    for (const row of data) {
      const value = row[key];
      const strValue = value === null || value === undefined ? '' : String(value);
      maxWidth = Math.max(maxWidth, strValue.length);
    }

    // Cap at reasonable max and add padding
    return { wch: Math.min(maxWidth + 2, 50) };
  });
}

/**
 * Generate a formatted Monthly Summary Excel report
 */
export function generateMonthlySummaryExcel(
  summaryData: Record<string, unknown>[],
  totals: { totalIncome: number; totalExpenses: number; netCashFlow: number }
): Buffer {
  const workbook = XLSX.utils.book_new();

  // Main summary sheet
  const summarySheet = XLSX.utils.json_to_sheet(summaryData);
  summarySheet['!cols'] = getColumnWidths(summaryData);
  XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');

  // Totals sheet
  const totalsData = [
    { Metric: 'Total Monthly Income', Amount: totals.totalIncome.toFixed(2) },
    { Metric: 'Total Monthly Expenses', Amount: totals.totalExpenses.toFixed(2) },
    { Metric: 'Net Cash Flow', Amount: totals.netCashFlow.toFixed(2) },
  ];
  const totalsSheet = XLSX.utils.json_to_sheet(totalsData);
  totalsSheet['!cols'] = [{ wch: 25 }, { wch: 15 }];
  XLSX.utils.book_append_sheet(workbook, totalsSheet, 'Totals');

  return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
}

/**
 * Generate a formatted Category Spending Excel report
 */
export function generateCategorySpendingExcel(
  categoryData: Record<string, unknown>[],
  totalSpending: number
): Buffer {
  const workbook = XLSX.utils.book_new();

  // Category breakdown sheet
  const categorySheet = XLSX.utils.json_to_sheet(categoryData);
  categorySheet['!cols'] = getColumnWidths(categoryData);
  XLSX.utils.book_append_sheet(workbook, categorySheet, 'By Category');

  // Summary sheet
  const summaryData = [
    { Metric: 'Total Monthly Spending', Amount: totalSpending.toFixed(2) },
    { Metric: 'Number of Categories', Amount: categoryData.length - 1 }, // Exclude total row
  ];
  const summarySheet = XLSX.utils.json_to_sheet(summaryData);
  summarySheet['!cols'] = [{ wch: 25 }, { wch: 15 }];
  XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');

  return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
}
