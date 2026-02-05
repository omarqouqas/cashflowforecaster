import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { Json } from '@/types/supabase';
import { canUseAdvancedExports, canAccessReport } from '@/lib/stripe/feature-gate';
import { getForecastDaysLimit } from '@/lib/stripe/subscription';
import generateCalendar from '@/lib/calendar/generate';
import {
  generateCSV,
  generateMultiSectionCSV,
  BILLS_COLUMNS,
  INCOME_COLUMNS,
  ACCOUNTS_COLUMNS,
  INVOICES_COLUMNS,
  MONTHLY_SUMMARY_COLUMNS,
  CATEGORY_SPENDING_COLUMNS,
  FORECAST_COLUMNS,
} from '@/lib/export/generators/csv-generator';
import { generateMultiSheetExcel } from '@/lib/export/generators/excel-generator';
import type { ExportConfig, ExportHistoryItem } from '@/lib/export/types';

// Local types for database records
interface BillRecord {
  id: string;
  name: string;
  amount: number;
  frequency: string;
  category: string | null;
  due_date: string;
  is_active: boolean | null;
}

interface IncomeRecord {
  id: string;
  name: string;
  amount: number;
  frequency: string;
  next_date: string | null;
  is_active: boolean | null;
}

interface AccountRecord {
  id: string;
  name: string;
  account_type: string | null;
  current_balance: number;
  currency: string | null;
  is_spendable: boolean | null;
  // Credit card fields for generateCalendar
  credit_limit?: number | null;
  apr?: number | null;
  payment_due_day?: number | null;
  statement_close_day?: number | null;
}

// Type for forecast data stored during export generation
interface ForecastExportData {
  forecastData: Record<string, unknown>[];
  forecastSummary: {
    startingBalance: number;
    lowestBalance: number;
    lowestBalanceDate: string;
    totalIncome: number;
    totalBills: number;
    endingBalance: number;
    netChange: number;
    safeToSpend: number;
    forecastDays: number;
  };
}

interface InvoiceRecord {
  id: string;
  invoice_number: string;
  client_name: string;
  amount: number;
  due_date: string;
  status: string | null;
}

// Helper to get report name
function getReportName(config: ExportConfig): string {
  const now = new Date();
  const monthYear = now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  switch (config.reportType) {
    case 'monthly_summary':
      return `Monthly Summary - ${monthYear}`;
    case 'category_spending':
      return `Category Spending - ${monthYear}`;
    case 'cash_forecast':
      return `Cash Forecast - ${monthYear}`;
    case 'all_data':
      return `All Data Backup - ${now.toISOString().split('T')[0]}`;
    default:
      return `Export - ${now.toISOString().split('T')[0]}`;
  }
}

// Calculate monthly equivalent for different frequencies
function calculateMonthlyEquivalent(amount: number, frequency: string): number {
  switch (frequency) {
    case 'weekly':
      return amount * (52 / 12);
    case 'biweekly':
      return amount * (26 / 12);
    case 'semi-monthly':
      return amount * 2;
    case 'monthly':
      return amount;
    case 'quarterly':
      return amount / 3;
    case 'annually':
      return amount / 12;
    case 'one-time':
      return 0;
    default:
      return amount;
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const config: ExportConfig = body.config;

    if (!config) {
      return NextResponse.json({ error: 'Missing export configuration' }, { status: 400 });
    }

    // Check format access
    if (config.format !== 'csv') {
      const formatAccess = await canUseAdvancedExports(user.id);
      if (!formatAccess.allowed) {
        return NextResponse.json(
          { error: 'Excel, PDF, and JSON exports require a Pro subscription' },
          { status: 403 }
        );
      }
    }

    // Check report access
    const reportAccess = await canAccessReport(user.id, config.reportType);
    if (!reportAccess.allowed) {
      return NextResponse.json(
        { error: 'This report type requires a Pro subscription' },
        { status: 403 }
      );
    }

    // Fetch all needed data in parallel
    const [billsResult, incomeResult, accountsResult, invoicesResult, settingsResult] =
      await Promise.all([
        config.includes.includes('bills') || ['monthly_summary', 'category_spending', 'cash_forecast', 'all_data'].includes(config.reportType)
          ? supabase.from('bills').select('*').eq('user_id', user.id).order('name')
          : Promise.resolve({ data: [], error: null }),
        config.includes.includes('income') || ['monthly_summary', 'cash_forecast', 'all_data'].includes(config.reportType)
          ? supabase.from('income').select('*').eq('user_id', user.id).order('name')
          : Promise.resolve({ data: [], error: null }),
        config.includes.includes('accounts') || ['monthly_summary', 'cash_forecast', 'all_data'].includes(config.reportType)
          ? supabase.from('accounts').select('*').eq('user_id', user.id).order('name')
          : Promise.resolve({ data: [], error: null }),
        config.includes.includes('invoices') || config.reportType === 'all_data'
          ? supabase.from('invoices').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
          : Promise.resolve({ data: [], error: null }),
        config.reportType === 'cash_forecast'
          ? supabase.from('user_settings').select('safety_buffer, timezone').eq('user_id', user.id).single()
          : Promise.resolve({ data: null, error: null }),
      ]);

    const bills = (billsResult.data ?? []) as BillRecord[];
    const income = (incomeResult.data ?? []) as IncomeRecord[];
    const accounts = (accountsResult.data ?? []) as AccountRecord[];
    const invoices = (invoicesResult.data ?? []) as InvoiceRecord[];

    // Generate export based on report type
    let csvContent = '';
    let rowCount = 0;
    let forecastExport: ForecastExportData | null = null;

    switch (config.reportType) {
      case 'monthly_summary': {
        // Build summary data
        const summaryData: Record<string, unknown>[] = [];

        // Add income
        for (const inc of income) {
          if (inc.is_active === false) continue;
          const monthlyEq = calculateMonthlyEquivalent(inc.amount, inc.frequency);
          summaryData.push({
            category: 'Income',
            type: 'Income',
            name: inc.name,
            amount: inc.amount,
            frequency: inc.frequency,
            monthly_equivalent: monthlyEq.toFixed(2),
          });
        }

        // Add bills
        for (const bill of bills) {
          if (bill.is_active === false) continue;
          const monthlyEq = calculateMonthlyEquivalent(bill.amount, bill.frequency);
          summaryData.push({
            category: bill.category || 'Other',
            type: 'Expense',
            name: bill.name,
            amount: bill.amount,
            frequency: bill.frequency,
            monthly_equivalent: monthlyEq.toFixed(2),
          });
        }

        // Add totals
        const totalIncome = income
          .filter((i) => i.is_active !== false)
          .reduce((sum, i) => sum + calculateMonthlyEquivalent(i.amount, i.frequency), 0);
        const totalExpenses = bills
          .filter((b) => b.is_active !== false)
          .reduce((sum, b) => sum + calculateMonthlyEquivalent(b.amount, b.frequency), 0);

        summaryData.push({
          category: '',
          type: '',
          name: '',
          amount: '',
          frequency: '',
          monthly_equivalent: '',
        });
        summaryData.push({
          category: 'TOTAL',
          type: 'Income',
          name: 'Total Monthly Income',
          amount: '',
          frequency: '',
          monthly_equivalent: totalIncome.toFixed(2),
        });
        summaryData.push({
          category: 'TOTAL',
          type: 'Expenses',
          name: 'Total Monthly Expenses',
          amount: '',
          frequency: '',
          monthly_equivalent: totalExpenses.toFixed(2),
        });
        summaryData.push({
          category: 'TOTAL',
          type: 'Net',
          name: 'Net Cash Flow',
          amount: '',
          frequency: '',
          monthly_equivalent: (totalIncome - totalExpenses).toFixed(2),
        });

        csvContent = generateCSV(summaryData, MONTHLY_SUMMARY_COLUMNS);
        rowCount = summaryData.length;
        break;
      }

      case 'category_spending': {
        // Group bills by category
        const categoryMap = new Map<string, { amount: number; count: number }>();
        let totalSpending = 0;

        for (const bill of bills) {
          if (bill.is_active === false) continue;
          const monthlyEq = calculateMonthlyEquivalent(bill.amount, bill.frequency);
          const category = bill.category || 'Other';
          const existing = categoryMap.get(category) ?? { amount: 0, count: 0 };
          categoryMap.set(category, {
            amount: existing.amount + monthlyEq,
            count: existing.count + 1,
          });
          totalSpending += monthlyEq;
        }

        const categoryData: Record<string, unknown>[] = [];
        Array.from(categoryMap.entries()).forEach(([category, data]) => {
          categoryData.push({
            category,
            amount: data.amount.toFixed(2),
            percentage: totalSpending > 0 ? ((data.amount / totalSpending) * 100).toFixed(1) + '%' : '0%',
            bill_count: data.count,
          });
        });

        // Sort by amount descending
        categoryData.sort((a, b) => parseFloat(b.amount as string) - parseFloat(a.amount as string));

        // Add total row
        categoryData.push({
          category: 'TOTAL',
          amount: totalSpending.toFixed(2),
          percentage: '100%',
          bill_count: bills.filter((b) => b.is_active !== false).length,
        });

        csvContent = generateCSV(categoryData, CATEGORY_SPENDING_COLUMNS);
        rowCount = categoryData.length;
        break;
      }

      case 'cash_forecast': {
        // Check if user has accounts
        if (accounts.length === 0) {
          return NextResponse.json(
            { error: 'Please add at least one account before generating a cash forecast' },
            { status: 400 }
          );
        }

        // Use actual calendar generation for real forecast data
        const settings = settingsResult.data as { safety_buffer?: number; timezone?: string } | null;
        const safetyBuffer = settings?.safety_buffer ?? 500;
        const timezone = settings?.timezone ?? undefined;

        // Get user's forecast days limit
        const forecastDays = await getForecastDaysLimit(user.id);

        // Generate real calendar data
        const calendarData = generateCalendar(
          accounts,
          income,
          bills,
          safetyBuffer,
          timezone,
          forecastDays
        );

        // Store forecast data for Excel/JSON export
        const forecastExportData = calendarData.days.map((day) => {
          const incomeTotal = day.income.reduce((sum, i) => sum + i.amount, 0);
          const expensesTotal = day.bills.reduce((sum, b) => sum + b.amount, 0);
          // Use semicolon separator to avoid CSV comma issues
          const transactionNames = [
            ...day.income.map((i) => `+${i.name}`),
            ...day.bills.map((b) => `-${b.name}`),
          ].join('; ');

          return {
            date: day.date.toISOString().split('T')[0],
            balance: day.balance.toFixed(2),
            income: incomeTotal.toFixed(2),
            expenses: expensesTotal.toFixed(2),
            transactions: transactionNames,
          };
        });

        // Calculate lowest balance the same way as calendar UI (minimum of all day balances)
        const lowestDayBalance = Math.min(...calendarData.days.map((d) => d.balance));
        const lowestDayBalanceDate = calendarData.days.find((d) => d.balance === lowestDayBalance)?.date;

        // Calculate totals the same way as calendar UI
        const totalIncome = calendarData.days.reduce(
          (sum, day) => sum + day.income.reduce((s, t) => s + t.amount, 0),
          0
        );
        const totalBills = calendarData.days.reduce(
          (sum, day) => sum + day.bills.reduce((s, t) => s + t.amount, 0),
          0
        );
        const endingBalance = calendarData.days[calendarData.days.length - 1]?.balance ?? calendarData.startingBalance;
        const netChange = endingBalance - calendarData.startingBalance;

        // Store for use in Excel/JSON section
        forecastExport = {
          forecastData: forecastExportData,
          forecastSummary: {
            startingBalance: calendarData.startingBalance,
            lowestBalance: lowestDayBalance,
            lowestBalanceDate: lowestDayBalanceDate?.toISOString().split('T')[0] ?? calendarData.lowestBalanceDay.toISOString().split('T')[0],
            totalIncome,
            totalBills,
            endingBalance,
            netChange,
            safeToSpend: calendarData.safeToSpend,
            forecastDays,
          },
        };

        csvContent = generateCSV(forecastExportData, FORECAST_COLUMNS);
        rowCount = forecastExportData.length;
        break;
      }

      case 'all_data': {
        // Multi-section export
        const sections = [];

        if (accounts.length > 0) {
          sections.push({
            title: 'Accounts',
            data: accounts.map((a) => ({
              name: a.name,
              account_type: a.account_type,
              current_balance: a.current_balance,
              currency: a.currency || 'USD',
              is_spendable: a.is_spendable ?? true,
            })),
            columns: ACCOUNTS_COLUMNS,
          });
        }

        if (bills.length > 0) {
          sections.push({
            title: 'Bills',
            data: bills.map((b) => ({
              name: b.name,
              amount: b.amount,
              frequency: b.frequency,
              category: b.category || 'Other',
              due_date: b.due_date,
              is_active: b.is_active ?? true,
            })),
            columns: BILLS_COLUMNS,
          });
        }

        if (income.length > 0) {
          sections.push({
            title: 'Income',
            data: income.map((i) => ({
              name: i.name,
              amount: i.amount,
              frequency: i.frequency,
              next_date: i.next_date,
              is_active: i.is_active ?? true,
            })),
            columns: INCOME_COLUMNS,
          });
        }

        if (invoices.length > 0) {
          sections.push({
            title: 'Invoices',
            data: invoices.map((inv) => ({
              invoice_number: inv.invoice_number,
              client_name: inv.client_name,
              amount: inv.amount,
              due_date: inv.due_date,
              status: inv.status,
            })),
            columns: INVOICES_COLUMNS,
          });
        }

        csvContent = generateMultiSectionCSV(sections);
        rowCount = accounts.length + bills.length + income.length + invoices.length;
        break;
      }

      default: {
        // Custom export - export selected data types
        const sections = [];

        if (config.includes.includes('bills') && bills.length > 0) {
          sections.push({
            title: 'Bills',
            data: bills.map((b) => ({
              name: b.name,
              amount: b.amount,
              frequency: b.frequency,
              category: b.category || 'Other',
              due_date: b.due_date,
              is_active: b.is_active ?? true,
            })),
            columns: BILLS_COLUMNS,
          });
        }

        if (config.includes.includes('income') && income.length > 0) {
          sections.push({
            title: 'Income',
            data: income.map((i) => ({
              name: i.name,
              amount: i.amount,
              frequency: i.frequency,
              next_date: i.next_date,
              is_active: i.is_active ?? true,
            })),
            columns: INCOME_COLUMNS,
          });
        }

        if (config.includes.includes('accounts') && accounts.length > 0) {
          sections.push({
            title: 'Accounts',
            data: accounts.map((a) => ({
              name: a.name,
              account_type: a.account_type,
              current_balance: a.current_balance,
              currency: a.currency || 'USD',
              is_spendable: a.is_spendable ?? true,
            })),
            columns: ACCOUNTS_COLUMNS,
          });
        }

        if (config.includes.includes('invoices') && invoices.length > 0) {
          sections.push({
            title: 'Invoices',
            data: invoices.map((inv) => ({
              invoice_number: inv.invoice_number,
              client_name: inv.client_name,
              amount: inv.amount,
              due_date: inv.due_date,
              status: inv.status,
            })),
            columns: INVOICES_COLUMNS,
          });
        }

        if (sections.length === 1 && sections[0]) {
          csvContent = generateCSV(sections[0].data, sections[0].columns);
          rowCount = sections[0].data.length;
        } else if (sections.length > 0) {
          csvContent = generateMultiSectionCSV(sections);
          rowCount = sections.reduce((sum, s) => sum + s.data.length, 0);
        }
      }
    }

    const exportName = body.name || getReportName(config);

    // Generate the appropriate format
    let fileContent: string | Buffer;
    let mimeType: string;
    let extension: string;

    if (config.format === 'excel') {
      // Build sheets for Excel
      const sheets = [];

      // Handle cash_forecast specially with proper data
      if (config.reportType === 'cash_forecast' && forecastExport) {
        const { forecastData, forecastSummary: summary } = forecastExport;

        // Add forecast sheet
        sheets.push({
          name: 'Daily Forecast',
          data: forecastData.map((d) => ({
            Date: d.date,
            Balance: d.balance,
            Income: d.income,
            Expenses: d.expenses,
            Transactions: d.transactions,
          })),
        });

        // Add summary sheet
        if (summary) {
          sheets.push({
            name: 'Summary',
            data: [
              { Metric: 'Starting Balance', Value: summary.startingBalance.toFixed(2) },
              { Metric: 'Ending Balance', Value: summary.endingBalance.toFixed(2) },
              { Metric: 'Net Change', Value: summary.netChange.toFixed(2) },
              { Metric: 'Lowest Balance', Value: summary.lowestBalance.toFixed(2) },
              { Metric: 'Lowest Balance Date', Value: summary.lowestBalanceDate },
              { Metric: 'Total Income', Value: summary.totalIncome.toFixed(2) },
              { Metric: 'Total Bills', Value: summary.totalBills.toFixed(2) },
              { Metric: 'Safe to Spend', Value: summary.safeToSpend.toFixed(2) },
              { Metric: 'Forecast Days', Value: summary.forecastDays },
            ],
          });
        }
      } else if (config.reportType === 'all_data' || config.reportType === 'custom') {
        if (accounts.length > 0) {
          sheets.push({
            name: 'Accounts',
            data: accounts.map((a) => ({
              Name: a.name,
              Type: a.account_type,
              Balance: a.current_balance,
              Currency: a.currency || 'USD',
              Spendable: a.is_spendable ?? true,
            })),
          });
        }
        if (bills.length > 0) {
          sheets.push({
            name: 'Bills',
            data: bills.map((b) => ({
              Name: b.name,
              Amount: b.amount,
              Frequency: b.frequency,
              Category: b.category || 'Other',
              'Due Date': b.due_date,
              Active: b.is_active ?? true,
            })),
          });
        }
        if (income.length > 0) {
          sheets.push({
            name: 'Income',
            data: income.map((i) => ({
              Name: i.name,
              Amount: i.amount,
              Frequency: i.frequency,
              'Next Date': i.next_date,
              Active: i.is_active ?? true,
            })),
          });
        }
        if (invoices.length > 0) {
          sheets.push({
            name: 'Invoices',
            data: invoices.map((inv) => ({
              'Invoice #': inv.invoice_number,
              Client: inv.client_name,
              Amount: inv.amount,
              'Due Date': inv.due_date,
              Status: inv.status,
            })),
          });
        }
      } else {
        // For specific reports, create a single sheet with the CSV data
        // Parse the CSV back to objects (simple approach for now)
        const lines = csvContent.split('\n').filter((l) => l.trim());
        const headerLine = lines[0];
        if (lines.length > 1 && headerLine) {
          const headers = headerLine.split(',').map((h) => h.replace(/"/g, ''));
          const rows = lines.slice(1).map((line) => {
            const values = line.split(',').map((v) => v.replace(/"/g, ''));
            const obj: Record<string, string> = {};
            headers.forEach((h, i) => {
              obj[h] = values[i] || '';
            });
            return obj;
          });
          sheets.push({ name: 'Report', data: rows });
        }
      }

      if (sheets.length > 0) {
        fileContent = generateMultiSheetExcel(sheets);
      } else {
        // Fallback to empty workbook
        fileContent = generateMultiSheetExcel([{ name: 'Empty', data: [{ Message: 'No data to export' }] }]);
      }
      mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      extension = '.xlsx';
    } else if (config.format === 'json') {
      // JSON export
      let jsonData: Record<string, unknown>;

      if (config.reportType === 'cash_forecast' && forecastExport) {
        // Include full forecast data for cash_forecast reports
        const { forecastData, forecastSummary: summary } = forecastExport;

        jsonData = {
          exportedAt: new Date().toISOString(),
          reportType: config.reportType,
          dateRange: config.dateRange,
          summary: summary,
          forecast: forecastData,
        };
      } else {
        jsonData = {
          exportedAt: new Date().toISOString(),
          reportType: config.reportType,
          dateRange: config.dateRange,
          data: {
            accounts: config.includes.includes('accounts') ? accounts : undefined,
            bills: config.includes.includes('bills') ? bills : undefined,
            income: config.includes.includes('income') ? income : undefined,
            invoices: config.includes.includes('invoices') ? invoices : undefined,
          },
        };
      }
      fileContent = JSON.stringify(jsonData, null, 2);
      mimeType = 'application/json';
      extension = '.json';
    } else if (config.format === 'pdf') {
      // PDF not yet implemented - return error
      return NextResponse.json(
        { error: 'PDF export is coming soon. Please use CSV or Excel for now.' },
        { status: 400 }
      );
    } else {
      // CSV (default)
      fileContent = csvContent;
      mimeType = 'text/csv';
      extension = '.csv';
    }

    const filename = `${exportName.replace(/[^a-zA-Z0-9-_ ]/g, '')}${extension}`;
    const fileSize = typeof fileContent === 'string' ? new Blob([fileContent]).size : fileContent.length;

    // Generate data URL for download
    const base64Content = Buffer.from(fileContent).toString('base64');
    const downloadUrl = `data:${mimeType};base64,${base64Content}`;

    // Create export record with file_url for re-download
    const { data: exportRecord } = await supabase
      .from('exports')
      .insert({
        user_id: user.id,
        name: exportName,
        report_type: config.reportType,
        format: config.format,
        config: config as unknown as Json,
        file_url: downloadUrl,
        status: 'completed',
        row_count: rowCount,
        file_size_bytes: fileSize,
        completed_at: new Date().toISOString(),
      })
      .select('*')
      .single();

    // If table doesn't exist yet (migration not run), still return the file
    const exportHistoryItem: ExportHistoryItem | null = exportRecord
      ? (exportRecord as unknown as ExportHistoryItem)
      : null;

    return NextResponse.json({
      success: true,
      downloadUrl,
      filename,
      rowCount,
      export: exportHistoryItem,
    });
  } catch (error) {
    console.error('Export generation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Export failed' },
      { status: 500 }
    );
  }
}
