/**
 * Type definitions for the AI Natural Language Queries feature.
 */

import type { Database } from '@/types/supabase';

// ============================================
// Database Types
// ============================================

/**
 * AI Query Usage row type (matches ai_query_usage table).
 * Used for tracking daily query counts per user.
 */
export interface AIQueryUsageRow {
  id: string;
  user_id: string;
  query_date: string; // YYYY-MM-DD
  query_count: number;
  created_at: string;
  updated_at: string;
}

// ============================================
// Query Usage Types
// ============================================

export interface QueryUsageResult {
  allowed: boolean;
  remaining: number;
  limit: number | null; // null = unlimited
  resetAt?: Date;
  reason?: 'limit_reached' | 'unauthorized' | 'pro_required';
}

// ============================================
// User Financial Context Types
// ============================================

type AccountRow = Database['public']['Tables']['accounts']['Row'];
type BillRow = Database['public']['Tables']['bills']['Row'];
type IncomeRow = Database['public']['Tables']['income']['Row'];
type InvoiceRow = Database['public']['Tables']['invoices']['Row'];

export interface UserSettings {
  currency: string;
  safety_buffer: number;
  timezone: string | null;
  tax_rate: number | null;
  tax_tracking_enabled: boolean | null;
  emergency_fund_account_id: string | null;
}

export interface UserFinancialData {
  accounts: AccountRow[];
  bills: BillRow[];
  income: IncomeRow[];
  invoices: InvoiceRow[];
  settings: UserSettings;
  incomeHistory?: Array<{ label: string; amount: number }>;
}

export interface UserFinancialContext {
  userId: string;
  currency: string;
  timezone: string | null;
  safetyBuffer: number;
  taxRate: number | null;
  spendableBalance: number;
  totalBalance: number;
  safeToSpend: number;
  lowestBalanceAmount: number;
  lowestBalanceDate: string;
  accountsSummary: string;
  upcomingBills: string;
  upcomingIncome: string;
  outstandingInvoices: string;
}

// ============================================
// Streaming Response Types
// ============================================

export type StreamEventType =
  | 'text'
  | 'tool_start'
  | 'tool_result'
  | 'error'
  | 'done';

export interface StreamEvent {
  type: StreamEventType;
  content?: string;
  tool?: string;
  success?: boolean;
  remaining?: number;
  message?: string;
}

// ============================================
// Tool Execution Types
// ============================================

export interface ToolExecutionResult {
  success: boolean;
  result: unknown;
  error?: string;
}

// ============================================
// API Request/Response Types
// ============================================

export interface ChatRequestBody {
  query: string;
}

export interface ChatErrorResponse {
  error: string;
  resetAt?: string;
  limit?: number;
}
