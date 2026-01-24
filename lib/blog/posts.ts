export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  updatedAt?: string;
  author: {
    name: string;
    role: string;
  };
  category: 'guides' | 'tips' | 'tools' | 'news';
  readingTime: string;
  keywords: string[];
  image?: string;
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'best-cash-flow-apps-freelancers-2026',
    title: 'Best Cash Flow Apps for Freelancers in 2026: A Comparison',
    description: 'Compare the top cash flow forecasting apps for freelancers. We break down features, pricing, and which app works best for different freelance situations.',
    publishedAt: '2026-01-23',
    author: {
      name: 'Cash Flow Forecaster Team',
      role: 'Personal Finance Experts',
    },
    category: 'tools',
    readingTime: '8 min read',
    keywords: [
      'best cash flow app',
      'cash flow apps for freelancers',
      'freelance finance apps',
      'money management apps freelancers',
      'cash flow forecasting software',
      'freelancer budget app',
      'self-employed finance app',
      'gig worker money app',
      'invoice tracking app',
      'best budgeting app irregular income',
    ],
  },
  {
    slug: 'how-to-track-freelance-income-expenses',
    title: 'How to Track Freelance Income and Expenses (Without Losing Your Mind)',
    description: 'A simple, practical system for tracking freelance income and expenses. Learn what to track, how often, and the best tools for the job.',
    publishedAt: '2026-01-23',
    author: {
      name: 'Cash Flow Forecaster Team',
      role: 'Personal Finance Experts',
    },
    category: 'guides',
    readingTime: '7 min read',
    keywords: [
      'track freelance income',
      'freelance expense tracking',
      'freelancer bookkeeping',
      'self-employed record keeping',
      '1099 income tracking',
      'freelance tax deductions',
      'business expense tracker',
      'solopreneur accounting',
      'gig worker expenses',
      'freelance financial records',
    ],
  },
  {
    slug: 'quarterly-tax-savings-1099-contractors',
    title: 'Quarterly Tax Savings for 1099 Contractors: How Much to Set Aside',
    description: 'Learn exactly how much to save for quarterly taxes as a 1099 contractor. Includes a simple formula and tips to avoid underpayment penalties.',
    publishedAt: '2026-01-23',
    author: {
      name: 'Cash Flow Forecaster Team',
      role: 'Personal Finance Experts',
    },
    category: 'guides',
    readingTime: '6 min read',
    keywords: [
      'quarterly taxes freelancer',
      '1099 tax savings',
      'self-employment tax',
      'estimated tax payments',
      'how much to save for taxes freelance',
      'quarterly tax calculator',
      'freelancer tax planning',
      'independent contractor taxes',
      'gig worker taxes',
      'solopreneur tax tips',
    ],
  },
  {
    slug: 'when-to-raise-freelance-rates',
    title: 'When to Raise Your Freelance Rates (And How to Do It)',
    description: 'Signs it\'s time to increase your rates, how much to raise them, and scripts for telling existing clients. Stop undercharging for your work.',
    publishedAt: '2026-01-23',
    author: {
      name: 'Cash Flow Forecaster Team',
      role: 'Personal Finance Experts',
    },
    category: 'tips',
    readingTime: '6 min read',
    keywords: [
      'raise freelance rates',
      'increase freelance prices',
      'freelance rate increase',
      'how to raise rates',
      'freelancer pricing strategy',
      'when to charge more',
      'freelance rate negotiation',
      'tell clients about rate increase',
      'undercharging freelance',
      'freelance income growth',
    ],
  },
  {
    slug: 'how-to-budget-with-variable-income',
    title: 'How to Budget with Variable Income: A Practical System',
    description: 'Traditional budgets assume steady paychecks. Learn a flexible budgeting system designed for solopreneurs, gig workers, and anyone with unpredictable income.',
    publishedAt: '2026-01-23',
    author: {
      name: 'Cash Flow Forecaster Team',
      role: 'Personal Finance Experts',
    },
    category: 'guides',
    readingTime: '7 min read',
    keywords: [
      'variable income budget',
      'budget with irregular income',
      'solopreneur budget',
      'self-employed budgeting',
      'gig worker budget',
      '1099 budget system',
      'flexible budgeting',
      'unpredictable income',
    ],
  },
  {
    slug: 'freelancer-emergency-fund-how-much',
    title: 'Freelancer Emergency Fund: How Much Do You Actually Need?',
    description: 'The standard "3-6 months expenses" advice doesn\'t account for irregular income. Here\'s how to calculate the right emergency fund size for freelancers.',
    publishedAt: '2026-01-23',
    author: {
      name: 'Cash Flow Forecaster Team',
      role: 'Personal Finance Experts',
    },
    category: 'guides',
    readingTime: '6 min read',
    keywords: [
      'freelancer emergency fund',
      'emergency savings freelancer',
      'solopreneur savings',
      'self-employed emergency fund',
      'gig worker savings',
      'how much emergency fund',
      'runway for freelancers',
      'financial buffer',
    ],
  },
  {
    slug: 'invoice-payment-terms-net-30-explained',
    title: 'Invoice Payment Terms Explained: Net 30, Net 15, Due on Receipt',
    description: 'Confused by invoice payment terms? Learn what Net 30, Net 15, and Due on Receipt mean, and which terms to use with different clients.',
    publishedAt: '2026-01-23',
    author: {
      name: 'Cash Flow Forecaster Team',
      role: 'Personal Finance Experts',
    },
    category: 'guides',
    readingTime: '5 min read',
    keywords: [
      'invoice payment terms',
      'net 30 meaning',
      'net 15 invoice',
      'due on receipt',
      'freelancer invoicing',
      'payment terms for freelancers',
      'invoice due date',
      'when to expect payment',
    ],
  },
  {
    slug: 'how-to-manage-irregular-income-as-freelancer',
    title: 'How to Manage Irregular Income as a Freelancer: A Complete Guide',
    description: 'Learn proven strategies for budgeting, saving, and planning when your income is unpredictable. Stop the feast-or-famine cycle with these practical tips.',
    publishedAt: '2026-01-23',
    author: {
      name: 'Cash Flow Forecaster Team',
      role: 'Personal Finance Experts',
    },
    category: 'guides',
    readingTime: '8 min read',
    keywords: [
      'irregular income',
      'variable income management',
      'freelancer budget',
      'freelance finances',
      'solopreneur finances',
      'self-employed budgeting',
      'gig worker budget',
      '1099 contractor finances',
      'side hustle income',
      'feast or famine cycle',
      'income planning',
    ],
  },
  {
    slug: 'what-is-safe-to-spend',
    title: 'What is "Safe to Spend"? The One Number Every Freelancer Needs',
    description: 'Discover why tracking your Safe to Spend amount is more important than your bank balance, and how to calculate it for irregular income.',
    publishedAt: '2026-01-23',
    author: {
      name: 'Cash Flow Forecaster Team',
      role: 'Personal Finance Experts',
    },
    category: 'guides',
    readingTime: '5 min read',
    keywords: [
      'safe to spend',
      'spendable amount',
      'available balance',
      'discretionary income',
      'cash flow management',
      'freelancer money management',
      'solopreneur budgeting',
      'self-employed spending',
      'gig worker finances',
    ],
  },
  {
    slug: 'cash-flow-forecasting-for-freelancers',
    title: 'Cash Flow Forecasting for Freelancers: Why Day-by-Day Visibility Matters',
    description: 'Learn why monthly budgets fail freelancers and how daily cash flow forecasting helps you avoid overdrafts and plan with confidence.',
    publishedAt: '2026-01-23',
    author: {
      name: 'Cash Flow Forecaster Team',
      role: 'Personal Finance Experts',
    },
    category: 'guides',
    readingTime: '6 min read',
    keywords: [
      'cash flow forecast',
      'cash flow forecasting',
      'freelancer finances',
      'solopreneur cash flow',
      'self-employed cash flow',
      'gig worker cash flow',
      '1099 income tracking',
      'balance projection',
      'daily cash flow',
      'overdraft prevention',
    ],
  },
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find(post => post.slug === slug);
}

export function getAllPosts(): BlogPost[] {
  return blogPosts.sort((a, b) =>
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}
