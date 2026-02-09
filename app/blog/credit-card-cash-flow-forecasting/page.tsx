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
  CreditCard,
  TrendingUp,
  Calculator,
  PieChart,
} from 'lucide-react';

const post = getPostBySlug('credit-card-cash-flow-forecasting')!;

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
      name: 'What is credit card cash flow forecasting?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Credit card cash flow forecasting means including your credit card payments, balances, and utilization in your cash flow projection. This shows you when payments are due, how much they\'ll impact your bank balance, and how your credit utilization will change over time.',
      },
    },
    {
      '@type': 'Question',
      name: 'Why does credit utilization matter for cash flow?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Credit utilization affects your credit score. Keeping it under 30% is ideal. By forecasting your utilization, you can plan purchases and payments to maintain a healthy score while managing your cash flow.',
      },
    },
    {
      '@type': 'Question',
      name: 'Should I pay the minimum or statement balance?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Paying the statement balance avoids interest charges. However, if cash flow is tight, paying more than the minimum but less than the full balance can be a reasonable compromise. Use a payment simulator to see how different amounts affect your cash flow and interest costs.',
      },
    },
  ],
};

export default function CreditCardCashFlowPage() {
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
            { name: 'Credit Card Forecasting', url: `https://www.cashflowforecaster.io/blog/${post.slug}` },
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
          {/* Definition box */}
          <div className="not-prose mb-10 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6">
            <div className="flex items-start gap-3">
              <CreditCard className="h-6 w-6 text-amber-400 mt-0.5 flex-shrink-0" />
              <div>
                <h2 className="text-xl font-semibold text-white mb-2">
                  Credit Card Cash Flow Forecasting
                </h2>
                <p className="text-zinc-300 leading-relaxed">
                  Including credit card payments, balances, and utilization in your cash flow projection
                  so you can see when payments are due, how they impact your bank balance, and plan
                  your spending accordingly.
                </p>
              </div>
            </div>
          </div>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-4">
              Why most budget apps ignore credit cards
            </h2>

            <p className="text-zinc-300 leading-relaxed mb-6">
              Traditional cash flow tools focus on your checking account. They track income in, bills out.
              But if you use credit cards for business expenses, subscriptions, or daily purchases, your
              cash flow picture is incomplete.
            </p>

            <div className="not-prose rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 mb-6">
              <p className="text-zinc-300 mb-4">Here&apos;s what happens without credit card tracking:</p>
              <ul className="space-y-3 text-zinc-300">
                <li className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-amber-400 mt-0.5 flex-shrink-0" />
                  <span>You forget about a $2,000 credit card payment due next week</span>
                </li>
                <li className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-amber-400 mt-0.5 flex-shrink-0" />
                  <span>Your utilization creeps above 50% without you noticing</span>
                </li>
                <li className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-amber-400 mt-0.5 flex-shrink-0" />
                  <span>Interest charges surprise you because you missed the statement balance</span>
                </li>
              </ul>
            </div>

            <p className="text-zinc-300 leading-relaxed">
              For freelancers who charge business expenses to cards for rewards or cash flow flexibility,
              this gap can cause serious problems.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-4">
              How credit card forecasting works
            </h2>

            <p className="text-zinc-300 leading-relaxed mb-6">
              Credit card cash flow forecasting adds three dimensions to your projection:
            </p>

            <div className="not-prose space-y-4 mb-6">
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-lg bg-teal-500/10 flex items-center justify-center flex-shrink-0">
                    <Calculator className="h-4 w-4 text-teal-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">1. Payment due dates</h3>
                    <p className="mt-1 text-zinc-400">
                      Your credit card payment appears in your cash flow calendar just like any other bill.
                      You see exactly when it&apos;s due and how it affects your bank balance.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-lg bg-teal-500/10 flex items-center justify-center flex-shrink-0">
                    <PieChart className="h-4 w-4 text-teal-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">2. Utilization tracking</h3>
                    <p className="mt-1 text-zinc-400">
                      See your credit utilization percentage now and projected into the future.
                      Color-coded warnings: green under 30%, amber 30-50%, red over 50%.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-lg bg-teal-500/10 flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="h-4 w-4 text-teal-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">3. Payment simulation</h3>
                    <p className="mt-1 text-zinc-400">
                      Compare paying minimum vs. statement balance vs. custom amount.
                      See how each choice affects your cash flow and interest costs.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-4">
              Understanding credit utilization
            </h2>

            <p className="text-zinc-300 leading-relaxed mb-6">
              Credit utilization is the percentage of your credit limit you&apos;re using. It&apos;s one
              of the biggest factors in your credit score. Here&apos;s what the numbers mean:
            </p>

            <div className="not-prose rounded-2xl border border-zinc-800 bg-zinc-900/40 overflow-hidden mb-6">
              <table className="w-full text-sm">
                <thead className="bg-zinc-950/40 border-b border-zinc-800">
                  <tr>
                    <th className="px-4 py-3 text-left text-zinc-400 font-medium">Utilization</th>
                    <th className="px-4 py-3 text-left text-zinc-400 font-medium">Status</th>
                    <th className="px-4 py-3 text-left text-zinc-400 font-medium">Impact</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  <tr>
                    <td className="px-4 py-3 text-emerald-400 font-medium">0-30%</td>
                    <td className="px-4 py-3 text-zinc-300">Excellent</td>
                    <td className="px-4 py-3 text-zinc-400">Best for credit score</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-amber-400 font-medium">30-50%</td>
                    <td className="px-4 py-3 text-zinc-300">Moderate</td>
                    <td className="px-4 py-3 text-zinc-400">May slightly impact score</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-rose-400 font-medium">50%+</td>
                    <td className="px-4 py-3 text-zinc-300">High</td>
                    <td className="px-4 py-3 text-zinc-400">Likely hurts credit score</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="not-prose rounded-2xl border border-teal-500/20 bg-teal-500/5 p-6">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-teal-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-white font-semibold mb-1">Pro tip for freelancers</p>
                  <p className="text-zinc-300">
                    If you charge large business expenses to a card, pay them down before the statement
                    closing date—not just the due date. This keeps your reported utilization low.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-4">
              Payment strategies: minimum vs. full balance
            </h2>

            <p className="text-zinc-300 leading-relaxed mb-6">
              How much should you pay? It depends on your cash flow situation:
            </p>

            <div className="not-prose space-y-4 mb-6">
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5">
                <h3 className="text-white font-semibold mb-2">Pay the statement balance (ideal)</h3>
                <p className="text-zinc-300">
                  Avoids all interest charges. If you can afford it, this is always the best choice.
                  Your cash flow forecast helps you see if this is realistic.
                </p>
              </div>

              <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-5">
                <h3 className="text-white font-semibold mb-2">Pay more than minimum (compromise)</h3>
                <p className="text-zinc-300">
                  Reduces interest charges and pays down the balance faster. Use the payment simulator
                  to find the sweet spot between cash flow and debt reduction.
                </p>
              </div>

              <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-5">
                <h3 className="text-white font-semibold mb-2">Pay just the minimum (emergency only)</h3>
                <p className="text-zinc-300">
                  Only do this in a cash flow crunch. Interest adds up fast. The simulator shows
                  exactly how much that &quot;saved&quot; cash flow costs you in interest.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-4">
              Example: Forecasting a credit card payment
            </h2>

            <p className="text-zinc-300 leading-relaxed mb-6">
              Let&apos;s say you have a credit card with:
            </p>

            <div className="not-prose rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 mb-6">
              <ul className="space-y-2 text-zinc-300">
                <li><strong className="text-white">Current balance:</strong> $3,200</li>
                <li><strong className="text-white">Credit limit:</strong> $10,000</li>
                <li><strong className="text-white">Utilization:</strong> 32% (amber zone)</li>
                <li><strong className="text-white">Payment due:</strong> February 15th</li>
                <li><strong className="text-white">Minimum payment:</strong> $64</li>
                <li><strong className="text-white">Statement balance:</strong> $3,200</li>
              </ul>
            </div>

            <p className="text-zinc-300 leading-relaxed mb-6">
              Your cash flow forecast shows you have $4,500 in your checking account on February 15th,
              with $1,800 rent due on the 1st and a $2,000 client payment coming on the 10th.
            </p>

            <div className="not-prose rounded-2xl border border-zinc-800 bg-zinc-900/40 overflow-hidden mb-6">
              <table className="w-full text-sm">
                <thead className="bg-zinc-950/40 border-b border-zinc-800">
                  <tr>
                    <th className="px-4 py-3 text-left text-zinc-400 font-medium">Payment Option</th>
                    <th className="px-4 py-3 text-right text-zinc-400 font-medium">After Payment</th>
                    <th className="px-4 py-3 text-right text-zinc-400 font-medium">Utilization</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  <tr>
                    <td className="px-4 py-3 text-zinc-300">Minimum ($64)</td>
                    <td className="px-4 py-3 text-right text-zinc-300">$4,436 in checking</td>
                    <td className="px-4 py-3 text-right text-amber-400">31.4%</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-zinc-300">Pay $1,500</td>
                    <td className="px-4 py-3 text-right text-zinc-300">$3,000 in checking</td>
                    <td className="px-4 py-3 text-right text-emerald-400">17%</td>
                  </tr>
                  <tr className="bg-teal-500/5">
                    <td className="px-4 py-3 text-white font-medium">Full balance ($3,200)</td>
                    <td className="px-4 py-3 text-right text-zinc-300">$1,300 in checking</td>
                    <td className="px-4 py-3 text-right text-emerald-400">0%</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-zinc-300 leading-relaxed">
              With this visibility, you might choose to pay $1,500—enough to get into the green
              utilization zone while keeping a healthy cash buffer.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-4">
              Multiple credit cards? Use the debt payoff planner
            </h2>

            <p className="text-zinc-300 leading-relaxed mb-6">
              If you have multiple credit cards with balances, credit card forecasting works alongside
              our <Link href="/blog/debt-payoff-snowball-vs-avalanche" className="text-teal-400 hover:text-teal-300">Debt Payoff Planner</Link>.
              You can:
            </p>

            <ul className="space-y-3 text-zinc-300 mb-6">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-teal-400 mt-0.5 flex-shrink-0" />
                <span>Compare Snowball vs Avalanche payoff strategies</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-teal-400 mt-0.5 flex-shrink-0" />
                <span>See exactly when each card will be paid off</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-teal-400 mt-0.5 flex-shrink-0" />
                <span>Calculate interest savings from extra payments</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-teal-400 mt-0.5 flex-shrink-0" />
                <span>Plan your debt-free date around your cash flow</span>
              </li>
            </ul>
          </section>
        </div>

        {/* CTA */}
        <section className="mt-12 rounded-2xl border border-zinc-800 bg-zinc-900/40 px-6 py-10 text-center">
          <h2 className="text-2xl font-semibold text-white">
            Start tracking your credit cards today
          </h2>
          <p className="mt-3 text-zinc-400 max-w-xl mx-auto">
            Cash Flow Forecaster includes credit card tracking, utilization monitoring, and payment
            simulation—features most competitors don&apos;t have. Start free.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <GetStartedCTA className="bg-teal-500 hover:bg-teal-400 text-zinc-950 px-8" />
            <Link href="/blog/debt-payoff-snowball-vs-avalanche" className="text-sm text-zinc-400 hover:text-zinc-200 transition-colors">
              Learn about debt payoff strategies
            </Link>
          </div>
        </section>

        {/* Related posts */}
        <section className="mt-12">
          <h3 className="text-lg font-semibold text-white mb-6">Related articles</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              href="/blog/debt-payoff-snowball-vs-avalanche"
              className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 hover:border-zinc-700 transition-colors group"
            >
              <p className="font-medium text-white group-hover:text-teal-300 transition-colors">
                Snowball vs Avalanche Debt Payoff
              </p>
              <p className="mt-1 text-sm text-zinc-400">
                Which strategy is right for you?
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
