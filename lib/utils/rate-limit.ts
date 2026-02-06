/**
 * Simple in-memory rate limiter for API routes
 * Uses a sliding window approach per IP address
 */

import { NextRequest } from 'next/server';

interface RateLimitEntry {
  resetAt: number;
  count: number;
}

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  keyPrefix?: string;
}

// Global state for rate limiting (persists across requests in serverless)
const rateLimitStates: Map<string, Map<string, RateLimitEntry>> = new Map();
const CLEANUP_INTERVAL_MS = 300_000; // 5 minutes
let lastCleanup = Date.now();

/**
 * Cleanup expired entries periodically
 */
function cleanupExpiredEntries() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;

  lastCleanup = now;
  for (const [_prefix, stateMap] of Array.from(rateLimitStates.entries())) {
    for (const [key, entry] of Array.from(stateMap.entries())) {
      if (entry.resetAt <= now) {
        stateMap.delete(key);
      }
    }
  }
}

/**
 * Get client IP from request headers
 */
export function getClientIp(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip')?.trim() ||
    'unknown'
  );
}

/**
 * Create a rate limiter with the given configuration
 */
export function createRateLimiter(config: RateLimitConfig) {
  const { windowMs, maxRequests, keyPrefix = 'default' } = config;

  // Initialize state map for this limiter
  if (!rateLimitStates.has(keyPrefix)) {
    rateLimitStates.set(keyPrefix, new Map());
  }

  const stateMap = rateLimitStates.get(keyPrefix)!;

  return {
    /**
     * Check if the request should be rate limited
     * @returns true if allowed, false if rate limited
     */
    check(key: string): boolean {
      cleanupExpiredEntries();

      const now = Date.now();
      const existing = stateMap.get(key);

      if (!existing || existing.resetAt <= now) {
        // Create new entry or reset expired entry
        stateMap.set(key, { resetAt: now + windowMs, count: 1 });
        return true;
      }

      if (existing.count >= maxRequests) {
        return false;
      }

      // Create a new object instead of mutating to avoid race conditions
      stateMap.set(key, {
        resetAt: existing.resetAt,
        count: existing.count + 1,
      });

      return true;
    },

    /**
     * Get remaining requests for a key
     */
    getRemaining(key: string): number {
      const now = Date.now();
      const existing = stateMap.get(key);

      if (!existing || existing.resetAt <= now) {
        return maxRequests;
      }

      return Math.max(0, maxRequests - existing.count);
    },
  };
}

/**
 * Pre-configured rate limiters for different use cases
 */
export const rateLimiters = {
  // PDF generation: 10 requests per minute per user
  pdf: createRateLimiter({
    windowMs: 60_000,
    maxRequests: 10,
    keyPrefix: 'pdf',
  }),

  // Export generation: 10 requests per minute per user
  export: createRateLimiter({
    windowMs: 60_000,
    maxRequests: 10,
    keyPrefix: 'export',
  }),

  // Send invoice/quote: 5 per minute per user
  sendEmail: createRateLimiter({
    windowMs: 60_000,
    maxRequests: 5,
    keyPrefix: 'send-email',
  }),
};
