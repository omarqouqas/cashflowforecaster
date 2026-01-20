'use client';

import { useState, useTransition, useEffect } from 'react';
import { CreditCard, ExternalLink, CheckCircle2, AlertCircle, Loader2, RefreshCw, Unlink } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { Button } from '@/components/ui/button';
import {
  initiateStripeConnect,
  refreshConnectStatus,
  disconnectStripeConnect,
  getOnboardingLink,
} from '@/lib/actions/stripe-connect';

type ConnectStatus = 'not_connected' | 'pending' | 'active' | 'restricted';

type Props = {
  initialStatus: ConnectStatus;
  chargesEnabled?: boolean;
  payoutsEnabled?: boolean;
};

export function StripeConnectForm({ initialStatus, chargesEnabled = false, payoutsEnabled = false }: Props) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<ConnectStatus>(initialStatus);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Handle URL params for return from Stripe onboarding
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const connectParam = params.get('connect');

    if (connectParam === 'success' || connectParam === 'refresh') {
      // Refresh status after returning from Stripe
      handleRefresh();
      // Clean up URL
      const url = new URL(window.location.href);
      url.searchParams.delete('connect');
      window.history.replaceState({}, '', url.toString());
    }
  }, []);

  async function handleConnect() {
    setError(null);
    startTransition(async () => {
      const result = await initiateStripeConnect();
      if (!result.ok) {
        setError(result.error);
        return;
      }
      // Redirect to Stripe onboarding
      window.location.href = result.data.onboardingUrl;
    });
  }

  async function handleCompleteSetup() {
    setError(null);
    startTransition(async () => {
      const result = await getOnboardingLink();
      if (!result.ok) {
        setError(result.error);
        return;
      }
      // Redirect to Stripe onboarding
      window.location.href = result.data.onboardingUrl;
    });
  }

  async function handleRefresh() {
    setError(null);
    setIsRefreshing(true);
    const result = await refreshConnectStatus();
    setIsRefreshing(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    if (result.data) {
      setStatus(result.data.accountStatus as ConnectStatus);
    }
  }

  async function handleDisconnect() {
    if (!confirm('Are you sure you want to disconnect your Stripe account? Existing payment links will stop working.')) {
      return;
    }

    setError(null);
    startTransition(async () => {
      const result = await disconnectStripeConnect();
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setStatus('not_connected');
    });
  }

  return (
    <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center">
          <CreditCard className="w-5 h-5 text-teal-400" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-zinc-100">Stripe Payments</h3>
            <StatusBadge status={status} />
          </div>
          <p className="text-sm text-zinc-400">
            Accept payments directly on invoices
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Not Connected State */}
        {status === 'not_connected' && (
          <div className="bg-zinc-800/50 rounded-lg p-4">
            <p className="text-zinc-300 text-sm mb-3">
              Connect your Stripe account to add &quot;Pay Now&quot; buttons to your invoices.
              Clients can pay instantly with a credit card.
            </p>
            <ul className="text-sm text-zinc-400 space-y-1 mb-4">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-400" />
                <span>Payments go directly to your Stripe account</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-400" />
                <span>Invoices auto-marked as paid</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-400" />
                <span>Standard Stripe fees apply (2.9% + $0.30)</span>
              </li>
            </ul>
            <Button
              onClick={handleConnect}
              disabled={isPending}
              loading={isPending}
              className="w-full sm:w-auto"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Connect Stripe Account
            </Button>
          </div>
        )}

        {/* Pending/Incomplete Setup State */}
        {status === 'pending' && (
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-amber-300 font-medium">Setup Incomplete</p>
                <p className="text-sm text-amber-400/80 mt-1 mb-3">
                  Complete your Stripe account setup to start accepting payments.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button
                    onClick={handleCompleteSetup}
                    disabled={isPending}
                    loading={isPending}
                    size="sm"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Complete Setup
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    size="sm"
                  >
                    {isRefreshing ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <RefreshCw className="w-4 h-4 mr-2" />
                    )}
                    Refresh Status
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Restricted State */}
        {status === 'restricted' && (
          <div className="bg-rose-500/10 border border-rose-500/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-rose-300 font-medium">Account Restricted</p>
                <p className="text-sm text-rose-400/80 mt-1 mb-3">
                  Your Stripe account has restrictions. Please visit your Stripe Dashboard to resolve any issues.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button
                    onClick={handleCompleteSetup}
                    disabled={isPending}
                    loading={isPending}
                    size="sm"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Fix Issues
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    size="sm"
                  >
                    {isRefreshing ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <RefreshCw className="w-4 h-4 mr-2" />
                    )}
                    Refresh Status
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Active/Connected State */}
        {status === 'active' && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-emerald-300 font-medium">Stripe Connected</p>
                <p className="text-sm text-emerald-400/80 mt-1">
                  Your invoices will include &quot;Pay Now&quot; buttons. Payments go directly to your Stripe account.
                </p>
                <div className="mt-3 text-sm text-zinc-400 space-y-1">
                  <p>Charges enabled: {chargesEnabled ? '✓' : '✗'}</p>
                  <p>Payouts enabled: {payoutsEnabled ? '✓' : '✗'}</p>
                </div>
                <div className="mt-4">
                  <Button
                    variant="ghost"
                    onClick={handleDisconnect}
                    disabled={isPending}
                    size="sm"
                    className="text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
                  >
                    <Unlink className="w-4 h-4 mr-2" />
                    Disconnect Account
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/20 rounded-lg p-3 text-sm text-rose-400">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: ConnectStatus }) {
  const config = {
    not_connected: { label: 'Not Connected', className: 'bg-zinc-700 text-zinc-300' },
    pending: { label: 'Setup Incomplete', className: 'bg-amber-500/20 text-amber-400' },
    restricted: { label: 'Restricted', className: 'bg-rose-500/20 text-rose-400' },
    active: { label: 'Connected', className: 'bg-emerald-500/20 text-emerald-400' },
  };

  const { label, className } = config[status];

  return (
    <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium', className)}>
      {label}
    </span>
  );
}
