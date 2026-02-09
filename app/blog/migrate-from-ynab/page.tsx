import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronLeft, Upload, Check, ArrowRight, AlertCircle, Zap, RefreshCw } from 'lucide-react';
import { getPostBySlug } from '@/lib/blog/posts';

const post = getPostBySlug('migrate-from-ynab')!;

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

const howToSchema = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to Migrate from YNAB to Cash Flow Forecaster',
  description: 'Step-by-step guide to exporting your YNAB data and importing it into Cash Flow Forecaster',
  step: [
    {
      '@type': 'HowToStep',
      name: 'Export from YNAB',
      text: 'In YNAB, go to your budget and export transactions to CSV',
    },
    {
      '@type': 'HowToStep',
      name: 'Create Cash Flow Forecaster account',
      text: 'Sign up for a free Cash Flow Forecaster account',
    },
    {
      '@type': 'HowToStep',
      name: 'Use YNAB Import tool',
      text: 'Navigate to the YNAB Import page and upload your exported file',
    },
    {
      '@type': 'HowToStep',
      name: 'Review and customize',
      text: 'Review imported data, set up recurring entries, and customize your forecast',
    },
  ],
};

export default function MigrateFromYnabPage() {
  return (
    <div className="min-h-screen bg-zinc-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
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
            Thinking about switching from YNAB (You Need A Budget) to Cash Flow Forecaster?
            Whether you&apos;re frustrated with subscription costs, need better forecasting
            for irregular income, or just want something different—we&apos;ve made the
            migration process as smooth as possible.
          </p>

          <h2 className="text-2xl font-bold text-white mt-12 mb-4">
            Why People Switch from YNAB
          </h2>
          <p className="text-zinc-300">
            YNAB is a great budgeting tool, but it&apos;s not perfect for everyone. Here are
            the most common reasons people make the switch:
          </p>
          <div className="space-y-4 my-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center shrink-0">
                <span className="text-lg">💸</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Subscription Costs</h3>
                <p className="text-zinc-400">
                  YNAB costs $99/year (or $14.99/month). Over 5 years, that&apos;s nearly $500.
                  Cash Flow Forecaster offers a $99 lifetime deal—pay once, use forever.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center shrink-0">
                <span className="text-lg">📊</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Better Forecasting</h3>
                <p className="text-zinc-400">
                  YNAB focuses on envelope budgeting. Cash Flow Forecaster shows you your
                  projected balance 365 days ahead—crucial for freelancers planning for
                  lean months.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center shrink-0">
                <span className="text-lg">🎯</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Irregular Income Focus</h3>
                <p className="text-zinc-400">
                  YNAB&apos;s &quot;give every dollar a job&quot; philosophy works great for
                  steady paychecks. Cash Flow Forecaster is built specifically for variable
                  income—gig workers, freelancers, and solopreneurs.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center shrink-0">
                <span className="text-lg">💳</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Credit Card Forecasting</h3>
                <p className="text-zinc-400">
                  We project your credit utilization into the future so you can see how
                  purchases today affect your credit score timeline—something YNAB doesn&apos;t do.
                </p>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-white mt-12 mb-4">
            Step 1: Export Your Data from YNAB
          </h2>
          <p className="text-zinc-300">
            First, you&apos;ll need to export your transaction history from YNAB:
          </p>
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 my-6">
            <ol className="space-y-4 text-zinc-300">
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 bg-teal-500/20 rounded-full flex items-center justify-center text-teal-400 text-sm font-bold shrink-0">1</span>
                <span>Log into your YNAB account at <strong>app.ynab.com</strong></span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 bg-teal-500/20 rounded-full flex items-center justify-center text-teal-400 text-sm font-bold shrink-0">2</span>
                <span>Open the budget you want to export</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 bg-teal-500/20 rounded-full flex items-center justify-center text-teal-400 text-sm font-bold shrink-0">3</span>
                <span>Click on <strong>All Accounts</strong> in the left sidebar</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 bg-teal-500/20 rounded-full flex items-center justify-center text-teal-400 text-sm font-bold shrink-0">4</span>
                <span>Click <strong>Export</strong> in the top right (or use File → Export)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 bg-teal-500/20 rounded-full flex items-center justify-center text-teal-400 text-sm font-bold shrink-0">5</span>
                <span>Download the CSV file to your computer</span>
              </li>
            </ol>
          </div>
          <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-4 my-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <p className="text-sm text-zinc-400">
                <strong className="text-zinc-300">Tip:</strong> For best results, export at
                least 3-6 months of data. This helps our recurring detection work more
                accurately.
              </p>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-white mt-12 mb-4">
            Step 2: Create Your Cash Flow Forecaster Account
          </h2>
          <p className="text-zinc-300">
            If you haven&apos;t already, sign up for a free account:
          </p>
          <div className="flex gap-4 my-6">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-500 hover:bg-teal-400 text-zinc-900 font-semibold rounded-lg transition-colors"
            >
              Create Free Account
            </Link>
          </div>
          <p className="text-zinc-400 text-sm">
            Our free tier includes 30-day forecasting—enough to test the import and see
            if Cash Flow Forecaster works for you.
          </p>

          <h2 className="text-2xl font-bold text-white mt-12 mb-4">
            Step 3: Import Your YNAB Data
          </h2>
          <p className="text-zinc-300">
            We have a dedicated YNAB import tool that understands YNAB&apos;s export format:
          </p>
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 my-6">
            <ol className="space-y-4 text-zinc-300">
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 bg-teal-500/20 rounded-full flex items-center justify-center text-teal-400 text-sm font-bold shrink-0">1</span>
                <span>Go to the <Link href="/dashboard/import/ynab" className="text-teal-400 hover:underline">YNAB Import page</Link></span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 bg-teal-500/20 rounded-full flex items-center justify-center text-teal-400 text-sm font-bold shrink-0">2</span>
                <span>Drag and drop your YNAB export file (or click to browse)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 bg-teal-500/20 rounded-full flex items-center justify-center text-teal-400 text-sm font-bold shrink-0">3</span>
                <span>Review the preview—we&apos;ll auto-map YNAB columns</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 bg-teal-500/20 rounded-full flex items-center justify-center text-teal-400 text-sm font-bold shrink-0">4</span>
                <span>Click <strong>Import</strong> to add transactions to your account</span>
              </li>
            </ol>
          </div>
          <div className="bg-gradient-to-br from-teal-500/10 to-teal-600/5 border border-teal-500/20 rounded-lg p-5 my-6">
            <div className="flex items-center gap-3 mb-3">
              <Zap className="w-5 h-5 text-teal-400" />
              <span className="font-semibold text-white">Smart Import Features</span>
            </div>
            <ul className="space-y-2 text-zinc-300 text-sm">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-teal-400" />
                Auto-detects YNAB&apos;s date, payee, category, and amount columns
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-teal-400" />
                Preserves your YNAB categories (you can rename later)
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-teal-400" />
                Identifies recurring transactions automatically
              </li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold text-white mt-12 mb-4">
            Step 4: Set Up Your Accounts
          </h2>
          <p className="text-zinc-300">
            After importing, you&apos;ll want to configure your accounts:
          </p>
          <ul className="space-y-3 text-zinc-300 my-6">
            <li className="flex items-start gap-3">
              <ArrowRight className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
              <span>
                <strong>Set current balances</strong> — Enter your actual account balances
                so forecasts start from the right place
              </span>
            </li>
            <li className="flex items-start gap-3">
              <ArrowRight className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
              <span>
                <strong>Configure credit cards</strong> — Add credit limits to enable
                utilization forecasting
              </span>
            </li>
            <li className="flex items-start gap-3">
              <ArrowRight className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
              <span>
                <strong>Review recurring entries</strong> — Check the auto-detected bills
                and income are accurate
              </span>
            </li>
          </ul>

          <h2 className="text-2xl font-bold text-white mt-12 mb-4">
            Step 5: Set Up Recurring Bills & Income
          </h2>
          <p className="text-zinc-300">
            Our importer tries to detect recurring transactions, but you should review
            and adjust as needed:
          </p>
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 my-6">
            <div className="flex items-center gap-3 mb-4">
              <RefreshCw className="w-5 h-5 text-teal-400" />
              <span className="font-semibold text-white">Suggested Recurring Entries</span>
            </div>
            <p className="text-zinc-400 mb-4">
              After import, go to the <strong>Bills</strong> and <strong>Income</strong>
              sections to review what we detected. You can:
            </p>
            <ul className="space-y-2 text-zinc-300">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-teal-400" />
                Approve suggested recurring entries
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-teal-400" />
                Adjust amounts or frequencies
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-teal-400" />
                Add new recurring items we didn&apos;t catch
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-teal-400" />
                Delete items that are no longer relevant
              </li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold text-white mt-12 mb-4">
            What Transfers vs. What Doesn&apos;t
          </h2>
          <p className="text-zinc-300">
            Here&apos;s what you can expect from your YNAB migration:
          </p>
          <div className="grid sm:grid-cols-2 gap-4 my-6">
            <div className="bg-zinc-900 border border-teal-500/30 rounded-lg p-5">
              <h3 className="font-semibold text-teal-400 mb-3 flex items-center gap-2">
                <Check className="w-5 h-5" />
                What Transfers
              </h3>
              <ul className="space-y-2 text-zinc-300 text-sm">
                <li>• Transaction history</li>
                <li>• Payee/merchant names</li>
                <li>• Categories (as tags)</li>
                <li>• Amounts and dates</li>
                <li>• Account names</li>
                <li>• Memos/notes</li>
              </ul>
            </div>
            <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-5">
              <h3 className="font-semibold text-zinc-400 mb-3">What Doesn&apos;t Transfer</h3>
              <ul className="space-y-2 text-zinc-400 text-sm">
                <li>• Category targets/goals</li>
                <li>• Scheduled transactions (recreate manually)</li>
                <li>• Budget allocations</li>
                <li>• Age of money metrics</li>
              </ul>
              <p className="text-xs text-zinc-500 mt-3">
                These features work differently in Cash Flow Forecaster, so they need
                to be set up fresh.
              </p>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-white mt-12 mb-4">
            YNAB vs. Cash Flow Forecaster: Key Differences
          </h2>
          <p className="text-zinc-300">
            The two tools have different philosophies. Here&apos;s what to expect:
          </p>
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
                  <td className="py-3 px-4">Approach</td>
                  <td className="py-3 px-4">Envelope budgeting</td>
                  <td className="py-3 px-4 text-teal-400">Cash flow forecasting</td>
                </tr>
                <tr className="border-b border-zinc-800">
                  <td className="py-3 px-4">Best for</td>
                  <td className="py-3 px-4">Steady paychecks</td>
                  <td className="py-3 px-4 text-teal-400">Irregular income</td>
                </tr>
                <tr className="border-b border-zinc-800">
                  <td className="py-3 px-4">Future visibility</td>
                  <td className="py-3 px-4">Current month</td>
                  <td className="py-3 px-4 text-teal-400">365 days ahead</td>
                </tr>
                <tr className="border-b border-zinc-800">
                  <td className="py-3 px-4">Credit card tracking</td>
                  <td className="py-3 px-4">Balance only</td>
                  <td className="py-3 px-4 text-teal-400">Utilization forecast</td>
                </tr>
                <tr className="border-b border-zinc-800">
                  <td className="py-3 px-4">Pricing</td>
                  <td className="py-3 px-4">$99/year subscription</td>
                  <td className="py-3 px-4 text-teal-400">$99 lifetime (one-time)</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-zinc-400 text-sm">
            <Link href="/compare/ynab" className="text-teal-400 hover:underline">
              See our detailed YNAB comparison →
            </Link>
          </p>

          <h2 className="text-2xl font-bold text-white mt-12 mb-4">
            Need Help?
          </h2>
          <p className="text-zinc-300">
            If you run into any issues during migration, we&apos;re here to help:
          </p>
          <ul className="space-y-3 text-zinc-300 my-6">
            <li className="flex items-start gap-3">
              <ArrowRight className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
              <span>
                Check our <Link href="/blog/import-bank-transactions-excel" className="text-teal-400 hover:underline">import guide</Link> for
                troubleshooting common issues
              </span>
            </li>
            <li className="flex items-start gap-3">
              <ArrowRight className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
              <span>
                Email us at support@cashflowforecaster.io—we typically respond within 24 hours
              </span>
            </li>
          </ul>

          {/* CTA */}
          <div className="bg-gradient-to-br from-teal-500/10 to-teal-600/5 border border-teal-500/20 rounded-xl p-8 my-12 text-center">
            <h3 className="text-2xl font-bold text-white mb-3">
              Ready to Make the Switch?
            </h3>
            <p className="text-zinc-400 mb-6 max-w-xl mx-auto">
              Export your YNAB data and start forecasting in minutes. Try free for 30 days,
              or get lifetime access for one payment.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/dashboard/import/ynab"
                className="inline-flex items-center gap-2 px-6 py-3 bg-teal-500 hover:bg-teal-400 text-zinc-900 font-semibold rounded-lg transition-colors"
              >
                <Upload className="w-5 h-5" />
                Import from YNAB
              </Link>
              <Link
                href="/compare/ynab"
                className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold rounded-lg transition-colors"
              >
                Compare Features
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
