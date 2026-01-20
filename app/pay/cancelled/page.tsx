import { XCircle } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Payment Cancelled | Cash Flow Forecaster',
  description: 'Your payment was cancelled',
};

export default function PaymentCancelledPage() {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-8">
          <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-8 h-8 text-zinc-400" />
          </div>

          <h1 className="text-2xl font-bold text-zinc-100 mb-2">
            Payment Cancelled
          </h1>

          <p className="text-zinc-400 mb-6">
            Your payment was not processed. If you meant to complete the payment,
            please use the payment link from your invoice email.
          </p>

          <div className="bg-zinc-800/50 rounded-lg p-4 mb-6">
            <p className="text-sm text-zinc-500">
              If you have questions about the invoice, please contact the sender
              directly.
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
