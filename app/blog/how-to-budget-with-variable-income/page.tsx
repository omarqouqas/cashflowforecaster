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
  AlertTriangle,
  Lightbulb,
  Target,
  ArrowDownUp,
} from 'lucide-react';

const post = getPostBySlug('how-to-budget-with-variable-income')!;

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

const howToSchema = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to Budget with Variable Income',
  description: 'A step-by-step system for budgeting when your income changes month to month.',
  step: [
    {
      '@type': 'HowToStep',
      position: 1,
      name: 'Calculate your floor income',
      text: 'Look at your last 6-12 months and find your lowest earning month. This becomes your baseline for budgeting.',
    },
    {
      '@type': 'HowToStep',
      position: 2,
      name: 'Prioritize expenses into tiers',
      text: 'Divide expenses into Survival (must pay), Security (important), and Freedom (nice to have) categories.',
    },
    {
      '@type': 'HowToStep',
      position: 3,
      name: 'Fund tiers in order',
      text: 'Pay Survival expenses first, then Security, then Freedom. Only move to the next tier when the previous is fully funded.',
    },
    {
      '@type': 'HowToStep',
      position: 4,
      name: 'Bank the surplus',
      text: 'Any income above your budgeted tiers goes to your buffer fund or savings goals.',
    },
  ],
};

export default function VariableIncomeBudgetPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />

      <article className="mx-auto max-w-3xl">
        <Breadcrumbs
          items={[
            breadcrumbs.home,
            breadcrumbs.blog,
            { name: 'Variable Income Budget', url: `https://www.cashflowforecaster.io/blog/${post.slug}` },
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
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-4">
              Why traditional budgets fail with variable income
            </h2>

            <p className="text-zinc-300 leading-relaxed mb-6">
              Most budgeting advice starts with &quot;calculate your monthly income.&quot; But what if your
              income is $8,000 one month, $3,000 the next, and $12,000 the month after? Traditional
              percentage-based budgets break down immediately.
            </p>

            <div className="not-prose rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6 mb-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-white font-semibold mb-1">The problem with percentage budgets</p>
                  <p className="text-zinc-300">
                    &quot;Spend 30% on housing&quot; means $2,400 in a $8K month but only $900 in a $3K month.
                    Your rent doesn&apos;t change based on your income—so percentage rules don&apos;t work.
                  </p>
                </div>
              </div>
            </div>

            <p className="text-zinc-300 leading-relaxed">
              What you need instead is a <strong className="text-white">priority-based system</strong> that
              works regardless of how much you earn in any given month.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-4">
              The tiered budgeting system
            </h2>

            <p className="text-zinc-300 leading-relaxed mb-6">
              Instead of allocating percentages, you&apos;ll organize expenses into three tiers and fund
              them in order. Think of it like filling buckets—you don&apos;t start the second bucket until
              the first is full.
            </p>

            <div className="not-prose space-y-4 mb-6">
              <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-5">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-8 w-8 rounded-lg bg-rose-500/20 flex items-center justify-center">
                    <span className="text-rose-300 font-bold">1</span>
                  </div>
                  <h3 className="font-semibold text-white">Tier 1: Survival</h3>
                </div>
                <p className="text-zinc-300 text-sm mb-3">
                  Non-negotiable expenses that keep a roof over your head and food on the table.
                </p>
                <ul className="text-sm text-zinc-400 space-y-1">
                  <li>Rent/mortgage</li>
                  <li>Utilities (electric, water, gas)</li>
                  <li>Basic groceries</li>
                  <li>Health insurance</li>
                  <li>Minimum debt payments</li>
                  <li>Essential transportation</li>
                </ul>
              </div>

              <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-5">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-8 w-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
                    <span className="text-amber-300 font-bold">2</span>
                  </div>
                  <h3 className="font-semibold text-white">Tier 2: Security</h3>
                </div>
                <p className="text-zinc-300 text-sm mb-3">
                  Important but not immediately life-threatening if skipped for a month.
                </p>
                <ul className="text-sm text-zinc-400 space-y-1">
                  <li>Internet (for work)</li>
                  <li>Phone bill</li>
                  <li>Business tools/subscriptions</li>
                  <li>Car insurance</li>
                  <li>Buffer fund contribution</li>
                  <li>Tax savings (25-30% of income)</li>
                </ul>
              </div>

              <div className="rounded-xl border border-teal-500/20 bg-teal-500/5 p-5">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-8 w-8 rounded-lg bg-teal-500/20 flex items-center justify-center">
                    <span className="text-teal-300 font-bold">3</span>
                  </div>
                  <h3 className="font-semibold text-white">Tier 3: Freedom</h3>
                </div>
                <p className="text-zinc-300 text-sm mb-3">
                  Quality of life expenses—nice to have, but you can live without them.
                </p>
                <ul className="text-sm text-zinc-400 space-y-1">
                  <li>Dining out</li>
                  <li>Entertainment subscriptions</li>
                  <li>Gym membership</li>
                  <li>Travel savings</li>
                  <li>Hobbies</li>
                  <li>Extra debt payments</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-4">
              Step 1: Find your floor income
            </h2>

            <p className="text-zinc-300 leading-relaxed mb-6">
              Your &quot;floor income&quot; is the minimum you can realistically expect to earn. Look at your
              last 6-12 months and find your lowest month—that&apos;s your floor.
            </p>

            <div className="not-prose rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 mb-6">
              <h4 className="text-white font-semibold mb-3">Example: Finding your floor</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm mb-4">
                <div className="bg-zinc-950/40 rounded-lg p-3">
                  <p className="text-zinc-500">Jan</p>
                  <p className="text-zinc-200 font-medium">$6,200</p>
                </div>
                <div className="bg-zinc-950/40 rounded-lg p-3">
                  <p className="text-zinc-500">Feb</p>
                  <p className="text-zinc-200 font-medium">$4,800</p>
                </div>
                <div className="bg-zinc-950/40 rounded-lg p-3 ring-1 ring-amber-500/50">
                  <p className="text-zinc-500">Mar</p>
                  <p className="text-amber-300 font-medium">$3,100</p>
                </div>
                <div className="bg-zinc-950/40 rounded-lg p-3">
                  <p className="text-zinc-500">Apr</p>
                  <p className="text-zinc-200 font-medium">$7,500</p>
                </div>
              </div>
              <p className="text-zinc-400 text-sm">
                Floor income: <span className="text-amber-300 font-medium">$3,100</span> — Budget your
                Tier 1 expenses to fit within this amount.
              </p>
            </div>

            <div className="not-prose rounded-2xl border border-teal-500/20 bg-teal-500/5 p-6">
              <div className="flex items-start gap-3">
                <Lightbulb className="h-5 w-5 text-teal-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-white font-semibold mb-1">Why use the lowest month?</p>
                  <p className="text-zinc-300">
                    If your Tier 1 fits within your worst month, you&apos;ll never stress about covering
                    essentials. Everything above that becomes surplus to allocate to Tier 2 and 3.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-4">
              Step 2: Calculate your tier totals
            </h2>

            <p className="text-zinc-300 leading-relaxed mb-6">
              Add up everything in each tier. Your goal is to have Tier 1 fit comfortably within your
              floor income.
            </p>

            <div className="not-prose rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 mb-6">
              <h4 className="text-white font-semibold mb-4">Example tier breakdown</h4>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-rose-300 font-medium">Tier 1: Survival</span>
                    <span className="text-white font-semibold">$2,450</span>
                  </div>
                  <div className="h-2 rounded-full bg-zinc-800 overflow-hidden">
                    <div className="h-full bg-rose-500 w-[79%]" />
                  </div>
                  <p className="text-xs text-zinc-500 mt-1">79% of floor income ($3,100)</p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-amber-300 font-medium">Tier 2: Security</span>
                    <span className="text-white font-semibold">$1,200</span>
                  </div>
                  <div className="h-2 rounded-full bg-zinc-800 overflow-hidden">
                    <div className="h-full bg-amber-500 w-[39%]" />
                  </div>
                  <p className="text-xs text-zinc-500 mt-1">Additional 39% needed</p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-teal-300 font-medium">Tier 3: Freedom</span>
                    <span className="text-white font-semibold">$800</span>
                  </div>
                  <div className="h-2 rounded-full bg-zinc-800 overflow-hidden">
                    <div className="h-full bg-teal-500 w-[26%]" />
                  </div>
                  <p className="text-xs text-zinc-500 mt-1">Additional 26% needed</p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-zinc-800">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Total needed for all tiers:</span>
                  <span className="text-white font-semibold">$4,450</span>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-4">
              Step 3: Fund tiers as money comes in
            </h2>

            <p className="text-zinc-300 leading-relaxed mb-6">
              Here&apos;s where the system shines. Each time you get paid, allocate money in tier order:
            </p>

            <div className="not-prose space-y-4 mb-6">
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
                <div className="flex items-start gap-3">
                  <ArrowDownUp className="h-5 w-5 text-teal-400 mt-0.5" />
                  <div>
                    <p className="text-white font-semibold">Low income month ($3,100)</p>
                    <p className="text-zinc-400 text-sm mt-1">
                      Cover Tier 1 ($2,450) fully. Put remaining $650 toward Tier 2. Skip Tier 3 this month.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
                <div className="flex items-start gap-3">
                  <ArrowDownUp className="h-5 w-5 text-teal-400 mt-0.5" />
                  <div>
                    <p className="text-white font-semibold">Average income month ($5,500)</p>
                    <p className="text-zinc-400 text-sm mt-1">
                      Cover Tier 1 ($2,450) + Tier 2 ($1,200) + Tier 3 ($800) = $4,450. Bank surplus $1,050.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
                <div className="flex items-start gap-3">
                  <ArrowDownUp className="h-5 w-5 text-teal-400 mt-0.5" />
                  <div>
                    <p className="text-white font-semibold">High income month ($9,000)</p>
                    <p className="text-zinc-400 text-sm mt-1">
                      Cover all tiers ($4,450). Bank $4,550 surplus—this covers future low months.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-zinc-300 leading-relaxed">
              The key insight: <strong className="text-white">good months fund bad months</strong>. Your
              buffer fund grows during high-income periods and smooths out the dips.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-4">
              Making it work day-to-day
            </h2>

            <p className="text-zinc-300 leading-relaxed mb-6">
              A tiered budget tells you what to prioritize, but you still need to track timing. Bills
              don&apos;t care about your tier system—they&apos;re due when they&apos;re due.
            </p>

            <ul className="space-y-3 text-zinc-300 mb-6">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-teal-400 mt-0.5 flex-shrink-0" />
                <span><strong className="text-white">Use a cash flow calendar</strong> to see when bills hit and when income arrives</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-teal-400 mt-0.5 flex-shrink-0" />
                <span><strong className="text-white">Check your &quot;Safe to Spend&quot;</strong> before discretionary purchases</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-teal-400 mt-0.5 flex-shrink-0" />
                <span><strong className="text-white">Review weekly</strong> to catch problems before they become emergencies</span>
              </li>
            </ul>

            <div className="not-prose rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
              <div className="flex items-start gap-3">
                <Target className="h-5 w-5 text-teal-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-white font-semibold mb-1">Try Cash Flow Forecaster</p>
                  <p className="text-zinc-300 mb-4">
                    See your projected balance up to 365 days ahead, get low-balance alerts, and know
                    your Safe to Spend amount at a glance.
                  </p>
                  <GetStartedCTA className="bg-teal-500 hover:bg-teal-400 text-zinc-950 text-sm" />
                </div>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-4">
              Quick-start checklist
            </h2>

            <div className="not-prose rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
              <ol className="space-y-4">
                <li className="flex items-start gap-3 text-zinc-300">
                  <CheckCircle2 className="h-5 w-5 text-teal-400 mt-0.5 flex-shrink-0" />
                  <span><strong className="text-white">Today:</strong> List all expenses and sort into Tier 1, 2, or 3</span>
                </li>
                <li className="flex items-start gap-3 text-zinc-300">
                  <CheckCircle2 className="h-5 w-5 text-teal-400 mt-0.5 flex-shrink-0" />
                  <span><strong className="text-white">This week:</strong> Find your floor income from the past 6-12 months</span>
                </li>
                <li className="flex items-start gap-3 text-zinc-300">
                  <CheckCircle2 className="h-5 w-5 text-teal-400 mt-0.5 flex-shrink-0" />
                  <span><strong className="text-white">Verify:</strong> Does Tier 1 fit within your floor? If not, cut or move expenses</span>
                </li>
                <li className="flex items-start gap-3 text-zinc-300">
                  <CheckCircle2 className="h-5 w-5 text-teal-400 mt-0.5 flex-shrink-0" />
                  <span><strong className="text-white">Each payday:</strong> Fund tiers in order, bank the surplus</span>
                </li>
              </ol>
            </div>
          </section>
        </div>

        {/* CTA */}
        <section className="mt-12 rounded-2xl border border-zinc-800 bg-zinc-900/40 px-6 py-10 text-center">
          <h2 className="text-2xl font-semibold text-white">
            See your variable income mapped out
          </h2>
          <p className="mt-3 text-zinc-400 max-w-xl mx-auto">
            Cash Flow Forecaster shows your balance day-by-day so you know exactly when to tighten
            up and when you have room to breathe.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <GetStartedCTA className="bg-teal-500 hover:bg-teal-400 text-zinc-950 px-8" />
            <Link href="/blog" className="text-sm text-zinc-400 hover:text-zinc-200 transition-colors">
              More articles
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
                Managing Irregular Income
              </p>
              <p className="mt-1 text-sm text-zinc-400">
                Complete guide for freelancers
              </p>
            </Link>
            <Link
              href="/blog/freelancer-emergency-fund-how-much"
              className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 hover:border-zinc-700 transition-colors group"
            >
              <p className="font-medium text-white group-hover:text-teal-300 transition-colors">
                Freelancer Emergency Fund
              </p>
              <p className="mt-1 text-sm text-zinc-400">
                How much do you actually need?
              </p>
            </Link>
          </div>
        </section>
      </article>
    </>
  );
}
