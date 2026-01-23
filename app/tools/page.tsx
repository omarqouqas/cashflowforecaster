import type { Metadata } from 'next';
import Link from 'next/link';
import LandingHeader from '@/components/landing/landing-header';
import { LandingFooter } from '@/components/landing/footer';
import { ToolsIndexClient } from '@/components/tools/tools-index-client';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { breadcrumbs } from '@/components/seo/schemas';
import { Sparkles, BookOpen, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Free Cash Flow Tools | Cash Flow Forecaster',
  description:
    'Free cash flow tools to help freelancers forecast balances, avoid overdrafts, and make smarter spending decisions.',
  alternates: {
    canonical: 'https://cashflowforecaster.io/tools',
  },
  openGraph: {
    title: 'Free Cash Flow Tools',
    description:
      'Try free cash flow tools to forecast your balance and avoid getting blindsided.',
    url: 'https://cashflowforecaster.io/tools',
    siteName: 'Cash Flow Forecaster',
    type: 'website',
    images: [{ url: '/hero-dashboard.png' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Cash Flow Tools',
    description:
      'Free cash flow tools to help you project balances and avoid overdrafts.',
    images: ['/hero-dashboard.png'],
  },
};

export default function ToolsIndexPage() {
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
          <Breadcrumbs
            items={[breadcrumbs.home, breadcrumbs.tools]}
            className="mb-8"
          />

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-zinc-900/60 border border-zinc-800 px-4 py-2 text-sm text-zinc-200">
              <Sparkles className="h-4 w-4 text-teal-400" />
              <span>Free tools - No login required</span>
            </div>

            <h1 className="mt-6 text-4xl md:text-5xl font-bold text-white tracking-tight">
              Free Cash Flow Tools
            </h1>
            <p className="mt-4 text-lg text-zinc-300 leading-relaxed">
              Quick calculators that demonstrate forward-looking cash flow projection - built on the same approach as Cash Flow Forecaster.
            </p>
          </div>

          <div className="mt-10">
            <ToolsIndexClient />
          </div>

          {/* Related content */}
          <section className="mt-16">
            <div className="flex items-center gap-2 mb-6">
              <BookOpen className="h-5 w-5 text-teal-400" />
              <h2 className="text-lg font-semibold text-white">Learn more about cash flow management</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                href="/blog/how-to-manage-irregular-income-as-freelancer"
                className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 hover:border-zinc-700 transition-colors group"
              >
                <p className="font-medium text-white group-hover:text-teal-300 transition-colors">
                  Managing Irregular Income
                </p>
                <p className="mt-1 text-sm text-zinc-400">
                  Complete guide for freelancers
                </p>
                <span className="mt-3 inline-flex items-center gap-1 text-sm text-teal-400 group-hover:gap-2 transition-all">
                  Read guide <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </Link>
              <Link
                href="/blog/what-is-safe-to-spend"
                className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 hover:border-zinc-700 transition-colors group"
              >
                <p className="font-medium text-white group-hover:text-teal-300 transition-colors">
                  What is Safe to Spend?
                </p>
                <p className="mt-1 text-sm text-zinc-400">
                  The key metric for freelancers
                </p>
                <span className="mt-3 inline-flex items-center gap-1 text-sm text-teal-400 group-hover:gap-2 transition-all">
                  Read guide <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </Link>
              <Link
                href="/compare/cash-flow-calendar-apps"
                className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 hover:border-zinc-700 transition-colors group"
              >
                <p className="font-medium text-white group-hover:text-teal-300 transition-colors">
                  Compare Cash Flow Apps
                </p>
                <p className="mt-1 text-sm text-zinc-400">
                  See how tools compare
                </p>
                <span className="mt-3 inline-flex items-center gap-1 text-sm text-teal-400 group-hover:gap-2 transition-all">
                  View comparison <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </Link>
            </div>
          </section>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}

