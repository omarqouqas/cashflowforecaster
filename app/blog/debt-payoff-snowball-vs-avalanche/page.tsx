import type { Metadata } from 'next';
import Link from 'next/link';
import { getPostBySlug } from '@/lib/blog/posts';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { breadcrumbs } from '@/components/seo/schemas';
import { GetStartedCTA } from '@/components/landing/get-started-cta';
import {
  Calendar,
  Clock,
  CheckCircle2,
  TrendingDown,
  Zap,
  Calculator,
  Target,
  ArrowDown,
} from 'lucide-react';

const post = getPostBySlug('debt-payoff-snowball-vs-avalanche')!;

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
      name: 'What is the debt snowball method?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The debt snowball method means paying off your smallest debt first, regardless of interest rate. You make minimum payments on all debts except the smallest, which gets all your extra money. When it\'s paid off, you roll that payment to the next smallest debt.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the debt avalanche method?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The debt avalanche method means paying off your highest interest rate debt first. You make minimum payments on all debts except the one with the highest APR, which gets all your extra money. This mathematically minimizes total interest paid.',
      },
    },
    {
      '@type': 'Question',
      name: 'Which debt payoff method is better for freelancers?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'It depends on your psychology and cash flow. Snowball provides quick wins that build momentum—good if you need motivation. Avalanche saves more money—good if you\'re disciplined. Many freelancers prefer snowball because the quick wins help during income fluctuations.',
      },
    },
  ],
};

export default function DebtPayoffPage() {
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
            { name: 'Debt Payoff Methods', url: `https://www.cashflowforecaster.io/blog/${post.slug}` },
          ]}
          className="mb-8"
        />

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

        <div className="prose prose-invert prose-zinc max-w-none">
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-4">
              Two proven strategies, one goal
            </h2>

            <p className="text-zinc-300 leading-relaxed mb-6">
              Both the Snowball and Avalanche methods will get you out of debt. The difference is
              the order you attack your debts—and that order affects your motivation and total interest paid.
            </p>

            <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="rounded-2xl border border-blue-500/30 bg-blue-500/5 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <Zap className="h-5 w-5 text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">Snowball</h3>
                </div>
                <p className="text-zinc-300 mb-4">Pay smallest balance first</p>
                <ul className="space-y-2 text-sm text-zinc-400">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                    <span>Quick wins build momentum</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                    <span>Psychological boost</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                    <span>Easier to stick with</span>
                  </li>
                </ul>
              </div>

              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                    <Calculator className="h-5 w-5 text-emerald-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">Avalanche</h3>
                </div>
                <p className="text-zinc-300 mb-4">Pay highest interest first</p>
                <ul className="space-y-2 text-sm text-zinc-400">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span>Mathematically optimal</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span>Saves the most money</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span>Faster debt-free date</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-4">
              How the Snowball method works
            </h2>

            <div className="not-prose rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 mb-6">
              <ol className="space-y-4">
                <li className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-sm">
                    1
                  </div>
                  <div>
                    <p className="text-white font-medium">List all debts from smallest to largest balance</p>
                    <p className="text-zinc-400 text-sm mt-1">Ignore interest rates—only balance matters</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-sm">
                    2
                  </div>
                  <div>
                    <p className="text-white font-medium">Pay minimum on all debts except the smallest</p>
                    <p className="text-zinc-400 text-sm mt-1">All extra money goes to the smallest debt</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-sm">
                    3
                  </div>
                  <div>
                    <p className="text-white font-medium">When the smallest is paid off, roll that payment to the next</p>
                    <p className="text-zinc-400 text-sm mt-1">Your payment snowballs larger as each debt disappears</p>
                  </div>
                </li>
              </ol>
            </div>

            <p className="text-zinc-300 leading-relaxed">
              The key insight: early wins keep you motivated. Paying off a $500 credit card in 2 months
              feels great, even if a larger 22% APR card would be more &quot;efficient&quot; to tackle first.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-4">
              How the Avalanche method works
            </h2>

            <div className="not-prose rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 mb-6">
              <ol className="space-y-4">
                <li className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-sm">
                    1
                  </div>
                  <div>
                    <p className="text-white font-medium">List all debts from highest to lowest interest rate</p>
                    <p className="text-zinc-400 text-sm mt-1">Ignore balances—only APR matters</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-sm">
                    2
                  </div>
                  <div>
                    <p className="text-white font-medium">Pay minimum on all debts except the highest APR</p>
                    <p className="text-zinc-400 text-sm mt-1">All extra money attacks the most expensive debt</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-sm">
                    3
                  </div>
                  <div>
                    <p className="text-white font-medium">When that debt is paid, move to the next highest APR</p>
                    <p className="text-zinc-400 text-sm mt-1">You minimize total interest paid over time</p>
                  </div>
                </li>
              </ol>
            </div>

            <p className="text-zinc-300 leading-relaxed">
              The math is clear: attacking high-interest debt first means less money lost to interest.
              But the first win might take longer, which can be discouraging.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-4">
              Example comparison
            </h2>

            <p className="text-zinc-300 leading-relaxed mb-6">
              Let&apos;s say you have three debts and can put $500/month toward debt payoff:
            </p>

            <div className="not-prose rounded-2xl border border-zinc-800 bg-zinc-900/40 overflow-hidden mb-6">
              <table className="w-full text-sm">
                <thead className="bg-zinc-950/40 border-b border-zinc-800">
                  <tr>
                    <th className="px-4 py-3 text-left text-zinc-400 font-medium">Debt</th>
                    <th className="px-4 py-3 text-right text-zinc-400 font-medium">Balance</th>
                    <th className="px-4 py-3 text-right text-zinc-400 font-medium">APR</th>
                    <th className="px-4 py-3 text-right text-zinc-400 font-medium">Minimum</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  <tr>
                    <td className="px-4 py-3 text-zinc-300">Credit Card A</td>
                    <td className="px-4 py-3 text-right text-zinc-300">$2,500</td>
                    <td className="px-4 py-3 text-right text-rose-400">22%</td>
                    <td className="px-4 py-3 text-right text-zinc-300">$50</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-zinc-300">Credit Card B</td>
                    <td className="px-4 py-3 text-right text-zinc-300">$800</td>
                    <td className="px-4 py-3 text-right text-amber-400">18%</td>
                    <td className="px-4 py-3 text-right text-zinc-300">$25</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-zinc-300">Personal Loan</td>
                    <td className="px-4 py-3 text-right text-zinc-300">$5,000</td>
                    <td className="px-4 py-3 text-right text-emerald-400">10%</td>
                    <td className="px-4 py-3 text-right text-zinc-300">$100</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-5">
                <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <Zap className="h-4 w-4 text-blue-400" />
                  Snowball Order
                </h3>
                <ol className="space-y-2 text-zinc-300 text-sm">
                  <li className="flex items-center gap-2">
                    <ArrowDown className="h-3 w-3 text-blue-400" />
                    1. Card B ($800) — paid off month 2
                  </li>
                  <li className="flex items-center gap-2">
                    <ArrowDown className="h-3 w-3 text-blue-400" />
                    2. Card A ($2,500) — paid off month 8
                  </li>
                  <li className="flex items-center gap-2">
                    <ArrowDown className="h-3 w-3 text-blue-400" />
                    3. Loan ($5,000) — paid off month 18
                  </li>
                </ol>
                <div className="mt-4 pt-4 border-t border-blue-500/20">
                  <p className="text-zinc-400 text-sm">Total interest: <span className="text-white font-medium">$1,420</span></p>
                  <p className="text-zinc-400 text-sm">First win: <span className="text-blue-400 font-medium">Month 2</span></p>
                </div>
              </div>

              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5">
                <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <TrendingDown className="h-4 w-4 text-emerald-400" />
                  Avalanche Order
                </h3>
                <ol className="space-y-2 text-zinc-300 text-sm">
                  <li className="flex items-center gap-2">
                    <ArrowDown className="h-3 w-3 text-emerald-400" />
                    1. Card A (22%) — paid off month 6
                  </li>
                  <li className="flex items-center gap-2">
                    <ArrowDown className="h-3 w-3 text-emerald-400" />
                    2. Card B (18%) — paid off month 8
                  </li>
                  <li className="flex items-center gap-2">
                    <ArrowDown className="h-3 w-3 text-emerald-400" />
                    3. Loan (10%) — paid off month 17
                  </li>
                </ol>
                <div className="mt-4 pt-4 border-t border-emerald-500/20">
                  <p className="text-zinc-400 text-sm">Total interest: <span className="text-white font-medium">$1,180</span></p>
                  <p className="text-zinc-400 text-sm">First win: <span className="text-emerald-400 font-medium">Month 6</span></p>
                </div>
              </div>
            </div>

            <div className="not-prose rounded-2xl border border-teal-500/20 bg-teal-500/5 p-6">
              <div className="flex items-start gap-3">
                <Target className="h-5 w-5 text-teal-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-white font-semibold mb-1">The verdict</p>
                  <p className="text-zinc-300">
                    Avalanche saves $240 and finishes 1 month earlier. But Snowball gets a win 4 months sooner.
                    Which matters more to you?
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-4">
              Which method is best for freelancers?
            </h2>

            <p className="text-zinc-300 leading-relaxed mb-6">
              Freelancers face unique challenges: income fluctuates, motivation matters more when times
              are tough, and you need flexibility. Here&apos;s our take:
            </p>

            <div className="not-prose space-y-4 mb-6">
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
                <h3 className="text-white font-semibold mb-2">Choose Snowball if...</h3>
                <ul className="space-y-2 text-zinc-300 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                    <span>You&apos;ve tried to pay off debt before and gave up</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                    <span>Your income varies and you need motivation during slow months</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                    <span>The interest rate difference between debts is small</span>
                  </li>
                </ul>
              </div>

              <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
                <h3 className="text-white font-semibold mb-2">Choose Avalanche if...</h3>
                <ul className="space-y-2 text-zinc-300 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span>You&apos;re disciplined and won&apos;t quit even without quick wins</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span>You have a high-interest debt (20%+) that&apos;s costing you a lot</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span>Saving every dollar matters more than psychology</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-4">
              The power of extra payments
            </h2>

            <p className="text-zinc-300 leading-relaxed mb-6">
              Whichever method you choose, extra payments accelerate your debt-free date dramatically.
              Even $50/month extra can shave months off your timeline and save hundreds in interest.
            </p>

            <p className="text-zinc-300 leading-relaxed">
              Our Debt Payoff Planner lets you simulate extra payments to see exactly how much faster
              you&apos;ll be debt-free and how much interest you&apos;ll save.
            </p>
          </section>
        </div>

        {/* CTA */}
        <section className="mt-12 rounded-2xl border border-zinc-800 bg-zinc-900/40 px-6 py-10 text-center">
          <h2 className="text-2xl font-semibold text-white">
            Plan your debt payoff today
          </h2>
          <p className="mt-3 text-zinc-400 max-w-xl mx-auto">
            Cash Flow Forecaster includes a Debt Payoff Planner that compares Snowball vs Avalanche
            side-by-side. See your debt-free date and start making progress.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <GetStartedCTA className="bg-teal-500 hover:bg-teal-400 text-zinc-950 px-8" />
            <Link href="/blog/credit-card-cash-flow-forecasting" className="text-sm text-zinc-400 hover:text-zinc-200 transition-colors">
              Learn about credit card tracking
            </Link>
          </div>
        </section>

        {/* Related posts */}
        <section className="mt-12">
          <h3 className="text-lg font-semibold text-white mb-6">Related articles</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              href="/blog/credit-card-cash-flow-forecasting"
              className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 hover:border-zinc-700 transition-colors group"
            >
              <p className="font-medium text-white group-hover:text-teal-300 transition-colors">
                Credit Card Cash Flow Forecasting
              </p>
              <p className="mt-1 text-sm text-zinc-400">
                Track utilization and plan payments
              </p>
            </Link>
            <Link
              href="/blog/how-to-manage-irregular-income-as-freelancer"
              className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 hover:border-zinc-700 transition-colors group"
            >
              <p className="font-medium text-white group-hover:text-teal-300 transition-colors">
                Managing Irregular Income
              </p>
              <p className="mt-1 text-sm text-zinc-400">
                A complete guide for freelancers
              </p>
            </Link>
          </div>
        </section>
      </article>
    </>
  );
}
