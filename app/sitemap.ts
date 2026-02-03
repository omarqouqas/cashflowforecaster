import type { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/blog/posts';

const baseUrl = 'https://cashflowforecaster.io';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  // Get all blog posts for sitemap
  const blogPosts = getAllPosts().map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt || post.publishedAt),
    priority: 0.7,
  }));

  return [
    // Core pages
    { url: `${baseUrl}`, lastModified, priority: 1.0 },
    { url: `${baseUrl}/pricing`, lastModified, priority: 0.8 },
    { url: `${baseUrl}/auth/signup`, lastModified, priority: 0.8 },

    // Blog
    { url: `${baseUrl}/blog`, lastModified, priority: 0.8 },
    ...blogPosts,

    // Comparison pages
    { url: `${baseUrl}/compare`, lastModified, priority: 0.7 },
    { url: `${baseUrl}/compare/cash-flow-calendar-apps`, lastModified, priority: 0.7 },
    { url: `${baseUrl}/compare/ynab`, lastModified, priority: 0.8 },
    { url: `${baseUrl}/compare/mint`, lastModified, priority: 0.8 },

    // Free tools
    { url: `${baseUrl}/tools`, lastModified, priority: 0.6 },
    { url: `${baseUrl}/tools/can-i-afford-it`, lastModified, priority: 0.6 },
    { url: `${baseUrl}/tools/freelance-rate-calculator`, lastModified, priority: 0.6 },
    { url: `${baseUrl}/tools/invoice-payment-predictor`, lastModified, priority: 0.6 },
    { url: `${baseUrl}/tools/income-variability-calculator`, lastModified, priority: 0.6 },

    // Auth & legal
    { url: `${baseUrl}/auth/login`, lastModified, priority: 0.5 },
    { url: `${baseUrl}/privacy`, lastModified, priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified, priority: 0.3 },
  ];
}