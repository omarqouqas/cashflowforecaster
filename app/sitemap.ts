import type { MetadataRoute } from 'next';

const baseUrl = 'https://www.cashflowforecaster.io';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    { url: `${baseUrl}`, lastModified, priority: 1.0 },
    { url: `${baseUrl}/pricing`, lastModified, priority: 0.8 },
    { url: `${baseUrl}/compare`, lastModified, priority: 0.7 },
    { url: `${baseUrl}/compare/cash-flow-calendar-apps`, lastModified, priority: 0.7 },
    { url: `${baseUrl}/tools`, lastModified, priority: 0.6 },
    { url: `${baseUrl}/tools/can-i-afford-it`, lastModified, priority: 0.6 },
    { url: `${baseUrl}/tools/freelance-rate-calculator`, lastModified, priority: 0.6 },
    { url: `${baseUrl}/tools/invoice-payment-predictor`, lastModified, priority: 0.6 },
    { url: `${baseUrl}/tools/income-variability-calculator`, lastModified, priority: 0.6 },
    { url: `${baseUrl}/auth/login`, lastModified, priority: 0.5 },
    { url: `${baseUrl}/auth/signup`, lastModified, priority: 0.8 },
    { url: `${baseUrl}/privacy`, lastModified, priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified, priority: 0.3 },
  ];
}