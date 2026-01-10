import type { Metadata } from 'next';
import LandingHeader from '@/components/landing/landing-header';
import { VariabilityCalculator } from '@/components/tools/variability-calculator';
import { TrendingUp, AlertTriangle, PiggyBank } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Freelance Income Variability Calculator - How Stable Is Your Income? | Cash Flow Forecaster',
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
    canonical: 'https://cashflowforecaster.io/tools/income-variability-calculator',
  },
  openGraph: {
    title: 'Freelance Income Variability Calculator - How Stable Is Your Income?',
    description:
      'Measure your income stability. See your variability score, identify danger zones, and get emergency fund recommendations.',
    url: 'https://cashflowforecaster.io/tools/income-variability-calculator',
    siteName: 'Cash Flow Forecaster',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Freelance Income Variability Calculator - How Stable Is Your Income?',
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
  url: 'https://cashflowforecaster.io/tools/income-variability-calculator',
} as const;

export default function IncomeVariabilityCalculatorPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white selection-teal">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

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
        </div>
      </main>
    </div>
  );
}

