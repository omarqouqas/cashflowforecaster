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
  PiggyBank,
  Calculator,
  Shield,
} from 'lucide-react';

const post = getPostBySlug('freelancer-emergency-fund-how-much')!;

export const metadata: Metadata = {
  title: post.title,
  description: post.description,
  keywords: post.keywords,
  alternates: {
    canonical: `https://cashflowforecaster.io/blog/${post.slug}`,
  },
  openGraph: {
    title: post.title,
    description: post.description,
    url: `https://cashflowforecaster.io/blog/${post.slug}`,
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
    url: 'https://cashflowforecaster.io',
  },
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': `https://cashflowforecaster.io/blog/${post.slug}`,
  },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How much emergency fund does a freelancer need?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Freelancers typically need 6-12 months of expenses in an emergency fund, compared to 3-6 months for salaried employees. The larger buffer accounts for irregular income and the longer time it may take to replace lost clients.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the difference between an emergency fund and a buffer fund?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'An emergency fund covers true emergencies like job loss, medical bills, or major repairs. A buffer fund (or income smoothing fund) covers the normal gaps between payments in your freelance work. You need both.',
      },
    },
    {
      '@type': 'Question',
      name: 'Should freelancers keep emergency funds in a separate account?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Keeping emergency funds in a separate high-yield savings account prevents accidental spending and makes it clear how much runway you actually have.',
      },
    },
  ],
};

export default function EmergencyFundPage() {
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
            { name: 'Emergency Fund Guide', url: `https://cashflowforecaster.io/blog/${post.slug}` },
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
          {/* Key definition for AEO */}
          <div className="not-prose mb-10 rounded-2xl border border-teal-500/20 bg-teal-500/5 p-6">
            <h2 className="text-xl font-semibold text-white mb-3">
              Freelancer Emergency Fund
            </h2>
            <p className="text-zinc-300 leading-relaxed text-lg">
              A freelancer emergency fund is savings specifically set aside for true emergencies—job loss,
              medical expenses, major repairs. It&apos;s separate from your buffer fund (which smooths out
              normal income gaps). Freelancers typically need <strong className="text-white">6-12 months
              of expenses</strong> saved, compared to 3-6 months for salaried workers.
            </p>
          </div>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-4">
              Why freelancers need a bigger emergency fund
            </h2>

            <p className="text-zinc-300 leading-relaxed mb-6">
              The standard advice is &quot;save 3-6 months of expenses.&quot; But that advice assumes you have
              a steady paycheck and unemployment benefits as a backstop. Freelancers have neither.
            </p>

            <div className="not-prose rounded-2xl border border-zinc-800 bg-zinc-900/40 overflow-hidden mb-6">
              <table className="w-full text-sm">
                <thead className="bg-zinc-950/40 border-b border-zinc-800">
                  <tr>
                    <th className="px-4 py-3 text-left text-zinc-400 font-medium">Factor</th>
                    <th className="px-4 py-3 text-center text-zinc-400 font-medium">Employee</th>
                    <th className="px-4 py-3 text-center text-zinc-400 font-medium">Freelancer</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  <tr>
                    <td className="px-4 py-3 text-zinc-300">Income stability</td>
                    <td className="px-4 py-3 text-center text-emerald-400">Predictable</td>
                    <td className="px-4 py-3 text-center text-amber-400">Variable</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-zinc-300">Unemployment benefits</td>
                    <td className="px-4 py-3 text-center text-emerald-400">Yes</td>
                    <td className="px-4 py-3 text-center text-rose-400">No</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-zinc-300">Time to replace income</td>
                    <td className="px-4 py-3 text-center text-zinc-300">1-3 months</td>
                    <td className="px-4 py-3 text-center text-zinc-300">3-6 months</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-zinc-300">Client concentration risk</td>
                    <td className="px-4 py-3 text-center text-zinc-500">N/A</td>
                    <td className="px-4 py-3 text-center text-amber-400">High</td>
                  </tr>
                  <tr className="bg-zinc-950/20">
                    <td className="px-4 py-3 text-white font-medium">Recommended fund</td>
                    <td className="px-4 py-3 text-center text-white font-medium">3-6 months</td>
                    <td className="px-4 py-3 text-center text-teal-300 font-medium">6-12 months</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-zinc-300 leading-relaxed">
              If your biggest client disappears tomorrow, how long would it take to replace that income?
              For most freelancers, the answer is &quot;months, not weeks.&quot;
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-4">
              Emergency fund vs. buffer fund
            </h2>

            <p className="text-zinc-300 leading-relaxed mb-6">
              Many freelancers confuse these two, but they serve different purposes:
            </p>

            <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <PiggyBank className="h-5 w-5 text-amber-400" />
                  <h3 className="font-semibold text-white">Buffer Fund</h3>
                </div>
                <ul className="text-sm text-zinc-300 space-y-2">
                  <li>Covers <strong className="text-white">normal gaps</strong> between payments</li>
                  <li>Used when a client pays late or work slows temporarily</li>
                  <li>Size: <strong className="text-white">2-3 months</strong> of expenses</li>
                  <li>Replenished during good months</li>
                  <li>Dipped into regularly</li>
                </ul>
              </div>

              <div className="rounded-xl border border-teal-500/20 bg-teal-500/5 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="h-5 w-5 text-teal-400" />
                  <h3 className="font-semibold text-white">Emergency Fund</h3>
                </div>
                <ul className="text-sm text-zinc-300 space-y-2">
                  <li>Covers <strong className="text-white">true emergencies</strong> only</li>
                  <li>Major client loss, health crisis, family emergency</li>
                  <li>Size: <strong className="text-white">6-12 months</strong> of expenses</li>
                  <li>Rarely touched</li>
                  <li>Last resort after buffer is depleted</li>
                </ul>
              </div>
            </div>

            <div className="not-prose rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-white font-semibold mb-1">You need both</p>
                  <p className="text-zinc-300">
                    Your buffer fund handles the routine volatility of freelance income. Your emergency
                    fund is the safety net when something truly goes wrong. Don&apos;t raid your emergency
                    fund just because a client is late paying.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-4">
              How to calculate your number
            </h2>

            <p className="text-zinc-300 leading-relaxed mb-6">
              Your emergency fund target depends on your monthly expenses and risk factors.
            </p>

            <div className="not-prose rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <Calculator className="h-5 w-5 text-teal-400" />
                <span className="font-semibold text-white">The formula</span>
              </div>
              <div className="bg-zinc-950/60 rounded-lg p-4 font-mono text-sm mb-4">
                <p className="text-teal-300">Emergency Fund Target =</p>
                <p className="text-zinc-300 ml-4">Monthly baseline expenses</p>
                <p className="text-zinc-300 ml-4">x Months of runway needed</p>
              </div>
              <p className="text-zinc-400 text-sm">
                Baseline = Tier 1 (survival) + Tier 2 (security) expenses. Don&apos;t include discretionary spending.
              </p>
            </div>

            <h3 className="text-xl font-semibold text-white mb-3">How many months do you need?</h3>

            <div className="not-prose space-y-3 mb-6">
              <div className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">6 months</p>
                    <p className="text-zinc-500 text-sm">Minimum for any freelancer</p>
                  </div>
                  <span className="text-xs px-2 py-1 rounded bg-zinc-800 text-zinc-400">Baseline</span>
                </div>
              </div>

              <div className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">9 months</p>
                    <p className="text-zinc-500 text-sm">If 1-2 clients = 50%+ of income</p>
                  </div>
                  <span className="text-xs px-2 py-1 rounded bg-amber-500/20 text-amber-300">Recommended</span>
                </div>
              </div>

              <div className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">12 months</p>
                    <p className="text-zinc-500 text-sm">If 1 client = 70%+ of income, or high expenses</p>
                  </div>
                  <span className="text-xs px-2 py-1 rounded bg-rose-500/20 text-rose-300">High risk</span>
                </div>
              </div>
            </div>

            <div className="not-prose rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
              <h4 className="text-white font-semibold mb-4">Example calculation</h4>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Monthly baseline expenses</span>
                  <span className="text-zinc-200">$4,200</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Risk level (2 main clients)</span>
                  <span className="text-zinc-200">9 months</span>
                </div>
                <div className="h-px bg-zinc-800" />
                <div className="flex items-center justify-between">
                  <span className="text-white font-medium">Emergency fund target</span>
                  <span className="text-teal-300 font-semibold">$37,800</span>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-4">
              Where to keep your emergency fund
            </h2>

            <p className="text-zinc-300 leading-relaxed mb-6">
              Your emergency fund needs to be:
            </p>

            <ul className="space-y-3 text-zinc-300 mb-6">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-teal-400 mt-0.5 flex-shrink-0" />
                <span><strong className="text-white">Liquid</strong>—accessible within 1-2 business days</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-teal-400 mt-0.5 flex-shrink-0" />
                <span><strong className="text-white">Safe</strong>—not subject to market volatility</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-teal-400 mt-0.5 flex-shrink-0" />
                <span><strong className="text-white">Separate</strong>—not mixed with everyday spending money</span>
              </li>
            </ul>

            <p className="text-zinc-300 leading-relaxed mb-6">
              Best options:
            </p>

            <div className="not-prose space-y-3">
              <div className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-4">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-white font-medium">High-yield savings account</p>
                  <span className="text-teal-300 text-sm">4-5% APY</span>
                </div>
                <p className="text-zinc-500 text-sm">Best balance of accessibility and returns. FDIC insured.</p>
              </div>

              <div className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-4">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-white font-medium">Money market account</p>
                  <span className="text-zinc-400 text-sm">4-5% APY</span>
                </div>
                <p className="text-zinc-500 text-sm">Similar to HYSA, sometimes with check-writing ability.</p>
              </div>

              <div className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-4">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-white font-medium">Treasury bills (T-bills)</p>
                  <span className="text-zinc-400 text-sm">4-5% yield</span>
                </div>
                <p className="text-zinc-500 text-sm">Slightly less liquid but state tax-exempt.</p>
              </div>
            </div>

            <div className="not-prose mt-6 rounded-2xl border border-teal-500/20 bg-teal-500/5 p-6">
              <div className="flex items-start gap-3">
                <Lightbulb className="h-5 w-5 text-teal-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-white font-semibold mb-1">Pro tip: Name your account</p>
                  <p className="text-zinc-300">
                    Label it &quot;Emergency Fund - DO NOT TOUCH&quot; or &quot;9 Month Runway.&quot; Psychology matters—you&apos;re
                    less likely to dip into a clearly labeled emergency fund for non-emergencies.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-4">
              How to build it up
            </h2>

            <p className="text-zinc-300 leading-relaxed mb-6">
              Building a 6-12 month emergency fund takes time. Here&apos;s a realistic approach:
            </p>

            <div className="not-prose space-y-4 mb-6">
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
                <div className="flex items-center gap-3 mb-2">
                  <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-teal-500 text-zinc-950 text-sm font-semibold">1</span>
                  <h4 className="font-semibold text-white">Start with 1 month</h4>
                </div>
                <p className="text-zinc-400 text-sm ml-9">
                  Get one month of baseline expenses saved as quickly as possible. This is your &quot;sleep at night&quot; fund.
                </p>
              </div>

              <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
                <div className="flex items-center gap-3 mb-2">
                  <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-teal-500 text-zinc-950 text-sm font-semibold">2</span>
                  <h4 className="font-semibold text-white">Build to 3 months</h4>
                </div>
                <p className="text-zinc-400 text-sm ml-9">
                  Allocate 10-20% of every payment until you hit 3 months. This is your buffer + starter emergency fund.
                </p>
              </div>

              <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
                <div className="flex items-center gap-3 mb-2">
                  <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-teal-500 text-zinc-950 text-sm font-semibold">3</span>
                  <h4 className="font-semibold text-white">Extend to target</h4>
                </div>
                <p className="text-zinc-400 text-sm ml-9">
                  Continue adding until you hit your target (6-12 months). Windfall income (tax refunds, bonuses, big projects) accelerates this.
                </p>
              </div>

              <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
                <div className="flex items-center gap-3 mb-2">
                  <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-teal-500 text-zinc-950 text-sm font-semibold">4</span>
                  <h4 className="font-semibold text-white">Maintain and forget</h4>
                </div>
                <p className="text-zinc-400 text-sm ml-9">
                  Once funded, don&apos;t touch it unless true emergency. Let it earn interest in the background.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-4">
              Tracking your runway
            </h2>

            <p className="text-zinc-300 leading-relaxed mb-6">
              &quot;Runway&quot; is how long you could survive if all income stopped today. It&apos;s a more
              useful metric than a raw dollar amount because it accounts for your actual spending.
            </p>

            <div className="not-prose rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Calculator className="h-5 w-5 text-teal-400" />
                <span className="font-semibold text-white">Runway calculation</span>
              </div>
              <div className="bg-zinc-950/60 rounded-lg p-4 font-mono text-sm mb-4">
                <p className="text-teal-300">Runway (months) =</p>
                <p className="text-zinc-300 ml-4">Total savings (buffer + emergency)</p>
                <p className="text-zinc-300 ml-4">÷ Monthly baseline expenses</p>
              </div>
              <p className="text-zinc-400 text-sm">
                Example: $25,000 savings ÷ $4,200/month = 5.9 months runway
              </p>
            </div>

            <div className="not-prose mt-6 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
              <div className="flex items-start gap-3">
                <PiggyBank className="h-5 w-5 text-teal-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-white font-semibold mb-1">Track it automatically</p>
                  <p className="text-zinc-300 mb-4">
                    Cash Flow Forecaster includes an emergency fund tracker that shows your runway
                    in months based on your actual spending patterns.
                  </p>
                  <GetStartedCTA className="bg-teal-500 hover:bg-teal-400 text-zinc-950 text-sm" />
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* CTA */}
        <section className="mt-12 rounded-2xl border border-zinc-800 bg-zinc-900/40 px-6 py-10 text-center">
          <h2 className="text-2xl font-semibold text-white">
            Know your runway at a glance
          </h2>
          <p className="mt-3 text-zinc-400 max-w-xl mx-auto">
            Cash Flow Forecaster shows how many months of runway you have and alerts you when
            savings dip below your target.
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
              href="/blog/how-to-budget-with-variable-income"
              className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 hover:border-zinc-700 transition-colors group"
            >
              <p className="font-medium text-white group-hover:text-teal-300 transition-colors">
                Budget with Variable Income
              </p>
              <p className="mt-1 text-sm text-zinc-400">
                A practical tiered system
              </p>
            </Link>
          </div>
        </section>
      </article>
    </>
  );
}
