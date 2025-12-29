import { NextRequest, NextResponse } from 'next/server';

import { verifyDigestEmailToken } from '@/lib/email/digest-token';
import { captureServerEvent } from '@/lib/posthog/server';

export const runtime = 'nodejs';

function getAppUrl() {
  const raw =
    process.env.NEXT_PUBLIC_APP_URL?.trim() ||
    process.env.APP_URL?.trim() ||
    'http://localhost:3000';
  return raw.replace(/\/+$/, '');
}

type LinkKey = 'view_forecast' | 'manage_preferences' | 'unsubscribe';

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token');
  const link = request.nextUrl.searchParams.get('link') as LinkKey | null;

  if (!token || !link) {
    return NextResponse.json({ error: 'Missing token or link' }, { status: 400 });
  }

  const payload = verifyDigestEmailToken(token);
  if (!payload) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 400 });
  }

  const appUrl = getAppUrl();
  const target =
    link === 'view_forecast'
      ? `${appUrl}/dashboard/calendar?utm_source=weekly_digest&utm_medium=email`
      : link === 'manage_preferences'
        ? `${appUrl}/dashboard/settings?utm_source=weekly_digest&utm_medium=email`
        : `${appUrl}/api/email/unsubscribe?token=${encodeURIComponent(token)}`;

  await captureServerEvent('digest_clicked', {
    distinctId: payload.userId,
    properties: {
      user_id: payload.userId,
      link,
    },
  });

  return NextResponse.redirect(target, 302);
}


