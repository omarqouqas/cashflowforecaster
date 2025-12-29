import 'server-only';

import crypto from 'crypto';

function base64UrlEncode(buf: Buffer): string {
  return buf.toString('base64').replaceAll('+', '-').replaceAll('/', '_').replaceAll('=', '');
}

function base64UrlDecodeToString(input: string): string {
  const padded = input.replaceAll('-', '+').replaceAll('_', '/').padEnd(Math.ceil(input.length / 4) * 4, '=');
  return Buffer.from(padded, 'base64').toString('utf8');
}

function getTokenSecret(): string | null {
  return (
    process.env.EMAIL_TOKEN_SECRET?.trim() ||
    process.env.CRON_SECRET?.trim() ||
    null
  );
}

function sign(input: string, secret: string): string {
  return crypto.createHmac('sha256', secret).update(input).digest('hex');
}

export type DigestEmailTokenPayload = {
  userId: string;
  issuedAtMs: number;
};

/**
 * Signed token used for unsubscribe + open/click tracking.
 * Format: base64url("v1.userId.issuedAtMs.signatureHex")
 */
export function generateDigestEmailToken(userId: string, issuedAtMs: number = Date.now()): string {
  const secret = getTokenSecret();
  if (!secret) throw new Error('Missing EMAIL_TOKEN_SECRET (or CRON_SECRET fallback)');

  const core = `v1.${userId}.${issuedAtMs}`;
  const sig = sign(core, secret);
  return base64UrlEncode(Buffer.from(`${core}.${sig}`, 'utf8'));
}

export function verifyDigestEmailToken(
  token: string,
  options?: { maxAgeMs?: number }
): DigestEmailTokenPayload | null {
  const secret = getTokenSecret();
  if (!secret) return null;

  try {
    const decoded = base64UrlDecodeToString(token);
    const parts = decoded.split('.');
    if (parts.length !== 4) return null;
    const [version, userId, issuedAtRaw, sig] = parts;
    if (version !== 'v1') return null;
    if (!userId) return null;

    const issuedAtMs = Number(issuedAtRaw);
    if (!Number.isFinite(issuedAtMs) || issuedAtMs <= 0) return null;

    const expected = sign(`v1.${userId}.${issuedAtMs}`, secret);
    const a = Buffer.from(expected, 'utf8');
    const b = Buffer.from(sig, 'utf8');
    if (a.length !== b.length) return null;
    if (!crypto.timingSafeEqual(a, b)) return null;

    const maxAgeMs = options?.maxAgeMs;
    if (typeof maxAgeMs === 'number' && maxAgeMs > 0) {
      const age = Date.now() - issuedAtMs;
      if (age > maxAgeMs) return null;
    }

    return { userId, issuedAtMs };
  } catch {
    return null;
  }
}


