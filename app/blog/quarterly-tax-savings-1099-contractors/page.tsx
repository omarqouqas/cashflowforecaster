import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { breadcrumbs } from '@/components/seo/schemas';
import { getPostBySlug } from '@/lib/blog/posts';
import {
  Calculator,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  PiggyBank,
  Percent,
} from 'lucide-react';

const post = getPostBySlug('quarterly-tax-savings-1099-contractors')!;

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

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How much should a 1099 contractor save for taxes?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Most 1099 contractors should save 25-30% of their income for taxes. This covers federal income tax (10-37% depending on bracket) plus self-employment tax (15.3% on the first $160,200 of net earnings in 2024). State taxes may add 0-13% more.',
      },
    },
    {
      '@type': 'Question',
      name: 'When are quarterly estimated taxes due?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Quarterly tax due dates are: Q1 (Jan-Mar) due April 15, Q2 (Apr-May) due June 15, Q3 (Jun-Aug) due September 15, Q4 (Sep-Dec) due January 15 of the following year.',
      },
    },
    {
      '@type': 'Question',
      name: 'What happens if I don\'t pay quarterly taxes?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'If you owe more than $1,000 at tax time and didn\'t pay quarterly estimates, the IRS charges an underpayment penalty. The penalty is roughly 8% annual interest on the unpaid amount, calculated for each quarter you missed.',
      },
    },
  ],
};

export default function QuarterlyTaxSavingsPage() {
  return (
    <article className="mx-auto max-w-3xl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <Breadcrumbs
        items={[
          breadcrumbs.home,
          breadcrumbs.blog,
          { name: 'Quarterly Tax Savings', url: `https://cashflowforecaster.io/blog/${post.slug}` },
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
          As a 1099 contractor, nobody withholds taxes from your payments. That means the IRS expects you to pay taxes
          quarterly—and if you don&apos;t, you&apos;ll owe penalties on top of what you already owe.
        </p>

        <p>
          The question everyone asks: <strong>how much should I actually set aside?</strong>
        </p>

        <h2>The Simple Rule: Save 25-30%</h2>

        <p>
          For most freelancers, saving <strong>25-30% of every payment</strong> will cover your tax obligations.
          This accounts for:
        </p>

        <div className="not-prose my-8 rounded-xl border border-zinc-800 bg-zinc-900/60 p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Percent className="h-5 w-5 text-teal-400" />
                <span className="text-white font-medium">Self-Employment Tax</span>
              </div>
              <span className="text-zinc-300">15.3%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Percent className="h-5 w-5 text-teal-400" />
                <span className="text-white font-medium">Federal Income Tax (avg)</span>
              </div>
              <span className="text-zinc-300">10-22%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Percent className="h-5 w-5 text-teal-400" />
                <span className="text-white font-medium">State Tax (varies)</span>
              </div>
              <span className="text-zinc-300">0-13%</span>
            </div>
            <div className="border-t border-zinc-700 pt-4 flex items-center justify-between">
              <span className="text-white font-semibold">Typical Total</span>
              <span className="text-teal-400 font-semibold">25-35%</span>
            </div>
          </div>
        </div>

        <h2>Understanding Self-Employment Tax</h2>

        <p>
          As a W-2 employee, your employer pays half of Social Security and Medicare taxes. As a 1099 contractor,
          you pay <strong>both halves</strong>—a total of 15.3% on your net self-employment income.
        </p>

        <div className="not-prose my-8 rounded-xl border border-amber-500/30 bg-amber-500/5 p-5">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-amber-300 mb-2">This Is Why Freelancers Feel Overtaxed</p>
              <p className="text-sm text-zinc-300">
                If you earned $80,000 as an employee vs. $80,000 as a 1099 contractor, you&apos;d pay roughly
                $6,000 more in self-employment tax as a contractor. This catches many new freelancers off guard.
              </p>
            </div>
          </div>
        </div>

        <h2>How to Calculate Your Quarterly Payment</h2>

        <p>Here&apos;s a simple formula that works for most freelancers:</p>

        <div className="not-prose my-8 rounded-xl border border-teal-500/30 bg-teal-500/5 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Calculator className="h-6 w-6 text-teal-400" />
            <h3 className="text-lg font-semibold text-white">Quick Calculation</h3>
          </div>
          <ol className="space-y-3 text-zinc-300">
            <li className="flex gap-3">
              <span className="text-teal-400 font-semibold">1.</span>
              <span>Take your total income for the quarter</span>
            </li>
            <li className="flex gap-3">
              <span className="text-teal-400 font-semibold">2.</span>
              <span>Subtract business expenses</span>
            </li>
            <li className="flex gap-3">
              <span className="text-teal-400 font-semibold">3.</span>
              <span>Multiply by 0.25 to 0.30 (your tax rate)</span>
            </li>
          </ol>
          <div className="mt-6 p-4 bg-zinc-900/60 rounded-lg">
            <p className="text-sm text-zinc-400">Example:</p>
            <p className="text-white mt-1">
              $15,000 income - $2,000 expenses = $13,000 profit
            </p>
            <p className="text-teal-300 mt-1">
              $13,000 × 0.27 = <strong>$3,510 quarterly payment</strong>
            </p>
          </div>
        </div>

        <h2>Quarterly Tax Due Dates (2026)</h2>

        <div className="not-prose my-8 rounded-xl border border-zinc-800 bg-zinc-900/60 overflow-hidden">
          <div className="grid grid-cols-3 divide-x divide-zinc-800">
            <div className="p-4 text-center">
              <p className="text-xs text-zinc-500 uppercase tracking-wide">Period</p>
            </div>
            <div className="p-4 text-center">
              <p className="text-xs text-zinc-500 uppercase tracking-wide">Income From</p>
            </div>
            <div className="p-4 text-center">
              <p className="text-xs text-zinc-500 uppercase tracking-wide">Due Date</p>
            </div>
          </div>
          {[
            { q: 'Q1', period: 'Jan 1 - Mar 31', due: 'April 15, 2026' },
            { q: 'Q2', period: 'Apr 1 - May 31', due: 'June 15, 2026' },
            { q: 'Q3', period: 'Jun 1 - Aug 31', due: 'Sept 15, 2026' },
            { q: 'Q4', period: 'Sep 1 - Dec 31', due: 'Jan 15, 2027' },
          ].map((item, i) => (
            <div key={item.q} className={`grid grid-cols-3 divide-x divide-zinc-800 ${i % 2 === 0 ? 'bg-zinc-900/40' : ''}`}>
              <div className="p-4 text-center">
                <p className="font-semibold text-white">{item.q}</p>
              </div>
              <div className="p-4 text-center">
                <p className="text-zinc-300">{item.period}</p>
              </div>
              <div className="p-4 text-center">
                <p className="text-teal-300 font-medium">{item.due}</p>
              </div>
            </div>
          ))}
        </div>

        <h2>The Easiest System: Auto-Transfer on Every Payment</h2>

        <p>
          Trying to calculate and save quarterly is stressful when income is irregular. Instead, use this system:
        </p>

        <div className="not-prose my-8 space-y-4">
          <div className="flex items-start gap-4 rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-teal-500/10 flex items-center justify-center text-teal-400 font-semibold">
              1
            </div>
            <div>
              <p className="font-medium text-white">Open a separate &quot;Tax&quot; savings account</p>
              <p className="text-sm text-zinc-400 mt-1">
                A basic savings account works. Name it &quot;Taxes&quot; so you don&apos;t accidentally spend it.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-teal-500/10 flex items-center justify-center text-teal-400 font-semibold">
              2
            </div>
            <div>
              <p className="font-medium text-white">Transfer 27% of every payment immediately</p>
              <p className="text-sm text-zinc-400 mt-1">
                The same day a client pays you, move 27% to your tax account. Don&apos;t wait.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-teal-500/10 flex items-center justify-center text-teal-400 font-semibold">
              3
            </div>
            <div>
              <p className="font-medium text-white">Pay from that account quarterly</p>
              <p className="text-sm text-zinc-400 mt-1">
                When quarterly taxes are due, the money is already set aside. No scrambling.
              </p>
            </div>
          </div>
        </div>

        <h2>What If You Don&apos;t Pay Quarterly?</h2>

        <p>
          If you owe more than $1,000 at tax time and didn&apos;t make quarterly payments, the IRS charges an
          <strong> underpayment penalty</strong>. The penalty is roughly 8% annual interest on what you should have paid.
        </p>

        <p>
          For example, if you should have paid $4,000 in Q1 but didn&apos;t, you might owe ~$240 extra in penalties
          by year-end.
        </p>

        <div className="not-prose my-8 rounded-xl border border-green-500/30 bg-green-500/5 p-5">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-green-300 mb-2">Safe Harbor Rule</p>
              <p className="text-sm text-zinc-300">
                You can avoid penalties if you pay at least 100% of last year&apos;s tax liability through quarterly
                estimates (110% if your income was over $150,000). Even if you end up owing more, no penalty applies.
              </p>
            </div>
          </div>
        </div>

        <h2>How to Pay Quarterly Taxes</h2>

        <p>You have several options:</p>

        <ul>
          <li><strong>IRS Direct Pay</strong> (irs.gov/payments) - Free, instant bank transfer</li>
          <li><strong>EFTPS</strong> (eftps.gov) - Free scheduled payments (requires registration)</li>
          <li><strong>Credit/Debit Card</strong> - Works but has ~2% fee</li>
          <li><strong>Mail a check</strong> - With Form 1040-ES voucher</li>
        </ul>

        <p>
          Most freelancers use IRS Direct Pay because it&apos;s instant and free. You&apos;ll select &quot;Estimated Tax&quot;
          and the quarter you&apos;re paying for.
        </p>

        <h2>Key Takeaways</h2>

        <ul>
          <li><strong>Save 25-30%</strong> of every payment for taxes</li>
          <li><strong>15.3% is self-employment tax</strong> alone—this surprises many new freelancers</li>
          <li><strong>Pay quarterly</strong> to avoid underpayment penalties</li>
          <li><strong>Use a separate tax account</strong> to make this automatic</li>
          <li><strong>Safe harbor rule</strong>: Pay 100% of last year&apos;s tax to avoid penalties</li>
        </ul>

        {/* CTA */}
        <div className="not-prose my-10 rounded-xl border border-teal-500/30 bg-teal-500/5 p-6 text-center">
          <PiggyBank className="h-8 w-8 text-teal-400 mx-auto mb-3" />
          <h3 className="text-xl font-semibold text-white mb-3">
            Know When Tax Payments Are Due
          </h3>
          <p className="text-zinc-300 mb-4">
            Cash Flow Forecaster can show your quarterly tax due dates on your calendar—so you never
            miss a payment and always know what&apos;s coming.
          </p>
          <Link
            href="/auth/signup"
            className="inline-flex items-center justify-center h-10 px-6 rounded-lg bg-teal-500 hover:bg-teal-400 text-zinc-950 font-semibold text-sm transition-colors"
          >
            Try Free for 14 Days
          </Link>
        </div>
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
            href="/blog/freelancer-emergency-fund-how-much"
            className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 hover:border-zinc-700 transition-colors group"
          >
            <p className="font-medium text-white group-hover:text-teal-300 transition-colors">
              Freelancer Emergency Fund: How Much Do You Need?
            </p>
            <p className="mt-1 text-sm text-zinc-400">Calculate the right financial buffer for irregular income.</p>
            <span className="mt-3 inline-flex items-center gap-1 text-sm text-teal-400 group-hover:gap-2 transition-all">
              Read article <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </Link>
        </div>
      </section>
    </article>
  );
}
