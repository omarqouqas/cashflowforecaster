'use client';

import { useState } from 'react';
import { CreditCard, Copy, ExternalLink, CheckCircle2 } from 'lucide-react';

type Props = {
  paymentUrl: string;
  status: string;
  paymentMethod?: string | null;
};

export function PaymentLinkSection({ paymentUrl, status, paymentMethod }: Props) {
  const [copied, setCopied] = useState(false);
  const isPaidViaStripe = status === 'paid' && paymentMethod === 'stripe';

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(paymentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
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

          <div className="flex items-center gap-2">
            <div className="flex-1 bg-zinc-800 rounded-md px-3 py-2 border border-zinc-700">
              <p className="text-xs text-zinc-300 truncate font-mono">{paymentUrl}</p>
            </div>

            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 transition-colors"
              title="Copy payment link"
            >
              {copied ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy</span>
                </>
              )}
            </button>

            <a
              href={paymentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md bg-teal-600 hover:bg-teal-500 text-white transition-colors"
              title="Open payment link"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Open</span>
            </a>
          </div>

          <p className="text-xs text-zinc-500 mt-3">
            Secure payment powered by Stripe. Standard processing fees apply (2.9% + $0.30).
          </p>
        </>
      )}
    </div>
  );
}
