/** @type {import('next').NextConfig} */
const nextConfig = {
  // Prevent 307 redirects for API routes (fixes Stripe webhook issues)
  skipTrailingSlashRedirect: true,
  
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Windows + synced folders (e.g. Google Drive) can throw filesystem errors during
  // Next/webpack persistent caching and output file tracing. Keep defaults on Vercel,
  // but disable these locally for stability.
  outputFileTracing: process.env.VERCEL ? true : false,
  
  webpack: (config) => {
    if (!process.env.VERCEL) {
      config.cache = false;
    }
    return config;
  },

  // PostHog reverse proxy - prevents ad blockers from blocking analytics
  async rewrites() {
    return [
      {
        source: '/ingest/static/:path*',
        destination: 'https://us-assets.i.posthog.com/static/:path*',
      },
      {
        source: '/ingest/:path*',
        destination: 'https://us.i.posthog.com/:path*',
      },
    ];
  },
};

export default nextConfig;