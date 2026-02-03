import type { Metadata } from 'next';
import Link from 'next/link';
import LandingHeader from '@/components/landing/landing-header';
import { LandingFooter } from '@/components/landing/footer';
import { GetStartedCTA } from '@/components/landing/get-started-cta';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { breadcrumbs } from '@/components/seo/schemas';
import { CheckCircle2, XCircle, AlertTriangle, Sparkles, BookOpen, ArrowRight, AlertCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Mint Alternative for Freelancers | Migrate from Mint to Cash Flow Forecaster',
  description:
    'Mint is shutting down. Cash Flow Forecaster is a free, forward-looking alternative with no ads—built for freelancers with irregular income.',
  keywords: [
    'mint alternative',
    'mint alternative free',
    'mint shutting down',
    'mint replacement',
    'mint alternative no ads',
    'mint migration',
    'intuit mint alternative',
    'mint budget app alternative',
    'free budget app like mint',
    'mint alternative for freelancers',
    'forward looking budget app',
    'cash flow app',
    'mint exodus',
    'credit karma alternative',
  ],
  alternates: {
    canonical: 'https://cashflowforecaster.io/compare/mint',
  },
  openGraph: {
    title: 'Mint Alternative for Freelancers | Free & No Ads',
    description:
      'Mint is shutting down. Cash Flow Forecaster is a free, forward-looking alternative with no ads—built for freelancers.',
    url: 'https://cashflowforecaster.io/compare/mint',
    siteName: 'Cash Flow Forecaster',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mint Alternative for Freelancers | Free & No Ads',
    description:
      'Mint is shutting down. Cash Flow Forecaster is a free, forward-looking alternative with no ads—built for freelancers.',
  },
};

const comparisonRows = [
  { feature: 'Status', cff: '✅ Active and growing', mint: '❌ Shutting down (migrating to Credit Karma)' },
  { feature: 'Approach', cff: '✅ Forward-looking (shows future balance)', mint: '❌ Backward-looking (tracks past spending)' },
  { feature: 'Ads', cff: '✅ No ads ever', mint: '❌ Heavy advertising' },
  { feature: 'Free tier', cff: '✅ Yes (10 bills, 10 income, 90-day forecast)', mint: '✅ Free (ad-supported)' },
  { feature: 'Paid option', cff: '✅ $7.99/mo or $99 lifetime', mint: '❌ N/A' },
  { feature: 'Daily balance forecast', cff: '✅ See balance on any future day', mint: '❌ No forecasting' },
  { feature: 'Forecast length', cff: '✅ Up to 365 days', mint: '❌ Not applicable' },
  { feature: '"Safe to Spend"', cff: '✅ Always visible', mint: '❌ No equivalent' },
  { feature: 'Irregular income support', cff: '✅ Built for it', mint: '⚠️ Basic' },
  { feature: 'Built-in invoicing', cff: '✅ Runway Collect', mint: '❌ No' },
  { feature: 'Invoice → forecast sync', cff: '✅ Automatic', mint: '❌ Not applicable' },
  { feature: 'Bank sync', cff: '❌ Optional (coming soon)', mint: '✅ Yes (Plaid)' },
  { feature: 'Bill reminders', cff: '✅ Email alerts + collision warnings', mint: '✅ Yes' },
  { feature: 'Data privacy', cff: '✅ We don\'t sell your data', mint: '⚠️ Data used for ads' },
  { feature: 'Credit score', cff: '❌ Not included', mint: '✅ Yes (Credit Karma now)' },
] as const;

const faqStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Is Mint shutting down?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Intuit announced that Mint is being discontinued and users are being migrated to Credit Karma. Many users are looking for alternatives that don\'t have ads and offer better features for their needs.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the best Mint alternative?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'For freelancers and people with irregular income, Cash Flow Forecaster is an excellent Mint alternative. Unlike Mint, it shows your future cash flow—not just past spending—and has no ads.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is Cash Flow Forecaster free like Mint?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! Cash Flow Forecaster has a free tier with 10 bills, 10 income sources, and 90-day forecasting. Unlike Mint, there are no ads. Pro features are available for $7.99/month or a $99 lifetime deal.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I import my data from Mint?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Cash Flow Forecaster supports CSV import. Export your recurring bills and income from Mint, then import them into Cash Flow Forecaster. A dedicated Mint importer is on our roadmap.',
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

export default function MintComparisonPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white selection-teal scroll-smooth">
      <script
        type="application/ld+json"
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
              { name: 'Mint Alternative', url: 'https://cashflowforecaster.io/compare/mint' },
            ]}
            className="mb-8"
          />

          {/* Mint shutdown alert */}
          <div className="mb-8 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-amber-200 font-medium">Mint is shutting down</p>
              <p className="mt-1 text-sm text-amber-200/70">
                Intuit is discontinuing Mint and migrating users to Credit Karma. Now is the time to find a better alternative.
              </p>
            </div>
          </div>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-teal-500/10 border border-teal-500/20 px-4 py-2 text-sm text-teal-300">
              <Sparkles className="h-4 w-4" />
              <span>Free tier available • No ads</span>
            </div>

            <h1 className="mt-6 text-4xl md:text-5xl font-bold text-white tracking-tight">
              Mint Alternative for Freelancers
            </h1>

            <p className="mt-5 text-lg text-zinc-300 leading-relaxed">
              Mint tracked where your money <em>went</em>. Cash Flow Forecaster shows where it <em>will be</em>.
              For freelancers with irregular income, that forward-looking view makes all the difference.
            </p>

            <p className="mt-4 text-zinc-400 leading-relaxed">
              Unlike Credit Karma (Mint&apos;s replacement), we have <span className="text-emerald-300">no ads</span>,
              no credit card offers, and no data selling. Just a clean cash flow calendar that helps you
              answer: &quot;Can I afford this before my next invoice pays?&quot;
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

          {/* Key differences callout */}
          <section className="mt-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="rounded-2xl border border-teal-500/30 bg-teal-500/5 p-6 text-center">
                <p className="text-3xl font-bold text-white">Forward</p>
                <p className="mt-2 text-sm text-zinc-400">Looking approach</p>
                <p className="mt-2 text-xs text-teal-300">See future balance, not past spending</p>
              </div>
              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-6 text-center">
                <p className="text-3xl font-bold text-white">No Ads</p>
                <p className="mt-2 text-sm text-zinc-400">Ever</p>
                <p className="mt-2 text-xs text-emerald-300">Your data stays yours</p>
              </div>
              <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-6 text-center">
                <p className="text-3xl font-bold text-white">Free</p>
                <p className="mt-2 text-sm text-zinc-400">Tier available</p>
                <p className="mt-2 text-xs text-amber-300">No credit card required</p>
              </div>
            </div>
          </section>

          {/* Comparison table */}
          <section className="mt-12">
            <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">Mint vs Cash Flow Forecaster</h2>
            <p className="mt-3 text-zinc-400 max-w-3xl">
              Mint was great for tracking past spending. But if you have irregular income, you need to see
              the future—not just the past. Here&apos;s how we compare.
            </p>

            <div className="mt-6 overflow-x-auto rounded-2xl border border-zinc-800 bg-zinc-900/40">
              <table className="min-w-[760px] w-full text-left text-sm">
                <thead className="bg-zinc-950/40 border-b border-zinc-800">
                  <tr>
                    <th className="px-5 py-4 text-zinc-300 font-medium">Feature</th>
                    <th className="px-5 py-4 text-white font-semibold">Cash Flow Forecaster</th>
                    <th className="px-5 py-4 text-zinc-200 font-medium">Mint</th>
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
                        <ValueCell value={row.mint} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Migration guide */}
          <section className="mt-14">
            <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">How to migrate from Mint</h2>
            <p className="mt-3 text-zinc-400 max-w-3xl">
              Moving from Mint is straightforward. Here&apos;s how to get started:
            </p>

            <div className="mt-8 space-y-4">
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-teal-500/20 flex items-center justify-center text-teal-400 font-bold">
                    1
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Export your data from Mint</h3>
                    <p className="mt-2 text-zinc-400">
                      In Mint, go to Settings → Export Data and download your transactions as CSV. Focus on recurring bills
                      and income sources—those are what matter for forecasting.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-teal-500/20 flex items-center justify-center text-teal-400 font-bold">
                    2
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Sign up for Cash Flow Forecaster</h3>
                    <p className="mt-2 text-zinc-400">
                      Create a free account—no credit card required. You&apos;ll get 10 bills, 10 income sources,
                      and 90-day forecasting to start.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-teal-500/20 flex items-center justify-center text-teal-400 font-bold">
                    3
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Add your current balance and recurring items</h3>
                    <p className="mt-2 text-zinc-400">
                      Enter your current bank balance, then add your recurring bills and income. Our quick setup
                      wizard makes this easy—most users are done in 5 minutes.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-teal-500/20 flex items-center justify-center text-teal-400 font-bold">
                    4
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">See your cash flow calendar</h3>
                    <p className="mt-2 text-zinc-400">
                      Instantly see your projected balance for every day ahead. Spot low-balance days,
                      bill collisions, and know exactly what&apos;s safe to spend.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="mt-14">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 px-6 py-10 text-center">
              <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">
                Ready to leave Mint behind?
              </h2>
              <p className="mt-3 text-zinc-400 max-w-2xl mx-auto">
                Join thousands of freelancers who are switching to a forward-looking approach.
                Start free, upgrade when you need more.
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
                <h3 className="text-white font-semibold">Is Mint really shutting down?</h3>
                <p className="mt-2 text-zinc-400">
                  Yes. Intuit announced that Mint is being discontinued and users are being migrated to Credit Karma,
                  which focuses on credit scores and ads rather than budgeting.
                </p>
              </div>
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
                <h3 className="text-white font-semibold">Is Cash Flow Forecaster really free?</h3>
                <p className="mt-2 text-zinc-400">
                  Yes! Our free tier includes 10 bills, 10 income sources, 90-day forecasting, and no ads.
                  No credit card required. Upgrade to Pro only when you need more.
                </p>
              </div>
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
                <h3 className="text-white font-semibold">Can I import my Mint data?</h3>
                <p className="mt-2 text-zinc-400">
                  Yes! Export your data from Mint as CSV, then add your recurring bills and income to
                  Cash Flow Forecaster. A dedicated Mint importer is coming soon.
                </p>
              </div>
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
                <h3 className="text-white font-semibold">Do you sell my data?</h3>
                <p className="mt-2 text-zinc-400">
                  Never. Unlike Mint and Credit Karma, we don&apos;t make money from ads or selling your data.
                  We make money when you upgrade to Pro—that&apos;s it.
                </p>
              </div>
            </div>
          </section>

          {/* Related articles */}
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
                href="/compare/ynab"
                className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 hover:border-zinc-700 transition-colors group"
              >
                <p className="font-medium text-white group-hover:text-teal-300 transition-colors">
                  YNAB Alternative
                </p>
                <p className="mt-1 text-sm text-zinc-400">
                  Save 47% with forward-looking forecasts
                </p>
                <span className="mt-3 inline-flex items-center gap-1 text-sm text-teal-400 group-hover:gap-2 transition-all">
                  Compare <ArrowRight className="h-3.5 w-3.5" />
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
