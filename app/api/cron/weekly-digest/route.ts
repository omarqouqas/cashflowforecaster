import { NextRequest, NextResponse } from 'next/server';

import { createAdminClient } from '@/lib/supabase/admin';
import { sendWeeklyDigest } from '@/lib/email/send-digest';

export const runtime = 'nodejs';
export const maxDuration = 300; // 5 minutes

function parseTimeHHMMSS(value: string | null): { hour: number; minute: number } | null {
  if (!value) return null;
  const m = /^(\d{2}):(\d{2})(?::(\d{2}))?$/.exec(value.trim());
  if (!m) return null;
  const hour = Number(m[1]);
  const minute = Number(m[2]);
  if (!Number.isFinite(hour) || !Number.isFinite(minute)) return null;
  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) return null;
  return { hour, minute };
}

function getLocalParts(now: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(now);

  const weekday = parts.find((p) => p.type === 'weekday')?.value ?? '';
  const hour = Number(parts.find((p) => p.type === 'hour')?.value);
  const minute = Number(parts.find((p) => p.type === 'minute')?.value);

  const dowMap: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };

  return { dow: dowMap[weekday] ?? null, hour, minute };
}

function shouldSendDigestNow(input: {
  email_digest_enabled: boolean | null;
  email_digest_day: number | null;
  email_digest_time: string | null;
  last_digest_sent_at: string | null;
  timezone: string | null;
  now: Date;
}): boolean {
  if (input.email_digest_enabled === false) return false;

  const timeZone = (input.timezone || 'UTC').trim() || 'UTC';
  const desiredDay = input.email_digest_day ?? 1;
  const desiredTime = parseTimeHHMMSS(input.email_digest_time ?? '08:00:00') ?? { hour: 8, minute: 0 };

  let local: { dow: number | null; hour: number; minute: number };
  try {
    local = getLocalParts(input.now, timeZone);
  } catch {
    local = getLocalParts(input.now, 'UTC');
  }

  if (local.dow === null) return false;
  if (local.dow !== desiredDay) return false;

  // Cron runs hourly; send if we're inside the configured hour
  if (local.hour !== desiredTime.hour) return false;

  // Safety: prevent duplicates if called multiple times in the same hour
  if (input.last_digest_sent_at) {
    const last = new Date(input.last_digest_sent_at);
    const diffMs = input.now.getTime() - last.getTime();
    if (Number.isFinite(diffMs) && diffMs < 20 * 60 * 60 * 1000) return false; // < 20 hours
    if (Number.isFinite(diffMs) && diffMs < 6 * 24 * 60 * 60 * 1000) return false; // < 6 days
  }

  return true;
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
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const now = new Date();

  const supabase = createAdminClient();
  const { data: rows, error } = await supabase
    .from('user_settings')
    .select('user_id,timezone,email_digest_enabled,email_digest_day,email_digest_time,last_digest_sent_at')
    .eq('email_digest_enabled', true);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const candidates = (rows ?? []).filter((r) =>
    shouldSendDigestNow({
      email_digest_enabled: r.email_digest_enabled,
      email_digest_day: r.email_digest_day,
      email_digest_time: r.email_digest_time,
      last_digest_sent_at: r.last_digest_sent_at,
      timezone: r.timezone,
      now,
    })
  );

  const results = await mapWithConcurrency(candidates, 5, async (r) => {
    const res = await sendWeeklyDigest(r.user_id);
    return { user_id: r.user_id, ...res };
  });

  const sent = results.filter((r) => r.success).length;
  const failed = results.length - sent;

  return NextResponse.json({
    ok: true,
    now: now.toISOString(),
    checked: rows?.length ?? 0,
    due: candidates.length,
    sent,
    failed,
    results,
  });
}


