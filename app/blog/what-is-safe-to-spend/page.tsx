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
  AlertTriangle,
  Lightbulb,
  Calculator,
  TrendingDown,
} from 'lucide-react';

const post = getPostBySlug('what-is-safe-to-spend')!;

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

// FAQ schema for AEO
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is Safe to Spend?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Safe to Spend is the maximum amount you can spend today without risking an overdraft in the next 14 days. It\'s calculated by taking your lowest projected balance over the next two weeks and subtracting your safety buffer.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do you calculate Safe to Spend?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Safe to Spend = Lowest projected balance in next 14 days - Safety buffer. For example, if your lowest balance will be $2,500 and your buffer is $500, your Safe to Spend is $2,000.',
      },
    },
    {
      '@type': 'Question',
      name: 'Why is Safe to Spend better than checking my bank balance?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Your current bank balance doesn\'t account for upcoming bills. You might have $3,000 today but $2,500 in bills due this week. Safe to Spend factors in all known future expenses to tell you what you can actually spend.',
      },
    },
  ],
};

export default function SafeToSpendPage() {
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
            { name: 'Safe to Spend', url: `https://www.cashflowforecaster.io/blog/${post.slug}` },
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
          {/* Definition box for AEO - this is the key content for AI search */}
          <div className="not-prose mb-10 rounded-2xl border border-teal-500/20 bg-teal-500/5 p-6">
            <h2 className="text-xl font-semibold text-white mb-3">
              {definitions.safeToSpend.term}
            </h2>
            <p className="text-zinc-300 leading-relaxed text-lg">
              {definitions.safeToSpend.definition}
            </p>
            <p className="mt-4 text-sm text-zinc-500">
              Also known as: {definitions.safeToSpend.alsoKnownAs.join(', ')}
            </p>
          </div>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-4">
              Why your bank balance lies to you
            </h2>

            <p className="text-zinc-300 leading-relaxed mb-6">
              You check your bank account: $3,500. Feels good, right? But here&apos;s what your bank balance
              doesn&apos;t tell you:
            </p>

            <ul className="space-y-3 text-zinc-300 mb-6">
              <li className="flex items-start gap-3">
                <TrendingDown className="h-5 w-5 text-rose-400 mt-0.5 flex-shrink-0" />
                <span>Rent ($1,800) hits in 3 days</span>
              </li>
              <li className="flex items-start gap-3">
                <TrendingDown className="h-5 w-5 text-rose-400 mt-0.5 flex-shrink-0" />
                <span>Car insurance ($180) auto-debits on the 15th</span>
              </li>
              <li className="flex items-start gap-3">
                <TrendingDown className="h-5 w-5 text-rose-400 mt-0.5 flex-shrink-0" />
                <span>That invoice you&apos;re counting on? Client hasn&apos;t confirmed payment date</span>
              </li>
            </ul>

            <p className="text-zinc-300 leading-relaxed mb-6">
              Your real available money isn&apos;t $3,500. It&apos;s $3,500 minus everything that&apos;s about to
              come out, with a buffer for safety.
            </p>

            <div className="not-prose rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-white font-semibold mb-1">The overdraft trap</p>
                  <p className="text-zinc-300">
                    63% of Americans who overdraft say they didn&apos;t see it coming. They looked at their
                    balance, thought they were fine, and forgot about upcoming bills.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-4">
              How Safe to Spend is calculated
            </h2>

            <p className="text-zinc-300 leading-relaxed mb-6">
              Safe to Spend gives you one honest number by looking ahead, not just at today:
            </p>

            <div className="not-prose rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <Calculator className="h-5 w-5 text-teal-400" />
                <span className="text-white font-semibold">The formula</span>
              </div>
              <div className="bg-zinc-950/60 rounded-lg p-4 font-mono text-sm">
                <p className="text-teal-300">Safe to Spend =</p>
                <p className="text-zinc-300 ml-4">Lowest projected balance (next 14 days)</p>
                <p className="text-zinc-300 ml-4">− Safety buffer</p>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-white mb-3">Example calculation</h3>

            <p className="text-zinc-300 leading-relaxed mb-6">
              Let&apos;s say today is January 23rd and your current balance is $4,200:
            </p>

            <div className="not-prose rounded-2xl border border-zinc-800 bg-zinc-900/40 overflow-hidden mb-6">
              <table className="w-full text-sm">
                <thead className="bg-zinc-950/40 border-b border-zinc-800">
                  <tr>
                    <th className="px-4 py-3 text-left text-zinc-400 font-medium">Date</th>
                    <th className="px-4 py-3 text-left text-zinc-400 font-medium">Event</th>
                    <th className="px-4 py-3 text-right text-zinc-400 font-medium">Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  <tr>
                    <td className="px-4 py-3 text-zinc-300">Jan 23</td>
                    <td className="px-4 py-3 text-zinc-300">Today</td>
                    <td className="px-4 py-3 text-right text-white font-medium">$4,200</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-zinc-300">Jan 25</td>
                    <td className="px-4 py-3 text-zinc-300">Groceries</td>
                    <td className="px-4 py-3 text-right text-zinc-300">$4,050</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-zinc-300">Jan 28</td>
                    <td className="px-4 py-3 text-zinc-300">Client payment</td>
                    <td className="px-4 py-3 text-right text-emerald-400">$6,050</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-zinc-300">Feb 1</td>
                    <td className="px-4 py-3 text-zinc-300">Rent</td>
                    <td className="px-4 py-3 text-right text-zinc-300">$4,250</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-zinc-300">Feb 3</td>
                    <td className="px-4 py-3 text-zinc-300">Utilities + subscriptions</td>
                    <td className="px-4 py-3 text-right text-amber-300">$3,850</td>
                  </tr>
                  <tr className="bg-zinc-950/40">
                    <td className="px-4 py-3 text-zinc-300" colSpan={2}>
                      <strong className="text-white">Lowest balance (14 days)</strong>
                    </td>
                    <td className="px-4 py-3 text-right text-amber-300 font-semibold">$3,850</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="not-prose rounded-2xl border border-teal-500/20 bg-teal-500/5 p-6">
              <p className="text-zinc-300 mb-2">With a $500 safety buffer:</p>
              <p className="text-2xl font-semibold text-teal-300">
                Safe to Spend = $3,850 − $500 = <span className="text-white">$3,350</span>
              </p>
              <p className="mt-3 text-sm text-zinc-400">
                Even though you have $4,200 today, spending more than $3,350 risks going below your buffer
                when bills hit on February 3rd.
              </p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-4">
              Why 14 days? Why not 30?
            </h2>

            <p className="text-zinc-300 leading-relaxed mb-6">
              We chose 14 days as the default window because:
            </p>

            <ul className="space-y-3 text-zinc-300 mb-6">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-teal-400 mt-0.5 flex-shrink-0" />
                <span><strong className="text-white">It captures most recurring bills</strong>—rent, utilities, and subscriptions typically fall within a 2-week window</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-teal-400 mt-0.5 flex-shrink-0" />
                <span><strong className="text-white">It&apos;s actionable</strong>—you can realistically plan spending for 2 weeks; 30 days feels too abstract</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-teal-400 mt-0.5 flex-shrink-0" />
                <span><strong className="text-white">It balances caution with flexibility</strong>—longer windows become overly restrictive; shorter ones miss important bills</span>
              </li>
            </ul>

            <div className="not-prose rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
              <div className="flex items-start gap-3">
                <Lightbulb className="h-5 w-5 text-teal-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-white font-semibold mb-1">Pro tip</p>
                  <p className="text-zinc-300">
                    If you have large quarterly expenses (like estimated taxes or insurance), extend your
                    mental window to account for those. Your &quot;true&quot; safe to spend might be lower around
                    those deadlines.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-4">
              Setting your safety buffer
            </h2>

            <p className="text-zinc-300 leading-relaxed mb-6">
              Your safety buffer is personal. It depends on your risk tolerance and income stability. Here are
              some guidelines:
            </p>

            <div className="not-prose rounded-2xl border border-zinc-800 bg-zinc-900/40 overflow-hidden mb-6">
              <table className="w-full text-sm">
                <thead className="bg-zinc-950/40 border-b border-zinc-800">
                  <tr>
                    <th className="px-4 py-3 text-left text-zinc-400 font-medium">Situation</th>
                    <th className="px-4 py-3 text-right text-zinc-400 font-medium">Suggested Buffer</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  <tr>
                    <td className="px-4 py-3 text-zinc-300">Stable income, low expenses</td>
                    <td className="px-4 py-3 text-right text-zinc-300">$200-500</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-zinc-300">Typical freelancer</td>
                    <td className="px-4 py-3 text-right text-teal-300 font-medium">$500-1,000</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-zinc-300">Highly variable income</td>
                    <td className="px-4 py-3 text-right text-zinc-300">$1,000-2,000</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-zinc-300">Large unexpected expenses common</td>
                    <td className="px-4 py-3 text-right text-zinc-300">$2,000+</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-zinc-300 leading-relaxed">
              Your buffer isn&apos;t an emergency fund—it&apos;s a cushion against timing surprises. If a client
              pays 3 days late or you forgot about an annual subscription, the buffer absorbs the shock.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-4">
              Using Safe to Spend in daily life
            </h2>

            <p className="text-zinc-300 leading-relaxed mb-6">
              Once you know your Safe to Spend number, decision-making becomes simple:
            </p>

            <div className="not-prose space-y-4 mb-6">
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
                <p className="text-zinc-300">
                  <strong className="text-white">&quot;Can I afford this $200 dinner?&quot;</strong>
                </p>
                <p className="text-sm text-zinc-400 mt-1">
                  → Is $200 less than your Safe to Spend? If yes, go for it. If no, wait.
                </p>
              </div>

              <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
                <p className="text-zinc-300">
                  <strong className="text-white">&quot;Should I buy this $1,500 laptop?&quot;</strong>
                </p>
                <p className="text-sm text-zinc-400 mt-1">
                  → Check Safe to Spend. If it&apos;s $3,000, you can buy it comfortably. If it&apos;s $1,200, wait
                  until after your next payment.
                </p>
              </div>

              <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
                <p className="text-zinc-300">
                  <strong className="text-white">&quot;My Safe to Spend is negative—what now?&quot;</strong>
                </p>
                <p className="text-sm text-zinc-400 mt-1">
                  → A negative Safe to Spend means you&apos;ll dip below your buffer (or even $0) without
                  action. Time to chase that invoice, delay a non-essential bill, or tap your emergency fund.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-4">
              Safe to Spend vs. other metrics
            </h2>

            <div className="not-prose rounded-2xl border border-zinc-800 bg-zinc-900/40 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-zinc-950/40 border-b border-zinc-800">
                  <tr>
                    <th className="px-4 py-3 text-left text-zinc-400 font-medium">Metric</th>
                    <th className="px-4 py-3 text-left text-zinc-400 font-medium">What it shows</th>
                    <th className="px-4 py-3 text-left text-zinc-400 font-medium">Limitation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  <tr>
                    <td className="px-4 py-3 text-white font-medium">Bank balance</td>
                    <td className="px-4 py-3 text-zinc-300">Money right now</td>
                    <td className="px-4 py-3 text-zinc-400">Ignores upcoming bills</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-white font-medium">Monthly budget</td>
                    <td className="px-4 py-3 text-zinc-300">Spending limits by category</td>
                    <td className="px-4 py-3 text-zinc-400">Hides timing problems</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-white font-medium">Available credit</td>
                    <td className="px-4 py-3 text-zinc-300">What you can borrow</td>
                    <td className="px-4 py-3 text-zinc-400">It&apos;s debt, not cash</td>
                  </tr>
                  <tr className="bg-teal-500/5">
                    <td className="px-4 py-3 text-teal-300 font-semibold">Safe to Spend</td>
                    <td className="px-4 py-3 text-zinc-300">What you can spend without going negative</td>
                    <td className="px-4 py-3 text-zinc-400">Requires tracking bills/income</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* CTA */}
        <section className="mt-12 rounded-2xl border border-zinc-800 bg-zinc-900/40 px-6 py-10 text-center">
          <h2 className="text-2xl font-semibold text-white">
            See your Safe to Spend right now
          </h2>
          <p className="mt-3 text-zinc-400 max-w-xl mx-auto">
            Cash Flow Forecaster calculates your Safe to Spend automatically and keeps it updated as bills and
            income change. Start free—no credit card required.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <GetStartedCTA className="bg-teal-500 hover:bg-teal-400 text-zinc-950 px-8" />
            <Link href="/tools/can-i-afford-it" className="text-sm text-zinc-400 hover:text-zinc-200 transition-colors">
              Try the free calculator
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
              href="/blog/cash-flow-forecasting-for-freelancers"
              className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 hover:border-zinc-700 transition-colors group"
            >
              <p className="font-medium text-white group-hover:text-teal-300 transition-colors">
                Cash Flow Forecasting for Freelancers
              </p>
              <p className="mt-1 text-sm text-zinc-400">
                Why day-by-day visibility matters
              </p>
            </Link>
          </div>
        </section>
      </article>
    </>
  );
}
