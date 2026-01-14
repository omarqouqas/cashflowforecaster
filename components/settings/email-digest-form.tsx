'use client';

import { useState, useTransition } from 'react';

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
    <div className="bg-white dark:bg-zinc-900 rounded-lg shadow border border-slate-200 dark:border-zinc-800 p-6">
      <h2 className="text-lg font-semibold text-slate-900 dark:text-zinc-100 mb-4">
        Email Preferences
      </h2>

      <div className="space-y-4">
        {/* Weekly Digest Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 py-3 border-b border-slate-200 dark:border-zinc-800">
          <div>
            <p className="text-slate-900 dark:text-zinc-100 font-medium">Weekly Digest</p>
            <p className="text-sm text-slate-600 dark:text-zinc-400">
              Get a summary of your upcoming week on your preferred day
            </p>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={enabled}
            onClick={() => setEnabled((v) => !v)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              enabled ? 'bg-teal-500' : 'bg-zinc-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                enabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Day Selector */}
        {enabled && (
          <div className="py-3 border-b border-slate-200 dark:border-zinc-800">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
              <label className="text-slate-900 dark:text-zinc-100 font-medium">Send on</label>
              <select
                className={cn(
                  'text-base',
                  'min-h-[44px] w-full sm:w-[220px] rounded-md border border-slate-200 dark:border-zinc-800',
                  'bg-white dark:bg-zinc-950 px-3 py-2 text-slate-900 dark:text-zinc-100',
                  'focus:outline-none focus:ring-2 focus:ring-teal-500'
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
          </div>
        )}

        {success && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded p-3 text-sm text-green-800 dark:text-green-200">
            ✓ Email preferences saved
          </div>
        )}

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded p-3 text-sm text-red-800 dark:text-red-200">
            {error}
          </div>
        )}

        <div className="flex justify-end">
          <Button
            type="button"
            disabled={isPending}
            loading={isPending}
            onClick={() => startTransition(save)}
          >
            {isPending ? 'Saving...' : 'Save Email Preferences'}
          </Button>
        </div>
      </div>
    </div>
  );
}


