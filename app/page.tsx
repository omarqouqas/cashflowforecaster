import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import PricingSection from '@/components/pricing/pricing-section';
import LandingHeader from '@/components/landing/landing-header';
import { FAQSection } from '@/components/landing/faq-section';
import { GetStartedCTA } from '@/components/landing/get-started-cta';
import { AlarmClock, AlertTriangle, BadgeDollarSign, Bell, Calendar, CheckCircle2, CreditCard, FileSpreadsheet, FileText, Lock, Mail, Shield, Sparkles, Wallet } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { getUserSubscription } from '@/lib/stripe/subscription';

export const metadata: Metadata = {
  title: 'Cash Flow Forecaster - See Your Bank Balance 60 Days Ahead',
  description:
    'See your bank balance 60 days into the future. Cash flow forecasting for freelancers with weekly email digests, bill collision alerts, and scenario planning.',
  keywords: [
    'cash flow forecast',
    'freelancer budget',
    'bank balance predictor',
    'gig worker finances',
    'freelancer cash flow forecast',
    'can I afford this calculator',
    'when will I run out of money calculator',
    'irregular income budgeting app',
    'gig worker money management',
    'predict bank balance',
    'avoid overdraft freelancer',
    'invoice to cash flow tracking',
  ],
  openGraph: {
    title: 'Cash Flow Forecaster',
    description:
      'See your bank balance 60 days into the future. Cash flow forecasting for freelancers with weekly email digests, bill collision alerts, and scenario planning.',
    url: 'https://cashflowforecaster.io',
    siteName: 'Cash Flow Forecaster',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cash Flow Forecaster',
    description:
      'See your bank balance 60 days into the future. Cash flow forecasting for freelancers with weekly email digests, bill collision alerts, and scenario planning.',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Cash Flow Forecaster',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Web',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: 4.8,
    ratingCount: 25,
  },
} as const;

export default async function Home() {
  // Get auth state on server
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  // Get subscription tier if logged in
  let currentTier: 'free' | 'pro' | 'premium' = 'free';
  if (user) {
    try {
      const subscription = await getUserSubscription(user.id);
      currentTier = subscription.tier;
    } catch (error) {
      // If subscription fetch fails, default to free
      console.error('Error fetching subscription:', error);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white selection-teal scroll-smooth">
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

      <main>
        <section className="px-6 pt-16 pb-10">
          <div className="mx-auto max-w-5xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-zinc-900/60 border border-zinc-800 px-4 py-2 text-sm text-zinc-200">
              <Sparkles className="h-4 w-4 text-teal-400" />
              <span>Forecast your balance. Avoid overdrafts. Invoice clients.</span>
            </div>

            <h1 className="mt-6 text-4xl md:text-5xl font-bold text-white tracking-tight">
              &quot;Can I afford rent on the 1st?&quot;
            </h1>

            <p className="mt-5 text-lg text-zinc-300 max-w-2xl mx-auto leading-relaxed">
              Freelancing is hard enough. Your finances shouldn&apos;t keep you guessing.
            </p>

            <p className="mt-2 text-zinc-400 text-base sm:text-lg md:text-xl max-w-2xl mx-auto px-4 leading-relaxed">
              Project your daily balance for the next 60 days.
              <span className="block mt-2 text-sm sm:text-base md:text-lg text-zinc-500">
                Weekly forecasts in your inbox. Bill collision alerts. Never get caught off guard.
              </span>
            </p>

            <div className="mt-8 flex flex-col items-center gap-3">
              <GetStartedCTA className="bg-teal-500 hover:bg-teal-400 text-zinc-950 px-8 py-3 rounded-lg text-lg font-semibold h-auto focus:ring-teal-400 focus:ring-offset-zinc-950" />

              <p className="text-sm text-zinc-400">Set up in under 3 minutes • No credit card required • Free forever plan</p>

              <p className="text-sm text-zinc-300">
                Already have an account?{' '}
                <Link href="/auth/login" className="text-teal-300 hover:text-teal-200 hover:underline">
                  Log in
                </Link>
              </p>
            </div>

            <div className="mt-10 max-w-4xl mx-auto rounded-2xl shadow-2xl border border-zinc-800 overflow-hidden bg-zinc-900/40">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-800 bg-zinc-950/40">
                <span className="h-3 w-3 rounded-full bg-red-500" />
                <span className="h-3 w-3 rounded-full bg-yellow-500" />
                <span className="h-3 w-3 rounded-full bg-green-500" />
              </div>
              <div className="relative">
                <Image
                  src="/hero-dashboard.png"
                  alt="Cash Flow Forecaster dashboard preview"
                  width={1600}
                  height={900}
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 80vw, 896px"
                  priority
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="px-6 py-16 scroll-mt-24">
          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-semibold text-white tracking-tight">How it works</h2>
              <p className="mt-3 text-zinc-400 max-w-2xl mx-auto">
                A simple 4-step flow to get clarity on what&apos;s safe to spend—today and 60 days from now.
              </p>
            </div>

            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-teal-500/10 ring-1 ring-teal-500/25 flex items-center justify-center">
                    <Wallet className="h-5 w-5 text-teal-300" />
                  </div>
                  <div className="text-sm text-zinc-300">
                    <span className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-teal-500 text-zinc-950 font-semibold">
                      1
                    </span>
                  </div>
                </div>
                <h3 className="mt-4 font-semibold text-white">Add Your Accounts</h3>
                <p className="mt-2 text-zinc-400">
                  Connect your checking/savings (or start with manual balances).
                </p>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-teal-500/10 ring-1 ring-teal-500/25 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-teal-300" />
                  </div>
                  <div className="text-sm text-zinc-300">
                    <span className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-teal-500 text-zinc-950 font-semibold">
                      2
                    </span>
                  </div>
                </div>
                <h3 className="mt-4 font-semibold text-white">Enter Your Bills</h3>
                <p className="mt-2 text-zinc-400">Add one-time or recurring bills and income.</p>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-teal-500/10 ring-1 ring-teal-500/25 flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-teal-300" />
                  </div>
                  <div className="text-sm text-zinc-300">
                    <span className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-teal-500 text-zinc-950 font-semibold">
                      3
                    </span>
                  </div>
                </div>
                <h3 className="mt-4 font-semibold text-white">See Your Future</h3>
                <p className="mt-2 text-zinc-400">Get a 60-day calendar projection with low days highlighted.</p>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-teal-500/10 ring-1 ring-teal-500/25 flex items-center justify-center">
                    <Mail className="h-5 w-5 text-teal-300" />
                  </div>
                  <div className="text-sm text-zinc-300">
                    <span className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-teal-500 text-zinc-950 font-semibold">
                      4
                    </span>
                  </div>
                </div>
                <h3 className="mt-4 font-semibold text-white">Stay Informed</h3>
                <p className="mt-2 text-zinc-400">Get weekly digests and alerts delivered to your inbox.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="px-6 py-16 scroll-mt-24 border-y border-zinc-900 bg-zinc-950">
          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-semibold text-white tracking-tight">
                Features built for real-life cash flow
              </h2>
              <p className="mt-3 text-zinc-400 max-w-2xl mx-auto">
                Test &quot;can I afford it?&quot;, send invoices, and get warned early—without spreadsheets.
              </p>
            </div>

            {/* Top row - 3 feature cards */}
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 flex flex-col">
                <div className="flex items-center justify-between">
                  <div className="h-10 w-10 rounded-lg bg-teal-500/10 ring-1 ring-teal-500/25 flex items-center justify-center">
                    <BadgeDollarSign className="h-5 w-5 text-teal-300" />
                  </div>
                  <span className="text-xs text-teal-300 bg-teal-500/10 border border-teal-500/20 rounded-full px-3 py-1">
                    Scenario Tester
                  </span>
                </div>
                <h3 className="mt-4 font-semibold text-white">Can I Afford It?</h3>
                <p className="mt-2 text-zinc-400">
                  Try a purchase, bill, or income change and instantly see how it affects your next 60 days.
                </p>
                <div className="mt-6 flex-1 rounded-xl border border-zinc-800 bg-zinc-950/40 p-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-zinc-300">New expense</span>
                    <span className="font-semibold text-white">$250</span>
                  </div>
                  <div className="mt-3 h-2 rounded-full bg-zinc-800 overflow-hidden">
                    <div className="h-full w-[72%] bg-teal-500" />
                  </div>
                  <div className="mt-4 flex items-start gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-teal-400 mt-0.5" />
                    <p className="text-zinc-300">
                      Result: you stay above your buffer for the next 30 days.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 flex flex-col">
                <div className="flex items-center justify-between">
                  <div className="h-10 w-10 rounded-lg bg-teal-500/10 ring-1 ring-teal-500/25 flex items-center justify-center">
                    <CreditCard className="h-5 w-5 text-teal-300" />
                  </div>
                  <span className="text-xs text-teal-300 bg-teal-500/10 border border-teal-500/20 rounded-full px-3 py-1">
                    Runway Collect
                  </span>
                </div>
                <h3 className="mt-4 font-semibold text-white">Invoicing that improves your runway</h3>
                <p className="mt-2 text-zinc-400">
                  Create invoices, send them, and track expected cash-in alongside your forecast.
                </p>
                <div className="mt-6 flex-1 rounded-xl border border-zinc-800 bg-zinc-950/40 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-zinc-300">Invoice #1042</span>
                    <span className="text-sm font-semibold text-white">$1,250</span>
                  </div>
                  <div className="mt-3 space-y-2">
                    <div className="h-2 rounded bg-zinc-800" />
                    <div className="h-2 rounded bg-zinc-800 w-5/6" />
                    <div className="h-2 rounded bg-zinc-800 w-3/4" />
                  </div>
                  <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-zinc-900/60 border border-zinc-800 px-3 py-1 text-xs text-zinc-300">
                    <AlarmClock className="h-3.5 w-3.5 text-teal-300" />
                    Scheduled reminders included
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 flex flex-col">
                <div className="flex items-center justify-between">
                  <div className="h-10 w-10 rounded-lg bg-teal-500/10 ring-1 ring-teal-500/25 flex items-center justify-center">
                    <Bell className="h-5 w-5 text-teal-300" />
                  </div>
                  <span className="text-xs text-teal-300 bg-teal-500/10 border border-teal-500/20 rounded-full px-3 py-1">
                    Warnings
                  </span>
                </div>
                <h3 className="mt-4 font-semibold text-white">Low balance warnings</h3>
                <p className="mt-2 text-zinc-400">
                  Get a heads up before you dip low—so you can move money, invoice faster, or delay a bill.
                </p>
                <div className="mt-6 flex-1 rounded-xl border border-zinc-800 bg-zinc-950/40 p-4">
                  <div className="grid grid-cols-7 gap-2">
                    {Array.from({ length: 21 }).map((_, i) => {
                      const risky = i === 9 || i === 10 || i === 15;
                      return (
                        <div
                          key={i}
                          className={[
                            'h-6 rounded-md border',
                            risky
                              ? 'border-rose-500/40 bg-rose-500/10'
                              : 'border-zinc-800 bg-zinc-900/40',
                          ].join(' ')}
                        />
                      );
                    })}
                  </div>
                  <div className="mt-4 flex items-start gap-2 text-sm">
                    <Bell className="h-4 w-4 text-rose-300 mt-0.5" />
                    <p className="text-zinc-300">3 low days detected in the next 2 weeks.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom row - 3 feature cards (completes a 3x2 grid) */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 flex flex-col">
                <div className="w-12 h-12 bg-teal-500/10 rounded-lg flex items-center justify-center mb-4">
                  <Mail className="w-6 h-6 text-teal-500" />
                </div>
                <h3 className="text-lg font-semibold text-zinc-100 mb-2">Weekly Cash Flow Digest</h3>
                <p className="text-zinc-400">
                  Start every week knowing exactly what&apos;s coming. Get a summary of your upcoming income, bills,
                  and any days to watch out for — delivered to your inbox.
                </p>

                {/* Mini visual: email-style preview */}
                <div className="mt-6 rounded-xl border border-zinc-800 bg-zinc-950/40 p-4">
                  <div className="flex items-center gap-2 text-sm text-zinc-200">
                    <Mail className="h-4 w-4 text-teal-300" />
                    <span className="font-medium">Your week ahead</span>
                  </div>
                  <div className="mt-3 rounded-lg bg-zinc-900/40 border border-zinc-800 p-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-zinc-400">Income</span>
                      <span className="font-semibold text-emerald-400">+$3,200</span>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-sm">
                      <span className="text-zinc-400">Bills</span>
                      <span className="font-semibold text-rose-300">-$1,847</span>
                    </div>
                    <div className="mt-3 h-px bg-zinc-800" />
                    <div className="mt-3 flex items-center justify-between text-sm">
                      <span className="text-zinc-300">Net</span>
                      <span className="font-semibold text-teal-200">+$1,353</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 flex flex-col">
                <div className="w-12 h-12 bg-amber-500/10 rounded-lg flex items-center justify-center mb-4">
                  <AlertTriangle className="w-6 h-6 text-amber-500" />
                </div>
                <h3 className="text-lg font-semibold text-zinc-100 mb-2">Bill Collision Alerts</h3>
                <p className="text-zinc-400">
                  Multiple bills hitting the same day? We&apos;ll warn you before it happens, so you can plan ahead
                  and avoid surprise cash crunches.
                </p>

                {/* Mini visual: collision day preview */}
                <div className="mt-6 rounded-xl border border-zinc-800 bg-zinc-950/40 p-4">
                  <div className="flex items-center gap-2 text-sm text-zinc-200">
                    <AlertTriangle className="h-4 w-4 text-amber-400" />
                    <span className="font-medium">Thu, Jan 16</span>
                  </div>
                  <div className="mt-3 rounded-lg bg-zinc-900/40 border border-zinc-800 p-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-zinc-300">Rent</span>
                      <span className="font-semibold text-zinc-100">$1,500</span>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-sm">
                      <span className="text-zinc-300">Car Ins.</span>
                      <span className="font-semibold text-zinc-100">$247</span>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-sm">
                      <span className="text-zinc-300">Electric</span>
                      <span className="font-semibold text-zinc-100">$85</span>
                    </div>
                    <div className="mt-3 h-px bg-zinc-800" />
                    <div className="mt-3 flex items-center justify-between text-sm">
                      <span className="text-zinc-400">Total</span>
                      <span className="font-semibold text-amber-200">$1,832 due</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 flex flex-col">
                <div className="w-12 h-12 bg-teal-500/10 rounded-lg flex items-center justify-center mb-4">
                  <FileSpreadsheet className="w-6 h-6 text-teal-500" />
                </div>
                <h3 className="text-lg font-semibold text-zinc-100 mb-2">Import from your bank</h3>
                <p className="text-zinc-400">
                  Upload a CSV export and quickly add bills &amp; income—no manual entry required.
                </p>

                {/* Mini visual: file upload preview */}
                <div className="mt-6 rounded-xl border border-zinc-800 bg-zinc-950/40 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-9 w-9 rounded-lg bg-teal-500/10 ring-1 ring-teal-500/20 flex items-center justify-center flex-shrink-0">
                        <FileSpreadsheet className="h-4 w-4 text-teal-300" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-zinc-200 truncate">transactions.csv</p>
                        <p className="text-xs text-zinc-500">Uploaded</p>
                      </div>
                    </div>
                    <div className="inline-flex items-center gap-2 rounded-full bg-zinc-900/60 border border-zinc-800 px-3 py-1 text-xs text-zinc-300 flex-shrink-0">
                      <CheckCircle2 className="h-3.5 w-3.5 text-teal-300" />
                      24 transactions found
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section with Stripe Integration */}
        <PricingSection 
          isLoggedIn={!!user} 
          currentTier={currentTier} 
        />

        {/* FAQ Section */}
        <FAQSection />

        <section className="px-6 py-16">
          <div className="mx-auto max-w-6xl text-center">
            <h2 className="text-3xl md:text-4xl font-semibold text-white tracking-tight">
              Ready to see your financial future?
            </h2>
            <p className="mt-3 text-zinc-400">
              Join freelancers who finally know where their money is going.
            </p>
            <div className="mt-6 flex justify-center">
              <GetStartedCTA className="bg-teal-500 hover:bg-teal-400 text-zinc-950 px-8 py-3 rounded-lg text-lg font-semibold h-auto focus:ring-teal-400 focus:ring-offset-zinc-950" />
            </div>
          </div>
        </section>

        <section className="px-6 py-12 border-t border-zinc-900">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex flex-wrap justify-center gap-4 sm:gap-8 text-zinc-400 text-sm">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-teal-500" />
                <span>Bank-level security</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-teal-500" />
                <span>Weekly digests, zero spam</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-teal-500" />
                <span>We never store bank credentials</span>
              </div>
            </div>
          </div>
        </section>

        <footer className="px-6 py-12 border-t border-zinc-900">
          <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
            <div>
              <p className="text-white font-semibold">Cash Flow Forecaster</p>
              <p className="mt-2 text-zinc-400">Made for freelancers, by a freelancer.</p>
            </div>

            <div className="md:text-right">
              <p className="text-zinc-300 font-medium">Links</p>
              <div className="mt-3 flex flex-col md:items-end gap-2 text-zinc-400">
                <Link href="/privacy" className="hover:text-zinc-200 transition-colors">
                  Privacy
                </Link>
                <Link href="/terms" className="hover:text-zinc-200 transition-colors">
                  Terms
                </Link>
                <Link
                  href="mailto:support@cashflowforecaster.io"
                  className="hover:text-zinc-200 transition-colors"
                >
                  Contact
                </Link>
              </div>
            </div>
          </div>

          <div className="mx-auto max-w-6xl mt-10 pt-6 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-500">
            <p>© {new Date().getFullYear()} Cash Flow Forecaster</p>
            <p className="inline-flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-teal-500" aria-hidden="true" />
              Built to help you stay cash-positive
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}
