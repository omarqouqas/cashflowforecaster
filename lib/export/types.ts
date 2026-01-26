// lib/export/types.ts
// ============================================
// TypeScript types for Reports & Export feature
// ============================================

export type ExportFormat = 'csv' | 'excel' | 'pdf' | 'json';

export type ReportType =
  | 'monthly_summary'
  | 'category_spending'
  | 'cash_forecast'
  | 'all_data'
  | 'custom';

export type DataInclude =
  | 'bills'
  | 'income'
  | 'accounts'
  | 'forecast'
  | 'transactions'
  | 'invoices';

export type ExportStatus = 'pending' | 'processing' | 'completed' | 'failed';

// Date range configuration
export interface DateRange {
  start: string; // ISO date string (YYYY-MM-DD)
  end: string;   // ISO date string (YYYY-MM-DD)
  preset?: DateRangePreset;
}

export type DateRangePreset =
  | 'this_month'
  | 'last_month'
  | 'last_30_days'
  | 'last_90_days'
  | 'this_quarter'
  | 'last_quarter'
  | 'this_year'
  | 'custom';

// Export configuration (stored in JSONB)
export interface ExportConfig {
  reportType: ReportType;
  format: ExportFormat;
  dateRange: DateRange;
  includes: DataInclude[];
  filters?: ExportFilters;
}

export interface ExportFilters {
  categories?: string[];
  statuses?: string[];
  accountIds?: string[];
  frequencies?: string[];
}

// Live preview data shown before export
export interface ExportPreview {
  rowCount: number;
  columns: string[];
  sampleData: Record<string, unknown>[];
  estimatedFileSize: string;
  warnings?: string[];
}

// Quick report card definition
export interface QuickReport {
  id: ReportType;
  name: string;
  description: string;
  icon: string; // Lucide icon name
  requiredTier: 'free' | 'pro';
  defaultConfig: Partial<ExportConfig>;
}

// Export history item (from database)
export interface ExportHistoryItem {
  id: string;
  user_id: string;
  name: string;
  report_type: ReportType;
  format: ExportFormat;
  config: ExportConfig;
  file_url: string | null;
  file_size_bytes: number | null;
  row_count: number | null;
  status: ExportStatus;
  error_message: string | null;
  created_at: string;
  completed_at: string | null;
  expires_at: string;
}

// API request/response types
export interface GenerateExportRequest {
  config: ExportConfig;
  name?: string; // Optional custom name, auto-generated if not provided
}

export interface GenerateExportResponse {
  exportId: string;
  status: ExportStatus;
}

export interface ExportPreviewRequest {
  config: ExportConfig;
}

// Report-specific data structures

export interface MonthlySummaryData {
  period: {
    start: string;
    end: string;
    label: string; // e.g., "January 2026"
  };
  income: {
    total: number;
    sources: Array<{
      name: string;
      amount: number;
      frequency: string;
      monthlyEquivalent: number;
    }>;
  };
  expenses: {
    total: number;
    bills: Array<{
      name: string;
      amount: number;
      frequency: string;
      category: string;
      monthlyEquivalent: number;
    }>;
  };
  netCashFlow: number;
  categoryBreakdown: Array<{
    category: string;
    amount: number;
    percentage: number;
  }>;
  accounts: Array<{
    name: string;
    balance: number;
    type: string;
  }>;
  totalBalance: number;
}

export interface CategorySpendingData {
  period: {
    start: string;
    end: string;
    label: string;
  };
  categories: Array<{
    category: string;
    amount: number;
    percentage: number;
    billCount: number;
    bills: Array<{
      name: string;
      amount: number;
      frequency: string;
    }>;
  }>;
  totalSpending: number;
}

export interface CashForecastData {
  period: {
    start: string;
    end: string;
    days: number;
  };
  startingBalance: number;
  projectedEndBalance: number;
  lowestBalance: number;
  lowestBalanceDate: string;
  safeToSpend: number;
  dailyProjections: Array<{
    date: string;
    balance: number;
    income: number;
    expenses: number;
    transactions: Array<{
      name: string;
      amount: number;
      type: 'income' | 'expense';
    }>;
  }>;
}

export interface AllDataExport {
  exportedAt: string;
  version: string;
  accounts: Array<{
    id: string;
    name: string;
    type: string;
    balance: number;
    currency: string;
    isSpendable: boolean;
  }>;
  bills: Array<{
    id: string;
    name: string;
    amount: number;
    dueDate: string;
    frequency: string;
    category: string;
    isActive: boolean;
  }>;
  income: Array<{
    id: string;
    name: string;
    amount: number;
    nextDate: string;
    frequency: string;
    isActive: boolean;
  }>;
  invoices?: Array<{
    id: string;
    invoiceNumber: string;
    clientName: string;
    amount: number;
    dueDate: string;
    status: string;
  }>;
  settings: {
    safetyBuffer: number;
    timezone: string | null;
    taxRate: number;
    taxTrackingEnabled: boolean;
  };
}

// Constants

export const REPORT_TYPES: QuickReport[] = [
  {
    id: 'monthly_summary',
    name: 'Monthly Summary',
    description: 'Income vs expenses, net cash flow, category breakdown',
    icon: 'BarChart3',
    requiredTier: 'free',
    defaultConfig: {
      reportType: 'monthly_summary',
      format: 'csv',
      includes: ['bills', 'income', 'accounts'],
    },
  },
  {
    id: 'category_spending',
    name: 'Category Spending',
    description: 'Breakdown by category with percentages',
    icon: 'PieChart',
    requiredTier: 'free',
    defaultConfig: {
      reportType: 'category_spending',
      format: 'csv',
      includes: ['bills'],
    },
  },
  {
    id: 'cash_forecast',
    name: 'Cash Forecast',
    description: 'Daily projected balances for forecast period',
    icon: 'TrendingUp',
    requiredTier: 'pro',
    defaultConfig: {
      reportType: 'cash_forecast',
      format: 'csv',
      includes: ['bills', 'income', 'accounts', 'forecast'],
    },
  },
  {
    id: 'all_data',
    name: 'All Data',
    description: 'Complete backup of all your data',
    icon: 'Database',
    requiredTier: 'pro',
    defaultConfig: {
      reportType: 'all_data',
      format: 'json',
      includes: ['bills', 'income', 'accounts', 'invoices'],
    },
  },
];

export const DATE_RANGE_PRESETS: Array<{
  id: DateRangePreset;
  label: string;
  getRange: () => DateRange;
}> = [
  {
    id: 'this_month',
    label: 'This Month',
    getRange: (): DateRange => {
      const now = new Date();
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      return {
        start: start.toISOString().split('T')[0] ?? '',
        end: end.toISOString().split('T')[0] ?? '',
        preset: 'this_month',
      };
    },
  },
  {
    id: 'last_month',
    label: 'Last Month',
    getRange: (): DateRange => {
      const now = new Date();
      const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const end = new Date(now.getFullYear(), now.getMonth(), 0);
      return {
        start: start.toISOString().split('T')[0] ?? '',
        end: end.toISOString().split('T')[0] ?? '',
        preset: 'last_month',
      };
    },
  },
  {
    id: 'last_30_days',
    label: 'Last 30 Days',
    getRange: (): DateRange => {
      const end = new Date();
      const start = new Date();
      start.setDate(start.getDate() - 30);
      return {
        start: start.toISOString().split('T')[0] ?? '',
        end: end.toISOString().split('T')[0] ?? '',
        preset: 'last_30_days',
      };
    },
  },
  {
    id: 'this_quarter',
    label: 'This Quarter',
    getRange: (): DateRange => {
      const now = new Date();
      const quarter = Math.floor(now.getMonth() / 3);
      const start = new Date(now.getFullYear(), quarter * 3, 1);
      const end = new Date(now.getFullYear(), (quarter + 1) * 3, 0);
      return {
        start: start.toISOString().split('T')[0] ?? '',
        end: end.toISOString().split('T')[0] ?? '',
        preset: 'this_quarter',
      };
    },
  },
  {
    id: 'this_year',
    label: 'This Year',
    getRange: (): DateRange => {
      const now = new Date();
      const start = new Date(now.getFullYear(), 0, 1);
      const end = new Date(now.getFullYear(), 11, 31);
      return {
        start: start.toISOString().split('T')[0] ?? '',
        end: end.toISOString().split('T')[0] ?? '',
        preset: 'this_year',
      };
    },
  },
];

export const FORMAT_OPTIONS: Array<{
  id: ExportFormat;
  label: string;
  description: string;
  extension: string;
  mimeType: string;
  requiresPro: boolean;
  comingSoon?: boolean;
}> = [
  {
    id: 'csv',
    label: 'CSV',
    description: 'Opens in Excel, Google Sheets, Numbers',
    extension: '.csv',
    mimeType: 'text/csv',
    requiresPro: false,
  },
  {
    id: 'excel',
    label: 'Excel',
    description: 'Formatted spreadsheet with multiple sheets',
    extension: '.xlsx',
    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    requiresPro: true,
  },
  {
    id: 'pdf',
    label: 'PDF',
    description: 'Print-ready formatted report (coming soon)',
    extension: '.pdf',
    mimeType: 'application/pdf',
    requiresPro: true,
    comingSoon: true,
  },
  {
    id: 'json',
    label: 'JSON',
    description: 'Structured data for developers',
    extension: '.json',
    mimeType: 'application/json',
    requiresPro: true,
  },
];
