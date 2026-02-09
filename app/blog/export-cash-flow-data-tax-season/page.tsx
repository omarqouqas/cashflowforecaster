import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronLeft, Download, FileSpreadsheet, Calendar, Check, ArrowRight, Calculator, AlertCircle } from 'lucide-react';
import { getPostBySlug } from '@/lib/blog/posts';

const post = getPostBySlug('export-cash-flow-data-tax-season')!;

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
  name: 'How to Export Cash Flow Data for Tax Season',
  description: 'Export your income, expenses, and financial reports for tax preparation',
  step: [
    {
      '@type': 'HowToStep',
      name: 'Go to Reports',
      text: 'Navigate to the Reports section in Cash Flow Forecaster',
    },
    {
      '@type': 'HowToStep',
      name: 'Select date range',
      text: 'Choose the tax year or quarter you need to export',
    },
    {
      '@type': 'HowToStep',
      name: 'Choose export format',
      text: 'Select Excel, CSV, or JSON based on your needs',
    },
    {
      '@type': 'HowToStep',
      name: 'Download and review',
      text: 'Download the file and review for accuracy before sending to your accountant',
    },
  ],
};

export default function ExportCashFlowDataTaxSeasonPage() {
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
            Tax season doesn&apos;t have to be stressful—especially if you&apos;ve been tracking
            your income and expenses in Cash Flow Forecaster. With our export features, you can
            generate clean reports that make your accountant&apos;s job easier (and potentially
            save you money on preparation fees).
          </p>

          <h2 className="text-2xl font-bold text-white mt-12 mb-4">
            What Data Can You Export?
          </h2>
          <p className="text-zinc-300">
            Cash Flow Forecaster Pro lets you export comprehensive financial data:
          </p>
          <div className="grid sm:grid-cols-2 gap-4 my-6">
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <Check className="w-5 h-5 text-teal-400" />
                <span className="font-semibold text-white">Income Summary</span>
              </div>
              <p className="text-sm text-zinc-400">
                All income entries by category, source, and date—perfect for 1099 reporting
              </p>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <Check className="w-5 h-5 text-teal-400" />
                <span className="font-semibold text-white">Expense Breakdown</span>
              </div>
              <p className="text-sm text-zinc-400">
                Expenses grouped by category for easy deduction tracking
              </p>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <Check className="w-5 h-5 text-teal-400" />
                <span className="font-semibold text-white">Transaction History</span>
              </div>
              <p className="text-sm text-zinc-400">
                Complete list of all transactions with dates, descriptions, and amounts
              </p>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <Check className="w-5 h-5 text-teal-400" />
                <span className="font-semibold text-white">Category Reports</span>
              </div>
              <p className="text-sm text-zinc-400">
                Spending by category to identify potential business deductions
              </p>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-white mt-12 mb-4">
            Export Formats Explained
          </h2>
          <p className="text-zinc-300">
            Choose the format that works best for your situation:
          </p>
          <div className="space-y-4 my-6">
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5">
              <div className="flex items-center gap-3 mb-2">
                <FileSpreadsheet className="w-5 h-5 text-green-500" />
                <span className="font-semibold text-white">Excel (.xlsx)</span>
                <span className="text-xs px-2 py-0.5 bg-teal-500/20 text-teal-400 rounded">Recommended</span>
              </div>
              <p className="text-zinc-400 mb-3">
                Best for sharing with accountants and doing additional analysis. Includes multiple
                sheets for income, expenses, and summaries.
              </p>
              <ul className="text-sm text-zinc-400 space-y-1">
                <li>• Opens directly in Excel, Google Sheets, or Numbers</li>
                <li>• Includes formatted headers and totals</li>
                <li>• Easy to filter and sort</li>
              </ul>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5">
              <div className="flex items-center gap-3 mb-2">
                <FileSpreadsheet className="w-5 h-5 text-blue-500" />
                <span className="font-semibold text-white">CSV (.csv)</span>
              </div>
              <p className="text-zinc-400 mb-3">
                Universal format that works with any spreadsheet software or accounting tool.
              </p>
              <ul className="text-sm text-zinc-400 space-y-1">
                <li>• Compatible with QuickBooks, FreshBooks, Wave</li>
                <li>• Plain text, no special software needed</li>
                <li>• Good for importing into other systems</li>
              </ul>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5">
              <div className="flex items-center gap-3 mb-2">
                <FileSpreadsheet className="w-5 h-5 text-purple-500" />
                <span className="font-semibold text-white">JSON</span>
              </div>
              <p className="text-zinc-400 mb-3">
                For developers or advanced users who need structured data.
              </p>
              <ul className="text-sm text-zinc-400 space-y-1">
                <li>• Machine-readable format</li>
                <li>• Useful for custom scripts or integrations</li>
                <li>• Preserves all data relationships</li>
              </ul>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-white mt-12 mb-4">
            Step-by-Step: Exporting for Tax Season
          </h2>
          <div className="space-y-6 my-8">
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-teal-500/20 rounded-full flex items-center justify-center text-teal-400 font-bold shrink-0">
                  1
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Navigate to Reports</h3>
                  <p className="text-zinc-400">
                    Click on <strong>Reports</strong> in the main navigation. You&apos;ll see options
                    for different report types.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-teal-500/20 rounded-full flex items-center justify-center text-teal-400 font-bold shrink-0">
                  2
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Select Your Date Range</h3>
                  <p className="text-zinc-400">
                    For annual taxes, select the full tax year (January 1 – December 31). For
                    quarterly estimated taxes, select the relevant quarter.
                  </p>
                  <div className="mt-4 p-3 bg-zinc-800/50 rounded-lg border border-zinc-700">
                    <p className="text-sm text-zinc-400">
                      <strong className="text-zinc-300">2026 Quarterly Dates:</strong>
                    </p>
                    <ul className="text-sm text-zinc-400 mt-2 space-y-1">
                      <li>• Q1: Jan 1 – Mar 31 (due April 15)</li>
                      <li>• Q2: Apr 1 – Jun 30 (due June 15)</li>
                      <li>• Q3: Jul 1 – Sep 30 (due September 15)</li>
                      <li>• Q4: Oct 1 – Dec 31 (due January 15)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-teal-500/20 rounded-full flex items-center justify-center text-teal-400 font-bold shrink-0">
                  3
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Choose Report Type</h3>
                  <p className="text-zinc-400">
                    Select the type of report you need:
                  </p>
                  <ul className="mt-3 space-y-2 text-zinc-400">
                    <li className="flex items-center gap-2">
                      <ArrowRight className="w-4 h-4 text-teal-400" />
                      <strong className="text-zinc-300">Income Report</strong> — For 1099 and
                      revenue documentation
                    </li>
                    <li className="flex items-center gap-2">
                      <ArrowRight className="w-4 h-4 text-teal-400" />
                      <strong className="text-zinc-300">Expense Report</strong> — For deduction
                      tracking and categorization
                    </li>
                    <li className="flex items-center gap-2">
                      <ArrowRight className="w-4 h-4 text-teal-400" />
                      <strong className="text-zinc-300">Full Transaction Log</strong> — Complete
                      record of all activity
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-teal-500/20 rounded-full flex items-center justify-center text-teal-400 font-bold shrink-0">
                  4
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Export & Review</h3>
                  <p className="text-zinc-400">
                    Click the export button and choose your format. Open the file to verify
                    the data looks correct before sharing with your accountant.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-white mt-12 mb-4">
            Tips for 1099 Contractors
          </h2>
          <p className="text-zinc-300">
            As a freelancer or independent contractor, you have specific tax reporting needs.
            Here&apos;s how to make the most of your exports:
          </p>
          <div className="space-y-4 my-6">
            <div className="flex items-start gap-4">
              <Calculator className="w-6 h-6 text-teal-400 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">
                  Track Income by Client
                </h3>
                <p className="text-zinc-400">
                  Use descriptive names for income entries (e.g., &quot;Acme Corp - Web Design&quot;).
                  When you export, you&apos;ll have a clear breakdown of income by source to
                  match against your 1099s.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Calculator className="w-6 h-6 text-teal-400 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">
                  Categorize Business Expenses
                </h3>
                <p className="text-zinc-400">
                  Create categories that match IRS Schedule C lines: Office Expenses, Software
                  & Subscriptions, Professional Services, etc. This makes deduction reporting
                  much easier.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Calculator className="w-6 h-6 text-teal-400 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">
                  Export Quarterly for Estimated Taxes
                </h3>
                <p className="text-zinc-400">
                  Run quarterly exports to calculate your estimated tax payments. Most freelancers
                  should set aside 25-30% of net income for federal and state taxes.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-5 my-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-amber-400 mb-1">Not Tax Advice</h3>
                <p className="text-zinc-400 text-sm">
                  This guide is for informational purposes only. We recommend consulting with
                  a qualified tax professional for advice specific to your situation. Tax laws
                  vary by jurisdiction and change frequently.
                </p>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-white mt-12 mb-4">
            What to Send Your Accountant
          </h2>
          <p className="text-zinc-300">
            When it&apos;s time to file, here&apos;s a checklist of exports that will make
            your accountant&apos;s job easier:
          </p>
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 my-6">
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-zinc-300">
                <Check className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Annual Income Summary</strong> — Excel export showing all income
                  by category and source
                </span>
              </li>
              <li className="flex items-start gap-3 text-zinc-300">
                <Check className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Annual Expense Summary</strong> — Excel export of all expenses
                  grouped by category
                </span>
              </li>
              <li className="flex items-start gap-3 text-zinc-300">
                <Check className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Transaction Detail</strong> (optional) — Full transaction log if
                  your accountant needs line-item detail
                </span>
              </li>
              <li className="flex items-start gap-3 text-zinc-300">
                <Check className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                <span>
                  <strong>1099 Forms</strong> — Copies of all 1099s received from clients
                  (not from Cash Flow Forecaster)
                </span>
              </li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold text-white mt-12 mb-4">
            Year-Round Best Practices
          </h2>
          <p className="text-zinc-300">
            The easiest tax season is one you&apos;ve prepared for all year:
          </p>
          <ul className="space-y-3 text-zinc-300 my-6">
            <li className="flex items-start gap-3">
              <ArrowRight className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
              <span>
                <strong>Categorize as you go</strong> — Don&apos;t wait until tax time to
                organize your transactions
              </span>
            </li>
            <li className="flex items-start gap-3">
              <ArrowRight className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
              <span>
                <strong>Export quarterly</strong> — Run exports at the end of each quarter
                for estimated tax calculations
              </span>
            </li>
            <li className="flex items-start gap-3">
              <ArrowRight className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
              <span>
                <strong>Keep personal and business separate</strong> — Use separate accounts
                in Cash Flow Forecaster for cleaner reporting
              </span>
            </li>
            <li className="flex items-start gap-3">
              <ArrowRight className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
              <span>
                <strong>Save your exports</strong> — Keep copies of exported files for your
                records (IRS recommends keeping records for 7 years)
              </span>
            </li>
          </ul>

          {/* CTA */}
          <div className="bg-gradient-to-br from-teal-500/10 to-teal-600/5 border border-teal-500/20 rounded-xl p-8 my-12 text-center">
            <h3 className="text-2xl font-bold text-white mb-3">
              Ready to Simplify Tax Season?
            </h3>
            <p className="text-zinc-400 mb-6 max-w-xl mx-auto">
              Start tracking your income and expenses now. When tax time comes, export
              everything you need in a few clicks.
            </p>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-6 py-3 bg-teal-500 hover:bg-teal-400 text-zinc-900 font-semibold rounded-lg transition-colors"
            >
              <Download className="w-5 h-5" />
              Start Free — Export Later
            </Link>
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
