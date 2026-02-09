import type { Metadata } from 'next';
import Link from 'next/link';
import LandingHeader from '@/components/landing/landing-header';
import { LandingFooter } from '@/components/landing/footer';
import { VariabilityCalculator } from '@/components/tools/variability-calculator';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { breadcrumbs } from '@/components/seo/schemas';
import { TrendingUp, AlertTriangle, PiggyBank, HelpCircle, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Income Variability Calculator | Cash Flow Forecaster',
  description:
    'Free calculator to measure your freelance income variability. Enter your monthly income history to see your stability score, danger zones, and recommended emergency fund.',
  keywords: [
    'freelance income variability',
    'income variability calculator',
    'irregular income calculator',
    'freelance income stability',
    'income volatility calculator',
    'freelancer income analysis',
    'self employed income calculator',
    'gig economy income stability',
  ],
  alternates: {
    canonical: 'https://www.cashflowforecaster.io/tools/income-variability-calculator',
  },
  openGraph: {
    title: 'Income Variability Calculator | Cash Flow Forecaster',
    description:
      'Measure your income stability. See your variability score, identify danger zones, and get emergency fund recommendations.',
    url: 'https://www.cashflowforecaster.io/tools/income-variability-calculator',
    siteName: 'Cash Flow Forecaster',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Income Variability Calculator | Cash Flow Forecaster',
    description: 'Free calculator to measure freelance income variability and get personalized recommendations.',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Freelance Income Variability Calculator',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Web',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  isAccessibleForFree: true,
  url: 'https://www.cashflowforecaster.io/tools/income-variability-calculator',
} as const;

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is income variability?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Income variability measures how much your income fluctuates from month to month. High variability means your income swings dramatically (common for freelancers), while low variability means predictable, steady income. Understanding your variability helps you plan savings and budget appropriately.',
      },
    },
    {
      '@type': 'Question',
      name: 'How much should I save with variable income?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'With variable income, aim for 6-12 months of expenses in emergency savings, compared to 3-6 months for steady income earners. The more variable your income, the larger your buffer should be. Calculate your coefficient of variation—if it\'s above 30%, lean toward 9-12 months of savings.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is a good income stability score for freelancers?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A coefficient of variation (CV) below 20% indicates stable income. 20-40% is moderate variability—typical for many freelancers. Above 40% indicates high variability, common in project-based work or seasonal industries. Most freelancers fall in the 25-45% range.',
      },
    },
    {
      '@type': 'Question',
      name: 'How can I reduce my income variability?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'To stabilize freelance income: 1) Pursue retainer clients who pay monthly, 2) Diversify your client base across industries, 3) Build recurring revenue through productized services, 4) Maintain a pipeline of potential projects, 5) Consider complementary income streams during slow periods.',
      },
    },
  ],
} as const;

const faqs = [
  {
    question: 'What is income variability?',
    answer: 'Income variability measures how much your income fluctuates month to month. High variability means dramatic swings, while low variability means steady, predictable income.',
  },
  {
    question: 'How much should I save with variable income?',
    answer: 'Aim for 6-12 months of expenses in emergency savings (vs 3-6 for steady income). The more variable your income, the larger your buffer should be.',
  },
  {
    question: 'What is a good stability score for freelancers?',
    answer: 'A coefficient of variation below 20% is stable. 20-40% is moderate (typical for freelancers). Above 40% is high variability. Most freelancers fall in the 25-45% range.',
  },
  {
    question: 'How can I reduce my income variability?',
    answer: 'Pursue retainer clients, diversify across industries, build recurring revenue through productized services, and maintain a pipeline of potential projects.',
  },
];

export default function IncomeVariabilityCalculatorPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white selection-teal">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* Dot grid background */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 opacity-[0.22]"
        style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          backgroundPosition: 'center',
        }}
      />

      <LandingHeader />

      <main className="px-6 py-12">
        <div className="mx-auto max-w-6xl">
          <Breadcrumbs
            items={[
              breadcrumbs.home,
              breadcrumbs.tools,
              { name: 'Income Variability', url: 'https://www.cashflowforecaster.io/tools/income-variability-calculator' },
            ]}
            className="mb-8"
          />

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-zinc-900/60 border border-zinc-800 px-4 py-2 text-sm text-zinc-200">
              <TrendingUp className="h-4 w-4 text-teal-400" />
              <span>Free tool • No login required</span>
            </div>

            <h1 className="mt-6 text-4xl md:text-5xl font-bold text-white tracking-tight">Income Variability Calculator</h1>

            <p className="mt-4 text-lg text-zinc-300 leading-relaxed">
              How stable is your freelance income? Enter your monthly earnings to get your variability score, see danger
              zones, and get a personalized emergency fund recommendation.
            </p>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-white">
                  <TrendingUp className="h-4 w-4 text-teal-300" />
                  Variability score
                </div>
                <p className="mt-2 text-sm text-zinc-400">See if your income variability is low, medium, or high.</p>
              </div>
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-white">
                  <AlertTriangle className="h-4 w-4 text-teal-300" />
                  Danger zone analysis
                </div>
                <p className="mt-2 text-sm text-zinc-400">Identify months where income fell below your expenses.</p>
              </div>
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-white">
                  <PiggyBank className="h-4 w-4 text-teal-300" />
                  Emergency fund target
                </div>
                <p className="mt-2 text-sm text-zinc-400">Get a personalized savings target for irregular income.</p>
              </div>
            </div>
          </div>

          <div className="mt-10">
            <VariabilityCalculator />
          </div>

          <div className="mt-10 max-w-5xl">
            <p className="text-xs text-zinc-600 leading-relaxed">
              Disclaimer: This calculator provides estimates based on the income data you provide. Variability scores and
              recommendations are for informational purposes only. Consult a financial advisor for personalized advice.
            </p>
          </div>

          {/* FAQ Section */}
          <section className="mt-16 max-w-3xl">
            <div className="flex items-center gap-2 mb-6">
              <HelpCircle className="h-5 w-5 text-teal-400" />
              <h2 className="text-xl font-semibold text-white">Frequently Asked Questions</h2>
            </div>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <details
                  key={index}
                  className="group rounded-xl border border-zinc-800 bg-zinc-900/40 overflow-hidden"
                >
                  <summary className="flex cursor-pointer items-center justify-between p-5 text-white font-medium hover:bg-zinc-900/60 transition-colors">
                    {faq.question}
                    <span className="ml-4 text-zinc-500 group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <div className="px-5 pb-5 text-zinc-400 text-sm leading-relaxed">
                    {faq.answer}
                  </div>
                </details>
              ))}
            </div>
          </section>

          {/* Related Content */}
          <section className="mt-12 max-w-3xl">
            <h2 className="text-lg font-semibold text-white mb-4">Related Resources</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Link
                href="/blog/freelancer-emergency-fund-how-much"
                className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 hover:border-zinc-700 transition-colors group"
              >
                <p className="font-medium text-white group-hover:text-teal-300 transition-colors">
                  Freelancer Emergency Fund Guide
                </p>
                <p className="mt-1 text-sm text-zinc-400">
                  How much emergency savings do you really need?
                </p>
                <span className="mt-3 inline-flex items-center gap-1 text-sm text-teal-400 group-hover:gap-2 transition-all">
                  Read guide <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </Link>
              <Link
                href="/blog/how-to-budget-with-variable-income"
                className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 hover:border-zinc-700 transition-colors group"
              >
                <p className="font-medium text-white group-hover:text-teal-300 transition-colors">
                  Budgeting with Variable Income
                </p>
                <p className="mt-1 text-sm text-zinc-400">
                  A tiered budgeting system for unpredictable income.
                </p>
                <span className="mt-3 inline-flex items-center gap-1 text-sm text-teal-400 group-hover:gap-2 transition-all">
                  Read guide <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </Link>
            </div>
          </section>

          {/* CTA */}
          <div className="mt-12 max-w-3xl rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 text-center">
            <p className="text-zinc-300">
              Know your variability? Now forecast your cash flow and spot danger zones before they happen.
            </p>
            <Link
              href="/auth/signup"
              className="mt-4 inline-flex items-center justify-center h-10 px-6 rounded-lg bg-teal-500 hover:bg-teal-400 text-zinc-950 font-semibold text-sm transition-colors"
            >
              Try Cash Flow Forecaster Free
            </Link>
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
