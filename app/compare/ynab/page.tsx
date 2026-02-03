import type { Metadata } from 'next';
import Link from 'next/link';
import LandingHeader from '@/components/landing/landing-header';
import { LandingFooter } from '@/components/landing/footer';
import { GetStartedCTA } from '@/components/landing/get-started-cta';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { breadcrumbs } from '@/components/seo/schemas';
import { CheckCircle2, XCircle, AlertTriangle, BookOpen, ArrowRight, DollarSign } from 'lucide-react';

export const metadata: Metadata = {
  title: 'YNAB Alternative for Freelancers | Cash Flow Forecaster vs YNAB',
  description:
    'Looking for a YNAB alternative? Cash Flow Forecaster is 47% cheaper ($7.99 vs $14.99), forward-looking instead of backward-looking, and built for irregular income.',
  keywords: [
    'ynab alternative',
    'ynab alternative free',
    'ynab alternative for freelancers',
    'cheaper than ynab',
    'ynab vs cash flow forecaster',
    'ynab too expensive',
    'ynab price increase',
    'budget app for freelancers',
    'forward looking budget app',
    'cash flow forecasting vs budgeting',
    'irregular income budget app',
    'freelancer budget alternative',
    'you need a budget alternative',
  ],
  alternates: {
    canonical: 'https://cashflowforecaster.io/compare/ynab',
  },
  openGraph: {
    title: 'YNAB Alternative for Freelancers | 47% Cheaper',
    description:
      'Looking for a YNAB alternative? Cash Flow Forecaster is 47% cheaper, forward-looking, and built for irregular income.',
    url: 'https://cashflowforecaster.io/compare/ynab',
    siteName: 'Cash Flow Forecaster',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'YNAB Alternative for Freelancers | 47% Cheaper',
    description:
      'Looking for a YNAB alternative? Cash Flow Forecaster is 47% cheaper, forward-looking, and built for irregular income.',
  },
};

const comparisonRows = [
  { feature: 'Approach', cff: '✅ Forward-looking (shows future balance)', ynab: '❌ Backward-looking (tracks past spending)' },
  { feature: 'Monthly price', cff: '✅ $7.99/mo (47% cheaper)', ynab: '❌ $14.99/mo' },
  { feature: 'Yearly price', cff: '✅ $79/year', ynab: '❌ $109/year' },
  { feature: 'Lifetime option', cff: '✅ $99 one-time', ynab: '❌ Not available' },
  { feature: 'Free tier', cff: '✅ Yes (10 bills, 10 income, 90-day forecast)', ynab: '❌ 34-day trial only' },
  { feature: 'Irregular income support', cff: '✅ Built for it', ynab: '⚠️ Requires workarounds' },
  { feature: 'Daily balance forecast', cff: '✅ See balance on any future day', ynab: '❌ Monthly view only' },
  { feature: 'Forecast length', cff: '✅ Up to 365 days', ynab: '⚠️ Current month focus' },
  { feature: '"Safe to Spend" indicator', cff: '✅ Always visible', ynab: '⚠️ "Age of Money" (different concept)' },
  { feature: 'Bill collision alerts', cff: '✅ Yes', ynab: '❌ No' },
  { feature: 'Built-in invoicing', cff: '✅ Runway Collect', ynab: '❌ No' },
  { feature: 'Invoice → forecast sync', cff: '✅ Automatic', ynab: '❌ Not applicable' },
  { feature: 'Bank sync', cff: '❌ Optional (coming soon)', ynab: '✅ Yes (Plaid)' },
  { feature: 'Learning curve', cff: '✅ Simple calendar view', ynab: '⚠️ Steep (envelope method)' },
  { feature: 'YNAB data migration', cff: '✅ Dedicated importer (auto-detects format)', ynab: '❌ Export only' },
  { feature: 'Mobile app', cff: '⚠️ PWA (works on mobile)', ynab: '✅ Native iOS/Android' },
] as const;

const faqStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Why is YNAB so expensive?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'YNAB charges $14.99/month or $109/year, making it one of the most expensive budgeting apps. The price has increased multiple times over the years, frustrating long-time users. Cash Flow Forecaster offers similar functionality for 47% less at $7.99/month.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the difference between YNAB and Cash Flow Forecaster?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'YNAB is backward-looking—it tracks where your money went. Cash Flow Forecaster is forward-looking—it shows where your money will be. For freelancers with irregular income, seeing future cash flow is often more valuable than categorizing past expenses.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does YNAB work for freelancers?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'YNAB can work for freelancers, but it requires workarounds. The envelope budgeting method assumes predictable income. If you have irregular income, a forward-looking cash flow calendar like Cash Flow Forecaster may be a better fit.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I import my data from YNAB?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! We have a dedicated YNAB importer that auto-detects your export format (both basic and register exports). Just export your transactions from YNAB as CSV, upload to our YNAB import page, and we automatically handle the Outflow/Inflow columns and use your YNAB categories to suggest income vs bill classification.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is there a free YNAB alternative?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Cash Flow Forecaster offers a free tier with 10 bills, 10 income sources, and a 90-day forecast—no credit card required. YNAB only offers a 34-day trial before requiring payment.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the best YNAB alternative for freelancers in 2026?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Cash Flow Forecaster is the best YNAB alternative for freelancers in 2026. It costs 47% less ($7.99/mo vs $14.99/mo), offers a forward-looking cash flow calendar built for irregular income, and includes built-in invoicing to help you get paid faster.',
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

export default function YNABComparisonPage() {
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
              { name: 'YNAB Alternative', url: 'https://cashflowforecaster.io/compare/ynab' },
            ]}
            className="mb-8"
          />

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 text-sm text-emerald-300">
              <DollarSign className="h-4 w-4" />
              <span>Save 47% vs YNAB</span>
            </div>

            <h1 className="mt-6 text-4xl md:text-5xl font-bold text-white tracking-tight">
              YNAB Alternative for Freelancers
            </h1>

            <p className="mt-5 text-lg text-zinc-300 leading-relaxed">
              Tired of paying <span className="text-rose-300">$14.99/month</span> for YNAB? You&apos;re not alone.
              YNAB&apos;s price increases have pushed many freelancers to look for alternatives that won&apos;t break the bank.
            </p>

            <p className="mt-4 text-zinc-400 leading-relaxed">
              Cash Flow Forecaster is <span className="text-emerald-300 font-medium">47% cheaper</span> and takes a different approach:
              instead of tracking where your money <em>went</em>, we show you where it <em>will be</em>.
              For freelancers with irregular income, that forward-looking view is often more valuable.
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

          {/* Price comparison callout */}
          <section className="mt-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="rounded-2xl border border-rose-500/30 bg-rose-500/5 p-6 text-center">
                <p className="text-sm text-rose-300 font-medium">YNAB</p>
                <p className="mt-2 text-3xl font-bold text-white">$14.99<span className="text-lg text-zinc-400">/mo</span></p>
                <p className="mt-1 text-sm text-zinc-400">or $109/year</p>
              </div>
              <div className="rounded-2xl border border-teal-500/30 bg-teal-500/5 p-6 text-center">
                <p className="text-sm text-teal-300 font-medium">Cash Flow Forecaster</p>
                <p className="mt-2 text-3xl font-bold text-white">$7.99<span className="text-lg text-zinc-400">/mo</span></p>
                <p className="mt-1 text-sm text-zinc-400">or $79/year</p>
              </div>
              <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-6 text-center">
                <p className="text-sm text-amber-300 font-medium">Your Savings</p>
                <p className="mt-2 text-3xl font-bold text-emerald-400">$7<span className="text-lg text-zinc-400">/mo</span></p>
                <p className="mt-1 text-sm text-zinc-400">47% less than YNAB</p>
              </div>
            </div>
          </section>

          {/* Comparison table */}
          <section className="mt-12">
            <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">Feature comparison</h2>
            <p className="mt-3 text-zinc-400 max-w-3xl">
              YNAB excels at envelope budgeting and tracking past spending. But if you need to see your
              future cash flow—especially with irregular income—here&apos;s how we compare.
            </p>

            <div className="mt-6 overflow-x-auto rounded-2xl border border-zinc-800 bg-zinc-900/40">
              <table className="min-w-[760px] w-full text-left text-sm">
                <thead className="bg-zinc-950/40 border-b border-zinc-800">
                  <tr>
                    <th className="px-5 py-4 text-zinc-300 font-medium">Feature</th>
                    <th className="px-5 py-4 text-white font-semibold">Cash Flow Forecaster</th>
                    <th className="px-5 py-4 text-zinc-200 font-medium">YNAB</th>
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
                        <ValueCell value={row.ynab} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Why switch */}
          <section className="mt-14">
            <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">Why freelancers switch from YNAB</h2>
            <p className="mt-3 text-zinc-400 max-w-3xl">
              YNAB is a great tool for W-2 employees with predictable paychecks. But freelancers often need something different.
            </p>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
                <h3 className="text-lg font-semibold text-white">Forward-looking, not backward-looking</h3>
                <p className="mt-2 text-zinc-400">
                  YNAB tells you where your money went. We show you where it <em>will be</em>—on any day up to a year ahead.
                  When clients pay erratically, that visibility is essential.
                </p>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
                <h3 className="text-lg font-semibold text-white">No envelope complexity</h3>
                <p className="mt-2 text-zinc-400">
                  YNAB&apos;s envelope method has a steep learning curve. Our calendar view is intuitive:
                  see income, see bills, see your balance. That&apos;s it.
                </p>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
                <h3 className="text-lg font-semibold text-white">Built-in invoicing</h3>
                <p className="mt-2 text-zinc-400">
                  Send invoices, collect payments via Stripe, and watch expected income appear in your forecast automatically.
                  YNAB doesn&apos;t help you get paid.
                </p>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
                <h3 className="text-lg font-semibold text-white">47% cheaper</h3>
                <p className="mt-2 text-zinc-400">
                  $7.99/mo vs $14.99/mo. Or save even more with our $99 lifetime deal—pay once, use forever.
                  No more subscription fatigue.
                </p>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="mt-14">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 px-6 py-10 text-center">
              <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">
                Ready to try a YNAB alternative?
              </h2>
              <p className="mt-3 text-zinc-400 max-w-2xl mx-auto">
                Start with our free tier—no credit card required. See your cash flow calendar in action,
                then decide if it&apos;s right for you.
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
                <h3 className="text-white font-semibold">Why is YNAB so expensive?</h3>
                <p className="mt-2 text-zinc-400">
                  YNAB has raised prices multiple times, frustrating users. At $14.99/mo, it&apos;s one of the priciest budget apps.
                  Cash Flow Forecaster costs 47% less.
                </p>
              </div>
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
                <h3 className="text-white font-semibold">Is Cash Flow Forecaster better than YNAB?</h3>
                <p className="mt-2 text-zinc-400">
                  It depends on your needs. YNAB excels at envelope budgeting. We excel at forward-looking cash flow for irregular income.
                  If you&apos;re a freelancer, we&apos;re likely a better fit.
                </p>
              </div>
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
                <h3 className="text-white font-semibold">Can I import from YNAB?</h3>
                <p className="mt-2 text-zinc-400">
                  Yes! We have a dedicated YNAB importer that auto-detects your export format.
                  Just upload your CSV and we handle the rest—no manual column mapping required.
                </p>
              </div>
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
                <h3 className="text-white font-semibold">Does Cash Flow Forecaster have bank sync?</h3>
                <p className="mt-2 text-zinc-400">
                  Not yet—bank sync is on our roadmap. Many users prefer manual entry for privacy and control.
                  Our CSV import makes it easy to get started.
                </p>
              </div>
            </div>
          </section>

          {/* Other comparisons */}
          <section className="mt-14">
            <h2 className="text-xl font-semibold text-white mb-6">Other comparisons</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link
                href="/compare/mint"
                className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 hover:border-teal-500/50 transition-colors group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-white group-hover:text-teal-300 transition-colors">
                      Mint Alternative
                    </p>
                    <p className="mt-1 text-sm text-zinc-400">
                      Mint shut down in 2024. See why freelancers are choosing us.
                    </p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-zinc-600 group-hover:text-teal-400 transition-colors flex-shrink-0" />
                </div>
              </Link>
              <Link
                href="/compare/cash-flow-calendar-apps"
                className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 hover:border-teal-500/50 transition-colors group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-white group-hover:text-teal-300 transition-colors">
                      Cash Flow Calendar Apps
                    </p>
                    <p className="mt-1 text-sm text-zinc-400">
                      Compare all the best options for freelancers in 2026.
                    </p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-zinc-600 group-hover:text-teal-400 transition-colors flex-shrink-0" />
                </div>
              </Link>
            </div>
          </section>

          {/* Related articles */}
          <section className="mt-14">
            <div className="flex items-center gap-2 mb-6">
              <BookOpen className="h-5 w-5 text-teal-400" />
              <h2 className="text-xl font-semibold text-white">Related guides</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            </div>
          </section>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
