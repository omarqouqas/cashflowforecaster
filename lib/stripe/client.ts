// lib/stripe/client.ts
// ============================================
// Stripe Client Configuration (SERVER-ONLY)
// ============================================

import 'server-only';
import Stripe from 'stripe';

// Validate required environment variables
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing STRIPE_SECRET_KEY environment variable');
}

if (!process.env.STRIPE_WEBHOOK_SECRET) {
  throw new Error('Missing STRIPE_WEBHOOK_SECRET environment variable');
}

// Server-side Stripe instance (use in API routes and server actions only)
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  // Keep this in sync with the Stripe SDK's supported apiVersion literal type.
  apiVersion: '2025-11-17.clover',
  typescript: true,
});

// Webhook secret for verifying Stripe webhook signatures
export const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

// App URLs for redirects
export const getURL = () => {
  let url =
    process.env.NEXT_PUBLIC_APP_URL ??
    process.env.NEXT_PUBLIC_VERCEL_URL ??
    'http://localhost:3000';
  
  // Make sure to include https:// when not localhost
  url = url.includes('http') ? url : `https://${url}`;
  // Make sure to NOT include trailing slash
  url = url.charAt(url.length - 1) === '/' ? url.slice(0, -1) : url;
  
  return url;
};
