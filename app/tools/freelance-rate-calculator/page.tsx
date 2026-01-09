import type { Metadata } from 'next';
import LandingHeader from '@/components/landing/landing-header';
import { RateCalculator } from '@/components/tools/rate-calculator';
import { DollarSign, Clock, Target } from 'lucide-react';

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

export default function FreelanceRateCalculatorPage() {
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
        </div>
      </main>
    </div>
  );
}

