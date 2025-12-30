export type CsvParseResult = {
  headers: string[];
  rows: string[][];
};

function detectDelimiter(sample: string): string {
  // Most US bank exports are comma-delimited. We support a couple fallbacks.
  const comma = (sample.match(/,/g) || []).length;
  const tab = (sample.match(/\t/g) || []).length;
  const semicolon = (sample.match(/;/g) || []).length;

  if (tab > comma && tab > semicolon) return '\t';
  if (semicolon > comma && semicolon > tab) return ';';
  return ',';
}

/**
 * Parse CSV into headers + rows.
 * - Handles quoted values, escaped quotes, and newlines inside quotes.
 * - Assumes first row is the header row.
 */
export function parseCsv(text: string): CsvParseResult {
  const normalized = text.replace(/^\uFEFF/, ''); // strip BOM
  const delimiter = detectDelimiter(normalized.slice(0, 2048));

  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let inQuotes = false;

  const pushField = () => {
    row.push(field);
    field = '';
  };

  const pushRow = () => {
    // skip fully empty trailing row
    const isEmptyRow = row.length === 1 && (row[0]?.trim() ?? '') === '';
    if (!isEmptyRow) rows.push(row);
    row = [];
  };

  for (let i = 0; i < normalized.length; i++) {
    const char = normalized[i];

    if (inQuotes) {
      if (char === '"') {
        const next = normalized[i + 1];
        if (next === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += char;
      }
      continue;
    }

    if (char === '"') {
      inQuotes = true;
      continue;
    }

    if (char === delimiter) {
      pushField();
      continue;
    }

    if (char === '\r') {
      // ignore
      continue;
    }

    if (char === '\n') {
      pushField();
      pushRow();
      continue;
    }

    field += char;
  }

  // flush last row
  pushField();
  pushRow();

  if (rows.length === 0) {
    return { headers: [], rows: [] };
  }

  const headers = (rows[0] ?? []).map((h) => h.trim());
  const dataRows = rows.slice(1);

  return { headers, rows: dataRows };
}

export type ColumnMapping = {
  dateIndex: number | null;
  descriptionIndex: number | null;
  amountIndex: number | null;
};

const DATE_HEADERS = [
  'date',
  'transaction date',
  'trans date',
  'posting date',
  'post date',
  'posted date',
];

const DESCRIPTION_HEADERS = [
  'description',
  'merchant',
  'name',
  'details',
  'memo',
  'transaction description',
];

const AMOUNT_HEADERS = [
  'amount',
  'transaction amount',
  'amt',
];

function normalizeHeader(h: string): string {
  return h.trim().toLowerCase().replace(/\s+/g, ' ');
}

function findFirstHeaderIndex(headers: string[], candidates: string[]): number | null {
  const normalized = headers.map(normalizeHeader);
  for (const cand of candidates) {
    const idx = normalized.indexOf(cand);
    if (idx !== -1) return idx;
  }
  return null;
}

export function detectColumnMapping(headers: string[]): ColumnMapping {
  const dateIndex = findFirstHeaderIndex(headers, DATE_HEADERS);
  const descriptionIndex = findFirstHeaderIndex(headers, DESCRIPTION_HEADERS);
  const amountIndex = findFirstHeaderIndex(headers, AMOUNT_HEADERS);

  return { dateIndex, descriptionIndex, amountIndex };
}

export function parseUsDateToIsoDate(value: string): string | null {
  const v = value.trim();
  if (!v) return null;

  // Common bank formats:
  // - MM/DD/YYYY
  // - YYYY-MM-DD
  // - MM/DD/YY
  const isoMatch = v.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (isoMatch) return v;

  const mdyMatch = v.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/);
  if (mdyMatch) {
    const mm = Number(mdyMatch[1]);
    const dd = Number(mdyMatch[2]);
    const yyRaw = Number(mdyMatch[3]);
    const yyyy = yyRaw < 100 ? 2000 + yyRaw : yyRaw;

    if (mm < 1 || mm > 12 || dd < 1 || dd > 31) return null;
    const mmStr = String(mm).padStart(2, '0');
    const ddStr = String(dd).padStart(2, '0');
    return `${yyyy}-${mmStr}-${ddStr}`;
  }

  // Fallback: let Date try. If it works, normalize to YYYY-MM-DD (local).
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return null;
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export function parseUsAmount(value: string): number | null {
  const raw = value.trim();
  if (!raw) return null;

  // Handle parentheses negatives: (12.34)
  const isParenNeg = raw.startsWith('(') && raw.endsWith(')');
  const cleaned = raw
    .replace(/[,$]/g, '')
    .replace(/^\(/, '')
    .replace(/\)$/, '')
    .replace(/\s+/g, '');

  // Some banks output +123.45 / -123.45
  const num = Number.parseFloat(cleaned);
  if (Number.isNaN(num)) return null;

  const signed = isParenNeg ? -Math.abs(num) : num;
  return Math.round(signed * 100) / 100;
}


