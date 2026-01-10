import type { Metadata } from 'next';
import LandingHeader from '@/components/landing/landing-header';
import { PaymentPredictor } from '@/components/tools/payment-predictor';
import { Calendar, Clock, FileText } from 'lucide-react';

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

export default function InvoicePaymentPredictorPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white selection-teal">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

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
        </div>
      </main>
    </div>
  );
}

