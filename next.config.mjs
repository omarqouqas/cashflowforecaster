/** @type {import('next').NextConfig} */
const nextConfig = {
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
};

export default nextConfig;
