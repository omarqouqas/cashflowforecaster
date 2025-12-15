'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { requireAuth } from '@/lib/auth/session';
import generateCalendar from '@/lib/calendar/generate';
import { parseLocalDate } from '@/lib/calendar/utils';
import { calculateScenario as calculateScenarioImpact } from '@/lib/calendar/calculate-scenario';
import type { Tables } from '@/types/supabase';

type ScenarioRow = Tables<'scenarios'>;
type Account = Tables<'accounts'>;
type Income = Tables<'income'>;
type Bill = Tables<'bills'>;

function toISODateString(d: Date): string {
  // Date-only (local) string – consistent with how we store bills/income dates (YYYY-MM-DD).
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function getTodayAtNoonForTimezone(timezone?: string | null): Date {
  if (!timezone) {
    const t = new Date();
    t.setHours(12, 0, 0, 0);
    return t;
  }

  try {
    const now = new Date();
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).formatToParts(now);

    const year = Number(parts.find((p) => p.type === 'year')?.value);
    const month = Number(parts.find((p) => p.type === 'month')?.value);
    const day = Number(parts.find((p) => p.type === 'day')?.value);

    if (!Number.isFinite(year) || !Number.isFinite(month) || !Number.isFinite(day)) {
      const t = new Date();
      t.setHours(12, 0, 0, 0);
      return t;
    }

    return new Date(year, month - 1, day, 12, 0, 0, 0);
  } catch {
    const t = new Date();
    t.setHours(12, 0, 0, 0);
    return t;
  }
}

export type CalculateScenarioResponse =
  | {
      ok: true;
      currency: string;
      scenario: {
        name: string;
        amount: number;
        date: string; // YYYY-MM-DD
        isRecurring: boolean;
      };
      result: {
        canAfford: boolean;
        lowestBalance: number;
        previousLowest: number;
        lowestDate: string; // YYYY-MM-DD
        causesOverdraft: boolean;
        causesLowBalance: boolean;
        firstProblemDay: string | null; // YYYY-MM-DD
        impactSummary: string;
      };
      preview: Array<{
        date: string; // YYYY-MM-DD
        baselineBalance: number;
        scenarioBalance: number;
        delta: number;
      }>;
      nextAffordableDate: string | null; // YYYY-MM-DD
    }
  | { ok: false; error: string };

/**
 * Calculates whether the user can afford a hypothetical expense on a specific date.
 *
 * Notes:
 * - `userId` is accepted for API symmetry, but auth is enforced with `requireAuth()`.
 * - `date` must be a date-only string (`YYYY-MM-DD`).
 */
export async function calculateScenario(
  userId: string,
  amount: number,
  date: string,
  isRecurring: boolean,
  name?: string
): Promise<CalculateScenarioResponse> {
  try {
    const user = await requireAuth();
    if (userId && userId !== user.id) return { ok: false, error: 'Unauthorized.' };

    const cleanedName = (name || 'New purchase').trim() || 'New purchase';
    if (!Number.isFinite(amount) || amount <= 0) return { ok: false, error: 'Please enter a valid amount.' };
    if (!date) return { ok: false, error: 'Please select a date.' };

    const supabase = await createClient();

    const [accountsResult, incomeResult, billsResult, settingsResult] = await Promise.all([
      supabase.from('accounts').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
      supabase
        .from('income')
        .select('*')
        .eq('user_id', user.id)
        .or('is_active.is.null,is_active.eq.true')
        .order('created_at', { ascending: false }),
      supabase
        .from('bills')
        .select('*')
        .eq('user_id', user.id)
        .or('is_active.is.null,is_active.eq.true')
        .order('created_at', { ascending: false }),
      supabase.from('user_settings').select('safety_buffer, timezone, currency').eq('user_id', user.id).single(),
    ]);

    const accounts: Account[] = accountsResult.data || [];
    const income: Income[] = incomeResult.data || [];
    const bills: Bill[] = billsResult.data || [];

    if (accounts.length === 0) {
      return { ok: false, error: 'Add at least one account to generate your forecast.' };
    }

    const safetyBuffer = settingsResult.data?.safety_buffer ?? 500;
    const timezone = settingsResult.data?.timezone ?? null;
    const currency = settingsResult.data?.currency ?? accounts[0]?.currency ?? 'USD';

    const chosenDate = parseLocalDate(date);
    if (Number.isNaN(chosenDate.getTime())) return { ok: false, error: 'Please select a valid date.' };

    const today = getTodayAtNoonForTimezone(timezone);
    if (chosenDate < today) {
      return { ok: false, error: 'Please select a future date.' };
    }

    const calendarData = generateCalendar(accounts, income, bills, safetyBuffer, timezone ?? undefined);
    const calendarEnd = calendarData.days[calendarData.days.length - 1]?.date;
    if (!calendarEnd) return { ok: false, error: 'Failed to generate calendar.' };

    const { result, preview } = calculateScenarioImpact(calendarData, {
      name: cleanedName,
      amount,
      date: chosenDate,
      frequency: isRecurring ? 'monthly' : 'one-time',
    });

    // Suggestion: next income day where moving the expense to that date would be safe.
    // (For recurring expenses, we still test using the selected recurrence starting that income date.)
    const nextAffordableDate = (() => {
      const incomeDays = calendarData.days
        .filter((d) => d.income && d.income.length > 0)
        .filter((d) => d.date > chosenDate);

      for (const d of incomeDays) {
        const test = calculateScenarioImpact(calendarData, {
          name: cleanedName,
          amount,
          date: d.date,
          frequency: isRecurring ? 'monthly' : 'one-time',
        }).result;
        if (test.canAfford) return toISODateString(d.date);
      }

      return null;
    })();

    return {
      ok: true,
      currency,
      scenario: {
        name: cleanedName,
        amount,
        date,
        isRecurring,
      },
      result: {
        canAfford: result.canAfford,
        lowestBalance: result.lowestBalance,
        previousLowest: result.previousLowest,
        lowestDate: toISODateString(result.lowestDate),
        causesOverdraft: result.causesOverdraft,
        causesLowBalance: result.causesLowBalance,
        firstProblemDay: result.firstProblemDay ? toISODateString(result.firstProblemDay) : null,
        impactSummary: result.impactSummary,
      },
      preview: preview.map((p) => ({
        date: toISODateString(p.date),
        baselineBalance: p.baselineBalance,
        scenarioBalance: p.scenarioBalance,
        delta: p.delta,
      })),
      nextAffordableDate,
    };
  } catch (e: any) {
    return { ok: false, error: e?.message ?? 'Failed to calculate scenario.' };
  }
}

export type SaveScenarioInput = {
  name: string;
  amount: number;
  date: string; // YYYY-MM-DD
  isRecurring: boolean;
  result: unknown;
};

export async function saveScenario(
  userId: string,
  scenarioData: SaveScenarioInput
): Promise<{ ok: true; scenario: ScenarioRow } | { ok: false; error: string }> {
  try {
    const user = await requireAuth();
    if (userId && userId !== user.id) return { ok: false, error: 'Unauthorized.' };

    const name = (scenarioData.name || '').trim() || 'New purchase';
    if (!Number.isFinite(scenarioData.amount) || scenarioData.amount <= 0) {
      return { ok: false, error: 'Please enter a valid amount.' };
    }
    if (!scenarioData.date) return { ok: false, error: 'Please select a date.' };

    const supabase = await createClient();
    const { data, error } = await supabase
      .from('scenarios')
      .insert({
        user_id: user.id,
        name,
        amount: scenarioData.amount,
        date: scenarioData.date,
        result: scenarioData.result as any,
        saved: true,
      })
      .select('*')
      .single();

    if (error) return { ok: false, error: error.message };

    revalidatePath('/dashboard');
    revalidatePath('/dashboard/calendar');

    return { ok: true, scenario: data };
  } catch (e: any) {
    return { ok: false, error: e?.message ?? 'Failed to save scenario.' };
  }
}

export async function getSavedScenarios(
  userId: string
): Promise<{ ok: true; scenarios: ScenarioRow[] } | { ok: false; error: string }> {
  try {
    const user = await requireAuth();
    if (userId && userId !== user.id) return { ok: false, error: 'Unauthorized.' };

    const supabase = await createClient();
    const { data, error } = await supabase
      .from('scenarios')
      .select('*')
      .eq('user_id', user.id)
      .or('saved.is.null,saved.eq.true')
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) return { ok: false, error: error.message };
    return { ok: true, scenarios: data ?? [] };
  } catch (e: any) {
    return { ok: false, error: e?.message ?? 'Failed to load saved scenarios.' };
  }
}


