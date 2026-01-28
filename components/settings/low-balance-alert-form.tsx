'use client';

import { useState, useTransition } from 'react';
import { AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { updateAlertSettings } from '@/lib/actions/update-alert-settings';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils/format';

type Props = {
  initialEnabled?: boolean | null;
  safetyBuffer?: number;
  currency?: string;
};

export function LowBalanceAlertForm({ initialEnabled, safetyBuffer = 500, currency = 'USD' }: Props) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const defaultEnabled = initialEnabled ?? true;
  const [enabled, setEnabled] = useState<boolean>(defaultEnabled);

  async function save() {
    setError(null);
    setSuccess(false);

    const fd = new FormData();
    fd.set('lowBalanceAlertEnabled', String(enabled));

    const res = await updateAlertSettings(fd);
    if (!res.success) {
      setError(res.error ?? 'Failed to save');
      return;
    }
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  }

  const formattedBuffer = formatCurrency(safetyBuffer, currency);

  return (
    <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
          <AlertTriangle className="w-5 h-5 text-amber-400" />
        </div>
        <div>
          <h3 className="font-semibold text-zinc-100">Low Balance Alerts</h3>
          <p className="text-sm text-zinc-400">
            Get notified before your balance drops too low
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Alert Toggle */}
        <div className="flex items-center justify-between py-3 border-b border-zinc-800">
          <div>
            <p className="text-zinc-100 font-medium">Enable Low Balance Alerts</p>
            <p className="text-sm text-zinc-500">
              Email me when my balance is projected to drop below {formattedBuffer} within 7 days
            </p>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={enabled}
            onClick={() => setEnabled((v) => !v)}
            className={cn(
              'relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0',
              enabled ? 'bg-amber-500' : 'bg-zinc-700'
            )}
          >
            <span
              className={cn(
                'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                enabled ? 'translate-x-6' : 'translate-x-1'
              )}
            />
          </button>
        </div>

        {/* Info text */}
        <div className="text-sm text-zinc-500 bg-zinc-800/50 rounded-lg p-3">
          <p>
            Alerts use your <span className="text-zinc-300">Safety Buffer</span> setting ({formattedBuffer}) as the threshold.
            You can adjust this in the Preferences section above.
          </p>
          <p className="mt-2">
            To prevent alert fatigue, you&apos;ll receive at most one alert every 3 days.
          </p>
        </div>

        {success && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3 text-sm text-emerald-400">
            Alert preferences saved
          </div>
        )}

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/20 rounded-lg p-3 text-sm text-rose-400">
            {error}
          </div>
        )}

        <div className="flex justify-end pt-2">
          <Button
            type="button"
            disabled={isPending}
            loading={isPending}
            onClick={() => startTransition(save)}
          >
            {isPending ? 'Saving...' : 'Save Preferences'}
          </Button>
        </div>
      </div>
    </div>
  );
}
