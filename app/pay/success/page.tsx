import { CheckCircle2, XCircle } from 'lucide-react';
import Link from 'next/link';
import { verifyCheckoutSession } from '@/lib/stripe/connect';
import { createAdminClient } from '@/lib/supabase/admin';

export const metadata = {
  title: 'Payment Successful | Cash Flow Forecaster',
  description: 'Your payment has been processed successfully',
};

async function markInvoiceAsPaid(invoiceId: string) {
  const supabase = createAdminClient();

  // First check current status to avoid duplicate updates
  const { data: invoice } = await supabase
    .from('invoices')
    .select('status')
    .eq('id', invoiceId)
    .single();

  if (!invoice || invoice.status === 'paid') {
    return invoice?.status === 'paid';
  }

  // Update invoice status
  const { error } = await supabase
    .from('invoices')
    .update({
      status: 'paid',
      paid_at: new Date().toISOString(),
      payment_method: 'stripe',
      updated_at: new Date().toISOString(),
    })
    .eq('id', invoiceId);

  if (error) {
    console.error('Failed to update invoice as paid:', error);
    return false;
  }

  return true;
}

export default async function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const params = await searchParams;
  const sessionId = params.session_id;

  let paymentVerified = false;
  let invoiceNumber = '';

  if (sessionId) {
    const session = await verifyCheckoutSession(sessionId);
    if (session?.paid && session.invoiceId) {
      paymentVerified = await markInvoiceAsPaid(session.invoiceId);
      invoiceNumber = session.invoiceNumber;
    }
  }

  // If no session_id or verification failed, show generic success
  // (webhook will handle it, or user came here directly)
  if (!sessionId) {
    paymentVerified = true; // Assume success if no session to verify
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-8">
          <div className={`w-16 h-16 ${paymentVerified ? 'bg-emerald-500/20' : 'bg-amber-500/20'} rounded-full flex items-center justify-center mx-auto mb-6`}>
            {paymentVerified ? (
              <CheckCircle2 className="w-8 h-8 text-emerald-400" />
            ) : (
              <XCircle className="w-8 h-8 text-amber-400" />
            )}
          </div>

          <h1 className="text-2xl font-bold text-zinc-100 mb-2">
            {paymentVerified ? 'Payment Successful' : 'Payment Processing'}
          </h1>

          {invoiceNumber && (
            <p className="text-teal-400 text-sm mb-4">
              Invoice {invoiceNumber}
            </p>
          )}

          <p className="text-zinc-400 mb-6">
            {paymentVerified
              ? 'Thank you! Your payment has been processed successfully. A receipt will be sent to your email.'
              : 'Your payment is being processed. The invoice will be updated shortly.'}
          </p>

          <div className="bg-zinc-800/50 rounded-lg p-4 mb-6">
            <p className="text-sm text-zinc-500">
              {paymentVerified
                ? 'The invoice has been automatically marked as paid. You can close this window.'
                : 'Please allow a few moments for the payment to be confirmed.'}
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
