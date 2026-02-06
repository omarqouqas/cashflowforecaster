import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

import { sendWeeklyDigest } from '@/lib/email/send-digest';

export const runtime = 'nodejs';
export const maxDuration = 60;

/**
 * Constant-time string comparison to prevent timing attacks
 */
function secureCompare(a: string, b: string): boolean {
  if (a.length !== b.length) {
    crypto.timingSafeEqual(Buffer.from(a), Buffer.from(a));
    return false;
  }
  return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
}

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization') || '';
  const expectedAuth = `Bearer ${process.env.CRON_SECRET || ''}`;
  if (!process.env.CRON_SECRET || !secureCompare(authHeader, expectedAuth)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = request.nextUrl.searchParams.get('userId');
  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
  }

  const res = await sendWeeklyDigest(userId);
  return NextResponse.json({ ok: true, userId, ...res });
}


