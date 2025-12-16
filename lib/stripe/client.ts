// lib/stripe/client.ts
// ============================================
// Stripe Client Configuration
// ============================================

import Stripe from 'stripe';

// Server-side Stripe instance (use in API routes and server actions only)
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
  typescript: true,
});

// Webhook secret for verifying Stripe webhook signatures
export const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

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
