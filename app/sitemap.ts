import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    { url: 'https://cashflowforecaster.io', lastModified, priority: 1.0 },
    { url: 'https://cashflowforecaster.io/pricing', lastModified, priority: 0.8 },
    { url: 'https://cashflowforecaster.io/compare', lastModified, priority: 0.7 },
    { url: 'https://cashflowforecaster.io/compare/cash-flow-calendar-apps', lastModified, priority: 0.7 },
    { url: 'https://cashflowforecaster.io/tools', lastModified, priority: 0.6 },
    { url: 'https://cashflowforecaster.io/tools/can-i-afford-it', lastModified, priority: 0.6 },
    { url: 'https://cashflowforecaster.io/tools/freelance-rate-calculator', lastModified, priority: 0.6 },
    { url: 'https://cashflowforecaster.io/tools/invoice-payment-predictor', lastModified, priority: 0.6 },
    { url: 'https://cashflowforecaster.io/tools/income-variability-calculator', lastModified, priority: 0.6 },
    { url: 'https://cashflowforecaster.io/auth/login', lastModified, priority: 0.5 },
    { url: 'https://cashflowforecaster.io/auth/signup', lastModified, priority: 0.8 },
    { url: 'https://cashflowforecaster.io/privacy', lastModified, priority: 0.3 },
    { url: 'https://cashflowforecaster.io/terms', lastModified, priority: 0.3 },
    // Add any other public pages here
  ];
}


