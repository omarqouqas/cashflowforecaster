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
      'freelancer budget',
      'variable income management',
      'freelance finances',
      'income planning',
      'feast or famine cycle',
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
