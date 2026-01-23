import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import PricingSection from '@/components/pricing/pricing-section';
import LandingHeader from '@/components/landing/landing-header';
import { FAQSection } from '@/components/landing/faq-section';
import { GetStartedCTA } from '@/components/landing/get-started-cta';
import { LandingFooter } from '@/components/landing/footer';
import HeroDashboard from '@/components/landing/hero-dashboard';
import {
  BadgeDollarSign,
  Bell,
  Calendar,
  CheckCircle2,
  Code2,
  DollarSign,
  FileSpreadsheet,
  FileText,
  Lock,
  Mail,
  Megaphone,
  Palette,
  PenLine,
  PiggyBank,
  Shield,
  Sparkles,
  Wallet,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { getUserSubscription } from '@/lib/stripe/subscription';

export const metadata: Metadata = {
  title: 'Cash Flow Calendar for Freelancers | Cash Flow Forecaster',
  description:
    'A cash flow calendar app for freelancers with irregular income—see your bank balance up to 365 days ahead with interactive charts, filters, and bill alerts.',
  keywords: [
    // Core product terms
    'cash flow calendar',
    'cash flow calendar app',
    'cash flow forecast',
    'cash flow forecast app',
    'cash flow forecasting tool',
    'cash flow forecasting software',
    // Freelancer terms
    'freelancer cash flow',
    'freelancer budget',
    'freelancer finances app',
    'freelancer cash flow forecast',
    'freelancer money management',
    // Solopreneur terms
    'solopreneur cash flow',
    'solopreneur budget app',
    'solopreneur finances',
    'solopreneur money management',
    // Self-employed terms
    'self-employed budgeting app',
    'self-employed cash flow',
    'self-employed money management',
    'self-employed finances',
    // Gig worker / 1099 terms
    'gig worker finances',
    'gig worker money management',
    'gig worker budget app',
    '1099 contractor finances',
    '1099 income tracking',
    '1099 budget app',
    // Side hustle terms
    'side hustle income tracking',
    'side hustle budget',
    'side hustle finances',
    // Income type terms
    'irregular income budgeting app',
    'variable income budgeting',
    'unpredictable income budget',
    // Problem/solution terms
    'can I afford this calculator',
    'when will I run out of money calculator',
    'bank balance predictor',
    'predict bank balance',
    'avoid overdraft freelancer',
    // Feature terms
    'freelancer invoice payment links',
    'invoice to cash flow tracking',
    'freelancer tax tracking',
    'quarterly tax payments freelancer',
    'emergency fund tracker',
  ],
  alternates: {
    canonical: 'https://cashflowforecaster.io',
  },
  openGraph: {
    title: 'Cash Flow Calendar for Freelancers | Cash Flow Forecaster',
    description:
      'A cash flow calendar app for freelancers with irregular income—see your bank balance up to 365 days ahead with interactive charts, filters, and bill alerts.',
    url: 'https://cashflowforecaster.io',
    siteName: 'Cash Flow Forecaster',
    type: 'website',
    images: [
      {
        url: 'https://cashflowforecaster.io/hero-dashboard.png',
        width: 1200,
        height: 630,
        alt: 'Cash Flow Forecaster dashboard showing balance forecast chart and calendar',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cash Flow Calendar for Freelancers | Cash Flow Forecaster',
    description:
      'A cash flow calendar app for freelancers with irregular income—see your bank balance up to 365 days ahead with interactive charts, filters, and bill alerts.',
    images: ['https://cashflowforecaster.io/hero-dashboard.png'],
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

const howToSchema = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to Forecast Your Cash Flow as a Freelancer',
  description: 'A simple 4-step process to get clarity on what\'s safe to spend—today and up to a year from now.',
  step: [
    {
      '@type': 'HowToStep',
      position: 1,
      name: 'Add Your Accounts',
      text: 'Connect your checking/savings accounts or start with manual balances to set your starting point.',
    },
    {
      '@type': 'HowToStep',
      position: 2,
      name: 'Enter Your Bills',
      text: 'Add one-time or recurring bills and income sources with their amounts and due dates.',
    },
    {
      '@type': 'HowToStep',
      position: 3,
      name: 'See Your Future',
      text: 'Get up to a 365-day projection with interactive charts and filters showing your daily balance.',
    },
    {
      '@type': 'HowToStep',
      position: 4,
      name: 'Stay Informed',
      text: 'Receive weekly digests and alerts delivered to your inbox to stay on top of your cash flow.',
    },
  ],
} as const;

interface HomeProps {
  searchParams: { deleted?: string };
}

export default async function Home({ searchParams }: HomeProps) {
  // Get auth state on server (use getSession to avoid refresh token errors)
  const supabase = await createClient();
  let user = null;

  try {
    // Use getSession() instead of getUser() to avoid refresh token errors
    // getSession() reads from the cookie without attempting to refresh
    const { data: { session }, error } = await supabase.auth.getSession();
    if (!error && session) {
      user = session.user;
    }
  } catch (error) {
    // If auth fails (invalid/expired token), treat as logged out
    // The middleware will handle cleanup
    user = null;
  }

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
      <script
        type="application/ld+json"
        // HowTo schema for "How it Works" section
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
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

      {/* Account Deleted Success Message */}
      {searchParams?.deleted === 'true' && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 max-w-md w-full mx-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 shadow-lg">
            <p className="text-sm text-green-800 font-medium text-center">
              Your account has been successfully deleted. Thank you for using Cash Flow Forecaster.
            </p>
          </div>
        </div>
      )}

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
              Know exactly what&apos;s <span className="text-teal-300 font-semibold">safe to spend</span> — today and for the next <span className="text-teal-300 font-semibold">365 days</span>.
              Your personal cash flow calendar with interactive charts, smart filters, and every bill mapped out.
            </p>

            <div className="mt-8 flex flex-col items-center gap-3">
              <GetStartedCTA className="bg-teal-500 hover:bg-teal-400 text-zinc-950 px-8 py-3 rounded-lg text-lg font-semibold h-auto focus:ring-teal-400 focus:ring-offset-zinc-950" />

              <p className="text-sm text-zinc-400">Set up in <span className="text-teal-300 font-medium">3 minutes</span> • No credit card • <span className="text-teal-300 font-medium">Free forever</span> plan</p>

              <p className="text-sm text-zinc-300">
                Already have an account?{' '}
                <Link href="/auth/login" className="text-teal-300 hover:text-teal-200 hover:underline">
                  Log in
                </Link>
              </p>

              <div className="mt-2 flex items-center gap-2 text-sm text-zinc-500">
                <div className="flex -space-x-2">
                  <div className="h-6 w-6 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 ring-2 ring-zinc-950" />
                  <div className="h-6 w-6 rounded-full bg-gradient-to-br from-violet-400 to-violet-600 ring-2 ring-zinc-950" />
                  <div className="h-6 w-6 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 ring-2 ring-zinc-950" />
                </div>
                <span>Trusted by designers, writers &amp; developers</span>
              </div>
            </div>

            <div className="mt-10 max-w-4xl mx-auto rounded-2xl shadow-2xl border border-zinc-800 overflow-hidden bg-zinc-900/40">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-800 bg-zinc-950/40">
                <span className="h-3 w-3 rounded-full bg-red-500" />
                <span className="h-3 w-3 rounded-full bg-yellow-500" />
                <span className="h-3 w-3 rounded-full bg-green-500" />
              </div>
              <div className="p-4 md:p-6">
                <HeroDashboard />
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
                A simple 4-step flow to get clarity on what&apos;s safe to spend—today and up to a year from now.
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
                <p className="mt-2 text-zinc-400">Get up to a 365-day projection with interactive charts and filters.</p>
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
                Four pillars of cash flow clarity
              </h2>
              <p className="mt-3 text-zinc-400 max-w-2xl mx-auto">
                Our cash flow forecasting tool helps you know what&apos;s safe today, get paid faster, avoid getting blindsided, and save for taxes—without spreadsheets.
              </p>
            </div>

            <div className="mt-12 space-y-16">
              {/* Pillar 1 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                <div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="h-11 w-11 rounded-xl bg-teal-500/10 ring-1 ring-teal-500/25 flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-teal-300" />
                    </div>
                    <h3 className="text-2xl font-semibold text-white tracking-tight">Safe to Spend</h3>
                    <span className="text-xs text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-3 py-1">
                      Core Feature
                    </span>
                  </div>

                  <p className="mt-4 text-zinc-300 leading-relaxed">
                    One number that answers: &quot;Can I afford this?&quot; Your <span className="text-teal-300 font-medium">Safe to Spend</span> amount
                    is calculated from your lowest projected balance over the next 14 days, minus your safety buffer.
                    No more guessing.
                  </p>

                  <ul className="mt-6 space-y-3 text-sm text-zinc-300">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-teal-300 mt-0.5" />
                      <span><strong className="text-white">Safe to Spend indicator</strong> — always visible at the top</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-teal-300 mt-0.5" />
                      <span>Interactive 365-day balance forecast chart</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-teal-300 mt-0.5" />
                      <span>Low balance alerts when you need them</span>
                    </li>
                  </ul>
                </div>

                <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 overflow-hidden shadow-2xl">
                  <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-800 bg-zinc-950/40">
                    <span className="h-3 w-3 rounded-full bg-red-500" />
                    <span className="h-3 w-3 rounded-full bg-yellow-500" />
                    <span className="h-3 w-3 rounded-full bg-green-500" />
                    <span className="ml-2 text-xs text-zinc-400">365-day forecast</span>
                  </div>
                  <Image
                    src="/screenshot-calendar.png"
                    alt="Cash flow calendar with interactive chart and balance forecast"
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
                    Create invoices, send them with a one-click &quot;Pay Now&quot; button, and auto-remind clients who forget.
                    Watch expected income appear in your forecast the moment you hit send—and get paid directly via Stripe.
                  </p>

                  <ul className="mt-6 space-y-3 text-sm text-zinc-300">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-teal-300 mt-0.5" />
                      <span><strong className="text-white">One-click payments</strong> — clients pay instantly via Stripe</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-teal-300 mt-0.5" />
                      <span>Professional PDF invoices with payment links</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-teal-300 mt-0.5" />
                      <span>Custom branding with your logo and business name</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-teal-300 mt-0.5" />
                      <span>Automated payment reminders</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-teal-300 mt-0.5" />
                      <span>Invoice-to-forecast sync + auto status updates</span>
                    </li>
                  </ul>
                </div>

                <div className="lg:order-1 rounded-2xl border border-zinc-800 bg-zinc-900/40 overflow-hidden shadow-2xl">
                  <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-800 bg-zinc-950/40">
                    <span className="h-3 w-3 rounded-full bg-red-500" />
                    <span className="h-3 w-3 rounded-full bg-yellow-500" />
                    <span className="h-3 w-3 rounded-full bg-green-500" />
                    <span className="ml-2 text-xs text-zinc-400">Invoice management</span>
                  </div>
                  <Image
                    src="/screenshot-invoices.png"
                    alt="Invoice dashboard with status tracking and PDF downloads"
                    width={1600}
                    height={900}
                    sizes="(max-width: 1024px) 100vw, 560px"
                    className="w-full h-auto"
                  />
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

              {/* Pillar 4: Tax Savings Tracker */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                <div className="lg:order-2">
                  <div className="flex items-center gap-3">
                    <div className="h-11 w-11 rounded-xl bg-teal-500/10 ring-1 ring-teal-500/25 flex items-center justify-center">
                      <DollarSign className="h-5 w-5 text-teal-300" />
                    </div>
                    <h3 className="text-2xl font-semibold text-white tracking-tight">Save for Taxes Automatically</h3>
                  </div>

                  <p className="mt-4 text-zinc-300 leading-relaxed">
                    Set your tax rate, track quarterly estimated payments, and see your after-tax &quot;safe to spend&quot; amount.
                    Never get surprised by tax season again.
                  </p>

                  <ul className="mt-6 space-y-3 text-sm text-zinc-300">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-teal-300 mt-0.5" />
                      <span>After-tax income calculator</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-teal-300 mt-0.5" />
                      <span>Quarterly tax deadline tracking</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-teal-300 mt-0.5" />
                      <span>Tax savings progress bar</span>
                    </li>
                  </ul>
                </div>

                <div className="lg:order-1 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-zinc-200">Tax Savings Tracker</span>
                    <span className="text-xs text-teal-300 bg-teal-500/10 border border-teal-500/20 rounded-full px-3 py-1">
                      25% rate
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <p className="text-sm text-zinc-400">Total Income</p>
                      <p className="mt-1 text-2xl font-semibold text-white">$48,000</p>
                    </div>
                    <div>
                      <p className="text-sm text-zinc-400">After-Tax</p>
                      <p className="mt-1 text-2xl font-semibold text-teal-400">$36,000</p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-zinc-400">Tax Progress</span>
                      <span className="font-medium text-white">$8,500 / $12,000</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
                      <div className="h-full bg-amber-400 transition-all" style={{ width: '71%' }} />
                    </div>
                    <p className="mt-2 text-xs text-zinc-400">
                      $3,500 remaining to save
                    </p>
                  </div>

                  <div className="mt-5 rounded-lg border border-amber-500/25 bg-amber-500/10 p-3">
                    <div className="flex items-start gap-2">
                      <Bell className="h-4 w-4 text-amber-300 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-amber-100">
                          Q4 deadline in 28 days
                        </p>
                        <p className="text-xs text-amber-200 mt-1">
                          $3,000 estimated tax due by January 15
                        </p>
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

                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                      Test a hypothetical expense and instantly see how it affects your cash flow forecast.
                    </p>
                    <div className="mt-5 rounded-xl border border-zinc-800 bg-zinc-950/40 overflow-hidden">
                      <Image
                        src="/screenshot-scenario.png"
                        alt="Can I Afford It scenario tester"
                        width={800}
                        height={600}
                        sizes="(max-width: 768px) 100vw, 400px"
                        className="w-full h-auto"
                      />
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
                    <div className="mt-5 rounded-xl border border-zinc-800 bg-zinc-950/40 overflow-hidden">
                      <Image
                        src="/screenshot-import.png"
                        alt="CSV import wizard with 3-step process"
                        width={800}
                        height={600}
                        sizes="(max-width: 768px) 100vw, 400px"
                        className="w-full h-auto"
                      />
                    </div>
                  </div>

                  <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
                    <div className="flex items-center justify-between">
                      <div className="h-10 w-10 rounded-lg bg-teal-500/10 ring-1 ring-teal-500/25 flex items-center justify-center">
                        <PiggyBank className="h-5 w-5 text-teal-300" />
                      </div>
                      <span className="text-xs text-teal-300 bg-teal-500/10 border border-teal-500/20 rounded-full px-3 py-1">
                        Savings Goal
                      </span>
                    </div>
                    <h4 className="mt-4 font-semibold text-white">Emergency Fund Tracker</h4>
                    <p className="mt-2 text-zinc-400">
                      Set a savings goal and track your progress. See how much runway you have if income stops.
                    </p>
                    <div className="mt-5 rounded-xl border border-zinc-800 bg-zinc-950/40 p-4">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-zinc-400">Emergency Fund</span>
                        <span className="font-medium text-white">$8,500 / $15,000</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
                        <div className="h-full bg-teal-500 transition-all" style={{ width: '57%' }} />
                      </div>
                      <p className="mt-3 text-xs text-zinc-400">
                        3.2 months of runway at current spending
                      </p>
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
                Cash Flow Forecaster is the most reliable cash flow forecasting system for anyone whose income doesn&apos;t arrive on the 1st and 15th like clockwork.
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
              Join freelancers who use our cash flow forecast software to finally know where their money is going.
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
