import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { breadcrumbs } from '@/components/seo/schemas';
import { getPostBySlug } from '@/lib/blog/posts';
import {
  FileText,
  FolderOpen,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Receipt,
  Wallet,
} from 'lucide-react';

const post = getPostBySlug('how-to-track-freelance-income-expenses')!;

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
  name: 'How to Track Freelance Income and Expenses',
  description: 'A simple system for tracking freelance income and expenses for tax purposes and financial planning.',
  step: [
    {
      '@type': 'HowToStep',
      name: 'Set up a dedicated business account',
      text: 'Open a separate bank account for all freelance income and expenses to keep business and personal finances separate.',
    },
    {
      '@type': 'HowToStep',
      name: 'Create a simple tracking system',
      text: 'Use a spreadsheet or app to log income when received and expenses when paid. Include date, amount, client/vendor, and category.',
    },
    {
      '@type': 'HowToStep',
      name: 'Track income weekly',
      text: 'Every week, record any payments received with the client name, invoice number, and amount.',
    },
    {
      '@type': 'HowToStep',
      name: 'Categorize expenses for taxes',
      text: 'Use IRS-friendly categories like software, equipment, home office, travel, and professional development.',
    },
    {
      '@type': 'HowToStep',
      name: 'Save receipts digitally',
      text: 'Take photos of receipts immediately and store in cloud folders organized by month or category.',
    },
  ],
};

export default function TrackFreelanceIncomeExpensesPage() {
  return (
    <article className="mx-auto max-w-3xl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />

      <Breadcrumbs
        items={[
          breadcrumbs.home,
          breadcrumbs.blog,
          { name: 'Track Income & Expenses', url: `https://www.cashflowforecaster.io/blog/${post.slug}` },
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
          Tracking freelance income and expenses sounds boring. It is boring. But it&apos;s also the difference between
          owing thousands in surprise taxes and knowing exactly where your money goes.
        </p>

        <p>
          The good news: you don&apos;t need fancy software or an accounting degree. You need a simple system you&apos;ll
          actually use.
        </p>

        <h2>The Minimum Viable Tracking System</h2>

        <p>
          Here&apos;s what you actually need to track—nothing more, nothing less:
        </p>

        <div className="not-prose my-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
            <Wallet className="h-5 w-5 text-green-400 mb-3" />
            <h3 className="font-semibold text-white mb-2">Income</h3>
            <ul className="text-sm text-zinc-400 space-y-1">
              <li>• Date received</li>
              <li>• Client name</li>
              <li>• Amount</li>
              <li>• Invoice number (optional)</li>
            </ul>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
            <Receipt className="h-5 w-5 text-red-400 mb-3" />
            <h3 className="font-semibold text-white mb-2">Expenses</h3>
            <ul className="text-sm text-zinc-400 space-y-1">
              <li>• Date paid</li>
              <li>• Vendor/description</li>
              <li>• Amount</li>
              <li>• Category (for taxes)</li>
            </ul>
          </div>
        </div>

        <h2>Step 1: Separate Your Business Finances</h2>

        <p>
          The single most important thing you can do: <strong>open a separate bank account for freelance income</strong>.
        </p>

        <p>
          This doesn&apos;t have to be a formal &quot;business account.&quot; A free personal checking account works fine.
          The point is keeping freelance money separate from personal money.
        </p>

        <div className="not-prose my-8 rounded-xl border border-teal-500/30 bg-teal-500/5 p-5">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-teal-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-white mb-2">Why This Matters</p>
              <p className="text-sm text-zinc-300">
                With separate accounts, your bank statement becomes your income record. Every deposit is income.
                Every withdrawal is either an expense or a transfer to personal. No more sorting through mixed transactions.
              </p>
            </div>
          </div>
        </div>

        <h2>Step 2: Choose Your Tracking Tool</h2>

        <p>You have three options, in order of simplicity:</p>

        <h3>Option A: Spreadsheet (Free, Simple)</h3>

        <p>
          A basic Google Sheet or Excel file with two tabs: Income and Expenses. That&apos;s it.
        </p>

        <p>
          <strong>Best for:</strong> Freelancers with fewer than 20 transactions per month
        </p>

        <h3>Option B: Accounting Software (More Features)</h3>

        <p>
          Tools like Wave (free), QuickBooks Self-Employed ($15/mo), or FreshBooks ($17/mo) add invoicing, bank sync,
          and tax reports.
        </p>

        <p>
          <strong>Best for:</strong> Freelancers who send lots of invoices or want automated categorization
        </p>

        <h3>Option C: Combination Approach (Recommended)</h3>

        <p>
          Use <strong>two simple tools</strong>: one for forward-looking cash flow, one for tax records.
        </p>

        <ul>
          <li>Cash Flow Forecaster for planning (when will money come in/go out)</li>
          <li>Spreadsheet or Wave for tax categorization (where did money go)</li>
        </ul>

        <h2>Step 3: Track Income Weekly</h2>

        <p>
          Pick a day—Friday works well—and spend 5 minutes logging any payments received that week.
        </p>

        <div className="not-prose my-8 rounded-xl border border-zinc-800 bg-zinc-900/60 overflow-hidden">
          <div className="px-5 py-4 border-b border-zinc-800 bg-zinc-900/80">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <FileText className="h-5 w-5 text-teal-400" />
              Sample Income Log
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="text-left p-4 font-medium text-zinc-400">Date</th>
                  <th className="text-left p-4 font-medium text-zinc-400">Client</th>
                  <th className="text-left p-4 font-medium text-zinc-400">Description</th>
                  <th className="text-right p-4 font-medium text-zinc-400">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                <tr>
                  <td className="p-4 text-zinc-300">Jan 15</td>
                  <td className="p-4 text-white">Acme Corp</td>
                  <td className="p-4 text-zinc-400">January retainer</td>
                  <td className="p-4 text-green-400 text-right">$3,000</td>
                </tr>
                <tr>
                  <td className="p-4 text-zinc-300">Jan 18</td>
                  <td className="p-4 text-white">StartupXYZ</td>
                  <td className="p-4 text-zinc-400">Website redesign</td>
                  <td className="p-4 text-green-400 text-right">$5,500</td>
                </tr>
                <tr>
                  <td className="p-4 text-zinc-300">Jan 22</td>
                  <td className="p-4 text-white">Smith LLC</td>
                  <td className="p-4 text-zinc-400">Consulting - 4 hrs</td>
                  <td className="p-4 text-green-400 text-right">$600</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <h2>Step 4: Categorize Expenses for Taxes</h2>

        <p>
          The IRS cares about expense <em>categories</em>, not individual transactions. Use these standard categories:
        </p>

        <div className="not-prose my-8">
          <div className="grid gap-3">
            {[
              { category: 'Software & Subscriptions', examples: 'Adobe, Figma, hosting, domains' },
              { category: 'Equipment', examples: 'Computer, monitor, keyboard, phone' },
              { category: 'Home Office', examples: 'Portion of rent/mortgage, utilities, internet' },
              { category: 'Professional Development', examples: 'Courses, books, conferences' },
              { category: 'Travel', examples: 'Flights, hotels, meals for business trips' },
              { category: 'Marketing', examples: 'Ads, website costs, business cards' },
              { category: 'Professional Services', examples: 'Accountant, lawyer, contractors' },
              { category: 'Office Supplies', examples: 'Notebooks, pens, printer ink' },
            ].map((item) => (
              <div key={item.category} className="flex items-start gap-3 rounded-lg border border-zinc-800 bg-zinc-900/40 p-4">
                <FolderOpen className="h-5 w-5 text-teal-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-white">{item.category}</p>
                  <p className="text-sm text-zinc-400">{item.examples}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <h2>Step 5: Save Receipts (The Easy Way)</h2>

        <p>
          You don&apos;t need to keep paper receipts. The IRS accepts digital copies. Here&apos;s the simplest system:
        </p>

        <ol>
          <li>Take a photo of the receipt immediately after purchase</li>
          <li>Save to a cloud folder (Google Drive, Dropbox, iCloud)</li>
          <li>Organize by month OR by category—pick one and stick with it</li>
        </ol>

        <div className="not-prose my-8 rounded-xl border border-amber-500/30 bg-amber-500/5 p-5">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-amber-300 mb-2">Keep Receipts for 7 Years</p>
              <p className="text-sm text-zinc-300">
                The IRS can audit up to 6 years back in some cases. Keep all receipts for at least 7 years.
                Digital storage is cheap—don&apos;t delete old records.
              </p>
            </div>
          </div>
        </div>

        <h2>How Often to Update Your Records</h2>

        <div className="not-prose my-8 rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Calendar className="h-5 w-5 text-teal-400 flex-shrink-0" />
              <div>
                <p className="font-medium text-white">Weekly (5 minutes)</p>
                <p className="text-sm text-zinc-400">Log income received, note any large expenses</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Calendar className="h-5 w-5 text-teal-400 flex-shrink-0" />
              <div>
                <p className="font-medium text-white">Monthly (30 minutes)</p>
                <p className="text-sm text-zinc-400">Categorize all expenses, reconcile with bank statement</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Calendar className="h-5 w-5 text-teal-400 flex-shrink-0" />
              <div>
                <p className="font-medium text-white">Quarterly (1 hour)</p>
                <p className="text-sm text-zinc-400">Calculate estimated taxes, review profit margins</p>
              </div>
            </div>
          </div>
        </div>

        <h2>Key Takeaways</h2>

        <ul>
          <li><strong>Separate accounts</strong> make everything easier—your bank statement becomes your record</li>
          <li><strong>Simple beats complex</strong>—a spreadsheet you use beats software you don&apos;t</li>
          <li><strong>Weekly habit</strong> of 5 minutes prevents year-end scrambles</li>
          <li><strong>Categorize for taxes</strong>, not for perfection—use standard IRS categories</li>
          <li><strong>Digital receipts</strong> are fine—just keep them for 7 years</li>
        </ul>

        {/* CTA */}
        <div className="not-prose my-10 rounded-xl border border-teal-500/30 bg-teal-500/5 p-6 text-center">
          <h3 className="text-xl font-semibold text-white mb-3">
            Track Income Timing, Not Just Amounts
          </h3>
          <p className="text-zinc-300 mb-4">
            Cash Flow Forecaster helps you see when payments will arrive and when bills are due—so you never
            get caught short between invoices.
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
            href="/blog/quarterly-tax-savings-1099-contractors"
            className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 hover:border-zinc-700 transition-colors group"
          >
            <p className="font-medium text-white group-hover:text-teal-300 transition-colors">
              Quarterly Tax Savings for 1099 Contractors
            </p>
            <p className="mt-1 text-sm text-zinc-400">How much to set aside for estimated taxes.</p>
            <span className="mt-3 inline-flex items-center gap-1 text-sm text-teal-400 group-hover:gap-2 transition-all">
              Read article <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </Link>
          <Link
            href="/blog/best-cash-flow-apps-freelancers-2026"
            className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 hover:border-zinc-700 transition-colors group"
          >
            <p className="font-medium text-white group-hover:text-teal-300 transition-colors">
              Best Cash Flow Apps for Freelancers
            </p>
            <p className="mt-1 text-sm text-zinc-400">Compare the top tools for managing freelance finances.</p>
            <span className="mt-3 inline-flex items-center gap-1 text-sm text-teal-400 group-hover:gap-2 transition-all">
              Read article <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </Link>
        </div>
      </section>
    </article>
  );
}
