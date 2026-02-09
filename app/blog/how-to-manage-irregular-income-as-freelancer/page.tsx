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
  PiggyBank,
  TrendingUp,
  Shield,
} from 'lucide-react';

const post = getPostBySlug('how-to-manage-irregular-income-as-freelancer')!;

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

const howToSchema = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to Manage Irregular Income as a Freelancer',
  description: 'A step-by-step guide to managing variable income when you\'re self-employed.',
  step: [
    {
      '@type': 'HowToStep',
      position: 1,
      name: 'Calculate your baseline expenses',
      text: 'Add up all fixed monthly costs like rent, utilities, insurance, and subscriptions to know your minimum monthly need.',
    },
    {
      '@type': 'HowToStep',
      position: 2,
      name: 'Build a buffer fund',
      text: 'Save 2-3 months of baseline expenses in an accessible account to smooth out income fluctuations.',
    },
    {
      '@type': 'HowToStep',
      position: 3,
      name: 'Use a cash flow calendar',
      text: 'Map income and expenses to specific dates to see your projected balance day-by-day instead of monthly totals.',
    },
    {
      '@type': 'HowToStep',
      position: 4,
      name: 'Pay yourself a salary',
      text: 'Transfer a consistent amount from your business account to personal account on a regular schedule.',
    },
    {
      '@type': 'HowToStep',
      position: 5,
      name: 'Set aside taxes immediately',
      text: 'Move 25-30% of each payment to a separate tax account to avoid quarterly tax surprises.',
    },
  ],
};

export default function IrregularIncomeGuidePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />

      <article className="mx-auto max-w-3xl">
        <Breadcrumbs
          items={[
            breadcrumbs.home,
            breadcrumbs.blog,
            { name: 'Irregular Income Guide', url: `https://www.cashflowforecaster.io/blog/${post.slug}` },
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

        {/* Table of contents */}
        <nav className="mb-10 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
          <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider mb-4">
            In this guide
          </h2>
          <ol className="space-y-2 text-sm">
            <li>
              <a href="#what-is-irregular-income" className="text-zinc-400 hover:text-teal-300 transition-colors">
                1. What is irregular income?
              </a>
            </li>
            <li>
              <a href="#why-monthly-budgets-fail" className="text-zinc-400 hover:text-teal-300 transition-colors">
                2. Why monthly budgets fail freelancers
              </a>
            </li>
            <li>
              <a href="#calculate-baseline" className="text-zinc-400 hover:text-teal-300 transition-colors">
                3. Calculate your baseline expenses
              </a>
            </li>
            <li>
              <a href="#buffer-fund" className="text-zinc-400 hover:text-teal-300 transition-colors">
                4. Build a buffer fund
              </a>
            </li>
            <li>
              <a href="#cash-flow-calendar" className="text-zinc-400 hover:text-teal-300 transition-colors">
                5. Use a cash flow calendar
              </a>
            </li>
            <li>
              <a href="#pay-yourself" className="text-zinc-400 hover:text-teal-300 transition-colors">
                6. Pay yourself a consistent salary
              </a>
            </li>
            <li>
              <a href="#taxes" className="text-zinc-400 hover:text-teal-300 transition-colors">
                7. Set aside taxes immediately
              </a>
            </li>
          </ol>
        </nav>

        {/* Article content */}
        <div className="prose prose-invert prose-zinc max-w-none">
          {/* Definition box for AEO */}
          <div className="not-prose mb-10 rounded-2xl border border-teal-500/20 bg-teal-500/5 p-6">
            <h3 className="text-lg font-semibold text-white mb-2">
              {definitions.irregularIncome.term}
            </h3>
            <p className="text-zinc-300 leading-relaxed">
              {definitions.irregularIncome.definition}
            </p>
            <p className="mt-3 text-sm text-zinc-500">
              Also known as: {definitions.irregularIncome.alsoKnownAs.join(', ')}
            </p>
          </div>

          <section id="what-is-irregular-income" className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-4">
              What is irregular income?
            </h2>
            <p className="text-zinc-300 leading-relaxed mb-6">
              Irregular income is money that doesn&apos;t arrive on a predictable schedule or in consistent amounts.
              If you&apos;re a freelancer, consultant, or gig worker, you likely know this reality well: one month
              you might earn $8,000, the next month $3,000, and the month after that $12,000.
            </p>
            <p className="text-zinc-300 leading-relaxed">
              According to the Freelancers Union, <strong className="text-white">47% of freelancers</strong> cite
              income instability as their #1 financial concern. It&apos;s not that freelancers earn less—many earn
              more than their salaried counterparts—it&apos;s that the timing and amount of payments is unpredictable.
            </p>
          </section>

          <section id="why-monthly-budgets-fail" className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-4">
              Why monthly budgets fail freelancers
            </h2>

            <div className="not-prose rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6 mb-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-zinc-300">
                    Traditional monthly budgets assume your income arrives predictably. They tell you to allocate
                    percentages of your income to categories—but what if your income this month is 40% less than
                    last month?
                  </p>
                </div>
              </div>
            </div>

            <p className="text-zinc-300 leading-relaxed mb-6">
              The problem with monthly budgets for freelancers:
            </p>

            <ul className="space-y-3 text-zinc-300 mb-6">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-rose-400 mt-0.5 flex-shrink-0" />
                <span><strong className="text-white">They hide timing problems.</strong> You might have $5,000 coming this month, but if it arrives on the 28th and rent is due on the 1st, you have a problem.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-rose-400 mt-0.5 flex-shrink-0" />
                <span><strong className="text-white">They assume consistency.</strong> Allocating 30% to rent works when income is stable. When it varies by 50%+, percentages break down.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-rose-400 mt-0.5 flex-shrink-0" />
                <span><strong className="text-white">They don&apos;t show bill collisions.</strong> When your car insurance, rent, and quarterly taxes all hit the same week, monthly totals won&apos;t warn you.</span>
              </li>
            </ul>

            <p className="text-zinc-300 leading-relaxed">
              What freelancers need instead is <strong className="text-white">day-by-day visibility</strong>—a
              way to see exactly when money comes in, when bills go out, and what your balance will be on any
              given day.
            </p>
          </section>

          <section id="calculate-baseline" className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-4">
              Step 1: Calculate your baseline expenses
            </h2>

            <p className="text-zinc-300 leading-relaxed mb-6">
              Your baseline is the minimum you need to survive each month—the non-negotiables that must be paid
              regardless of income. This becomes your &quot;survival number.&quot;
            </p>

            <div className="not-prose rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 mb-6">
              <h4 className="text-white font-semibold mb-4">Baseline expense checklist:</h4>
              <ul className="space-y-2 text-zinc-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-teal-400" />
                  Rent or mortgage
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-teal-400" />
                  Utilities (electric, gas, water, internet)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-teal-400" />
                  Insurance (health, car, renter&apos;s)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-teal-400" />
                  Minimum debt payments
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-teal-400" />
                  Essential subscriptions (tools for work)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-teal-400" />
                  Food (grocery budget, not dining out)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-teal-400" />
                  Transportation (car payment, gas, transit)
                </li>
              </ul>
            </div>

            <div className="not-prose rounded-2xl border border-teal-500/20 bg-teal-500/5 p-6">
              <div className="flex items-start gap-3">
                <Lightbulb className="h-5 w-5 text-teal-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-white font-semibold mb-1">Pro tip</p>
                  <p className="text-zinc-300">
                    Add up three months of bank statements to get an accurate baseline. Don&apos;t guess—look at
                    actual spending. Most people underestimate by 15-20%.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section id="buffer-fund" className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-4">
              Step 2: Build a buffer fund
            </h2>

            <div className="not-prose flex items-center gap-4 mb-6">
              <div className="h-12 w-12 rounded-xl bg-teal-500/10 ring-1 ring-teal-500/25 flex items-center justify-center">
                <PiggyBank className="h-6 w-6 text-teal-300" />
              </div>
              <div>
                <p className="text-white font-semibold">Target: 2-3 months of baseline expenses</p>
                <p className="text-zinc-400 text-sm">Keep in a separate, easily accessible account</p>
              </div>
            </div>

            <p className="text-zinc-300 leading-relaxed mb-6">
              A buffer fund (also called an income smoothing fund) is different from an emergency fund. Your emergency
              fund is for unexpected expenses—car repairs, medical bills. Your buffer fund is specifically for
              smoothing out the gaps between payments.
            </p>

            <p className="text-zinc-300 leading-relaxed mb-6">
              Here&apos;s how it works: When you have a good month, excess money goes into the buffer. When you have
              a slow month, you pull from the buffer to cover the gap. This creates artificial consistency.
            </p>

            <div className="not-prose rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
              <h4 className="text-white font-semibold mb-3">Building your buffer:</h4>
              <ol className="space-y-3 text-zinc-300">
                <li className="flex items-start gap-3">
                  <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-teal-500 text-zinc-950 text-sm font-semibold flex-shrink-0">1</span>
                  <span>Open a separate savings account (label it &quot;Buffer&quot; or &quot;Income Smoothing&quot;)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-teal-500 text-zinc-950 text-sm font-semibold flex-shrink-0">2</span>
                  <span>Any month you earn above your baseline, move the excess to this account</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-teal-500 text-zinc-950 text-sm font-semibold flex-shrink-0">3</span>
                  <span>Aim for 2-3x your monthly baseline as the target balance</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-teal-500 text-zinc-950 text-sm font-semibold flex-shrink-0">4</span>
                  <span>Draw from it only when income falls short of baseline</span>
                </li>
              </ol>
            </div>
          </section>

          <section id="cash-flow-calendar" className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-4">
              Step 3: Use a cash flow calendar
            </h2>

            {/* Definition box for AEO */}
            <div className="not-prose mb-6 rounded-2xl border border-teal-500/20 bg-teal-500/5 p-6">
              <h3 className="text-lg font-semibold text-white mb-2">
                {definitions.cashFlowCalendar.term}
              </h3>
              <p className="text-zinc-300 leading-relaxed">
                {definitions.cashFlowCalendar.definition}
              </p>
              <p className="mt-3 text-sm text-zinc-500">
                Also known as: {definitions.cashFlowCalendar.alsoKnownAs.join(', ')}
              </p>
            </div>

            <p className="text-zinc-300 leading-relaxed mb-6">
              A cash flow calendar is the single most important tool for freelancers. Instead of looking at
              monthly totals, you see your projected balance on every single day. This lets you:
            </p>

            <ul className="space-y-3 text-zinc-300 mb-6">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-teal-400 mt-0.5 flex-shrink-0" />
                <span><strong className="text-white">Spot low-balance days before they happen</strong>—not after an overdraft hits</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-teal-400 mt-0.5 flex-shrink-0" />
                <span><strong className="text-white">See bill collisions</strong>—when multiple expenses land on the same day or week</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-teal-400 mt-0.5 flex-shrink-0" />
                <span><strong className="text-white">Know what&apos;s safe to spend</strong>—the exact amount you can spend without going negative</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-teal-400 mt-0.5 flex-shrink-0" />
                <span><strong className="text-white">Plan large purchases</strong>—see the best day to make that equipment purchase</span>
              </li>
            </ul>

            <div className="not-prose rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
              <div className="flex items-start gap-3">
                <TrendingUp className="h-5 w-5 text-teal-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-white font-semibold mb-1">Try Cash Flow Forecaster</p>
                  <p className="text-zinc-300 mb-4">
                    See your projected balance up to 365 days ahead with interactive charts, bill alerts,
                    and a &quot;Safe to Spend&quot; indicator that tells you exactly what you can spend today.
                  </p>
                  <GetStartedCTA className="bg-teal-500 hover:bg-teal-400 text-zinc-950 text-sm" />
                </div>
              </div>
            </div>
          </section>

          <section id="pay-yourself" className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-4">
              Step 4: Pay yourself a consistent salary
            </h2>

            <p className="text-zinc-300 leading-relaxed mb-6">
              One of the most effective strategies for managing irregular income is to stop thinking of client
              payments as &quot;your money&quot; and start treating your business like an employer.
            </p>

            <p className="text-zinc-300 leading-relaxed mb-6">
              Here&apos;s the framework:
            </p>

            <ol className="space-y-4 text-zinc-300 mb-6">
              <li className="flex items-start gap-3">
                <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-teal-500 text-zinc-950 text-sm font-semibold flex-shrink-0 mt-0.5">1</span>
                <div>
                  <p><strong className="text-white">All client payments go to a business account</strong></p>
                  <p className="text-zinc-400 text-sm">This is your &quot;business&quot; money, not personal money yet</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-teal-500 text-zinc-950 text-sm font-semibold flex-shrink-0 mt-0.5">2</span>
                <div>
                  <p><strong className="text-white">Set a &quot;salary&quot; based on your baseline expenses</strong></p>
                  <p className="text-zinc-400 text-sm">Your baseline + a small cushion (10-15%)</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-teal-500 text-zinc-950 text-sm font-semibold flex-shrink-0 mt-0.5">3</span>
                <div>
                  <p><strong className="text-white">Transfer your &quot;salary&quot; to personal on a set schedule</strong></p>
                  <p className="text-zinc-400 text-sm">Every 1st and 15th, or every Monday—pick a cadence</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-teal-500 text-zinc-950 text-sm font-semibold flex-shrink-0 mt-0.5">4</span>
                <div>
                  <p><strong className="text-white">Excess stays in the business account (or buffer)</strong></p>
                  <p className="text-zinc-400 text-sm">This builds your runway for slow months</p>
                </div>
              </li>
            </ol>

            <p className="text-zinc-300 leading-relaxed">
              This approach creates the psychological and practical stability of a regular paycheck, even when
              your actual income varies wildly.
            </p>
          </section>

          <section id="taxes" className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-4">
              Step 5: Set aside taxes immediately
            </h2>

            <div className="not-prose flex items-center gap-4 mb-6">
              <div className="h-12 w-12 rounded-xl bg-amber-500/10 ring-1 ring-amber-500/25 flex items-center justify-center">
                <Shield className="h-6 w-6 text-amber-300" />
              </div>
              <div>
                <p className="text-white font-semibold">Rule of thumb: 25-30% of every payment</p>
                <p className="text-zinc-400 text-sm">Transfer to a separate tax savings account immediately</p>
              </div>
            </div>

            <p className="text-zinc-300 leading-relaxed mb-6">
              As a freelancer, no one withholds taxes from your payments. This means you&apos;re responsible for
              paying estimated quarterly taxes to the IRS (and potentially state). The biggest mistake freelancers
              make is treating all income as spendable, then scrambling when tax season hits.
            </p>

            <div className="not-prose rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6 mb-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-white font-semibold mb-1">Don&apos;t get caught</p>
                  <p className="text-zinc-300">
                    If you earn $60,000 and don&apos;t set aside taxes, you could owe $15,000+ come April.
                    Plus penalties for missing quarterly payments. Set it aside from day one.
                  </p>
                </div>
              </div>
            </div>

            <p className="text-zinc-300 leading-relaxed mb-6">
              The system is simple: every time you get paid, immediately transfer 25-30% to a separate savings
              account labeled &quot;Taxes.&quot; Don&apos;t touch it. When quarterly taxes are due, the money is there.
            </p>

            <div className="not-prose rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
              <h4 className="text-white font-semibold mb-3">2026 Quarterly tax deadlines:</h4>
              <ul className="space-y-2 text-zinc-300 text-sm">
                <li className="flex items-center justify-between">
                  <span>Q1 (Jan-Mar income)</span>
                  <span className="text-zinc-400">April 15, 2026</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Q2 (Apr-May income)</span>
                  <span className="text-zinc-400">June 16, 2026</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Q3 (Jun-Aug income)</span>
                  <span className="text-zinc-400">September 15, 2026</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Q4 (Sep-Dec income)</span>
                  <span className="text-zinc-400">January 15, 2027</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Summary */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-4">
              Putting it all together
            </h2>

            <p className="text-zinc-300 leading-relaxed mb-6">
              Managing irregular income isn&apos;t about making more money—it&apos;s about creating systems that
              give you predictability despite unpredictable income. Here&apos;s your action plan:
            </p>

            <div className="not-prose rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
              <ol className="space-y-4">
                <li className="flex items-start gap-3 text-zinc-300">
                  <CheckCircle2 className="h-5 w-5 text-teal-400 mt-0.5 flex-shrink-0" />
                  <span><strong className="text-white">This week:</strong> Calculate your baseline expenses from the last 3 months</span>
                </li>
                <li className="flex items-start gap-3 text-zinc-300">
                  <CheckCircle2 className="h-5 w-5 text-teal-400 mt-0.5 flex-shrink-0" />
                  <span><strong className="text-white">This month:</strong> Open separate accounts for buffer and taxes</span>
                </li>
                <li className="flex items-start gap-3 text-zinc-300">
                  <CheckCircle2 className="h-5 w-5 text-teal-400 mt-0.5 flex-shrink-0" />
                  <span><strong className="text-white">Ongoing:</strong> Use a cash flow calendar to see your balance day-by-day</span>
                </li>
                <li className="flex items-start gap-3 text-zinc-300">
                  <CheckCircle2 className="h-5 w-5 text-teal-400 mt-0.5 flex-shrink-0" />
                  <span><strong className="text-white">Every payment:</strong> Immediately set aside 25-30% for taxes</span>
                </li>
                <li className="flex items-start gap-3 text-zinc-300">
                  <CheckCircle2 className="h-5 w-5 text-teal-400 mt-0.5 flex-shrink-0" />
                  <span><strong className="text-white">Every payday:</strong> Transfer a consistent &quot;salary&quot; to personal</span>
                </li>
              </ol>
            </div>
          </section>
        </div>

        {/* CTA */}
        <section className="mt-12 rounded-2xl border border-zinc-800 bg-zinc-900/40 px-6 py-10 text-center">
          <h2 className="text-2xl font-semibold text-white">
            Ready to see your cash flow calendar?
          </h2>
          <p className="mt-3 text-zinc-400 max-w-xl mx-auto">
            Stop guessing when you&apos;ll run low. Cash Flow Forecaster shows your projected balance
            up to 365 days ahead—free to start.
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
              href="/blog/what-is-safe-to-spend"
              className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 hover:border-zinc-700 transition-colors group"
            >
              <p className="font-medium text-white group-hover:text-teal-300 transition-colors">
                What is &quot;Safe to Spend&quot;?
              </p>
              <p className="mt-1 text-sm text-zinc-400">
                The one number every freelancer needs to know
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
