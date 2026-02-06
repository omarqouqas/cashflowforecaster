import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

import { createAdminClient } from '@/lib/supabase/admin';
import { sendLowBalanceAlert } from '@/lib/email/send-low-balance-alert';

export const runtime = 'nodejs';
export const maxDuration = 300; // 5 minutes

const DEFAULT_SAFETY_BUFFER = 500;
const DEFAULT_CURRENCY = 'USD';
const DEFAULT_TIMEZONE = 'America/New_York';

/**
 * Constant-time string comparison to prevent timing attacks
 */
function secureCompare(a: string, b: string): boolean {
  if (a.length !== b.length) {
    // Still do the comparison to maintain constant time
    crypto.timingSafeEqual(Buffer.from(a), Buffer.from(a));
    return false;
  }
  return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
}

async function mapWithConcurrency<T, R>(
  items: T[],
  concurrency: number,
  fn: (item: T) => Promise<R>
): Promise<R[]> {
  const results: R[] = [];
  let idx = 0;

  async function worker() {
    while (idx < items.length) {
      const i = idx++;
      results[i] = await fn(items[i]!);
    }
  }

  const workers = Array.from({ length: Math.max(1, concurrency) }, () => worker());
  await Promise.all(workers);
  return results;
}

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization') || '';
  const expectedAuth = `Bearer ${process.env.CRON_SECRET || ''}`;
  if (!process.env.CRON_SECRET || !secureCompare(authHeader, expectedAuth)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const now = new Date();
  const supabase = createAdminClient();

  // Get all users with alerts enabled (or null, meaning default enabled)
  // Also get users who have accounts (no point checking users with no data)
  const { data: settingsRows, error: settingsError } = await supabase
    .from('user_settings')
    .select('user_id, safety_buffer, currency, timezone, low_balance_alert_enabled, last_low_balance_alert_at');

  if (settingsError) {
    return NextResponse.json({ error: settingsError.message }, { status: 500 });
  }

  // Get all user IDs that have at least one account
  const { data: accountUsers, error: accountsError } = await supabase
    .from('accounts')
    .select('user_id');

  if (accountsError) {
    return NextResponse.json({ error: accountsError.message }, { status: 500 });
  }

  const usersWithAccounts = new Set(accountUsers?.map((a) => a.user_id) || []);

  // Get user emails from auth - combine both sources and dedupe
  const allUserIds = [
    ...(settingsRows?.map((r) => r.user_id) || []),
    ...Array.from(usersWithAccounts),
  ];
  const userIds = Array.from(new Set(allUserIds));

  // Fetch user details from auth
  const userDetails: Record<string, { email: string; name?: string }> = {};
  for (const userId of userIds) {
    try {
      const { data: userData } = await supabase.auth.admin.getUserById(userId);
      if (userData?.user?.email) {
        userDetails[userId] = {
          email: userData.user.email,
          name: userData.user.user_metadata?.full_name || userData.user.user_metadata?.name,
        };
      }
    } catch {
      // Skip users we can't fetch
    }
  }

  // Build candidates: users with accounts who have alerts enabled
  const candidates = userIds
    .filter((userId) => {
      // Must have accounts
      if (!usersWithAccounts.has(userId)) return false;
      // Must have email
      if (!userDetails[userId]?.email) return false;
      // Check alert setting (default to enabled if no settings row)
      const settings = settingsRows?.find((r) => r.user_id === userId);
      if (settings?.low_balance_alert_enabled === false) return false;
      return true;
    })
    .map((userId) => {
      const settings = settingsRows?.find((r) => r.user_id === userId);
      return {
        userId,
        email: userDetails[userId]!.email,
        userName: userDetails[userId]?.name,
        safetyBuffer: settings?.safety_buffer ?? DEFAULT_SAFETY_BUFFER,
        currency: settings?.currency ?? DEFAULT_CURRENCY,
        timezone: settings?.timezone ?? DEFAULT_TIMEZONE,
        lastAlertSentAt: settings?.last_low_balance_alert_at ?? null,
        alertEnabled: settings?.low_balance_alert_enabled !== false,
      };
    });

  // Process alerts with concurrency limit
  const results = await mapWithConcurrency(candidates, 5, async (userData) => {
    const res = await sendLowBalanceAlert(userData);
    return { user_id: userData.userId, ...res };
  });

  const sent = results.filter((r) => r.success && !r.skipped).length;
  const skipped = results.filter((r) => r.skipped).length;
  const failed = results.filter((r) => !r.success).length;

  return NextResponse.json({
    ok: true,
    now: now.toISOString(),
    checked: candidates.length,
    sent,
    skipped,
    failed,
    results,
  });
}
