/** @type {import('next').NextConfig} */
const nextConfig = {
  // Explicitly disable trailing slashes for consistent URLs
  // This ensures /blog redirects from /blog/ properly (good for SEO)
  trailingSlash: false,

  eslint: {
    ignoreDuringBuilds: true,
  },

  // Allow images from Supabase storage
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
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