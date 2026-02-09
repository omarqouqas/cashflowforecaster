import * as XLSX from 'xlsx';
import type { CsvParseResult } from './parse-csv';

/**
 * Parse an Excel file (.xlsx, .xls) into the same format as CSV parsing.
 * Uses the first sheet by default.
 *
 * Excel cells may contain:
 * - Formatted dates (Excel serial numbers)
 * - Formatted numbers (currency, percentages)
 * - Formulas (we extract the calculated value)
 *
 * All values are converted to strings to match CSV behavior.
 */
export function parseExcel(buffer: ArrayBuffer): CsvParseResult {
  // Read the workbook from the buffer
  // Use cellDates: true to get Date objects for date cells
  const workbook = XLSX.read(buffer, {
    type: 'array',
    cellDates: true,  // Parse dates as JS Date objects
  });

  // Get the first sheet
  const sheetName = workbook.SheetNames[0];
  if (!sheetName) {
    return { headers: [], rows: [] };
  }

  const worksheet = workbook.Sheets[sheetName];
  if (!worksheet) {
    return { headers: [], rows: [] };
  }

  // Convert sheet to array of arrays (preserves order, handles empty cells)
  // Use raw: true to get actual values (Date objects, numbers) instead of formatted strings
  const rawData: unknown[][] = XLSX.utils.sheet_to_json(worksheet, {
    header: 1,        // Return array of arrays instead of objects
    raw: true,        // Return raw values (Date objects, numbers) for proper handling
    defval: '',       // Default value for empty cells
    blankrows: false, // Skip blank rows
  });

  if (rawData.length === 0) {
    return { headers: [], rows: [] };
  }

  // First row is headers
  const headers = (rawData[0] ?? []).map((cell) => cellToString(cell).trim());

  // Rest are data rows
  const rows = rawData.slice(1).map((row) =>
    (row as unknown[]).map((cell) => cellToString(cell))
  );

  return { headers, rows };
}

/**
 * Convert any cell value to a string.
 * Handles dates, numbers, booleans, and existing strings.
 */
function cellToString(value: unknown): string {
  if (value === null || value === undefined) {
    return '';
  }

  // Handle Date objects (Excel dates parsed with cellDates: true)
  if (value instanceof Date) {
    // Check if it's a valid date
    if (Number.isNaN(value.getTime())) {
      return '';
    }
    // Format as YYYY-MM-DD for consistency with our date parsing
    const yyyy = value.getFullYear();
    const mm = String(value.getMonth() + 1).padStart(2, '0');
    const dd = String(value.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  // Handle numbers (preserve precision for amounts)
  if (typeof value === 'number') {
    // Check for NaN or Infinity
    if (!Number.isFinite(value)) {
      return '';
    }
    // For integers, return as-is
    if (Number.isInteger(value)) {
      return String(value);
    }
    // For decimals, use toFixed(2) for typical currency values
    // This avoids scientific notation for small values and floating point oddities
    // The amount parser can handle values like "123.45" or "123.4"
    return value.toFixed(2);
  }

  // Handle booleans
  if (typeof value === 'boolean') {
    return value ? 'true' : 'false';
  }

  // Handle strings and everything else
  return String(value);
}

/**
 * Check if a file is an Excel file based on extension
 */
export function isExcelFile(fileName: string): boolean {
  const lower = fileName.toLowerCase();
  return lower.endsWith('.xlsx') || lower.endsWith('.xls');
}

/**
 * Check if a file is a supported spreadsheet file (CSV or Excel)
 */
export function isSupportedSpreadsheet(fileName: string): boolean {
  const lower = fileName.toLowerCase();
  return lower.endsWith('.csv') || lower.endsWith('.xlsx') || lower.endsWith('.xls');
}
