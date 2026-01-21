'use client';

import { CreditCard, Copy, ExternalLink, CheckCircle2 } from 'lucide-react';
import { showSuccess } from '@/lib/toast';

type Props = {
  paymentUrl: string;
  status: string;
  paymentMethod?: string | null;
};

function truncateUrl(url: string, maxLength: number = 50): string {
  if (url.length <= maxLength) return url;
  // Show beginning and end of URL
  const start = url.slice(0, maxLength - 10);
  const end = url.slice(-7);
  return `${start}...${end}`;
}

export function PaymentLinkSection({ paymentUrl, status, paymentMethod }: Props) {
  const isPaidViaStripe = status === 'paid' && paymentMethod === 'stripe';

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(paymentUrl);
      showSuccess('Link copied!');
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }

  return (
    <div className="border border-zinc-800 bg-zinc-900 rounded-lg p-5 mb-6">
      <div className="flex items-center gap-2 mb-3">
        <CreditCard className="w-4 h-4 text-teal-400" />
        <h3 className="text-sm font-semibold text-zinc-100">Payment Link</h3>
        {isPaidViaStripe && (
          <span className="ml-auto inline-flex items-center gap-1.5 text-xs font-medium text-emerald-400 bg-emerald-500/20 border border-emerald-500/30 rounded-full px-2.5 py-1">
            <CheckCircle2 className="w-3 h-3" />
            Paid via Stripe
          </span>
        )}
      </div>

      {status === 'paid' ? (
        <p className="text-sm text-zinc-400">
          {isPaidViaStripe
            ? 'This invoice was paid online via Stripe.'
            : 'This invoice has been marked as paid.'}
        </p>
      ) : (
        <>
          <p className="text-sm text-zinc-400 mb-3">
            Share this link with your client so they can pay online with a credit card.
          </p>

          <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-3 flex items-center justify-between gap-3">
            <span
              className="text-sm text-zinc-300 font-mono truncate min-w-0 flex-1"
              title={paymentUrl}
            >
              {truncateUrl(paymentUrl)}
            </span>

            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md border border-zinc-600 bg-zinc-700 hover:bg-zinc-600 text-zinc-100 transition-colors"
                title="Copy payment link"
              >
                <Copy className="w-4 h-4" />
                <span>Copy Link</span>
              </button>

              <a
                href={paymentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md bg-teal-600 hover:bg-teal-500 text-white transition-colors"
                title="Open payment link"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Open</span>
              </a>
            </div>
          </div>

          <p className="text-xs text-zinc-500 mt-3">
            Secure payment powered by Stripe. Standard processing fees apply (2.9% + $0.30).
          </p>
        </>
      )}
    </div>
  );
}
