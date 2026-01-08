import type { Metadata } from 'next';
import LandingHeader from '@/components/landing/landing-header';
import { ToolsIndexClient } from '@/components/tools/tools-index-client';
import { Sparkles } from 'lucide-react';

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
        </div>
      </main>
    </div>
  );
}

