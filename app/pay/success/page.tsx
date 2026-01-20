import { CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Payment Successful | Cash Flow Forecaster',
  description: 'Your payment has been processed successfully',
};

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-8">
          <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-8 h-8 text-emerald-400" />
          </div>

          <h1 className="text-2xl font-bold text-zinc-100 mb-2">
            Payment Successful
          </h1>

          <p className="text-zinc-400 mb-6">
            Thank you! Your payment has been processed successfully. A receipt
            will be sent to your email.
          </p>

          <div className="bg-zinc-800/50 rounded-lg p-4 mb-6">
            <p className="text-sm text-zinc-500">
              The invoice has been automatically marked as paid. You can close
              this window.
            </p>
          </div>

          <Link
            href="https://cashflowforecaster.io"
            className="text-teal-400 hover:text-teal-300 text-sm font-medium transition-colors"
          >
            Learn more about Cash Flow Forecaster
          </Link>
        </div>

        <p className="mt-6 text-sm text-zinc-600">
          Powered by{' '}
          <a
            href="https://stripe.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-500 hover:text-zinc-400"
          >
            Stripe
          </a>
        </p>
      </div>
    </div>
  );
}
