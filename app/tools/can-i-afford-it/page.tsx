import type { Metadata } from 'next';
import Link from 'next/link';
import LandingHeader from '@/components/landing/landing-header';
import { LandingFooter } from '@/components/landing/footer';
import { CanIAffordCalculator } from '@/components/tools/can-i-afford-calculator';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { breadcrumbs } from '@/components/seo/schemas';
import { BadgeDollarSign, CalendarDays, Sparkles, ArrowRight, BookOpen } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Free “Can I Afford It?” Calculator | Cash Flow Forecaster',
  description:
    'A free cash flow projection calculator. Enter your current balance, upcoming bills, next income, and a purchase to see if you can afford it without going negative.',
  keywords: [
    'can I afford it calculator',
    'cash flow projection',
    'bank balance forecast',
    'overdraft risk',
    'freelancer budgeting',
    'when will I run out of money calculator',
    'predict bank balance',
  ],
  alternates: {
    canonical: 'https://cashflowforecaster.io/tools/can-i-afford-it',
  },
  openGraph: {
    title: 'Can I Afford It? Free Cash Flow Calculator (Day-by-Day)',
    description:
      'Try a purchase and see your projected bank balance day-by-day. Built on the same forward-looking cash flow logic as Cash Flow Forecaster.',
    url: 'https://cashflowforecaster.io/tools/can-i-afford-it',
    siteName: 'Cash Flow Forecaster',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Can I Afford It? Free Cash Flow Calculator (Day-by-Day)',
    description:
      'A free cash flow projection calculator to check a purchase against bills + next income.',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Can I Afford It? Calculator',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Web',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  isAccessibleForFree: true,
  url: 'https://cashflowforecaster.io/tools/can-i-afford-it',
} as const;

export default function CanIAffordItToolPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white selection-teal">
      <script
        type="application/ld+json"
        // JSON-LD for rich snippets
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* subtle dot grid */}
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
              { name: 'Can I Afford It?', url: 'https://cashflowforecaster.io/tools/can-i-afford-it' },
            ]}
            className="mb-8"
          />

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-zinc-900/60 border border-zinc-800 px-4 py-2 text-sm text-zinc-200">
              <Sparkles className="h-4 w-4 text-teal-400" />
              <span>Free tool • No login required</span>
            </div>

            <h1 className="mt-6 text-4xl md:text-5xl font-bold text-white tracking-tight">
              Can I Afford It?
            </h1>

            <p className="mt-4 text-lg text-zinc-300 leading-relaxed">
              A quick, forward-looking cash flow projection. Enter your balance, bills, next income, and a purchase—then
              see your lowest point before it happens.
            </p>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-white">
                  <BadgeDollarSign className="h-4 w-4 text-teal-300" />
                  Purchase check
                </div>
                <p className="mt-2 text-sm text-zinc-400">Know if a spend will push you below $0.</p>
              </div>
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-white">
                  <CalendarDays className="h-4 w-4 text-teal-300" />
                  Daily projection
                </div>
                <p className="mt-2 text-sm text-zinc-400">See your balance move day-by-day.</p>
              </div>
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-white">
                  <Sparkles className="h-4 w-4 text-teal-300" />
                  Lowest-point clarity
                </div>
                <p className="mt-2 text-sm text-zinc-400">Find the exact low day before payday.</p>
              </div>
            </div>
          </div>

          <div className="mt-10">
            <CanIAffordCalculator />
          </div>

          <div className="mt-10 max-w-5xl">
            <p className="text-xs text-zinc-600 leading-relaxed">
              Disclaimer: This tool is a simplified estimate based on the inputs you provide. It does not account for
              recurring schedules, pending transactions, holds, or multiple accounts. For a full forecast, use Cash Flow
              Forecaster.
            </p>
          </div>

          {/* Related content for internal linking */}
          <section className="mt-16 max-w-3xl">
            <div className="flex items-center gap-2 mb-6">
              <BookOpen className="h-5 w-5 text-teal-400" />
              <h2 className="text-lg font-semibold text-white">Learn more about cash flow</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link
                href="/blog/what-is-safe-to-spend"
                className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 hover:border-zinc-700 transition-colors group"
              >
                <p className="font-medium text-white group-hover:text-teal-300 transition-colors">
                  What is &quot;Safe to Spend&quot;?
                </p>
                <p className="mt-1 text-sm text-zinc-400">
                  The one number every freelancer needs to know before making a purchase.
                </p>
                <span className="mt-3 inline-flex items-center gap-1 text-sm text-teal-400 group-hover:gap-2 transition-all">
                  Read article <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </Link>
              <Link
                href="/blog/cash-flow-forecasting-for-freelancers"
                className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 hover:border-zinc-700 transition-colors group"
              >
                <p className="font-medium text-white group-hover:text-teal-300 transition-colors">
                  Cash Flow Forecasting for Freelancers
                </p>
                <p className="mt-1 text-sm text-zinc-400">
                  Why day-by-day visibility matters more than monthly budgets.
                </p>
                <span className="mt-3 inline-flex items-center gap-1 text-sm text-teal-400 group-hover:gap-2 transition-all">
                  Read article <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </Link>
            </div>

            {/* CTA */}
            <div className="mt-8 rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 text-center">
              <p className="text-zinc-300">
                Want a full 365-day forecast with recurring bills and income?
              </p>
              <Link
                href="/auth/signup"
                className="mt-4 inline-flex items-center justify-center h-10 px-6 rounded-lg bg-teal-500 hover:bg-teal-400 text-zinc-950 font-semibold text-sm transition-colors"
              >
                Try Cash Flow Forecaster Free
              </Link>
            </div>
          </section>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}

