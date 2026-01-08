import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import PricingSection from '@/components/pricing/pricing-section';
import LandingHeader from '@/components/landing/landing-header';
import { FAQSection } from '@/components/landing/faq-section';
import { GetStartedCTA } from '@/components/landing/get-started-cta';
import { LandingFooter } from '@/components/landing/footer';
import {
  AlarmClock,
  BadgeDollarSign,
  Bell,
  Calendar,
  CheckCircle2,
  Code2,
  FileSpreadsheet,
  FileText,
  Lock,
  Mail,
  Megaphone,
  Palette,
  PenLine,
  Shield,
  Sparkles,
  Wallet,
} from 'lucide-react';
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
  alternates: {
    canonical: 'https://cashflowforecaster.io',
  },
  openGraph: {
    title: 'Cash Flow Forecaster - See Your Bank Balance 60 Days Ahead',
    description:
      'See your bank balance 60 days into the future. Cash flow forecasting for freelancers with weekly email digests, bill collision alerts, and scenario planning.',
    url: 'https://cashflowforecaster.io',
    siteName: 'Cash Flow Forecaster',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cash Flow Forecaster - See Your Bank Balance 60 Days Ahead',
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
      // eslint-disable-next-line no-console
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
              <span>Built for freelancers with irregular income</span>
            </div>

            <h1 className="mt-6 text-4xl md:text-5xl font-bold text-white tracking-tight">
              Stop Guessing If You Can Cover Rent
            </h1>

            <p className="mt-5 text-lg text-zinc-300 max-w-2xl mx-auto leading-relaxed">
              See your exact bank balance for the next 60 days — with every invoice, bill, and payday mapped out.
              Built for freelancers with irregular income.
            </p>

            <div className="mt-8 flex flex-col items-center gap-3">
              <GetStartedCTA className="bg-teal-500 hover:bg-teal-400 text-zinc-950 px-8 py-3 rounded-lg text-lg font-semibold h-auto focus:ring-teal-400 focus:ring-offset-zinc-950" />

              <p className="text-sm text-zinc-400">Set up in 3 minutes • No credit card • Free forever plan</p>

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

        <section className="px-6 pb-4">
          <div className="mx-auto max-w-5xl">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 px-6 py-5 text-center">
              <p className="text-zinc-200">
                Built for the <span className="font-semibold text-white">47%</span> of freelancers who say income instability is
                their #1 financial worry.
              </p>
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
                Three pillars of cash flow clarity
              </h2>
              <p className="mt-3 text-zinc-400 max-w-2xl mx-auto">
                Know what&apos;s safe today, get paid faster, and avoid getting blindsided—without spreadsheets.
              </p>
            </div>

            <div className="mt-12 space-y-16">
              {/* Pillar 1 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                <div>
                  <div className="flex items-center gap-3">
                    <div className="h-11 w-11 rounded-xl bg-teal-500/10 ring-1 ring-teal-500/25 flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-teal-300" />
                    </div>
                    <h3 className="text-2xl font-semibold text-white tracking-tight">Know Your Number Today</h3>
                  </div>

                  <p className="mt-4 text-zinc-300 leading-relaxed">
                    See your &quot;safe to spend&quot; amount right now — based on what&apos;s coming in and going out over the
                    next 60 days. No more checking your bank app ten times a day.
                  </p>

                  <ul className="mt-6 space-y-3 text-sm text-zinc-300">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-teal-300 mt-0.5" />
                      <span>Daily balance projections</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-teal-300 mt-0.5" />
                      <span>Color-coded low-balance warnings</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-teal-300 mt-0.5" />
                      <span>Overdraft alerts before they happen</span>
                    </li>
                  </ul>
                </div>

                <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 overflow-hidden shadow-2xl">
                  <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-800 bg-zinc-950/40">
                    <span className="h-3 w-3 rounded-full bg-red-500" />
                    <span className="h-3 w-3 rounded-full bg-yellow-500" />
                    <span className="h-3 w-3 rounded-full bg-green-500" />
                    <span className="ml-2 text-xs text-zinc-400">60-day forecast</span>
                  </div>
                  <Image
                    src="/hero-dashboard.png"
                    alt="60-day calendar preview"
                    width={1600}
                    height={900}
                    sizes="(max-width: 1024px) 100vw, 560px"
                    className="w-full h-auto"
                  />
                </div>
              </div>

              {/* Pillar 2 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                <div className="lg:order-2">
                  <div className="flex items-center gap-3">
                    <div className="h-11 w-11 rounded-xl bg-teal-500/10 ring-1 ring-teal-500/25 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-teal-300" />
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="text-2xl font-semibold text-white tracking-tight">Get Paid Faster</h3>
                      <span className="text-xs text-teal-300 bg-teal-500/10 border border-teal-500/20 rounded-full px-3 py-1">
                        Runway Collect
                      </span>
                    </div>
                  </div>

                  <p className="mt-4 text-zinc-300 leading-relaxed">
                    Create invoices, send them, and auto-remind clients who forget. Watch expected income appear in your
                    forecast the moment you hit send.
                  </p>

                  <ul className="mt-6 space-y-3 text-sm text-zinc-300">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-teal-300 mt-0.5" />
                      <span>Professional PDF invoices</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-teal-300 mt-0.5" />
                      <span>Automated payment reminders</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-teal-300 mt-0.5" />
                      <span>Invoice-to-forecast sync</span>
                    </li>
                  </ul>
                </div>

                <div className="lg:order-1 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-zinc-300">Invoice #1042</span>
                    <span className="text-sm font-semibold text-white">$1,250</span>
                  </div>
                  <div className="mt-3 space-y-2">
                    <div className="h-2 rounded bg-zinc-800" />
                    <div className="h-2 rounded bg-zinc-800 w-5/6" />
                    <div className="h-2 rounded bg-zinc-800 w-3/4" />
                  </div>
                  <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-zinc-950/40 border border-zinc-800 px-3 py-1 text-xs text-zinc-300">
                    <AlarmClock className="h-3.5 w-3.5 text-teal-300" />
                    Scheduled reminders included
                  </div>
                  <div className="mt-6 rounded-xl border border-zinc-800 bg-zinc-950/40 p-4">
                    <div className="flex items-start gap-2 text-sm">
                      <Bell className="h-4 w-4 text-amber-300 mt-0.5" />
                      <div className="text-zinc-300">
                        <p className="font-medium text-zinc-200">Reminder scheduled</p>
                        <p className="text-zinc-400">Auto-follow up in 3 days if unpaid.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pillar 3 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                <div>
                  <div className="flex items-center gap-3">
                    <div className="h-11 w-11 rounded-xl bg-teal-500/10 ring-1 ring-teal-500/25 flex items-center justify-center">
                      <Mail className="h-5 w-5 text-teal-300" />
                    </div>
                    <h3 className="text-2xl font-semibold text-white tracking-tight">Never Get Blindsided</h3>
                  </div>

                  <p className="mt-4 text-zinc-300 leading-relaxed">
                    Monday morning clarity. See your week&apos;s cash flow, get warned about bill pile-ups, and start the
                    week knowing exactly where you stand.
                  </p>

                  <ul className="mt-6 space-y-3 text-sm text-zinc-300">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-teal-300 mt-0.5" />
                      <span>Weekly email digest</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-teal-300 mt-0.5" />
                      <span>Bill collision alerts</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-teal-300 mt-0.5" />
                      <span>Upcoming expense warnings</span>
                    </li>
                  </ul>
                </div>

                <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
                  <div className="flex items-center gap-2 text-sm text-zinc-200">
                    <Mail className="h-4 w-4 text-teal-300" />
                    <span className="font-medium">Your week ahead</span>
                  </div>
                  <div className="mt-3 rounded-lg bg-zinc-950/40 border border-zinc-800 p-4">
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

                  <div className="mt-5 rounded-lg border border-amber-500/25 bg-amber-500/10 p-4">
                    <div className="flex items-start gap-2 text-sm">
                      <Bell className="h-4 w-4 text-amber-300 mt-0.5" />
                      <div className="text-zinc-200">
                        <p className="font-medium">Bill collision detected</p>
                        <p className="text-zinc-300/90">Thu: Rent + Car Insurance land on the same day.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Secondary features */}
              <div className="pt-4">
                <div className="text-center">
                  <h3 className="text-xl md:text-2xl font-semibold text-white tracking-tight">More ways we help</h3>
                  <p className="mt-2 text-zinc-400 max-w-2xl mx-auto">
                    Quick what-ifs and fast setup—so you can get answers without rebuilding your whole budget.
                  </p>
                </div>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
                    <div className="flex items-center justify-between">
                      <div className="h-10 w-10 rounded-lg bg-teal-500/10 ring-1 ring-teal-500/25 flex items-center justify-center">
                        <BadgeDollarSign className="h-5 w-5 text-teal-300" />
                      </div>
                      <span className="text-xs text-teal-300 bg-teal-500/10 border border-teal-500/20 rounded-full px-3 py-1">
                        Scenario Tester
                      </span>
                    </div>
                    <h4 className="mt-4 font-semibold text-white">Can I Afford It?</h4>
                    <p className="mt-2 text-zinc-400">
                      Try a purchase, bill, or income change and instantly see how it affects your next 60 days.
                    </p>
                    <div className="mt-5 rounded-xl border border-zinc-800 bg-zinc-950/40 p-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-zinc-300">New expense</span>
                        <span className="font-semibold text-white">$250</span>
                      </div>
                      <div className="mt-3 h-2 rounded-full bg-zinc-800 overflow-hidden">
                        <div className="h-full w-[72%] bg-teal-500" />
                      </div>
                      <div className="mt-4 flex items-start gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-teal-400 mt-0.5" />
                        <p className="text-zinc-300">Result: you stay above your buffer for the next 30 days.</p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
                    <div className="flex items-center justify-between">
                      <div className="h-10 w-10 rounded-lg bg-teal-500/10 ring-1 ring-teal-500/25 flex items-center justify-center">
                        <FileSpreadsheet className="h-5 w-5 text-teal-300" />
                      </div>
                      <span className="text-xs text-teal-300 bg-teal-500/10 border border-teal-500/20 rounded-full px-3 py-1">
                        CSV Import
                      </span>
                    </div>
                    <h4 className="mt-4 font-semibold text-white">Import from your bank</h4>
                    <p className="mt-2 text-zinc-400">
                      Upload a CSV export and quickly add bills &amp; income—no manual entry required.
                    </p>
                    <div className="mt-5 rounded-xl border border-zinc-800 bg-zinc-950/40 p-4">
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
            </div>
          </div>
        </section>

        <section id="who-its-for" className="px-6 py-16 scroll-mt-24">
          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-semibold text-white tracking-tight">
                Built for freelancers who are tired of guessing
              </h2>
              <p className="mt-3 text-zinc-400 max-w-3xl mx-auto">
                Cash Flow Forecaster is for anyone whose income doesn&apos;t arrive on the 1st and 15th like clockwork.
              </p>
            </div>

            <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
                <div className="h-11 w-11 rounded-xl bg-teal-500/10 ring-1 ring-teal-500/25 flex items-center justify-center">
                  <Palette className="h-5 w-5 text-teal-300" />
                </div>
                <h3 className="mt-4 font-semibold text-white">Graphic Designers</h3>
                <p className="mt-2 text-sm text-zinc-400">Waiting on client approvals and Net-30 payments</p>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
                <div className="h-11 w-11 rounded-xl bg-teal-500/10 ring-1 ring-teal-500/25 flex items-center justify-center">
                  <PenLine className="h-5 w-5 text-teal-300" />
                </div>
                <h3 className="mt-4 font-semibold text-white">Freelance Writers</h3>
                <p className="mt-2 text-sm text-zinc-400">Juggling multiple clients with different payment schedules</p>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
                <div className="h-11 w-11 rounded-xl bg-teal-500/10 ring-1 ring-teal-500/25 flex items-center justify-center">
                  <Megaphone className="h-5 w-5 text-teal-300" />
                </div>
                <h3 className="mt-4 font-semibold text-white">Marketing Consultants</h3>
                <p className="mt-2 text-sm text-zinc-400">Managing retainers and project-based work</p>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
                <div className="h-11 w-11 rounded-xl bg-teal-500/10 ring-1 ring-teal-500/25 flex items-center justify-center">
                  <Code2 className="h-5 w-5 text-teal-300" />
                </div>
                <h3 className="mt-4 font-semibold text-white">Web Developers</h3>
                <p className="mt-2 text-sm text-zinc-400">Balancing milestone payments across projects</p>
              </div>
            </div>

            <p className="mt-8 text-center text-sm text-zinc-500">
              Not built for: Businesses with full-time bookkeepers or anyone who needs complex accounting. We keep it simple on
              purpose.
            </p>
          </div>
        </section>

        <section className="px-6 pb-16">
          <div className="mx-auto max-w-4xl">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 px-6 py-10 text-center">
              <h3 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">Ready to stop guessing?</h3>
              <div className="mt-6 flex justify-center">
                <GetStartedCTA className="bg-teal-500 hover:bg-teal-400 text-zinc-950 px-8 py-3 rounded-lg text-lg font-semibold h-auto focus:ring-teal-400 focus:ring-offset-zinc-950" />
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

        <LandingFooter />
      </main>
    </div>
  );
}
