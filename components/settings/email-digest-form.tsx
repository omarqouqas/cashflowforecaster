'use client';

import { useState, useTransition } from 'react';
import { Mail } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { updateDigestSettings } from '@/lib/actions/update-digest-settings';
import { Button } from '@/components/ui/button';

type Props = {
  initialEnabled?: boolean | null;
  initialDay?: number | null;
};

const DAYS: Array<{ value: number; label: string }> = [
  { value: 0, label: 'Sunday' },
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' },
];

export function EmailDigestForm({ initialEnabled, initialDay }: Props) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const defaultEnabled = initialEnabled ?? true;
  const defaultDay = typeof initialDay === 'number' ? initialDay : 1;

  const [enabled, setEnabled] = useState<boolean>(defaultEnabled);
  const [day, setDay] = useState<number>(defaultDay);

  async function save() {
    setError(null);
    setSuccess(false);

    const fd = new FormData();
    fd.set('emailDigestEnabled', String(enabled));
    fd.set('emailDigestDay', String(day));

    const res = await updateDigestSettings(fd);
    if (!res.success) {
      setError(res.error ?? 'Failed to save');
      return;
    }
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  }

  return (
    <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center">
          <Mail className="w-5 h-5 text-teal-400" />
        </div>
        <div>
          <h3 className="font-semibold text-zinc-100">Weekly Digest</h3>
          <p className="text-sm text-zinc-400">
            Get a summary of your upcoming week
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Weekly Digest Toggle */}
        <div className="flex items-center justify-between py-3 border-b border-zinc-800">
          <div>
            <p className="text-zinc-100 font-medium">Enable Weekly Digest</p>
            <p className="text-sm text-zinc-500">
              Receive email summaries on your preferred day
            </p>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={enabled}
            onClick={() => setEnabled((v) => !v)}
            className={cn(
              'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
              enabled ? 'bg-teal-500' : 'bg-zinc-700'
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

        {/* Day Selector */}
        {enabled && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-3 border-b border-zinc-800">
            <label className="text-zinc-100 font-medium">Send on</label>
            <select
              className={cn(
                'text-base min-h-[44px] w-full sm:w-[200px] rounded-lg',
                'border border-zinc-800 bg-zinc-950 px-3 py-2',
                'text-zinc-100 focus:outline-none focus:ring-2 focus:ring-teal-500'
              )}
              value={day}
              onChange={(e) => setDay(Number(e.target.value))}
            >
              {DAYS.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {success && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3 text-sm text-emerald-400">
            Email preferences saved
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
