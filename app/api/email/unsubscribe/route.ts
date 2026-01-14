import { NextRequest, NextResponse } from 'next/server';

import { verifyDigestEmailToken } from '@/lib/email/digest-token';
import { createAdminClient } from '@/lib/supabase/admin';
import { captureServerEvent } from '@/lib/posthog/server';

export const runtime = 'nodejs';

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 30;
const CLEANUP_INTERVAL_MS = 300_000; // 5 minutes

interface RateLimitEntry {
  resetAt: number;
  count: number;
}

const rateLimitState: Map<string, RateLimitEntry> =
  (globalThis as any).__digest_unsub_rl ?? new Map();
(globalThis as any).__digest_unsub_rl = rateLimitState;

// Cleanup expired entries periodically
let lastCleanup = Date.now();

function cleanupExpiredEntries() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;

  lastCleanup = now;
  for (const [key, entry] of rateLimitState.entries()) {
    if (entry.resetAt <= now) {
      rateLimitState.delete(key);
    }
  }
}

function getIp(request: NextRequest) {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip')?.trim() ||
    'unknown'
  );
}

function rateLimit(ip: string): boolean {
  cleanupExpiredEntries();

  const now = Date.now();
  const existing = rateLimitState.get(ip);

  if (!existing || existing.resetAt <= now) {
    // Create new entry or reset expired entry
    rateLimitState.set(ip, { resetAt: now + RATE_LIMIT_WINDOW_MS, count: 1 });
    return true;
  }

  if (existing.count >= RATE_LIMIT_MAX) {
    return false;
  }

  // Create a new object instead of mutating to avoid race conditions
  rateLimitState.set(ip, {
    resetAt: existing.resetAt,
    count: existing.count + 1,
  });

  return true;
}

function getAppUrl() {
  const raw =
    process.env.NEXT_PUBLIC_APP_URL?.trim() ||
    process.env.APP_URL?.trim() ||
    'http://localhost:3000';
  return raw.replace(/\/+$/, '');
}

function htmlPage(title: string, body: string) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${title}</title>
  </head>
  <body style="margin:0;padding:0;background:#18181b;color:#e4e4e7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
    <div style="max-width:640px;margin:0 auto;padding:32px 16px;">
      <div style="font-size:12px;color:#a1a1aa;letter-spacing:0.08em;font-weight:700;">CASH FLOW FORECASTER</div>
      <h1 style="margin:10px 0 0 0;font-size:22px;line-height:28px;">${title}</h1>
      <div style="margin-top:14px;font-size:16px;line-height:24px;color:#d4d4d8;">${body}</div>
    </div>
  </body>
</html>`;
}

export async function GET(request: NextRequest) {
  const ip = getIp(request);
  if (!rateLimit(ip)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  const token = request.nextUrl.searchParams.get('token');
  if (!token) {
    return new NextResponse(
      htmlPage('Invalid link', 'Missing unsubscribe token.'),
      { status: 400, headers: { 'content-type': 'text/html; charset=utf-8' } }
    );
  }

  const payload = verifyDigestEmailToken(token, { maxAgeMs: 400 * 24 * 60 * 60 * 1000 });
  if (!payload) {
    return new NextResponse(
      htmlPage('Invalid link', 'This unsubscribe link is invalid or has expired.'),
      { status: 400, headers: { 'content-type': 'text/html; charset=utf-8' } }
    );
  }

  const supabase = createAdminClient();
  const { error } = await supabase
    .from('user_settings')
    .upsert(
      {
        user_id: payload.userId,
        email_digest_enabled: false,
      },
      { onConflict: 'user_id' }
    );

  if (error) {
    return new NextResponse(
      htmlPage('Something went wrong', 'We could not update your email preferences. Please try again later.'),
      { status: 500, headers: { 'content-type': 'text/html; charset=utf-8' } }
    );
  }

  await captureServerEvent('digest_unsubscribed', {
    distinctId: payload.userId,
    properties: { user_id: payload.userId, method: 'link' },
  });

  const appUrl = getAppUrl();
  return new NextResponse(
    htmlPage(
      'You’re unsubscribed',
      `Weekly digest emails are now disabled.<br /><br />
       You can re-enable them anytime in <a href="${appUrl}/dashboard/settings" style="color:#5eead4;text-decoration:underline;">Settings</a>.`
    ),
    { status: 200, headers: { 'content-type': 'text/html; charset=utf-8' } }
  );
}


