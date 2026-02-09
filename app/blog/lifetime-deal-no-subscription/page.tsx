import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronLeft, Check, X, DollarSign, Infinity, Heart } from 'lucide-react';
import { getPostBySlug } from '@/lib/blog/posts';

const post = getPostBySlug('lifetime-deal-no-subscription')!;

export const metadata: Metadata = {
  title: post.title,
  description: post.description,
  keywords: post.keywords,
  authors: [{ name: post.author.name }],
  openGraph: {
    title: post.title,
    description: post.description,
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
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What does the lifetime deal include?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The $99 lifetime deal includes permanent access to all Pro features: 365-day forecasting, unlimited accounts, credit card tracking, debt payoff planner, reports & exports, and all future updates.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is the lifetime deal really one-time payment?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, you pay $99 once and never pay again. There are no hidden fees, no annual renewals, and no feature limitations.',
      },
    },
    {
      '@type': 'Question',
      name: 'What if you raise prices later?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Your lifetime access is locked in at your purchase price. Even if we raise prices in the future, your access remains permanent with no additional cost.',
      },
    },
  ],
};

export default function LifetimeDealPage() {
  return (
    <div className="min-h-screen bg-zinc-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Blog
          </Link>
        </div>
      </header>

      {/* Article */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        {/* Meta */}
        <div className="mb-8">
          <div className="flex items-center gap-3 text-sm text-zinc-400 mb-4">
            <span className="px-2 py-1 bg-zinc-800 rounded text-teal-400 uppercase text-xs font-medium">
              {post.category}
            </span>
            <span>{post.readingTime}</span>
            <span>•</span>
            <time dateTime={post.publishedAt}>
              {new Date(post.publishedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
            {post.title}
          </h1>
          <p className="text-xl text-zinc-400 leading-relaxed">{post.description}</p>
        </div>

        {/* Author */}
        <div className="flex items-center gap-4 pb-8 mb-8 border-b border-zinc-800">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-zinc-900 font-bold">
            CF
          </div>
          <div>
            <div className="font-medium text-white">{post.author.name}</div>
            <div className="text-sm text-zinc-400">{post.author.role}</div>
          </div>
        </div>

        {/* Content */}
        <div className="prose prose-invert prose-zinc max-w-none">
          <p className="text-lg text-zinc-300 leading-relaxed">
            Let&apos;s be honest: subscription fatigue is real. Between Netflix, Spotify, your
            cloud storage, your password manager, and a dozen other services, monthly fees add
            up fast. So when we built Cash Flow Forecaster, we decided to do something different.
          </p>

          <h2 className="text-2xl font-bold text-white mt-12 mb-4">
            The Math Behind Subscription Fatigue
          </h2>
          <p className="text-zinc-300">
            Consider a popular budgeting app like YNAB, which costs $14.99/month (or $99/year).
            Over time, that adds up:
          </p>
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 my-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-3xl font-bold text-red-400">$99</div>
                <div className="text-sm text-zinc-400 mt-1">Year 1</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-red-400">$297</div>
                <div className="text-sm text-zinc-400 mt-1">Year 3</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-red-400">$495</div>
                <div className="text-sm text-zinc-400 mt-1">Year 5</div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-zinc-700 text-center">
              <div className="text-sm text-zinc-400">
                YNAB total cost over 5 years: <span className="text-red-400 font-semibold">$495+</span>
              </div>
            </div>
          </div>

          <p className="text-zinc-300">
            Meanwhile, our lifetime deal? <strong className="text-teal-400">$99 once, forever.</strong>
          </p>

          <h2 className="text-2xl font-bold text-white mt-12 mb-4">
            What&apos;s Included in the Lifetime Deal
          </h2>
          <p className="text-zinc-300">
            For $99, you get permanent access to everything in Pro—no restrictions, no asterisks:
          </p>
          <div className="grid sm:grid-cols-2 gap-4 my-6">
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
              <div className="flex items-center gap-3 text-white font-semibold mb-3">
                <Check className="w-5 h-5 text-teal-400" />
                365-Day Forecasting
              </div>
              <p className="text-sm text-zinc-400">
                See your projected cash flow for an entire year ahead
              </p>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
              <div className="flex items-center gap-3 text-white font-semibold mb-3">
                <Check className="w-5 h-5 text-teal-400" />
                Unlimited Accounts
              </div>
              <p className="text-sm text-zinc-400">
                Track all your bank accounts, credit cards, and cash
              </p>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
              <div className="flex items-center gap-3 text-white font-semibold mb-3">
                <Check className="w-5 h-5 text-teal-400" />
                Credit Card Tracking
              </div>
              <p className="text-sm text-zinc-400">
                Forecast utilization and plan payments ahead
              </p>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
              <div className="flex items-center gap-3 text-white font-semibold mb-3">
                <Check className="w-5 h-5 text-teal-400" />
                Debt Payoff Planner
              </div>
              <p className="text-sm text-zinc-400">
                Snowball or Avalanche strategies to crush debt
              </p>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
              <div className="flex items-center gap-3 text-white font-semibold mb-3">
                <Check className="w-5 h-5 text-teal-400" />
                Reports & Exports
              </div>
              <p className="text-sm text-zinc-400">
                Export to Excel, CSV, or JSON anytime
              </p>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
              <div className="flex items-center gap-3 text-white font-semibold mb-3">
                <Check className="w-5 h-5 text-teal-400" />
                All Future Updates
              </div>
              <p className="text-sm text-zinc-400">
                New features are automatically included
              </p>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-white mt-12 mb-4">
            Lifetime vs. Monthly vs. Yearly
          </h2>
          <p className="text-zinc-300">
            We offer three options so you can choose what works for your budget:
          </p>
          <div className="overflow-x-auto my-6">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-zinc-700">
                  <th className="py-3 px-4 text-zinc-300 font-semibold">Plan</th>
                  <th className="py-3 px-4 text-zinc-300 font-semibold">Price</th>
                  <th className="py-3 px-4 text-zinc-300 font-semibold">Year 1</th>
                  <th className="py-3 px-4 text-zinc-300 font-semibold">Year 3</th>
                  <th className="py-3 px-4 text-zinc-300 font-semibold">Year 5</th>
                </tr>
              </thead>
              <tbody className="text-zinc-400">
                <tr className="border-b border-zinc-800">
                  <td className="py-3 px-4">Monthly</td>
                  <td className="py-3 px-4">$9/mo</td>
                  <td className="py-3 px-4">$108</td>
                  <td className="py-3 px-4">$324</td>
                  <td className="py-3 px-4">$540</td>
                </tr>
                <tr className="border-b border-zinc-800">
                  <td className="py-3 px-4">Yearly</td>
                  <td className="py-3 px-4">$69/yr</td>
                  <td className="py-3 px-4">$69</td>
                  <td className="py-3 px-4">$207</td>
                  <td className="py-3 px-4">$345</td>
                </tr>
                <tr className="border-b border-zinc-800 bg-teal-500/5">
                  <td className="py-3 px-4 text-teal-400 font-semibold">Lifetime</td>
                  <td className="py-3 px-4 text-teal-400 font-semibold">$99 once</td>
                  <td className="py-3 px-4 text-teal-400 font-semibold">$99</td>
                  <td className="py-3 px-4 text-teal-400 font-semibold">$99</td>
                  <td className="py-3 px-4 text-teal-400 font-semibold">$99</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-zinc-400 text-sm">
            The lifetime deal pays for itself in just over one year compared to the yearly plan.
          </p>

          <h2 className="text-2xl font-bold text-white mt-12 mb-4">
            Why We Offer a Lifetime Deal
          </h2>
          <p className="text-zinc-300">
            You might wonder: why would a software company offer a one-time payment option?
            Here&apos;s our honest reasoning:
          </p>
          <div className="space-y-4 my-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-teal-500/20 rounded-full flex items-center justify-center shrink-0">
                <Heart className="w-5 h-5 text-teal-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">
                  We Built This for People Like Us
                </h3>
                <p className="text-zinc-400">
                  As freelancers ourselves, we understand subscription fatigue. We wanted to create
                  something we&apos;d actually want to use—and pay for—ourselves.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-teal-500/20 rounded-full flex items-center justify-center shrink-0">
                <DollarSign className="w-5 h-5 text-teal-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">
                  Upfront Revenue Helps Us Build Better
                </h3>
                <p className="text-zinc-400">
                  Lifetime deals give us the runway to invest in features without worrying about
                  monthly churn. It aligns our incentives with making the product genuinely useful.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-teal-500/20 rounded-full flex items-center justify-center shrink-0">
                <Infinity className="w-5 h-5 text-teal-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">
                  Long-Term Users Become Advocates
                </h3>
                <p className="text-zinc-400">
                  When you own something forever, you&apos;re more likely to recommend it to others.
                  Word-of-mouth from happy lifetime users is our best marketing.
                </p>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-white mt-12 mb-4">
            Common Questions About the Lifetime Deal
          </h2>
          <div className="space-y-4 my-6">
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5">
              <h3 className="text-lg font-semibold text-white mb-2">
                What if you shut down the service?
              </h3>
              <p className="text-zinc-400">
                Your data is always exportable. If we ever shut down (we have no plans to), you&apos;ll
                get ample notice and the ability to export everything in multiple formats.
              </p>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5">
              <h3 className="text-lg font-semibold text-white mb-2">
                Do lifetime users get support?
              </h3>
              <p className="text-zinc-400">
                Absolutely. Lifetime users get the same priority support as monthly/yearly subscribers.
                You paid for the product—you deserve support.
              </p>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5">
              <h3 className="text-lg font-semibold text-white mb-2">
                What if you raise prices later?
              </h3>
              <p className="text-zinc-400">
                Your lifetime access is locked in at your purchase price. Even if we increase the
                lifetime deal price in the future, your access remains permanent.
              </p>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5">
              <h3 className="text-lg font-semibold text-white mb-2">
                Can I try before I buy?
              </h3>
              <p className="text-zinc-400">
                Yes! Our free tier includes 30-day forecasting with limited accounts. Try it out,
                see if it fits your workflow, then upgrade when you&apos;re ready.
              </p>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-white mt-12 mb-4">
            YNAB vs. Cash Flow Forecaster: A Quick Comparison
          </h2>
          <div className="overflow-x-auto my-6">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-zinc-700">
                  <th className="py-3 px-4 text-zinc-300 font-semibold">Feature</th>
                  <th className="py-3 px-4 text-zinc-300 font-semibold">YNAB</th>
                  <th className="py-3 px-4 text-zinc-300 font-semibold">Cash Flow Forecaster</th>
                </tr>
              </thead>
              <tbody className="text-zinc-400">
                <tr className="border-b border-zinc-800">
                  <td className="py-3 px-4">Lifetime deal</td>
                  <td className="py-3 px-4"><X className="w-4 h-4 text-red-400 inline" /></td>
                  <td className="py-3 px-4"><Check className="w-4 h-4 text-teal-400 inline" /> $99 one-time</td>
                </tr>
                <tr className="border-b border-zinc-800">
                  <td className="py-3 px-4">5-year cost (subscription)</td>
                  <td className="py-3 px-4">$495</td>
                  <td className="py-3 px-4">$345 (yearly) or $99 (lifetime)</td>
                </tr>
                <tr className="border-b border-zinc-800">
                  <td className="py-3 px-4">365-day forecasting</td>
                  <td className="py-3 px-4"><X className="w-4 h-4 text-red-400 inline" /></td>
                  <td className="py-3 px-4"><Check className="w-4 h-4 text-teal-400 inline" /></td>
                </tr>
                <tr className="border-b border-zinc-800">
                  <td className="py-3 px-4">Credit card utilization tracking</td>
                  <td className="py-3 px-4"><X className="w-4 h-4 text-red-400 inline" /></td>
                  <td className="py-3 px-4"><Check className="w-4 h-4 text-teal-400 inline" /></td>
                </tr>
                <tr className="border-b border-zinc-800">
                  <td className="py-3 px-4">Built for irregular income</td>
                  <td className="py-3 px-4">Partial</td>
                  <td className="py-3 px-4"><Check className="w-4 h-4 text-teal-400 inline" /> Core focus</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-zinc-400 text-sm">
            <Link href="/compare/ynab" className="text-teal-400 hover:underline">
              See our full YNAB comparison →
            </Link>
          </p>

          {/* CTA */}
          <div className="bg-gradient-to-br from-teal-500/10 to-teal-600/5 border border-teal-500/20 rounded-xl p-8 my-12 text-center">
            <h3 className="text-2xl font-bold text-white mb-3">
              Ready to Ditch Subscription Fatigue?
            </h3>
            <p className="text-zinc-400 mb-6 max-w-xl mx-auto">
              Pay once, use forever. Get lifetime access to all Pro features for $99—less than
              one year of most budgeting subscriptions.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/auth/signup"
                className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold rounded-lg transition-colors"
              >
                Try Free First
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 px-6 py-3 bg-teal-500 hover:bg-teal-400 text-zinc-900 font-semibold rounded-lg transition-colors"
              >
                <Infinity className="w-5 h-5" />
                Get Lifetime Deal — $99
              </Link>
            </div>
          </div>
        </div>
      </article>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center text-zinc-500 text-sm">
          <p>
            &copy; {new Date().getFullYear()} Cash Flow Forecaster. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
