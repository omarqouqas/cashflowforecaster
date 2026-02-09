import type { Metadata } from 'next';
import Link from 'next/link';
import LandingHeader from '@/components/landing/landing-header';
import { LandingFooter } from '@/components/landing/footer';
import { Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Compare Cash Flow Calendar Apps | Cash Flow Forecaster',
  description:
    'Comparison guides for freelancers evaluating cash flow calendar apps. See how Cash Flow Forecaster stacks up on invoicing, free tier, and forecasting.',
  alternates: {
    canonical: 'https://www.cashflowforecaster.io/compare',
  },
  openGraph: {
    title: 'Compare Cash Flow Calendar Apps',
    description:
      'Comparison guides for freelancers evaluating cash flow calendar apps.',
    url: 'https://www.cashflowforecaster.io/compare',
    siteName: 'Cash Flow Forecaster',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Compare Cash Flow Calendar Apps',
    description:
      'Comparison guides for freelancers evaluating cash flow calendar apps.',
  },
};

const comparePages = [
  {
    href: '/compare/cash-flow-calendar-apps',
    title: 'Best Cash Flow Calendar Apps for Freelancers (2026)',
    description:
      'A freelancer-focused breakdown of free tiers, forecasting length, and why built-in invoicing + invoice-to-forecast sync matters.',
  },
] as const;

export default function CompareIndexPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white selection-teal">
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
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-zinc-900/60 border border-zinc-800 px-4 py-2 text-sm text-zinc-200">
              <Sparkles className="h-4 w-4 text-teal-400" />
              <span>Comparison guides</span>
            </div>

            <h1 className="mt-6 text-4xl md:text-5xl font-bold text-white tracking-tight">Compare</h1>
            <p className="mt-4 text-lg text-zinc-300 leading-relaxed">
              Short, freelancer-focused comparisons to help you pick the right cash flow calendar app—without getting lost in generic budgeting features.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
            {comparePages.map((p) => (
              <Link
                key={p.href}
                href={p.href}
                className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 hover:bg-zinc-900/55 transition-colors"
              >
                <h2 className="text-xl font-semibold text-white">{p.title}</h2>
                <p className="mt-2 text-zinc-400">{p.description}</p>
                <p className="mt-4 text-sm text-teal-300">Read comparison →</p>
              </Link>
            ))}
          </div>

          <div className="mt-10 text-sm text-zinc-500">
            Looking for pricing instead?{' '}
            <Link href="/pricing" className="text-zinc-300 hover:text-white hover:underline">
              View plans
            </Link>
            .
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}

