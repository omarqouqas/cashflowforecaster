import type { Metadata } from 'next';
import Link from 'next/link';
import LandingHeader from '@/components/landing/landing-header';
import { LandingFooter } from '@/components/landing/footer';
import { PaymentPredictor } from '@/components/tools/payment-predictor';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { breadcrumbs } from '@/components/seo/schemas';
import { Calendar, Clock, FileText, HelpCircle, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Invoice Payment Date Predictor - When Will You Get Paid? | Cash Flow Forecaster',
  description:
    'Free calculator to predict when your invoice will be paid. Enter invoice date and payment terms (Net-30, Net-60, etc.) to see the expected payment date, adjusted for weekends.',
  keywords: [
    'invoice payment date calculator',
    'net 30 payment date calculator',
    'when will I get paid calculator',
    'invoice due date calculator',
    'payment terms calculator',
    'net 60 calculator',
    'invoice payment predictor',
    'freelance invoice calculator',
  ],
  alternates: {
    canonical: 'https://cashflowforecaster.io/tools/invoice-payment-predictor',
  },
  openGraph: {
    title: 'Invoice Payment Date Predictor - When Will You Get Paid?',
    description:
      'Stop guessing when invoices will be paid. Calculate expected payment dates based on terms, weekends, and client history.',
    url: 'https://cashflowforecaster.io/tools/invoice-payment-predictor',
    siteName: 'Cash Flow Forecaster',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Invoice Payment Date Predictor - When Will You Get Paid?',
    description:
      'Free calculator to predict invoice payment dates. Accounts for Net-30/60/90 terms and weekends.',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Invoice Payment Date Predictor',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Web',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  isAccessibleForFree: true,
  url: 'https://cashflowforecaster.io/tools/invoice-payment-predictor',
} as const;

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What does Net 30 mean on an invoice?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Net 30 means payment is due 30 days after the invoice date. For example, if you invoice on January 1st, payment is due by January 31st. The "Net" refers to the total number of days the client has to pay.',
      },
    },
    {
      '@type': 'Question',
      name: 'When will I actually get paid on a Net 30 invoice?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'While Net 30 means payment is due in 30 days, most freelancers receive payment 35-45 days after invoicing. Many companies process payments weekly, so if your due date falls mid-week, expect a few extra days. Add more time for slow-paying clients.',
      },
    },
    {
      '@type': 'Question',
      name: 'What if the payment due date falls on a weekend?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Most companies process payments on business days only. If your invoice due date falls on a Saturday or Sunday, expect payment on the following Monday. Some companies only process payments on specific days (like Fridays), which can add additional delays.',
      },
    },
    {
      '@type': 'Question',
      name: 'How can I get clients to pay faster?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'To speed up payments: 1) Invoice immediately upon project completion, 2) Use shorter payment terms like Net 15 or Due on Receipt, 3) Offer early payment discounts (e.g., 2% off if paid within 10 days), 4) Make payment easy with multiple options, 5) Send friendly reminders before the due date.',
      },
    },
  ],
} as const;

const faqs = [
  {
    question: 'What does Net 30 mean on an invoice?',
    answer: 'Net 30 means payment is due 30 days after the invoice date. If you invoice on January 1st, payment is due by January 31st.',
  },
  {
    question: 'When will I actually get paid on a Net 30 invoice?',
    answer: 'While due in 30 days, most freelancers receive payment 35-45 days after invoicing. Companies process payments weekly, so expect a few extra days.',
  },
  {
    question: 'What if the due date falls on a weekend?',
    answer: 'Most companies process payments on business days only. Weekend due dates typically mean payment on the following Monday.',
  },
  {
    question: 'How can I get clients to pay faster?',
    answer: 'Invoice immediately, use shorter terms (Net 15), offer early payment discounts, provide multiple payment options, and send reminders before due dates.',
  },
];

export default function InvoicePaymentPredictorPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white selection-teal">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* Dot grid background */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 opacity-[0.22]"
        style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          backgroundPosition: 'center',
        }}
      />

      <LandingHeader />

      <main className="px-6 py-12">
        <div className="mx-auto max-w-6xl">
          <Breadcrumbs
            items={[
              breadcrumbs.home,
              breadcrumbs.tools,
              { name: 'Payment Predictor', url: 'https://cashflowforecaster.io/tools/invoice-payment-predictor' },
            ]}
            className="mb-8"
          />

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-zinc-900/60 border border-zinc-800 px-4 py-2 text-sm text-zinc-200">
              <Calendar className="h-4 w-4 text-teal-400" />
              <span>Free tool • No login required</span>
            </div>

            <h1 className="mt-6 text-4xl md:text-5xl font-bold text-white tracking-tight">Invoice Payment Predictor</h1>

            <p className="mt-4 text-lg text-zinc-300 leading-relaxed">
              Stop guessing when you&apos;ll get paid. Enter your invoice details and payment terms to see the realistic
              payment date—adjusted for weekends and slow-paying clients.
            </p>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-white">
                  <FileText className="h-4 w-4 text-teal-300" />
                  Any payment terms
                </div>
                <p className="mt-2 text-sm text-zinc-400">Net-7 to Net-90, or set custom terms.</p>
              </div>
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-white">
                  <Calendar className="h-4 w-4 text-teal-300" />
                  Weekend-aware
                </div>
                <p className="mt-2 text-sm text-zinc-400">Payments on weekends shift to Monday.</p>
              </div>
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-white">
                  <Clock className="h-4 w-4 text-teal-300" />
                  Client reality check
                </div>
                <p className="mt-2 text-sm text-zinc-400">Factor in clients who always pay late.</p>
              </div>
            </div>
          </div>

          <div className="mt-10">
            <PaymentPredictor />
          </div>

          <div className="mt-10 max-w-5xl">
            <p className="text-xs text-zinc-600 leading-relaxed">
              Disclaimer: This calculator provides estimates based on standard payment terms. Actual payment timing
              depends on client behavior, their payment processes, and other factors. This tool does not account for
              specific holidays.
            </p>
          </div>

          {/* FAQ Section */}
          <section className="mt-16 max-w-3xl">
            <div className="flex items-center gap-2 mb-6">
              <HelpCircle className="h-5 w-5 text-teal-400" />
              <h2 className="text-xl font-semibold text-white">Frequently Asked Questions</h2>
            </div>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <details
                  key={index}
                  className="group rounded-xl border border-zinc-800 bg-zinc-900/40 overflow-hidden"
                >
                  <summary className="flex cursor-pointer items-center justify-between p-5 text-white font-medium hover:bg-zinc-900/60 transition-colors">
                    {faq.question}
                    <span className="ml-4 text-zinc-500 group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <div className="px-5 pb-5 text-zinc-400 text-sm leading-relaxed">
                    {faq.answer}
                  </div>
                </details>
              ))}
            </div>
          </section>

          {/* Related Content */}
          <section className="mt-12 max-w-3xl">
            <h2 className="text-lg font-semibold text-white mb-4">Related Resources</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Link
                href="/blog/invoice-payment-terms-net-30-explained"
                className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 hover:border-zinc-700 transition-colors group"
              >
                <p className="font-medium text-white group-hover:text-teal-300 transition-colors">
                  Invoice Payment Terms Explained
                </p>
                <p className="mt-1 text-sm text-zinc-400">
                  Net 30, Net 15, Due on Receipt—what they mean and when to use them.
                </p>
                <span className="mt-3 inline-flex items-center gap-1 text-sm text-teal-400 group-hover:gap-2 transition-all">
                  Read guide <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </Link>
              <Link
                href="/blog/cash-flow-forecasting-for-freelancers"
                className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 hover:border-zinc-700 transition-colors group"
              >
                <p className="font-medium text-white group-hover:text-teal-300 transition-colors">
                  Cash Flow Forecasting for Freelancers
                </p>
                <p className="mt-1 text-sm text-zinc-400">
                  Why day-by-day visibility matters for managing invoices.
                </p>
                <span className="mt-3 inline-flex items-center gap-1 text-sm text-teal-400 group-hover:gap-2 transition-all">
                  Read guide <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </Link>
            </div>
          </section>

          {/* CTA */}
          <div className="mt-12 max-w-3xl rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 text-center">
            <p className="text-zinc-300">
              Track all your invoices and see when each payment will arrive in one calendar view.
            </p>
            <Link
              href="/auth/signup"
              className="mt-4 inline-flex items-center justify-center h-10 px-6 rounded-lg bg-teal-500 hover:bg-teal-400 text-zinc-950 font-semibold text-sm transition-colors"
            >
              Try Cash Flow Forecaster Free
            </Link>
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
