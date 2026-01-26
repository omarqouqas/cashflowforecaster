import type { Metadata } from 'next';
import Link from 'next/link';
import LandingHeader from '@/components/landing/landing-header';
import { LandingFooter } from '@/components/landing/footer';
import { GetStartedCTA } from '@/components/landing/get-started-cta';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { breadcrumbs } from '@/components/seo/schemas';
import { CheckCircle2, XCircle, AlertTriangle, Sparkles, BookOpen, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Best Cash Flow Calendar Apps for Freelancers (2026) | Cash Flow Forecaster',
  description:
    "Compare cash flow calendar apps for freelancers. See why Cash Flow Forecaster's invoicing integration and free tier beats the competition.",
  keywords: [
    // Core comparison terms
    'cash flow calendar',
    'cash flow calendar app',
    'cash flow forecasting tool',
    'cash flow forecast software',
    'best cash flow app',
    // Freelancer terms
    'freelance cash flow',
    'freelancer budget app',
    'freelancer finances app',
    // Solopreneur terms
    'solopreneur cash flow app',
    'solopreneur budget tool',
    // Self-employed terms
    'self-employed cash flow',
    'self-employed budget app',
    // Gig worker terms
    'gig worker finances app',
    '1099 contractor budget app',
    // Comparison terms
    'cash flow forecaster vs',
    'best budget app for freelancers',
    'best cash flow app for solopreneurs',
    // Feature terms
    'invoice payment links freelancer',
    'emergency fund tracker freelancer',
  ],
  alternates: {
    canonical: 'https://cashflowforecaster.io/compare/cash-flow-calendar-apps',
  },
  openGraph: {
    title: 'Best Cash Flow Calendar Apps for Freelancers (2026)',
    description:
      "Compare cash flow calendar apps for freelancers. See why Cash Flow Forecaster's invoicing integration and free tier beats the competition.",
    url: 'https://cashflowforecaster.io/compare/cash-flow-calendar-apps',
    siteName: 'Cash Flow Forecaster',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Best Cash Flow Calendar Apps for Freelancers (2026)',
    description:
      "Compare cash flow calendar apps for freelancers. See why Cash Flow Forecaster's invoicing integration and free tier beats the competition.",
  },
};

const comparisonRows = [
  { feature: '"Safe to Spend" indicator', cff: '✅ Prominently displayed daily', typical: '❌ Not available' },
  { feature: 'Low balance alerts', cff: '✅ Proactive email warnings', typical: '❌ No' },
  { feature: 'Free tier', cff: '✅ Yes (10 bills, 10 income)', typical: '❌ Trial only (14 days)' },
  { feature: 'Forecast length', cff: '90 days (Free) / 365 days (Pro)', typical: '~30 days' },
  { feature: 'Invoicing built-in', cff: '✅ Runway Collect', typical: '❌ No' },
  { feature: 'One-click invoice payments', cff: '✅ Clients pay via Stripe', typical: '❌ No' },
  { feature: 'Custom invoice branding', cff: '✅ Logo + business name', typical: '❌ No' },
  { feature: 'Invoice → Forecast sync', cff: '✅ Automatic', typical: '❌ No' },
  { feature: 'Payment reminders', cff: '✅ 3 escalating templates', typical: '❌ No' },
  { feature: 'Emergency fund tracker', cff: '✅ Track savings + runway', typical: '❌ No' },
  { feature: 'Tax savings tracker', cff: '✅ Quarterly estimates', typical: '❌ No' },
  { feature: 'Weekly email digest', cff: '✅ Yes', typical: '❌ No' },
  { feature: 'Freelancer-focused', cff: '✅ Built for irregular income', typical: '⚠️ Generic' },
  { feature: 'Bank connection required', cff: '❌ Optional', typical: '⚠️ Often required' },
  { feature: 'Price', cff: '$7.99/mo', typical: '$8/mo or $72 lifetime' },
] as const;

const faqStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is a cash flow calendar?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A cash flow calendar maps expected income (like invoices or paydays) and upcoming bills onto specific dates so you can see your projected bank balance day-by-day.',
      },
    },
    {
      '@type': 'Question',
      name: 'Why do freelancers need a cash flow calendar?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Freelancers often have irregular income. A cash flow calendar helps you spot low-balance days early, plan spending, and avoid overdrafts between payments.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do I need to connect my bank account?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Not necessarily. Some apps require a bank connection, but Cash Flow Forecaster supports starting with manual balances if you prefer.',
      },
    },
    {
      '@type': 'Question',
      name: 'What makes Cash Flow Forecaster different from typical cash flow calendar apps?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Cash Flow Forecaster is built for freelancers with irregular income and includes built-in invoicing (Runway Collect) plus automatic invoice-to-forecast syncing and a free tier.',
      },
    },
  ],
} as const;

function ValueCell({ value }: { value: string }) {
  const Icon =
    value.startsWith('✅') ? CheckCircle2 : value.startsWith('❌') ? XCircle : value.startsWith('⚠️') ? AlertTriangle : null;

  const iconColor =
    value.startsWith('✅') ? 'text-emerald-300' : value.startsWith('❌') ? 'text-rose-300' : value.startsWith('⚠️') ? 'text-amber-300' : 'text-zinc-300';

  const marker = value.startsWith('✅') ? '✅' : value.startsWith('❌') ? '❌' : value.startsWith('⚠️') ? '⚠️' : null;
  const label = marker ? value.slice(marker.length).trimStart() : value;

  return (
    <div className="flex items-start gap-2">
      {Icon ? <Icon className={`h-4 w-4 mt-0.5 ${iconColor}`} aria-hidden="true" /> : null}
      <span className="text-zinc-200">{label}</span>
    </div>
  );
}

export default function CashFlowCalendarAppsComparePage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white selection-teal scroll-smooth">
      <script
        type="application/ld+json"
        // JSON-LD for rich snippets
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
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
              breadcrumbs.compare,
              { name: 'Cash Flow Calendar Apps', url: 'https://cashflowforecaster.io/compare/cash-flow-calendar-apps' },
            ]}
            className="mb-8"
          />

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-zinc-900/60 border border-zinc-800 px-4 py-2 text-sm text-zinc-200">
              <Sparkles className="h-4 w-4 text-teal-400" />
              <span>Comparison • Updated for 2026</span>
            </div>

            <h1 className="mt-6 text-4xl md:text-5xl font-bold text-white tracking-tight">
              Best Cash Flow Calendar Apps for Freelancers
            </h1>

            <p className="mt-5 text-lg text-zinc-300 leading-relaxed">
              If your income doesn&apos;t hit on the 1st and 15th, a cash flow forecast app gives you the one thing spreadsheets
              never do: date-level clarity. With the right cash flow forecasting software, you can see when invoices land, when bills collide, and what your bank balance is
              likely to be—before you spend.
            </p>

            <p className="mt-4 text-zinc-400 leading-relaxed">
              People often compare tools like <span className="text-zinc-200">Cash Flow Forecaster</span> vs{' '}
              <span className="text-zinc-200">Cash Flow Calendar</span> and other cash flow calendar apps. Here&apos;s a clear,
              freelancer-focused breakdown—without the fluff.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <GetStartedCTA className="bg-teal-500 hover:bg-teal-400 text-zinc-950 focus:ring-teal-400 focus:ring-offset-zinc-950" />
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center h-11 px-4 rounded-md border border-zinc-800 bg-zinc-950/40 text-sm font-medium text-zinc-200 hover:text-white hover:bg-zinc-900/40 transition-colors"
              >
                View Pricing
              </Link>
            </div>
          </div>

          {/* Comparison table */}
          <section className="mt-12">
            <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">Feature comparison</h2>
            <p className="mt-3 text-zinc-400 max-w-3xl">
              Most cash flow forecasting tools show a short projection and stop there. Cash Flow Forecaster is built around
              freelancer workflows—combining cash flow forecasting and liquidity visibility with invoicing and irregular income support.
            </p>

            <div className="mt-6 overflow-x-auto rounded-2xl border border-zinc-800 bg-zinc-900/40">
              <table className="min-w-[760px] w-full text-left text-sm">
                <thead className="bg-zinc-950/40 border-b border-zinc-800">
                  <tr>
                    <th className="px-5 py-4 text-zinc-300 font-medium">Feature</th>
                    <th className="px-5 py-4 text-white font-semibold">Cash Flow Forecaster</th>
                    <th className="px-5 py-4 text-zinc-200 font-medium">Typical Cash Flow Calendar Apps</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((row) => (
                    <tr key={row.feature} className="border-b border-zinc-800 last:border-b-0">
                      <td className="px-5 py-4 text-zinc-300">{row.feature}</td>
                      <td className="px-5 py-4">
                        <ValueCell value={row.cff} />
                      </td>
                      <td className="px-5 py-4">
                        <ValueCell value={row.typical} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="mt-4 text-xs text-zinc-500">
              Note: “Typical” represents common patterns across cash flow calendar apps. Specific features may vary by vendor.
            </p>
          </section>

          {/* Why CFF */}
          <section className="mt-14">
            <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">Why Cash Flow Forecaster</h2>
            <p className="mt-3 text-zinc-400 max-w-3xl">
              Cash Flow Forecaster is designed for freelancers who want the most reliable cash flow forecasting system that actually matches how they
              get paid—a true cash flow forecast model built for irregular income.
            </p>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
                <h3 className="text-lg font-semibold text-white">Built-in invoicing (Runway Collect)</h3>
                <p className="mt-2 text-zinc-400">
                  Create invoices, send them, and keep your cash flow forecast software accurate as your work turns into payments—no separate accounts payable automation needed.
                </p>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
                <h3 className="text-lg font-semibold text-white">Invoice → forecast sync (automatic)</h3>
                <p className="mt-2 text-zinc-400">
                  When you invoice a client, expected income can appear in your forecast automatically—so you don&apos;t have to
                  double-enter data.
                </p>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
                <h3 className="text-lg font-semibold text-white">Free tier (not a 14‑day trial)</h3>
                <p className="mt-2 text-zinc-400">
                  Start planning with a real free plan, then upgrade only when you want longer forecasts and more capacity.
                </p>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
                <h3 className="text-lg font-semibold text-white">Freelancer-first cash flow calendar</h3>
                <p className="mt-2 text-zinc-400">
                  Built for irregular income, bill collisions, and “what&apos;s safe to spend” decisions—without forcing a bank
                  connection.
                </p>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="mt-14">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 px-6 py-10 text-center">
              <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">
                Get your cash flow calendar—free
              </h2>
              <p className="mt-3 text-zinc-400 max-w-2xl mx-auto">
                See the exact days you&apos;ll run low, map invoices and bills on a calendar, and stop guessing if rent is safe.
                Start with 90 days free, or go Pro for a full 365-day forecast.
              </p>
              <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                <GetStartedCTA className="bg-teal-500 hover:bg-teal-400 text-zinc-950 focus:ring-teal-400 focus:ring-offset-zinc-950 px-8" />
                <Link href="/" className="text-sm text-zinc-400 hover:text-zinc-200 transition-colors">
                  Back to home
                </Link>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section className="mt-14">
            <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">FAQ</h2>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
                <h3 className="text-white font-semibold">What is a cash flow calendar?</h3>
                <p className="mt-2 text-zinc-400">
                  It&apos;s a calendar view of expected income and bills so you can see your projected bank balance day-by-day.
                </p>
              </div>
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
                <h3 className="text-white font-semibold">Is this a budget calendar app?</h3>
                <p className="mt-2 text-zinc-400">
                  It&apos;s more cash-focused than a traditional budget calendar app: the goal is knowing what hits your account,
                  when, and what&apos;s safe to spend in between.
                </p>
              </div>
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
                <h3 className="text-white font-semibold">Do I need to connect my bank?</h3>
                <p className="mt-2 text-zinc-400">
                  No—Cash Flow Forecaster supports starting with manual balances. Many cash flow calendar apps push bank
                  connections by default.
                </p>
              </div>
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
                <h3 className="text-white font-semibold">Is Cash Flow Forecaster better than Cash Flow Calendar?</h3>
                <p className="mt-2 text-zinc-400">
                  If you&apos;re a freelancer, the differentiators that matter most are built-in invoicing, invoice-to-forecast
                  sync, and a free tier—areas where typical cash flow calendar apps are often limited.
                </p>
              </div>
            </div>
          </section>

          {/* Related articles for internal linking */}
          <section className="mt-14">
            <div className="flex items-center gap-2 mb-6">
              <BookOpen className="h-5 w-5 text-teal-400" />
              <h2 className="text-xl font-semibold text-white">Related guides</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                href="/blog/how-to-manage-irregular-income-as-freelancer"
                className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 hover:border-zinc-700 transition-colors group"
              >
                <p className="font-medium text-white group-hover:text-teal-300 transition-colors">
                  How to Manage Irregular Income
                </p>
                <p className="mt-1 text-sm text-zinc-400">
                  A complete guide for freelancers
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
                  What is &quot;Safe to Spend&quot;?
                </p>
                <p className="mt-1 text-sm text-zinc-400">
                  The one number every freelancer needs
                </p>
                <span className="mt-3 inline-flex items-center gap-1 text-sm text-teal-400 group-hover:gap-2 transition-all">
                  Read guide <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </Link>
              <Link
                href="/blog/cash-flow-forecasting-for-freelancers"
                className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 hover:border-zinc-700 transition-colors group"
              >
                <p className="font-medium text-white group-hover:text-teal-300 transition-colors">
                  Cash Flow Forecasting Guide
                </p>
                <p className="mt-1 text-sm text-zinc-400">
                  Why day-by-day visibility matters
                </p>
                <span className="mt-3 inline-flex items-center gap-1 text-sm text-teal-400 group-hover:gap-2 transition-all">
                  Read guide <ArrowRight className="h-3.5 w-3.5" />
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

