import { NextRequest, NextResponse } from 'next/server';

import { verifyDigestEmailToken } from '@/lib/email/digest-token';
import { captureServerEvent } from '@/lib/posthog/server';

export const runtime = 'nodejs';

// 1x1 transparent GIF
const PIXEL = Buffer.from('R0lGODlhAQABAPAAAP///wAAACwAAAAAAQABAEACAkQBADs=', 'base64');

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token');
  if (token) {
    const payload = verifyDigestEmailToken(token);
    if (payload) {
      await captureServerEvent('digest_opened', {
        distinctId: payload.userId,
        properties: { user_id: payload.userId },
      });
    }
  }

  return new NextResponse(PIXEL, {
    status: 200,
    headers: {
      'content-type': 'image/gif',
      'cache-control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      pragma: 'no-cache',
      expires: '0',
    },
  });
}


