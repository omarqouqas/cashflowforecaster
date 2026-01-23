import type { Metadata } from 'next';
import Link from 'next/link';
import LandingHeader from '@/components/landing/landing-header';
import { LandingFooter } from '@/components/landing/footer';
import { RateCalculator } from '@/components/tools/rate-calculator';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { breadcrumbs } from '@/components/seo/schemas';
import { DollarSign, Clock, Target, HelpCircle, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Freelance Hourly Rate Calculator - What Should You Charge? | Cash Flow Forecaster',
  description:
    'Free calculator to find your ideal freelance hourly rate. Enter your income goal, expenses, and billable hours to see your minimum, suggested, and premium rates.',
  keywords: [
    'freelance rate calculator',
    'what should I charge as a freelancer',
    'hourly rate calculator',
    'freelance pricing calculator',
    'consulting rate calculator',
    'how much to charge freelance',
    'freelancer hourly rate',
    'calculate freelance rate',
  ],
  alternates: {
    canonical: 'https://cashflowforecaster.io/tools/freelance-rate-calculator',
  },
  openGraph: {
    title: 'Freelance Rate Calculator - Find Your Ideal Hourly Rate',
    description: 'Stop guessing what to charge. Calculate your minimum hourly rate based on your income goals and actual expenses.',
    url: 'https://cashflowforecaster.io/tools/freelance-rate-calculator',
    siteName: 'Cash Flow Forecaster',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Freelance Rate Calculator - What Should You Charge?',
    description: 'Free calculator to find your ideal freelance hourly rate based on income goals and expenses.',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Freelance Hourly Rate Calculator',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  isAccessibleForFree: true,
  url: 'https://cashflowforecaster.io/tools/freelance-rate-calculator',
} as const;

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How do I calculate my freelance hourly rate?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'To calculate your freelance hourly rate: 1) Determine your desired annual income, 2) Add your business expenses (software, insurance, taxes), 3) Divide by your realistic billable hours (typically 1,000-1,500/year, not 2,080). This gives you a minimum rate. Add 20-30% buffer for slow months.',
      },
    },
    {
      '@type': 'Question',
      name: 'How many billable hours do freelancers actually work?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Most freelancers bill 50-70% of their working hours. If you work 40 hours/week, expect 20-28 billable hours. The rest goes to marketing, admin, invoicing, and finding new clients. Plan for 1,000-1,400 billable hours per year, not 2,080.',
      },
    },
    {
      '@type': 'Question',
      name: 'Should I charge the same rate for all clients?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Not necessarily. Consider charging more for rush projects, complex work, or clients who require extensive revisions. Some freelancers have a base rate and premium rate. Enterprise clients often have bigger budgets and expect higher rates than small businesses.',
      },
    },
    {
      '@type': 'Question',
      name: 'What expenses should I factor into my freelance rate?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Include: self-employment tax (15.3% in the US), health insurance, retirement savings, software subscriptions, equipment, professional development, accounting/legal fees, and a buffer for slow months or unexpected expenses. These can add 30-50% to your base living expenses.',
      },
    },
  ],
} as const;

const faqs = [
  {
    question: 'How do I calculate my freelance hourly rate?',
    answer: 'Start with your desired annual income, add business expenses (taxes, insurance, software), then divide by realistic billable hours (typically 1,000-1,500/year). Add 20-30% buffer for slow months.',
  },
  {
    question: 'How many billable hours do freelancers actually work?',
    answer: 'Most freelancers bill 50-70% of their working hours. Expect 20-28 billable hours from a 40-hour week—the rest goes to admin, marketing, and finding clients.',
  },
  {
    question: 'Should I charge the same rate for all clients?',
    answer: 'Not necessarily. Consider higher rates for rush work, complex projects, or enterprise clients with bigger budgets. Many freelancers have tiered pricing.',
  },
  {
    question: 'What expenses should I factor into my rate?',
    answer: 'Include self-employment tax (15.3%), health insurance, retirement, software, equipment, and a buffer for slow months. These can add 30-50% to base living expenses.',
  },
];

export default function FreelanceRateCalculatorPage() {
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
              { name: 'Rate Calculator', url: 'https://cashflowforecaster.io/tools/freelance-rate-calculator' },
            ]}
            className="mb-8"
          />

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-zinc-900/60 border border-zinc-800 px-4 py-2 text-sm text-zinc-200">
              <DollarSign className="h-4 w-4 text-teal-400" />
              <span>Free tool • No login required</span>
            </div>

            <h1 className="mt-6 text-4xl md:text-5xl font-bold text-white tracking-tight">Freelance Rate Calculator</h1>

            <p className="mt-4 text-lg text-zinc-300 leading-relaxed">
              Stop guessing what to charge. Calculate your minimum hourly rate based on your income goals, expenses, and
              realistic billable hours.
            </p>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-white">
                  <Target className="h-4 w-4 text-teal-300" />
                  Income-based
                </div>
                <p className="mt-2 text-sm text-zinc-400">Start with what you want to earn, work backwards.</p>
              </div>
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-white">
                  <Clock className="h-4 w-4 text-teal-300" />
                  Reality-checked
                </div>
                <p className="mt-2 text-sm text-zinc-400">Factors in actual billable hours, not 40-hour weeks.</p>
              </div>
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-white">
                  <DollarSign className="h-4 w-4 text-teal-300" />
                  Buffer included
                </div>
                <p className="mt-2 text-sm text-zinc-400">Suggested rates include margin for slow months.</p>
              </div>
            </div>
          </div>

          <div className="mt-10">
            <RateCalculator />
          </div>

          <div className="mt-10 max-w-5xl">
            <p className="text-xs text-zinc-600 leading-relaxed">
              Disclaimer: This calculator provides estimates based on the inputs you provide. Actual rates depend on your
              market, skills, experience, and demand. Consider researching rates in your specific industry and location.
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
                href="/blog/how-to-manage-irregular-income-as-freelancer"
                className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 hover:border-zinc-700 transition-colors group"
              >
                <p className="font-medium text-white group-hover:text-teal-300 transition-colors">
                  Managing Irregular Income
                </p>
                <p className="mt-1 text-sm text-zinc-400">
                  Strategies for budgeting when your income varies month to month.
                </p>
                <span className="mt-3 inline-flex items-center gap-1 text-sm text-teal-400 group-hover:gap-2 transition-all">
                  Read guide <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </Link>
              <Link
                href="/tools/income-variability-calculator"
                className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 hover:border-zinc-700 transition-colors group"
              >
                <p className="font-medium text-white group-hover:text-teal-300 transition-colors">
                  Income Variability Calculator
                </p>
                <p className="mt-1 text-sm text-zinc-400">
                  Measure how stable your freelance income is over time.
                </p>
                <span className="mt-3 inline-flex items-center gap-1 text-sm text-teal-400 group-hover:gap-2 transition-all">
                  Try calculator <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </Link>
            </div>
          </section>

          {/* CTA */}
          <div className="mt-12 max-w-3xl rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 text-center">
            <p className="text-zinc-300">
              Know your rate? Now plan when you&apos;ll actually get paid with a full cash flow forecast.
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

