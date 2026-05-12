/**
 * Tool execution dispatcher for AI function calling.
 * Routes tool calls to the appropriate calculation functions.
 */

import { calculateAffordability } from '@/lib/tools/calculate-affordability';
import { calculatePaymentDate } from '@/lib/tools/calculate-payment-date';
import { calculateTaxReserve } from '@/lib/tools/calculate-tax-reserve';
import { calculateIncomeVariability } from '@/lib/tools/calculate-income-variability';
import { calculateHourlyRate } from '@/lib/tools/calculate-hourly-rate';
import generateCalendar from '@/lib/calendar/generate';
import type { ToolExecutionResult, UserFinancialData } from './types';

/**
 * Helper to format a Date as YYYY-MM-DD
 */
function toDateOnly(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Execute a tool with the given input and user financial data context.
 */
export async function executeTool(
  toolName: string,
  toolInput: Record<string, unknown>,
  userData: UserFinancialData
): Promise<ToolExecutionResult> {
  try {
    switch (toolName) {
      case 'calculate_affordability': {
        // Generate calendar to get current balance and upcoming transactions
        const calendar = generateCalendar(
          userData.accounts,
          userData.income,
          userData.bills,
          userData.settings.safety_buffer ?? 500,
          userData.settings.timezone ?? undefined,
          90,
          [], // transfers
          userData.settings.emergency_fund_account_id
        );

        // Get upcoming bills from calendar data
        const upcomingBills = userData.bills
          .filter((b) => b.is_active !== false)
          .map((b) => ({
            name: b.name,
            amount: b.amount,
            date: b.due_date,
          }));

        // Find next income
        const activeIncome = userData.income.filter((i) => i.is_active !== false);
        const sortedIncome = activeIncome.sort((a, b) =>
          (a.next_date ?? '').localeCompare(b.next_date ?? '')
        );
        const nextIncome = sortedIncome[0];

        const result = calculateAffordability({
          currentBalance: calendar.startingBalance,
          purchaseAmount: toolInput.purchaseAmount as number,
          purchaseDate: toolInput.purchaseDate as string,
          nextIncome: {
            amount: nextIncome?.amount ?? 0,
            date: nextIncome?.next_date ?? toDateOnly(new Date()),
          },
          upcomingBills,
        });

        return {
          success: true,
          result: {
            canAfford: result.canAfford,
            currentBalance: result.currentBalance,
            purchaseAmount: result.purchaseAmount,
            lowestBalance: result.lowestBalance,
            overdraftDays: result.overdraftDays,
            safetyBuffer: userData.settings.safety_buffer ?? 500,
            wouldGoNegative: result.lowestBalance.amount < 0,
            wouldGoBelowBuffer:
              result.lowestBalance.amount < (userData.settings.safety_buffer ?? 500),
          },
        };
      }

      case 'calculate_payment_date': {
        const result = calculatePaymentDate({
          invoiceDate: toolInput.invoiceDate as string,
          paymentTerms: toolInput.paymentTerms as
            | 'due_on_receipt'
            | 'net_7'
            | 'net_15'
            | 'net_30'
            | 'net_45'
            | 'net_60'
            | 'net_90',
          clientHistory: toolInput.clientHistory as
            | 'on_time'
            | 'usually_late'
            | 'very_late',
          adjustForWeekends: (toolInput.adjustForWeekends as boolean) ?? true,
        });

        return {
          success: true,
          result: {
            expectedPaymentDate: result.expectedPaymentDate,
            dayOfWeek: result.dayOfWeek,
            daysFromToday: result.daysFromToday,
            isPast: result.isPast,
            paymentTermsLabel: result.paymentTermsLabel,
            lateClientAdjustmentDays: result.lateClientAdjustmentDays,
          },
        };
      }

      case 'calculate_tax_reserve': {
        type CAProvince = 'ON' | 'BC' | 'AB' | 'QC' | 'MB' | 'SK' | 'NS' | 'NB' | 'NL' | 'PE' | 'YT' | 'NT' | 'NU';
        const result = calculateTaxReserve({
          country: toolInput.country as 'US' | 'CA',
          annualRevenue: toolInput.annualRevenue as number,
          businessExpenses: toolInput.businessExpenses as number,
          filingStatus: toolInput.filingStatus as
            | 'single'
            | 'married_joint'
            | 'married_separate'
            | 'head_of_household'
            | undefined,
          province: toolInput.province as CAProvince | undefined,
        });

        return {
          success: true,
          result: {
            netIncome: result.netIncome,
            totalTaxReserve: result.totalTaxReserve,
            effectiveTaxRate: result.effectiveTaxRate,
            safeToSpend: result.safeToSpend,
            monthlyTaxReserve: result.monthlyTaxReserve,
            quarterlyTaxPayment: result.quarterlyTaxPayment,
            breakdown: result.breakdown,
            alerts: result.alerts,
            country: result.country,
          },
        };
      }

      case 'calculate_income_variability': {
        // Build income history from user's income data
        // For now, we'll create a simple history based on monthly amounts
        const incomeHistory =
          userData.incomeHistory ??
          userData.income
            .filter((i) => i.is_active !== false)
            .map((i, idx) => ({
              id: String(idx),
              label: i.name,
              amount: i.amount,
            }));

        const result = calculateIncomeVariability({
          incomes: incomeHistory.map((h, i) => ({
            id: String(i),
            label: h.label,
            amount: h.amount,
          })),
          monthlyExpenses: toolInput.monthlyExpenses as number | undefined,
        });

        return {
          success: true,
          result: {
            variabilityLevel: result.variabilityLevel,
            variabilityScore: result.variabilityScore,
            averageIncome: result.averageIncome,
            medianIncome: result.medianIncome,
            recommendedEmergencyMonths: result.recommendedEmergencyMonths,
            recommendedEmergencyFund: result.recommendedEmergencyFund,
            percentileBetterThan: result.percentileBetterThan,
          },
        };
      }

      case 'calculate_hourly_rate': {
        const result = calculateHourlyRate({
          annualIncomeGoal: toolInput.annualIncomeGoal as number,
          monthlyExpenses: toolInput.monthlyExpenses as number,
          billableHoursPerWeek: toolInput.billableHoursPerWeek as number,
          vacationWeeks: toolInput.vacationWeeks as number,
        });

        return {
          success: true,
          result: {
            minimumHourlyRate: result.minimumHourlyRate,
            suggestedHourlyRate: result.suggestedHourlyRate,
            premiumHourlyRate: result.premiumHourlyRate,
            dailyRate: result.dailyRate,
            weeklyRate: result.weeklyRate,
            monthlyRevenueNeeded: result.monthlyRevenueNeeded,
            annualBillableHours: result.annualBillableHours,
            tenHourProject: result.tenHourProject,
            twentyHourProject: result.twentyHourProject,
            fortyHourProject: result.fortyHourProject,
          },
        };
      }

      case 'get_forecast_summary': {
        const daysAhead = Math.min(
          Math.max((toolInput.daysAhead as number) || 30, 7),
          90
        );

        const calendar = generateCalendar(
          userData.accounts,
          userData.income,
          userData.bills,
          userData.settings.safety_buffer ?? 500,
          userData.settings.timezone ?? undefined,
          daysAhead,
          [], // transfers
          userData.settings.emergency_fund_account_id
        );

        // Find days below safety buffer
        const safetyBuffer = userData.settings.safety_buffer ?? 500;
        const daysAtRisk = calendar.days.filter(
          (d) => d.balance < safetyBuffer
        ).length;

        return {
          success: true,
          result: {
            startingBalance: calendar.startingBalance,
            lowestBalance: calendar.lowestBalance,
            lowestBalanceDate: toDateOnly(calendar.lowestBalanceDay),
            safeToSpend: calendar.safeToSpend,
            daysForecasted: calendar.days.length,
            safetyBuffer,
            daysAtRisk,
            hasOverdraftRisk: calendar.lowestBalance < 0,
          },
        };
      }

      default:
        return {
          success: false,
          result: null,
          error: `Unknown tool: ${toolName}`,
        };
    }
  } catch (error) {
    console.error(`Tool execution error (${toolName}):`, error);
    return {
      success: false,
      result: null,
      error: error instanceof Error ? error.message : 'Tool execution failed',
    };
  }
}
