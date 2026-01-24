import type { Metadata } from 'next';
import Link from 'next/link';
import LandingHeader from '@/components/landing/landing-header';
import { LandingFooter } from '@/components/landing/footer';

export const metadata: Metadata = {
  title: 'Freelance Finance Glossary | Cash Flow Forecaster',
  description:
    'Clear definitions of cash flow, invoicing, tax, and budgeting terms every freelancer needs to know. Plain English explanations for self-employed finances.',
  keywords: [
    'freelance finance terms',
    'cash flow definition',
    'net 30 meaning',
    'self-employment tax explained',
    'freelancer accounting terms',
    'invoice terms glossary',
    'solopreneur finance dictionary',
  ],
  openGraph: {
    title: 'Freelance Finance Glossary | Cash Flow Forecaster',
    description:
      'Clear definitions of cash flow, invoicing, tax, and budgeting terms every freelancer needs to know.',
    type: 'website',
  },
};

interface GlossaryTerm {
  term: string;
  definition: string;
  relatedLink?: {
    text: string;
    href: string;
  };
}

const glossaryTerms: GlossaryTerm[] = [
  {
    term: '1099 Contractor',
    definition:
      'A self-employed individual who receives a 1099-NEC tax form instead of a W-2. Unlike employees, 1099 contractors pay their own taxes, including self-employment tax, and are responsible for their own benefits.',
    relatedLink: {
      text: 'Quarterly Tax Savings for 1099 Contractors',
      href: '/blog/quarterly-tax-savings-1099-contractors',
    },
  },
  {
    term: 'Accounts Receivable',
    definition:
      'Money owed to you by clients for work you have completed but haven\'t been paid for yet. For freelancers, this typically includes unpaid invoices.',
  },
  {
    term: 'Balance Projection',
    definition:
      'A forecast of your future bank balance based on expected income and scheduled expenses. Balance projections help freelancers see potential cash shortfalls before they happen.',
    relatedLink: {
      text: 'Cash Flow Forecasting for Freelancers',
      href: '/blog/cash-flow-forecasting-for-freelancers',
    },
  },
  {
    term: 'Billable Hours',
    definition:
      'Time spent working directly on client projects that you can charge for. Non-billable hours include administrative tasks, marketing, and professional development.',
  },
  {
    term: 'Cash Flow',
    definition:
      'The movement of money in and out of your business over time. Positive cash flow means more money coming in than going out. For freelancers, managing cash flow is crucial because income is often irregular.',
    relatedLink: {
      text: 'How to Manage Irregular Income',
      href: '/blog/how-to-manage-irregular-income-as-freelancer',
    },
  },
  {
    term: 'Cash Flow Forecast',
    definition:
      'A prediction of your future cash position based on expected income (like pending invoices) and planned expenses (like rent and subscriptions). Helps you plan ahead and avoid overdrafts.',
    relatedLink: {
      text: 'Why Day-by-Day Visibility Matters',
      href: '/blog/cash-flow-forecasting-for-freelancers',
    },
  },
  {
    term: 'Cash Reserve',
    definition:
      'Money set aside for emergencies or slow periods. Also called an emergency fund or runway. Freelancers typically need larger cash reserves than employees due to income variability.',
    relatedLink: {
      text: 'How Much Emergency Fund Do You Need?',
      href: '/blog/freelancer-emergency-fund-how-much',
    },
  },
  {
    term: 'Deductible Expense',
    definition:
      'A business expense that reduces your taxable income. Common freelancer deductions include home office costs, software subscriptions, professional development, and equipment.',
    relatedLink: {
      text: 'How to Track Freelance Expenses',
      href: '/blog/how-to-track-freelance-income-expenses',
    },
  },
  {
    term: 'Due on Receipt',
    definition:
      'Payment terms indicating that payment is expected immediately upon receiving the invoice. Common for small projects or new client relationships.',
    relatedLink: {
      text: 'Invoice Payment Terms Explained',
      href: '/blog/invoice-payment-terms-net-30-explained',
    },
  },
  {
    term: 'Emergency Fund',
    definition:
      'Savings set aside for unexpected expenses or income gaps. For freelancers, the recommended amount is typically 3-6 months of expenses, though some prefer more due to income unpredictability.',
    relatedLink: {
      text: 'Freelancer Emergency Fund Guide',
      href: '/blog/freelancer-emergency-fund-how-much',
    },
  },
  {
    term: 'Estimated Tax Payments',
    definition:
      'Quarterly tax payments required by the IRS for self-employed individuals. Due on April 15, June 15, September 15, and January 15 of the following year.',
    relatedLink: {
      text: 'Quarterly Tax Savings Guide',
      href: '/blog/quarterly-tax-savings-1099-contractors',
    },
  },
  {
    term: 'Feast or Famine Cycle',
    definition:
      'The common freelancer experience of alternating between periods of too much work (feast) and too little work (famine). Proper cash flow management and client diversification help smooth this cycle.',
  },
  {
    term: 'Gross Income',
    definition:
      'Your total revenue before any deductions or expenses. For freelancers, this is the total amount invoiced to clients before subtracting business expenses or taxes.',
  },
  {
    term: 'Income Variability',
    definition:
      'The degree to which your income fluctuates from month to month. High income variability is common for freelancers and requires special budgeting strategies.',
    relatedLink: {
      text: 'Income Variability Calculator',
      href: '/tools/income-variability-calculator',
    },
  },
  {
    term: 'Invoice',
    definition:
      'A document sent to clients requesting payment for completed work. Includes details like services provided, amounts due, payment terms, and payment methods.',
  },
  {
    term: 'Late Payment Fee',
    definition:
      'A charge added to overdue invoices, typically 1-2% per month. Including late payment terms in your contract can incentivize timely payment.',
  },
  {
    term: 'Minimum Viable Income',
    definition:
      'The bare minimum amount you need to earn to cover essential expenses. Knowing this number helps freelancers make decisions during slow periods.',
  },
  {
    term: 'Net 15',
    definition:
      'Payment terms indicating payment is due within 15 days of the invoice date. Shorter than Net 30, often used for smaller projects or established client relationships.',
    relatedLink: {
      text: 'Invoice Payment Terms Explained',
      href: '/blog/invoice-payment-terms-net-30-explained',
    },
  },
  {
    term: 'Net 30',
    definition:
      'Payment terms indicating payment is due within 30 days of the invoice date. The most common payment terms for freelance work.',
    relatedLink: {
      text: 'Invoice Payment Terms Explained',
      href: '/blog/invoice-payment-terms-net-30-explained',
    },
  },
  {
    term: 'Net Income',
    definition:
      'Your income after subtracting all business expenses, also called profit. This is different from gross income and is what you actually have available to pay yourself and save.',
  },
  {
    term: 'Overhead',
    definition:
      'Ongoing business expenses that aren\'t directly tied to specific projects. Examples include software subscriptions, insurance, and professional memberships.',
  },
  {
    term: 'Payment Terms',
    definition:
      'The conditions under which payment is expected, including when payment is due and any late fees. Common terms include Net 30, Net 15, and Due on Receipt.',
    relatedLink: {
      text: 'Invoice Payment Terms Explained',
      href: '/blog/invoice-payment-terms-net-30-explained',
    },
  },
  {
    term: 'Profit Margin',
    definition:
      'The percentage of revenue that remains after expenses. Calculated as (Revenue - Expenses) / Revenue × 100. Helps determine if your rates are sustainable.',
  },
  {
    term: 'Quarterly Taxes',
    definition:
      'Estimated tax payments made four times per year by self-employed individuals. Required when you expect to owe $1,000 or more in taxes for the year.',
    relatedLink: {
      text: 'Quarterly Tax Savings Guide',
      href: '/blog/quarterly-tax-savings-1099-contractors',
    },
  },
  {
    term: 'Rate Increase',
    definition:
      'Raising your prices for services. Recommended annually or when you gain experience, develop new skills, or have more demand than capacity.',
    relatedLink: {
      text: 'When to Raise Your Freelance Rates',
      href: '/blog/when-to-raise-freelance-rates',
    },
  },
  {
    term: 'Recurring Revenue',
    definition:
      'Income that repeats on a regular schedule, such as monthly retainers or subscription services. More predictable than project-based income.',
  },
  {
    term: 'Retainer',
    definition:
      'A recurring payment arrangement where a client pays a fixed amount monthly for ongoing services or guaranteed availability. Provides predictable income for freelancers.',
  },
  {
    term: 'Revenue',
    definition:
      'The total amount of money earned from services before expenses. For freelancers, revenue equals the total of all paid invoices.',
  },
  {
    term: 'Runway',
    definition:
      'How long you can sustain your business without new income, based on your current cash reserves and burn rate. Knowing your runway helps with financial planning.',
    relatedLink: {
      text: 'Freelancer Emergency Fund Guide',
      href: '/blog/freelancer-emergency-fund-how-much',
    },
  },
  {
    term: 'Safe to Spend',
    definition:
      'The amount you can safely spend after accounting for upcoming bills, taxes, and savings goals. More useful than your bank balance for day-to-day spending decisions.',
    relatedLink: {
      text: 'What is Safe to Spend?',
      href: '/blog/what-is-safe-to-spend',
    },
  },
  {
    term: 'Scope Creep',
    definition:
      'When a project expands beyond its original requirements without corresponding adjustments to timeline or budget. Common freelancer challenge that affects profitability.',
  },
  {
    term: 'Self-Employment Tax',
    definition:
      'The Social Security and Medicare taxes that self-employed individuals must pay on their net earnings. Currently 15.3% (12.4% Social Security + 2.9% Medicare).',
    relatedLink: {
      text: 'Quarterly Tax Savings Guide',
      href: '/blog/quarterly-tax-savings-1099-contractors',
    },
  },
  {
    term: 'Solopreneur',
    definition:
      'An entrepreneur who runs their business alone without employees. Similar to a freelancer but may sell products or services at scale rather than trading time for money.',
  },
  {
    term: 'Tax Reserve',
    definition:
      'Money set aside specifically for tax payments. Freelancers typically save 25-30% of income for federal taxes, plus any state taxes.',
    relatedLink: {
      text: 'Quarterly Tax Savings Guide',
      href: '/blog/quarterly-tax-savings-1099-contractors',
    },
  },
  {
    term: 'Variable Income',
    definition:
      'Income that changes from period to period, as opposed to a fixed salary. Most freelancers have variable income, which requires special budgeting strategies.',
    relatedLink: {
      text: 'How to Budget with Variable Income',
      href: '/blog/how-to-budget-with-variable-income',
    },
  },
];

// Generate JSON-LD for all glossary terms
function generateGlossarySchema(terms: GlossaryTerm[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'DefinedTermSet',
    name: 'Freelance Finance Glossary',
    description:
      'Definitions of cash flow, invoicing, tax, and budgeting terms for freelancers and self-employed professionals.',
    hasDefinedTerm: terms.map((item) => ({
      '@type': 'DefinedTerm',
      name: item.term,
      description: item.definition,
    })),
  };
}

export default function GlossaryPage() {
  // Group terms by first letter
  const groupedTerms = glossaryTerms.reduce(
    (acc, term) => {
      const firstChar = term.term[0];
      if (!firstChar) return acc;
      const letter = firstChar.toUpperCase();
      if (!acc[letter]) {
        acc[letter] = [];
      }
      acc[letter].push(term);
      return acc;
    },
    {} as Record<string, GlossaryTerm[]>
  );

  const letters = Object.keys(groupedTerms).sort();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateGlossarySchema(glossaryTerms)),
        }}
      />
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        <LandingHeader />
        <main className="flex-grow">
          <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                Freelance Finance Glossary
              </h1>
              <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                Plain English definitions for cash flow, invoicing, taxes, and
                budgeting terms. Everything you need to understand your finances
                as a freelancer.
              </p>
            </div>

            {/* Quick navigation */}
            <nav className="mb-12 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
              <p className="text-sm text-slate-400 mb-3">Jump to letter:</p>
              <div className="flex flex-wrap gap-2">
                {letters.map((letter) => (
                  <a
                    key={letter}
                    href={`#${letter}`}
                    className="w-8 h-8 flex items-center justify-center rounded bg-slate-700 text-slate-300 hover:bg-teal-600 hover:text-white transition-colors text-sm font-medium"
                  >
                    {letter}
                  </a>
                ))}
              </div>
            </nav>

            {/* Terms */}
            <div className="space-y-12">
              {letters.map((letter) => {
                const terms = groupedTerms[letter];
                if (!terms) return null;
                return (
                <section key={letter} id={letter}>
                  <h2 className="text-2xl font-bold text-teal-400 mb-6 pb-2 border-b border-slate-700">
                    {letter}
                  </h2>
                  <dl className="space-y-6">
                    {terms.map((item) => (
                      <div
                        key={item.term}
                        className="p-4 bg-slate-800/30 rounded-lg border border-slate-700/50"
                      >
                        <dt className="text-lg font-semibold text-white mb-2">
                          {item.term}
                        </dt>
                        <dd className="text-slate-300 leading-relaxed">
                          {item.definition}
                        </dd>
                        {item.relatedLink && (
                          <Link
                            href={item.relatedLink.href}
                            className="inline-flex items-center mt-3 text-sm text-teal-400 hover:text-teal-300"
                          >
                            Learn more: {item.relatedLink.text}
                            <svg
                              className="ml-1 w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                          </Link>
                        )}
                      </div>
                    ))}
                  </dl>
                </section>
              );})}
            </div>

            {/* CTA */}
            <div className="mt-16 p-8 bg-gradient-to-r from-teal-900/40 to-cyan-900/40 rounded-xl border border-teal-700/50 text-center">
              <h2 className="text-2xl font-bold text-white mb-3">
                Put These Concepts Into Practice
              </h2>
              <p className="text-slate-300 mb-6 max-w-xl mx-auto">
                Cash Flow Forecaster helps you manage irregular income with
                day-by-day balance projections, safe-to-spend calculations, and
                automatic tax set-asides.
              </p>
              <Link
                href="/signup"
                className="inline-flex items-center px-6 py-3 rounded-lg bg-teal-500 text-white font-semibold hover:bg-teal-400 transition-colors"
              >
                Start Free Trial
                <svg
                  className="ml-2 w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </main>
        <LandingFooter />
      </div>
    </>
  );
}
