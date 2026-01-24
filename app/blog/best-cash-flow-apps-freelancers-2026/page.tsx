import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { breadcrumbs } from '@/components/seo/schemas';
import { getPostBySlug } from '@/lib/blog/posts';
import {
  Star,
  Check,
  X,
  ArrowRight,
  Calendar,
  TrendingUp,
  Receipt,
  Smartphone,
} from 'lucide-react';

const post = getPostBySlug('best-cash-flow-apps-freelancers-2026')!;

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

const apps = [
  {
    name: 'Cash Flow Forecaster',
    bestFor: 'Freelancers with irregular income who need day-by-day visibility',
    price: 'Free tier, Pro from $7.99/mo',
    pros: [
      'Built specifically for irregular income',
      'Day-by-day balance projection up to 365 days',
      'Shows "safe to spend" amount',
      'Invoice tracking with payment predictions',
      'Simple, focused interface',
    ],
    cons: [
      'Manual entry (no automatic bank sync yet)',
      'No expense categorization',
    ],
    highlight: true,
  },
  {
    name: 'YNAB (You Need A Budget)',
    bestFor: 'Freelancers who want strict zero-based budgeting',
    price: '$14.99/mo or $99/year',
    pros: [
      'Powerful budgeting methodology',
      'Bank sync available',
      'Great educational resources',
      'Mobile app included',
    ],
    cons: [
      'Steep learning curve',
      'Not designed for irregular income',
      'No forward cash flow projection',
      'Monthly focus, not daily',
    ],
    highlight: false,
  },
  {
    name: 'Copilot',
    bestFor: 'Freelancers who want beautiful expense tracking',
    price: '$9.99/mo or $69.99/year',
    pros: [
      'Clean, modern interface',
      'Bank sync included',
      'Good expense categorization',
      'iOS and Mac apps',
    ],
    cons: [
      'iOS/Mac only (no Android/Windows)',
      'Limited cash flow forecasting',
      'Not built for irregular income',
    ],
    highlight: false,
  },
  {
    name: 'Mint',
    bestFor: 'Freelancers who want free basic tracking',
    price: 'Free (ad-supported)',
    pros: [
      'Completely free',
      'Bank sync included',
      'Bill reminders',
      'Credit score monitoring',
    ],
    cons: [
      'Ads throughout the app',
      'No real cash flow forecasting',
      'Overwhelming for some users',
      'Being discontinued/migrating to Credit Karma',
    ],
    highlight: false,
  },
  {
    name: 'PocketSmith',
    bestFor: 'Power users who want detailed forecasting',
    price: 'Free tier, Premium from $9.95/mo',
    pros: [
      'Powerful calendar-based forecasting',
      'Bank feeds available',
      'Scenario modeling',
      'Multiple currency support',
    ],
    cons: [
      'Complex interface',
      'Can be overwhelming',
      'Premium features require paid plan',
    ],
    highlight: false,
  },
];

export default function BestCashFlowAppsPage() {
  return (
    <article className="mx-auto max-w-3xl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <Breadcrumbs
        items={[
          breadcrumbs.home,
          breadcrumbs.blog,
          { name: 'Best Cash Flow Apps', url: `https://cashflowforecaster.io/blog/${post.slug}` },
        ]}
        className="mb-8"
      />

      <header className="mb-12">
        <div className="flex items-center gap-3 text-sm text-zinc-400 mb-4">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-900 border border-zinc-800 px-3 py-1 text-xs font-medium text-teal-400">
            {post.category}
          </span>
          <span>{post.readingTime}</span>
          <span>•</span>
          <time dateTime={post.publishedAt}>
            {new Date(post.publishedAt).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </time>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight leading-tight">
          {post.title}
        </h1>

        <p className="mt-4 text-lg text-zinc-300 leading-relaxed">{post.description}</p>

        <div className="mt-6 flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-zinc-950 font-bold text-sm">
            CF
          </div>
          <div>
            <p className="text-sm font-medium text-white">{post.author.name}</p>
            <p className="text-sm text-zinc-500">{post.author.role}</p>
          </div>
        </div>
      </header>

      <div className="prose prose-invert prose-zinc max-w-none">
        <p>
          Finding the right cash flow app as a freelancer is tricky. Most budgeting apps assume you get the same
          paycheck every two weeks. When your income varies wildly month to month, those tools fall short.
        </p>

        <p>
          We tested the most popular options to find which ones actually work for irregular income. Here&apos;s what we
          found.
        </p>

        <h2>What to Look for in a Cash Flow App</h2>

        <p>Before diving into specific apps, here are the features that matter most for freelancers:</p>

        <div className="not-prose my-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
            <Calendar className="h-5 w-5 text-teal-400 mb-3" />
            <h3 className="font-semibold text-white mb-2">Forward-Looking View</h3>
            <p className="text-sm text-zinc-400">See your future balance, not just past transactions.</p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
            <TrendingUp className="h-5 w-5 text-teal-400 mb-3" />
            <h3 className="font-semibold text-white mb-2">Handles Variable Income</h3>
            <p className="text-sm text-zinc-400">Doesn&apos;t assume a fixed paycheck schedule.</p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
            <Receipt className="h-5 w-5 text-teal-400 mb-3" />
            <h3 className="font-semibold text-white mb-2">Bill Tracking</h3>
            <p className="text-sm text-zinc-400">Know when bills hit before they surprise you.</p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
            <Smartphone className="h-5 w-5 text-teal-400 mb-3" />
            <h3 className="font-semibold text-white mb-2">Simple Interface</h3>
            <p className="text-sm text-zinc-400">Easy to use without accounting knowledge.</p>
          </div>
        </div>

        <h2>The Best Cash Flow Apps for Freelancers</h2>

        {apps.map((app, index) => (
          <div
            key={app.name}
            className={`not-prose my-8 rounded-xl border ${
              app.highlight ? 'border-teal-500/50 bg-teal-500/5' : 'border-zinc-800 bg-zinc-900/40'
            } p-6`}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-semibold text-white">
                    {index + 1}. {app.name}
                  </h3>
                  {app.highlight && (
                    <span className="text-xs bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded-full border border-teal-500/30">
                      Editor&apos;s Pick
                    </span>
                  )}
                </div>
                <p className="text-sm text-zinc-400 mt-1">{app.bestFor}</p>
              </div>
              <span className="text-sm text-teal-300 font-medium whitespace-nowrap">{app.price}</span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-2">Pros</p>
                <ul className="space-y-1.5">
                  {app.pros.map((pro) => (
                    <li key={pro} className="flex items-start gap-2 text-sm text-zinc-300">
                      <Check className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                      {pro}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-2">Cons</p>
                <ul className="space-y-1.5">
                  {app.cons.map((con) => (
                    <li key={con} className="flex items-start gap-2 text-sm text-zinc-300">
                      <X className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
                      {con}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}

        <h2>Quick Comparison Table</h2>

        <div className="not-prose my-8 rounded-xl border border-zinc-800 bg-zinc-900/60 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="text-left p-4 font-semibold text-zinc-300">App</th>
                <th className="text-left p-4 font-semibold text-zinc-300">Cash Flow Forecast</th>
                <th className="text-left p-4 font-semibold text-zinc-300">Bank Sync</th>
                <th className="text-left p-4 font-semibold text-zinc-300">Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              <tr className="bg-teal-500/5">
                <td className="p-4 text-white font-medium">Cash Flow Forecaster</td>
                <td className="p-4 text-green-400">365 days</td>
                <td className="p-4 text-zinc-400">No</td>
                <td className="p-4 text-zinc-300">Free / $9+</td>
              </tr>
              <tr>
                <td className="p-4 text-white font-medium">YNAB</td>
                <td className="p-4 text-zinc-400">Limited</td>
                <td className="p-4 text-green-400">Yes</td>
                <td className="p-4 text-zinc-300">$14.99/mo</td>
              </tr>
              <tr>
                <td className="p-4 text-white font-medium">Copilot</td>
                <td className="p-4 text-zinc-400">Basic</td>
                <td className="p-4 text-green-400">Yes</td>
                <td className="p-4 text-zinc-300">$9.99/mo</td>
              </tr>
              <tr>
                <td className="p-4 text-white font-medium">Mint</td>
                <td className="p-4 text-red-400">No</td>
                <td className="p-4 text-green-400">Yes</td>
                <td className="p-4 text-zinc-300">Free</td>
              </tr>
              <tr>
                <td className="p-4 text-white font-medium">PocketSmith</td>
                <td className="p-4 text-green-400">Yes</td>
                <td className="p-4 text-green-400">Yes</td>
                <td className="p-4 text-zinc-300">Free / $9.95+</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2>Our Recommendation</h2>

        <p>
          For most freelancers, the best approach is to use <strong>two tools together</strong>:
        </p>

        <ol>
          <li>
            <strong>A forward-looking cash flow app</strong> (like Cash Flow Forecaster or PocketSmith) to see your
            future balance and plan ahead
          </li>
          <li>
            <strong>A basic expense tracker</strong> (like your bank&apos;s app or a spreadsheet) for tax-time expense
            categorization
          </li>
        </ol>

        <p>
          The most important thing for irregular income is knowing what&apos;s coming—not just categorizing what
          happened. That&apos;s why forward-looking forecasting is the priority.
        </p>

        {/* CTA */}
        <div className="not-prose my-10 rounded-xl border border-teal-500/30 bg-teal-500/5 p-6 text-center">
          <div className="flex items-center justify-center gap-1 mb-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
            ))}
          </div>
          <h3 className="text-xl font-semibold text-white mb-3">Try Cash Flow Forecaster Free</h3>
          <p className="text-zinc-300 mb-4">
            See your balance up to 365 days ahead. Built specifically for freelancers with irregular income.
          </p>
          <Link
            href="/auth/signup"
            className="inline-flex items-center justify-center h-10 px-6 rounded-lg bg-teal-500 hover:bg-teal-400 text-zinc-950 font-semibold text-sm transition-colors"
          >
            Start Free Trial
          </Link>
        </div>

        <h2>Bottom Line</h2>

        <p>
          The best cash flow app for you depends on your priorities. If you want automatic bank syncing and don&apos;t
          mind complexity, try PocketSmith. If you want simplicity and focus on future planning, try Cash Flow
          Forecaster.
        </p>

        <p>
          The worst thing you can do is use a tool that assumes steady income when yours isn&apos;t. That leads to
          budget plans that never match reality.
        </p>
      </div>

      {/* Related Content */}
      <section className="mt-16 pt-10 border-t border-zinc-800">
        <h2 className="text-xl font-semibold text-white mb-6">Related Articles</h2>
        <div className="grid gap-4">
          <Link
            href="/blog/how-to-track-freelance-income-expenses"
            className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 hover:border-zinc-700 transition-colors group"
          >
            <p className="font-medium text-white group-hover:text-teal-300 transition-colors">
              How to Track Freelance Income and Expenses
            </p>
            <p className="mt-1 text-sm text-zinc-400">A simple system for freelance bookkeeping.</p>
            <span className="mt-3 inline-flex items-center gap-1 text-sm text-teal-400 group-hover:gap-2 transition-all">
              Read article <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </Link>
          <Link
            href="/blog/cash-flow-forecasting-for-freelancers"
            className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 hover:border-zinc-700 transition-colors group"
          >
            <p className="font-medium text-white group-hover:text-teal-300 transition-colors">
              Cash Flow Forecasting for Freelancers
            </p>
            <p className="mt-1 text-sm text-zinc-400">Why day-by-day visibility matters more than monthly budgets.</p>
            <span className="mt-3 inline-flex items-center gap-1 text-sm text-teal-400 group-hover:gap-2 transition-all">
              Read article <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </Link>
        </div>
      </section>
    </article>
  );
}
