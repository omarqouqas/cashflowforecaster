import { NextRequest, NextResponse } from 'next/server';

import { sendWeeklyDigest } from '@/lib/email/send-digest';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = request.nextUrl.searchParams.get('userId');
  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
  }

  const res = await sendWeeklyDigest(userId);
  return NextResponse.json({ ok: true, userId, ...res });
}


