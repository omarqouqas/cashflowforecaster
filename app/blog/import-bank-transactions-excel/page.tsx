import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronLeft, Upload, FileSpreadsheet, Check, ArrowRight, RefreshCw, Zap, AlertCircle } from 'lucide-react';
import { getPostBySlug } from '@/lib/blog/posts';

const post = getPostBySlug('import-bank-transactions-excel')!;

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
  name: 'How to Import Bank Transactions from Excel or CSV',
  description: 'Step-by-step guide to importing your bank transactions into Cash Flow Forecaster',
  step: [
    {
      '@type': 'HowToStep',
      name: 'Export from your bank',
      text: 'Log into your bank and download transactions as Excel (.xlsx) or CSV file',
    },
    {
      '@type': 'HowToStep',
      name: 'Upload to Cash Flow Forecaster',
      text: 'Click Import and select your downloaded file',
    },
    {
      '@type': 'HowToStep',
      name: 'Map columns',
      text: 'Match your file columns to date, description, and amount fields',
    },
    {
      '@type': 'HowToStep',
      name: 'Review and confirm',
      text: 'Check the preview and import your transactions',
    },
  ],
};

export default function ImportBankTransactionsExcelPage() {
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
            If you&apos;ve been tracking your finances in a spreadsheet or just downloaded your bank
            statement, you don&apos;t have to re-enter everything manually. Cash Flow Forecaster
            supports importing transactions directly from Excel (.xlsx, .xls) and CSV files—and
            can even auto-detect recurring bills and income to save you hours of setup time.
          </p>

          <h2 className="text-2xl font-bold text-white mt-12 mb-4">
            What File Formats Are Supported?
          </h2>
          <p className="text-zinc-300">
            We support the most common formats you&apos;ll encounter:
          </p>
          <div className="grid sm:grid-cols-2 gap-4 my-6">
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <FileSpreadsheet className="w-5 h-5 text-green-500" />
                <span className="font-semibold text-white">Excel Files</span>
              </div>
              <ul className="text-sm text-zinc-400 space-y-1">
                <li>• .xlsx (Excel 2007+)</li>
                <li>• .xls (Legacy Excel)</li>
              </ul>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <FileSpreadsheet className="w-5 h-5 text-blue-500" />
                <span className="font-semibold text-white">CSV Files</span>
              </div>
              <ul className="text-sm text-zinc-400 space-y-1">
                <li>• Standard CSV (comma-separated)</li>
                <li>• Bank exports from most institutions</li>
              </ul>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-white mt-12 mb-4">
            Step-by-Step Import Guide
          </h2>

          <div className="space-y-6 my-8">
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-teal-500/20 rounded-full flex items-center justify-center text-teal-400 font-bold shrink-0">
                  1
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Export from Your Bank</h3>
                  <p className="text-zinc-400">
                    Log into your bank&apos;s website and look for &quot;Download Transactions&quot; or
                    &quot;Export.&quot; Most banks offer CSV or Excel download options. Select a date range
                    that covers at least 3 months for best recurring detection.
                  </p>
                  <div className="mt-4 p-3 bg-zinc-800/50 rounded-lg border border-zinc-700">
                    <p className="text-sm text-zinc-400">
                      <strong className="text-zinc-300">Tip:</strong> Chase, Bank of America, Wells Fargo,
                      and most credit unions support CSV export. Look under &quot;Account Activity&quot; or
                      &quot;Statements.&quot;
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-teal-500/20 rounded-full flex items-center justify-center text-teal-400 font-bold shrink-0">
                  2
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Upload Your File</h3>
                  <p className="text-zinc-400">
                    In Cash Flow Forecaster, click the <strong>Import</strong> button in the top
                    navigation. Drag and drop your file or click to browse. We&apos;ll automatically
                    detect the file type and parse it.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-teal-500/20 rounded-full flex items-center justify-center text-teal-400 font-bold shrink-0">
                  3
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Map Your Columns</h3>
                  <p className="text-zinc-400">
                    Our smart importer tries to auto-detect your columns, but you can adjust the
                    mapping if needed. The required fields are:
                  </p>
                  <ul className="mt-3 space-y-2 text-zinc-400">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-teal-400" />
                      <strong className="text-zinc-300">Date</strong> — When the transaction occurred
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-teal-400" />
                      <strong className="text-zinc-300">Description</strong> — Merchant or payee name
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-teal-400" />
                      <strong className="text-zinc-300">Amount</strong> — Transaction amount (we auto-detect
                      positive/negative)
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
                  <h3 className="text-lg font-semibold text-white mb-2">Review & Import</h3>
                  <p className="text-zinc-400">
                    Preview your transactions before importing. You can deselect any transactions
                    you don&apos;t want to include. Click <strong>Import</strong> to add them to your
                    forecast.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-white mt-12 mb-4">
            Auto-Detecting Recurring Transactions
          </h2>
          <p className="text-zinc-300">
            Here&apos;s where Cash Flow Forecaster really shines. When you import transactions,
            our smart detection algorithm analyzes patterns to find recurring bills and income:
          </p>
          <div className="bg-gradient-to-br from-teal-500/10 to-teal-600/5 border border-teal-500/20 rounded-lg p-6 my-6">
            <div className="flex items-center gap-3 mb-4">
              <RefreshCw className="w-6 h-6 text-teal-400" />
              <span className="font-semibold text-white text-lg">Smart Recurring Detection</span>
            </div>
            <ul className="space-y-3 text-zinc-300">
              <li className="flex items-start gap-3">
                <Zap className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Monthly bills</strong> like rent, subscriptions, and utilities are
                  identified automatically
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Zap className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Bi-weekly or weekly</strong> patterns are detected for paychecks and
                  regular expenses
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Zap className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                <span>
                  <strong>You stay in control</strong>—review suggested recurring entries before
                  they&apos;re created
                </span>
              </li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold text-white mt-12 mb-4">
            Handling Common Import Issues
          </h2>
          <div className="space-y-4 my-6">
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <AlertCircle className="w-5 h-5 text-amber-400" />
                <span className="font-semibold text-white">Dates in Wrong Format</span>
              </div>
              <p className="text-sm text-zinc-400">
                If your bank uses a non-standard date format (like DD/MM/YYYY), you can select the
                correct format in the column mapping step. We support US, European, and ISO date
                formats.
              </p>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <AlertCircle className="w-5 h-5 text-amber-400" />
                <span className="font-semibold text-white">Amount Shows as Positive/Negative</span>
              </div>
              <p className="text-sm text-zinc-400">
                Some banks show all amounts as positive with a separate &quot;Type&quot; column. You can
                use the &quot;Invert amounts&quot; option or map a Type column to indicate credits vs debits.
              </p>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <AlertCircle className="w-5 h-5 text-amber-400" />
                <span className="font-semibold text-white">Multiple Accounts in One File</span>
              </div>
              <p className="text-sm text-zinc-400">
                If your export includes transactions from multiple accounts, import them separately
                or use the account filter if your file has an account column.
              </p>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-white mt-12 mb-4">
            Tips for Best Results
          </h2>
          <ul className="space-y-3 text-zinc-300 my-6">
            <li className="flex items-start gap-3">
              <ArrowRight className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
              <span>
                <strong>Import at least 3 months</strong> of data for accurate recurring detection
              </span>
            </li>
            <li className="flex items-start gap-3">
              <ArrowRight className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
              <span>
                <strong>Use separate files</strong> for checking, savings, and credit card accounts
              </span>
            </li>
            <li className="flex items-start gap-3">
              <ArrowRight className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
              <span>
                <strong>Review recurring suggestions</strong> carefully—you can always edit or
                delete them later
              </span>
            </li>
            <li className="flex items-start gap-3">
              <ArrowRight className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
              <span>
                <strong>Check your starting balance</strong> after import to ensure accuracy
              </span>
            </li>
          </ul>

          <h2 className="text-2xl font-bold text-white mt-12 mb-4">
            Coming from Another App?
          </h2>
          <p className="text-zinc-300">
            If you&apos;re migrating from YNAB, Mint, or another budgeting app, check out our
            dedicated migration guides:
          </p>
          <div className="flex flex-wrap gap-3 my-6">
            <Link
              href="/blog/migrate-from-ynab"
              className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg text-white transition-colors"
            >
              <ArrowRight className="w-4 h-4" />
              Migrate from YNAB
            </Link>
            <Link
              href="/dashboard/import/ynab"
              className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg text-white transition-colors"
            >
              <Upload className="w-4 h-4" />
              YNAB Import Tool
            </Link>
          </div>

          {/* CTA */}
          <div className="bg-gradient-to-br from-teal-500/10 to-teal-600/5 border border-teal-500/20 rounded-xl p-8 my-12 text-center">
            <h3 className="text-2xl font-bold text-white mb-3">
              Ready to Import Your Transactions?
            </h3>
            <p className="text-zinc-400 mb-6 max-w-xl mx-auto">
              Get started for free. Upload your bank export and see your cash flow forecast
              in minutes—no credit card required.
            </p>
            <Link
              href="/auth/signup"
              className="inline-flex items-center gap-2 px-6 py-3 bg-teal-500 hover:bg-teal-400 text-zinc-900 font-semibold rounded-lg transition-colors"
            >
              <Upload className="w-5 h-5" />
              Start Free Import
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
