import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { breadcrumbs } from '@/components/seo/schemas';
import { getPostBySlug } from '@/lib/blog/posts';
import {
  Clock,
  CalendarDays,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Building2,
  User,
  Zap,
} from 'lucide-react';

const post = getPostBySlug('invoice-payment-terms-net-30-explained')!;

export const metadata: Metadata = {
  title: post.title + ' | Cash Flow Forecaster',
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

const definitionListSchema = {
  '@context': 'https://schema.org',
  '@type': 'DefinedTermSet',
  name: 'Invoice Payment Terms',
  description: 'Common payment terms used on freelancer and contractor invoices',
  definedTerm: [
    {
      '@type': 'DefinedTerm',
      name: 'Net 30',
      description: 'Payment is due 30 days after the invoice date. This is the most common payment term for business-to-business transactions.',
    },
    {
      '@type': 'DefinedTerm',
      name: 'Net 15',
      description: 'Payment is due 15 days after the invoice date. Often used when faster payment is needed or with established client relationships.',
    },
    {
      '@type': 'DefinedTerm',
      name: 'Due on Receipt',
      description: 'Payment is expected immediately upon receiving the invoice. Common for small projects, new clients, or retail transactions.',
    },
    {
      '@type': 'DefinedTerm',
      name: 'Net 60',
      description: 'Payment is due 60 days after the invoice date. Typically used by larger corporations with longer accounts payable cycles.',
    },
  ],
};

export default function InvoicePaymentTermsPage() {
  return (
    <article className="mx-auto max-w-3xl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(definitionListSchema) }}
      />
          <Breadcrumbs
            items={[
              breadcrumbs.home,
              breadcrumbs.blog,
              { name: 'Invoice Payment Terms', url: `https://cashflowforecaster.io/blog/${post.slug}` },
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
              <time dateTime={post.publishedAt}>{new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</time>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight leading-tight">
              {post.title}
            </h1>

            <p className="mt-4 text-lg text-zinc-300 leading-relaxed">
              {post.description}
            </p>

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
            {/* Quick Reference Table */}
            <div className="not-prose mb-10 rounded-xl border border-zinc-800 bg-zinc-900/60 overflow-hidden">
              <div className="px-5 py-4 border-b border-zinc-800 bg-zinc-900/80">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Clock className="h-5 w-5 text-teal-400" />
                  Quick Reference: Payment Terms at a Glance
                </h2>
              </div>
              <div className="divide-y divide-zinc-800">
                <div className="grid grid-cols-3 px-5 py-3 text-sm">
                  <div className="font-semibold text-zinc-300">Term</div>
                  <div className="font-semibold text-zinc-300">When Payment Due</div>
                  <div className="font-semibold text-zinc-300">Best For</div>
                </div>
                <div className="grid grid-cols-3 px-5 py-3 text-sm">
                  <div className="text-white font-medium">Due on Receipt</div>
                  <div className="text-zinc-400">Immediately</div>
                  <div className="text-zinc-400">New clients, small projects</div>
                </div>
                <div className="grid grid-cols-3 px-5 py-3 text-sm">
                  <div className="text-white font-medium">Net 15</div>
                  <div className="text-zinc-400">15 days</div>
                  <div className="text-zinc-400">Trusted clients, fast turnaround</div>
                </div>
                <div className="grid grid-cols-3 px-5 py-3 text-sm bg-teal-500/5">
                  <div className="text-teal-300 font-medium">Net 30</div>
                  <div className="text-zinc-400">30 days</div>
                  <div className="text-zinc-400">Most B2B work (industry standard)</div>
                </div>
                <div className="grid grid-cols-3 px-5 py-3 text-sm">
                  <div className="text-white font-medium">Net 60</div>
                  <div className="text-zinc-400">60 days</div>
                  <div className="text-zinc-400">Enterprise clients (beware!)</div>
                </div>
              </div>
            </div>

            <h2>What Do Invoice Payment Terms Mean?</h2>

            <p>
              When you send an invoice to a client, the payment terms tell them <strong>when payment is expected</strong>.
              These aren&apos;t just formalities—they directly impact your cash flow.
            </p>

            <p>
              The &quot;Net&quot; in payment terms refers to the total number of days the client has to pay.
              The clock starts ticking from the <strong>invoice date</strong>, not when the client receives or opens it.
            </p>

            {/* Net 30 Section */}
            <div className="not-prose my-8 rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 h-12 w-12 rounded-lg bg-teal-500/10 flex items-center justify-center">
                  <CalendarDays className="h-6 w-6 text-teal-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Net 30: The Industry Standard</h3>
                  <p className="text-zinc-300 mb-4">
                    Net 30 means payment is due <strong>30 days after the invoice date</strong>. If you invoice on January 1st,
                    payment is due by January 31st.
                  </p>
                  <div className="space-y-2">
                    <p className="text-sm text-zinc-400 flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                      Most common term in B2B transactions
                    </p>
                    <p className="text-sm text-zinc-400 flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                      Gives clients time to process through their accounting
                    </p>
                    <p className="text-sm text-zinc-400 flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-amber-400 mt-0.5 flex-shrink-0" />
                      Means you wait a month minimum for payment
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <h2>Breaking Down Each Payment Term</h2>

            <h3>Due on Receipt</h3>
            <p>
              <strong>Due on Receipt</strong> means payment is expected immediately when the client receives the invoice.
              In practice, &quot;immediately&quot; usually means within a few days.
            </p>

            <p><strong>When to use it:</strong></p>
            <ul>
              <li>New clients you haven&apos;t worked with before</li>
              <li>Small, one-off projects under $500</li>
              <li>Clients with a history of late payments</li>
              <li>When you need cash flow quickly</li>
            </ul>

            <h3>Net 15</h3>
            <p>
              <strong>Net 15</strong> gives clients 15 days to pay. It&apos;s a middle ground between immediate payment
              and the longer Net 30 standard.
            </p>

            <p><strong>When to use it:</strong></p>
            <ul>
              <li>Established clients who pay reliably</li>
              <li>Smaller businesses with simpler payment processes</li>
              <li>When you want faster payment without seeming aggressive</li>
              <li>Projects with quick turnaround times</li>
            </ul>

            <h3>Net 30</h3>
            <p>
              <strong>Net 30</strong> is the default for most business transactions. It gives clients a full month
              to process the invoice through their accounting department.
            </p>

            <p><strong>When to use it:</strong></p>
            <ul>
              <li>Established business relationships</li>
              <li>Larger companies with formal AP processes</li>
              <li>When it&apos;s the industry norm in your field</li>
              <li>Ongoing retainer or recurring work</li>
            </ul>

            <h3>Net 60 (and Beyond)</h3>
            <p>
              <strong>Net 60</strong> means clients have two full months to pay. Large corporations often request
              this—or even Net 90—because of their internal payment cycles.
            </p>

            {/* Warning Box */}
            <div className="not-prose my-8 rounded-xl border border-amber-500/30 bg-amber-500/5 p-5">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-amber-300 mb-2">Cash Flow Warning</p>
                  <p className="text-sm text-zinc-300">
                    Net 60+ terms can seriously strain your finances. If you complete work in January and invoice immediately,
                    you might not see payment until April. Make sure you have enough runway to cover 2-3 months of expenses
                    before accepting extended terms.
                  </p>
                </div>
              </div>
            </div>

            <h2>How Payment Terms Affect Your Cash Flow</h2>

            <p>
              Here&apos;s a real example of how payment terms impact when money actually hits your account:
            </p>

            <div className="not-prose my-8 rounded-xl border border-zinc-800 bg-zinc-900/60 p-5">
              <p className="text-sm text-zinc-400 mb-3">You complete a $3,000 project on January 15th and invoice the same day:</p>
              <div className="space-y-2">
                <div className="flex justify-between items-center py-2 border-b border-zinc-800">
                  <span className="text-zinc-300">Due on Receipt</span>
                  <span className="text-white font-medium">Paid by ~Jan 18-20</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-zinc-800">
                  <span className="text-zinc-300">Net 15</span>
                  <span className="text-white font-medium">Due Jan 30</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-zinc-800">
                  <span className="text-zinc-300">Net 30</span>
                  <span className="text-white font-medium">Due Feb 14</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-zinc-300">Net 60</span>
                  <span className="text-white font-medium">Due Mar 16</span>
                </div>
              </div>
            </div>

            <p>
              That&apos;s a <strong>two-month difference</strong> between Due on Receipt and Net 60 for the same work.
              When you have rent due on February 1st, this difference matters enormously.
            </p>

            <h2>Choosing Payment Terms by Client Type</h2>

            {/* Client Type Cards */}
            <div className="not-prose my-8 grid gap-4">
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
                <div className="flex items-center gap-3 mb-3">
                  <User className="h-5 w-5 text-teal-400" />
                  <h3 className="font-semibold text-white">Individual Clients / Small Businesses</h3>
                </div>
                <p className="text-sm text-zinc-400 mb-3">
                  Smaller clients usually pay faster because they don&apos;t have complex accounting processes.
                </p>
                <p className="text-sm text-teal-300">
                  <strong>Recommended:</strong> Due on Receipt or Net 15
                </p>
              </div>

              <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
                <div className="flex items-center gap-3 mb-3">
                  <Building2 className="h-5 w-5 text-teal-400" />
                  <h3 className="font-semibold text-white">Mid-Size Companies</h3>
                </div>
                <p className="text-sm text-zinc-400 mb-3">
                  They often have accounts payable departments that process invoices on a schedule.
                </p>
                <p className="text-sm text-teal-300">
                  <strong>Recommended:</strong> Net 15 or Net 30
                </p>
              </div>

              <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
                <div className="flex items-center gap-3 mb-3">
                  <Zap className="h-5 w-5 text-teal-400" />
                  <h3 className="font-semibold text-white">Enterprise / Large Corporations</h3>
                </div>
                <p className="text-sm text-zinc-400 mb-3">
                  Big companies often require Net 30 or longer. Factor this into your pricing.
                </p>
                <p className="text-sm text-teal-300">
                  <strong>Recommended:</strong> Net 30 (push back on Net 60+ or charge more)
                </p>
              </div>
            </div>

            <h2>Tips for Getting Paid Faster</h2>

            <ol>
              <li>
                <strong>Invoice immediately</strong> – Don&apos;t wait. The clock doesn&apos;t start until you send the invoice.
              </li>
              <li>
                <strong>Make payment easy</strong> – Offer multiple payment methods (ACH, credit card, PayPal).
              </li>
              <li>
                <strong>Clearly state terms</strong> – Put &quot;Payment Due: [Date]&quot; prominently on the invoice.
              </li>
              <li>
                <strong>Send reminders</strong> – A friendly reminder a few days before due date can help.
              </li>
              <li>
                <strong>Consider early payment discounts</strong> – &quot;2/10 Net 30&quot; means 2% off if paid within 10 days.
              </li>
            </ol>

            <h2>Tracking Expected Payments in Your Cash Flow</h2>

            <p>
              The tricky part of being a freelancer is that your invoice date and payment date are different.
              A $5,000 invoice might feel like you have $5,000, but you don&apos;t—not yet.
            </p>

            <p>
              This is where cash flow forecasting becomes essential. You need to see not just your current balance,
              but when expected payments will actually arrive based on their payment terms.
            </p>

            {/* CTA Box */}
            <div className="not-prose my-10 rounded-xl border border-teal-500/30 bg-teal-500/5 p-6 text-center">
              <h3 className="text-xl font-semibold text-white mb-3">
                See When Payments Will Actually Arrive
              </h3>
              <p className="text-zinc-300 mb-4">
                Cash Flow Forecaster lets you add expected income with specific dates, so you can see
                your real balance projection—not just what&apos;s invoiced, but what&apos;s actually in your account.
              </p>
              <Link
                href="/auth/signup"
                className="inline-flex items-center justify-center h-10 px-6 rounded-lg bg-teal-500 hover:bg-teal-400 text-zinc-950 font-semibold text-sm transition-colors"
              >
                Try Free for 14 Days
              </Link>
            </div>

            <h2>Key Takeaways</h2>

            <ul>
              <li><strong>Net 30</strong> is the industry standard—expect most B2B clients to use it</li>
              <li><strong>Due on Receipt</strong> is best for new clients and small projects</li>
              <li><strong>Net 60+</strong> requires careful cash flow planning—you&apos;ll wait 2+ months for payment</li>
              <li>Always match payment terms to the client type and your cash flow needs</li>
              <li>Invoice immediately—delays on your end mean delays in payment</li>
            </ul>
          </div>

          {/* Related Content */}
          <section className="mt-16 pt-10 border-t border-zinc-800">
            <h2 className="text-xl font-semibold text-white mb-6">Related Articles</h2>
            <div className="grid gap-4">
              <Link
                href="/blog/cash-flow-forecasting-for-freelancers"
                className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 hover:border-zinc-700 transition-colors group"
              >
                <p className="font-medium text-white group-hover:text-teal-300 transition-colors">
                  Cash Flow Forecasting for Freelancers
                </p>
                <p className="mt-1 text-sm text-zinc-400">
                  Why day-by-day visibility matters more than monthly budgets.
                </p>
                <span className="mt-3 inline-flex items-center gap-1 text-sm text-teal-400 group-hover:gap-2 transition-all">
                  Read article <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </Link>
              <Link
                href="/blog/freelancer-emergency-fund-how-much"
                className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 hover:border-zinc-700 transition-colors group"
              >
                <p className="font-medium text-white group-hover:text-teal-300 transition-colors">
                  Freelancer Emergency Fund: How Much Do You Actually Need?
                </p>
                <p className="mt-1 text-sm text-zinc-400">
                  Calculate the right financial buffer for irregular income.
                </p>
                <span className="mt-3 inline-flex items-center gap-1 text-sm text-teal-400 group-hover:gap-2 transition-all">
                  Read article <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </Link>
            </div>
          </section>
        </article>
  );
}
