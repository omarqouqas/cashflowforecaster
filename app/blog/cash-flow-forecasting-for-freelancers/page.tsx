import type { Metadata } from 'next';
import Link from 'next/link';
import { getPostBySlug } from '@/lib/blog/posts';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { breadcrumbs, definitions } from '@/components/seo/schemas';
import { GetStartedCTA } from '@/components/landing/get-started-cta';
import {
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  Lightbulb,
  TrendingUp,
  BarChart3,
  AlertTriangle,
} from 'lucide-react';

const post = getPostBySlug('cash-flow-forecasting-for-freelancers')!;

export const metadata: Metadata = {
  title: post.title,
  description: post.description,
  keywords: post.keywords,
  alternates: {
    canonical: `https://www.cashflowforecaster.io/blog/${post.slug}`,
  },
  openGraph: {
    title: post.title,
    description: post.description,
    url: `https://www.cashflowforecaster.io/blog/${post.slug}`,
    siteName: 'Cash Flow Forecaster',
    type: 'article',
    publishedTime: post.publishedAt,
    authors: [post.author.name],
  },
  twitter: {
    card: 'summary_large_image',
    title: post.title,
    description: post.description,
  },
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: post.title,
  description: post.description,
  datePublished: post.publishedAt,
  dateModified: post.updatedAt || post.publishedAt,
  author: {
    '@type': 'Organization',
    name: post.author.name,
  },
  publisher: {
    '@type': 'Organization',
    name: 'Cash Flow Forecaster',
    url: 'https://www.cashflowforecaster.io',
  },
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': `https://www.cashflowforecaster.io/blog/${post.slug}`,
  },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is cash flow forecasting?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Cash flow forecasting is predicting your future bank balance based on known income and expenses. For freelancers, this means projecting when invoices will be paid, when bills are due, and what your balance will be on any given day.',
      },
    },
    {
      '@type': 'Question',
      name: 'Why do freelancers need cash flow forecasting?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Freelancers have irregular income, making monthly budgets unreliable. Cash flow forecasting shows day-by-day projections so you can spot low-balance days before they happen, plan large purchases, and avoid overdrafts.',
      },
    },
    {
      '@type': 'Question',
      name: 'How far ahead should I forecast my cash flow?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'For most freelancers, 60-90 days provides useful visibility without too much uncertainty. However, forecasting up to 365 days helps with quarterly taxes, annual expenses, and long-term planning.',
      },
    },
  ],
};

export default function CashFlowForecastingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <article className="mx-auto max-w-3xl">
        <Breadcrumbs
          items={[
            breadcrumbs.home,
            breadcrumbs.blog,
            { name: 'Cash Flow Forecasting', url: `https://www.cashflowforecaster.io/blog/${post.slug}` },
          ]}
          className="mb-8"
        />

        {/* Article header */}
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs px-3 py-1 rounded-full border bg-teal-500/10 text-teal-300 border-teal-500/20">
              {post.category}
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight leading-tight">
            {post.title}
          </h1>

          <p className="mt-4 text-lg text-zinc-300 leading-relaxed">
            {post.description}
          </p>

          <div className="mt-6 flex items-center gap-4 text-sm text-zinc-500">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {new Date(post.publishedAt).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              {post.readingTime}
            </span>
          </div>
        </header>

        {/* Article content */}
        <div className="prose prose-invert prose-zinc max-w-none">
          {/* Definition box for AEO */}
          <div className="not-prose mb-10 rounded-2xl border border-teal-500/20 bg-teal-500/5 p-6">
            <h2 className="text-xl font-semibold text-white mb-3">
              {definitions.cashFlowForecast.term}
            </h2>
            <p className="text-zinc-300 leading-relaxed text-lg">
              {definitions.cashFlowForecast.definition}
            </p>
            <p className="mt-4 text-sm text-zinc-500">
              Also known as: {definitions.cashFlowForecast.alsoKnownAs.join(', ')}
            </p>
          </div>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-4">
              The problem with monthly thinking
            </h2>

            <p className="text-zinc-300 leading-relaxed mb-6">
              Traditional financial advice tells you to budget monthly: calculate your monthly income, subtract
              monthly expenses, save the rest. Simple, right?
            </p>

            <p className="text-zinc-300 leading-relaxed mb-6">
              Not if you&apos;re a freelancer. Here&apos;s why monthly budgeting fails:
            </p>

            <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <XCircle className="h-5 w-5 text-rose-400" />
                  <span className="font-semibold text-white">Monthly budget says:</span>
                </div>
                <p className="text-zinc-300 text-sm">
                  &quot;You&apos;ll earn $6,000 and spend $4,500 this month. You&apos;re $1,500 ahead!&quot;
                </p>
              </div>

              <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-5 w-5 text-amber-400" />
                  <span className="font-semibold text-white">Reality:</span>
                </div>
                <p className="text-zinc-300 text-sm">
                  That $6,000 arrives on the 28th. Rent, insurance, and utilities hit on the 1st. You overdraft.
                </p>
              </div>
            </div>

            <p className="text-zinc-300 leading-relaxed">
              Monthly totals hide <strong className="text-white">timing</strong>. For freelancers, timing is everything.
              A $10,000 month means nothing if the money arrives after your bills are due.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-4">
              What cash flow forecasting actually shows you
            </h2>

            <p className="text-zinc-300 leading-relaxed mb-6">
              Instead of monthly totals, a cash flow forecast shows your <strong className="text-white">projected
              balance on every single day</strong>. It&apos;s like a weather forecast for your bank account.
            </p>

            <div className="not-prose rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <BarChart3 className="h-5 w-5 text-teal-400" />
                <span className="font-semibold text-white">A day-by-day forecast reveals:</span>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-zinc-300">
                  <CheckCircle2 className="h-5 w-5 text-teal-400 mt-0.5 flex-shrink-0" />
                  <span><strong className="text-white">Low-balance days</strong>—exactly when you&apos;ll dip below comfortable levels</span>
                </li>
                <li className="flex items-start gap-3 text-zinc-300">
                  <CheckCircle2 className="h-5 w-5 text-teal-400 mt-0.5 flex-shrink-0" />
                  <span><strong className="text-white">Bill collisions</strong>—when multiple expenses land on the same day or week</span>
                </li>
                <li className="flex items-start gap-3 text-zinc-300">
                  <CheckCircle2 className="h-5 w-5 text-teal-400 mt-0.5 flex-shrink-0" />
                  <span><strong className="text-white">Income gaps</strong>—the days between when you finish work and when you get paid</span>
                </li>
                <li className="flex items-start gap-3 text-zinc-300">
                  <CheckCircle2 className="h-5 w-5 text-teal-400 mt-0.5 flex-shrink-0" />
                  <span><strong className="text-white">Safe purchase windows</strong>—the best time to make big purchases</span>
                </li>
              </ul>
            </div>

            <p className="text-zinc-300 leading-relaxed">
              This visibility transforms financial stress into financial clarity. You stop guessing and start knowing.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-4">
              The freelancer&apos;s forecasting challenge
            </h2>

            <p className="text-zinc-300 leading-relaxed mb-6">
              Cash flow forecasting is harder for freelancers than employees because of three factors:
            </p>

            <div className="not-prose space-y-4 mb-6">
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
                <h4 className="font-semibold text-white mb-2">1. Income timing uncertainty</h4>
                <p className="text-zinc-400 text-sm">
                  You invoice on Net-30, but will the client actually pay in 30 days? Maybe it&apos;s 45. Maybe 60.
                  Some clients pay early. Forecasting requires educated guesses about when money actually arrives.
                </p>
              </div>

              <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
                <h4 className="font-semibold text-white mb-2">2. Income amount variability</h4>
                <p className="text-zinc-400 text-sm">
                  Next month might bring $3,000 or $12,000. You can&apos;t forecast with certainty, but you can
                  plan around confirmed invoices and expected project completions.
                </p>
              </div>

              <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
                <h4 className="font-semibold text-white mb-2">3. Irregular expenses</h4>
                <p className="text-zinc-400 text-sm">
                  Quarterly taxes, annual insurance, software renewals—these large irregular expenses are easy to
                  forget until they blindside you.
                </p>
              </div>
            </div>

            <div className="not-prose rounded-2xl border border-teal-500/20 bg-teal-500/5 p-6">
              <div className="flex items-start gap-3">
                <Lightbulb className="h-5 w-5 text-teal-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-white font-semibold mb-1">The solution</p>
                  <p className="text-zinc-300">
                    Forecast conservatively. Only count income you&apos;re confident about. Add bills the moment
                    you know about them. Update your forecast as reality unfolds. A slightly pessimistic forecast
                    is better than an optimistic one that leads to overdrafts.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-4">
              How far ahead should you forecast?
            </h2>

            <p className="text-zinc-300 leading-relaxed mb-6">
              The further you look, the less accurate your forecast becomes. Here&apos;s a practical framework:
            </p>

            <div className="not-prose rounded-2xl border border-zinc-800 bg-zinc-900/40 overflow-hidden mb-6">
              <table className="w-full text-sm">
                <thead className="bg-zinc-950/40 border-b border-zinc-800">
                  <tr>
                    <th className="px-4 py-3 text-left text-zinc-400 font-medium">Timeframe</th>
                    <th className="px-4 py-3 text-left text-zinc-400 font-medium">Accuracy</th>
                    <th className="px-4 py-3 text-left text-zinc-400 font-medium">Use case</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  <tr>
                    <td className="px-4 py-3 text-white font-medium">0-14 days</td>
                    <td className="px-4 py-3 text-emerald-400">Very high</td>
                    <td className="px-4 py-3 text-zinc-300">Daily spending decisions</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-white font-medium">14-60 days</td>
                    <td className="px-4 py-3 text-teal-300">High</td>
                    <td className="px-4 py-3 text-zinc-300">Bill planning, purchase timing</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-white font-medium">60-180 days</td>
                    <td className="px-4 py-3 text-amber-300">Medium</td>
                    <td className="px-4 py-3 text-zinc-300">Quarterly taxes, seasonal planning</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-white font-medium">180-365 days</td>
                    <td className="px-4 py-3 text-zinc-400">Lower</td>
                    <td className="px-4 py-3 text-zinc-300">Annual planning, goal setting</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-zinc-300 leading-relaxed">
              For most freelancers, <strong className="text-white">60-90 days</strong> provides the sweet spot of
              useful visibility without excessive uncertainty. Going to 365 days helps with annual planning but
              requires more frequent updates.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-4">
              Building your first cash flow forecast
            </h2>

            <p className="text-zinc-300 leading-relaxed mb-6">
              You can build a basic cash flow forecast in a spreadsheet, or use a tool like Cash Flow Forecaster
              that does the heavy lifting. Either way, here&apos;s the process:
            </p>

            <div className="not-prose space-y-4 mb-6">
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
                <div className="flex items-center gap-3 mb-2">
                  <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-teal-500 text-zinc-950 text-sm font-semibold">1</span>
                  <h4 className="font-semibold text-white">Start with your current balance</h4>
                </div>
                <p className="text-zinc-400 text-sm ml-9">
                  Check your bank account(s). This is your starting point.
                </p>
              </div>

              <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
                <div className="flex items-center gap-3 mb-2">
                  <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-teal-500 text-zinc-950 text-sm font-semibold">2</span>
                  <h4 className="font-semibold text-white">Add known recurring expenses</h4>
                </div>
                <p className="text-zinc-400 text-sm ml-9">
                  Rent, utilities, subscriptions, loan payments—anything that hits regularly.
                  Include the specific date each bill is due.
                </p>
              </div>

              <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
                <div className="flex items-center gap-3 mb-2">
                  <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-teal-500 text-zinc-950 text-sm font-semibold">3</span>
                  <h4 className="font-semibold text-white">Add upcoming one-time expenses</h4>
                </div>
                <p className="text-zinc-400 text-sm ml-9">
                  Quarterly taxes, annual insurance, planned purchases. These are easy to forget.
                </p>
              </div>

              <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
                <div className="flex items-center gap-3 mb-2">
                  <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-teal-500 text-zinc-950 text-sm font-semibold">4</span>
                  <h4 className="font-semibold text-white">Add confirmed income</h4>
                </div>
                <p className="text-zinc-400 text-sm ml-9">
                  Invoices sent, retainers due, expected payments. Be conservative with dates—assume
                  clients pay at the end of their payment window, not the beginning.
                </p>
              </div>

              <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
                <div className="flex items-center gap-3 mb-2">
                  <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-teal-500 text-zinc-950 text-sm font-semibold">5</span>
                  <h4 className="font-semibold text-white">Calculate running balance</h4>
                </div>
                <p className="text-zinc-400 text-sm ml-9">
                  For each day, calculate: Previous balance + income − expenses = New balance.
                  This gives you a day-by-day projection.
                </p>
              </div>

              <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
                <div className="flex items-center gap-3 mb-2">
                  <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-teal-500 text-zinc-950 text-sm font-semibold">6</span>
                  <h4 className="font-semibold text-white">Review and update regularly</h4>
                </div>
                <p className="text-zinc-400 text-sm ml-9">
                  Check your forecast weekly. Update as invoices are paid, new bills appear, or
                  plans change. A forecast is a living document.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-4">
              What to do when the forecast looks bad
            </h2>

            <p className="text-zinc-300 leading-relaxed mb-6">
              The whole point of forecasting is to see problems before they happen. When your forecast shows
              a low-balance day or negative territory, you have options:
            </p>

            <ul className="space-y-3 text-zinc-300 mb-6">
              <li className="flex items-start gap-3">
                <TrendingUp className="h-5 w-5 text-teal-400 mt-0.5 flex-shrink-0" />
                <span><strong className="text-white">Chase outstanding invoices</strong>—follow up with clients who are slow to pay. Sometimes a gentle nudge accelerates payment.</span>
              </li>
              <li className="flex items-start gap-3">
                <TrendingUp className="h-5 w-5 text-teal-400 mt-0.5 flex-shrink-0" />
                <span><strong className="text-white">Shift bill due dates</strong>—many vendors allow you to change your billing date. Move bills away from low-balance days.</span>
              </li>
              <li className="flex items-start gap-3">
                <TrendingUp className="h-5 w-5 text-teal-400 mt-0.5 flex-shrink-0" />
                <span><strong className="text-white">Delay non-essential expenses</strong>—that new software can wait until after your next payment arrives.</span>
              </li>
              <li className="flex items-start gap-3">
                <TrendingUp className="h-5 w-5 text-teal-400 mt-0.5 flex-shrink-0" />
                <span><strong className="text-white">Draw from your buffer fund</strong>—this is exactly what it&apos;s for. Smooth out the rough patches.</span>
              </li>
              <li className="flex items-start gap-3">
                <TrendingUp className="h-5 w-5 text-teal-400 mt-0.5 flex-shrink-0" />
                <span><strong className="text-white">Pick up quick-pay work</strong>—if you have capacity, take on a small project with fast payment terms.</span>
              </li>
            </ul>

            <p className="text-zinc-300 leading-relaxed">
              The key is acting <em>before</em> the problem arrives, not after. A bad forecast today is better than
              an overdraft tomorrow.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-4">
              Spreadsheet vs. dedicated tool
            </h2>

            <p className="text-zinc-300 leading-relaxed mb-6">
              You can absolutely build a cash flow forecast in Excel or Google Sheets. Many freelancers start
              there. But spreadsheets have limitations:
            </p>

            <div className="not-prose rounded-2xl border border-zinc-800 bg-zinc-900/40 overflow-hidden mb-6">
              <table className="w-full text-sm">
                <thead className="bg-zinc-950/40 border-b border-zinc-800">
                  <tr>
                    <th className="px-4 py-3 text-left text-zinc-400 font-medium">Feature</th>
                    <th className="px-4 py-3 text-center text-zinc-400 font-medium">Spreadsheet</th>
                    <th className="px-4 py-3 text-center text-zinc-400 font-medium">Cash Flow Forecaster</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  <tr>
                    <td className="px-4 py-3 text-zinc-300">Recurring bills (auto-expand)</td>
                    <td className="px-4 py-3 text-center text-amber-400">Manual</td>
                    <td className="px-4 py-3 text-center text-teal-400">Automatic</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-zinc-300">Safe to Spend calculation</td>
                    <td className="px-4 py-3 text-center text-amber-400">DIY formula</td>
                    <td className="px-4 py-3 text-center text-teal-400">Built-in</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-zinc-300">Low balance alerts</td>
                    <td className="px-4 py-3 text-center text-rose-400">No</td>
                    <td className="px-4 py-3 text-center text-teal-400">Yes (email)</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-zinc-300">Invoice tracking</td>
                    <td className="px-4 py-3 text-center text-rose-400">Separate</td>
                    <td className="px-4 py-3 text-center text-teal-400">Integrated</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-zinc-300">Mobile access</td>
                    <td className="px-4 py-3 text-center text-amber-400">Clunky</td>
                    <td className="px-4 py-3 text-center text-teal-400">Responsive</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-zinc-300">Setup time</td>
                    <td className="px-4 py-3 text-center text-zinc-300">Hours</td>
                    <td className="px-4 py-3 text-center text-teal-300">Minutes</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-zinc-300 leading-relaxed">
              If you enjoy spreadsheets and have time to maintain them, they work fine. If you want something
              that &quot;just works&quot; and saves time, a dedicated tool pays for itself quickly.
            </p>
          </section>
        </div>

        {/* CTA */}
        <section className="mt-12 rounded-2xl border border-zinc-800 bg-zinc-900/40 px-6 py-10 text-center">
          <h2 className="text-2xl font-semibold text-white">
            Start forecasting your cash flow today
          </h2>
          <p className="mt-3 text-zinc-400 max-w-xl mx-auto">
            Cash Flow Forecaster gives you day-by-day visibility for up to 365 days. See your Safe to Spend,
            get low balance alerts, and finally know where your money is going.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <GetStartedCTA className="bg-teal-500 hover:bg-teal-400 text-zinc-950 px-8" />
            <Link href="/compare/cash-flow-calendar-apps" className="text-sm text-zinc-400 hover:text-zinc-200 transition-colors">
              Compare options
            </Link>
          </div>
        </section>

        {/* Related posts */}
        <section className="mt-12">
          <h3 className="text-lg font-semibold text-white mb-6">Related articles</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              href="/blog/how-to-manage-irregular-income-as-freelancer"
              className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 hover:border-zinc-700 transition-colors group"
            >
              <p className="font-medium text-white group-hover:text-teal-300 transition-colors">
                How to Manage Irregular Income
              </p>
              <p className="mt-1 text-sm text-zinc-400">
                A complete guide for freelancers
              </p>
            </Link>
            <Link
              href="/blog/what-is-safe-to-spend"
              className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 hover:border-zinc-700 transition-colors group"
            >
              <p className="font-medium text-white group-hover:text-teal-300 transition-colors">
                What is &quot;Safe to Spend&quot;?
              </p>
              <p className="mt-1 text-sm text-zinc-400">
                The one number every freelancer needs
              </p>
            </Link>
          </div>
        </section>
      </article>
    </>
  );
}
