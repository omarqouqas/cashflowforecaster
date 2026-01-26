/**
 * Structured data schemas for SEO/AEO optimization
 * These schemas help search engines and AI assistants understand the content better
 */

// Organization schema for brand recognition
export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Cash Flow Forecaster',
  url: 'https://cashflowforecaster.io',
  logo: 'https://cashflowforecaster.io/logo.png',
  description: 'Cash flow calendar app for freelancers with irregular income. See your bank balance up to 365 days ahead.',
  foundingDate: '2024',
  sameAs: [
    // Add social profiles as they become available
    // 'https://twitter.com/cashflowforecast',
    // 'https://linkedin.com/company/cashflowforecaster',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    email: 'support@cashflowforecaster.io',
    contactType: 'customer support',
    availableLanguage: 'English',
  },
  offers: {
    '@type': 'Offer',
    description: 'Free cash flow calendar for freelancers',
    price: '0',
    priceCurrency: 'USD',
  },
} as const;

// WebSite schema for sitelinks search box
export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Cash Flow Forecaster',
  url: 'https://cashflowforecaster.io',
  description: 'Cash flow calendar app for freelancers with irregular income',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://cashflowforecaster.io/search?q={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
} as const;

// Helper to generate BreadcrumbList schema
export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function generateBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

// Predefined breadcrumb paths
export const breadcrumbs = {
  home: { name: 'Home', url: 'https://cashflowforecaster.io' },
  tools: { name: 'Free Tools', url: 'https://cashflowforecaster.io/tools' },
  compare: { name: 'Compare', url: 'https://cashflowforecaster.io/compare' },
  pricing: { name: 'Pricing', url: 'https://cashflowforecaster.io/pricing' },
  blog: { name: 'Blog', url: 'https://cashflowforecaster.io/blog' },
} as const;

// AEO-optimized definitional content for common questions
export const definitions = {
  safeToSpend: {
    term: 'Safe to Spend',
    definition: 'Safe to Spend is the maximum amount you can spend today without risking an overdraft in the next 14 days. It\'s calculated by taking your lowest projected balance over the next two weeks and subtracting your safety buffer. This gives freelancers with irregular income a clear, single number that answers "Can I afford this?" without guessing.',
    alsoKnownAs: ['available balance', 'spendable amount', 'discretionary income', 'cushion'],
  },
  cashFlowCalendar: {
    term: 'Cash Flow Calendar',
    definition: 'A cash flow calendar is a visual tool that maps your expected income (like invoices, paychecks, or client payments) and upcoming bills onto specific dates. Unlike a traditional budget that shows monthly totals, a cash flow calendar shows your projected bank balance day-by-day, helping you spot low-balance days before they happen.',
    alsoKnownAs: ['bill calendar', 'payment calendar', 'balance forecast', 'income calendar'],
  },
  cashFlowForecast: {
    term: 'Cash Flow Forecast',
    definition: 'A cash flow forecast predicts your future bank balance based on known income and expenses. For freelancers, this means projecting when invoices will be paid, when bills are due, and what your balance will be on any given day. A good cash flow forecast helps you avoid overdrafts, plan large purchases, and manage irregular income.',
    alsoKnownAs: ['balance projection', 'cash projection', 'liquidity forecast', 'financial forecast'],
  },
  irregularIncome: {
    term: 'Irregular Income',
    definition: 'Irregular income refers to earnings that don\'t arrive on a predictable schedule or in consistent amounts. Freelancers, consultants, gig workers, and contractors typically have irregular income because they\'re paid per project, by the hour, or based on invoice terms like Net-30. This makes traditional monthly budgeting difficult and requires day-by-day cash flow planning.',
    alsoKnownAs: ['variable income', 'unpredictable income', 'project-based income', 'freelance income'],
  },
  runwayCollect: {
    term: 'Runway Collect',
    definition: 'Runway Collect is Cash Flow Forecaster\'s built-in invoicing feature that lets freelancers create professional invoices, send one-click payment links via Stripe, and automatically sync expected payments to their cash flow forecast. When a client pays, the invoice status updates automatically.',
    alsoKnownAs: ['invoicing feature', 'payment collection', 'invoice management'],
  },
} as const;

// Product schema for software application
export const productSchema = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'Cash Flow Forecaster Pro',
  description: '365-day cash flow forecast with unlimited bills, invoicing, and tax tracking for freelancers',
  brand: {
    '@type': 'Brand',
    name: 'Cash Flow Forecaster',
  },
  offers: [
    {
      '@type': 'Offer',
      name: 'Free Plan',
      price: '0',
      priceCurrency: 'USD',
      description: '90-day forecast, 10 bills, 10 income sources',
      availability: 'https://schema.org/InStock',
    },
    {
      '@type': 'Offer',
      name: 'Pro Plan',
      price: '7.99',
      priceCurrency: 'USD',
      priceValidUntil: '2026-12-31',
      description: '365-day forecast, unlimited bills and income, invoicing, tax tracking',
      availability: 'https://schema.org/InStock',
    },
  ],
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    ratingCount: '25',
    bestRating: '5',
    worstRating: '1',
  },
} as const;
