'use client';

import { useMemo, useState, useTransition } from 'react';

import { cn } from '@/lib/utils/cn';
import { updateDigestSettings } from '@/lib/actions/update-digest-settings';
import { Button } from '@/components/ui/button';

type Props = {
  initialEnabled?: boolean | null;
  initialDay?: number | null;
  initialTime?: string | null; // "HH:MM:SS" or "HH:MM"
};

function normalizeTime(value: string | null | undefined): string {
  if (!value) return '08:00';
  const m = /^(\d{2}):(\d{2})/.exec(value.trim());
  if (!m) return '08:00';
  return `${m[1]}:${m[2]}`;
}

const DAYS: Array<{ value: number; label: string }> = [
  { value: 0, label: 'Sunday' },
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' },
];

const TIMES: Array<{ value: string; label: string }> = [
  { value: '06:00', label: '6:00 AM' },
  { value: '07:00', label: '7:00 AM' },
  { value: '08:00', label: '8:00 AM' },
  { value: '09:00', label: '9:00 AM' },
  { value: '10:00', label: '10:00 AM' },
  { value: '11:00', label: '11:00 AM' },
];

export function EmailDigestForm({ initialEnabled, initialDay, initialTime }: Props) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const defaultEnabled = initialEnabled ?? true;
  const defaultDay = typeof initialDay === 'number' ? initialDay : 1;
  const defaultTime = useMemo(() => normalizeTime(initialTime ?? null), [initialTime]);

  const [enabled, setEnabled] = useState<boolean>(defaultEnabled);
  const [day, setDay] = useState<number>(defaultDay);
  const [time, setTime] = useState<string>(defaultTime);

  async function save() {
    setError(null);
    setSuccess(false);

    const fd = new FormData();
    fd.set('emailDigestEnabled', String(enabled));
    fd.set('emailDigestDay', String(day));
    fd.set('emailDigestTime', time);

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
              Get a summary of your upcoming week on your preferred schedule
            </p>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={enabled}
            onClick={() => setEnabled((v) => !v)}
            className={cn(
              'min-h-[44px] min-w-[44px]',
              'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
              'focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2',
              'focus:ring-offset-white dark:focus:ring-offset-zinc-900',
              enabled ? 'bg-teal-500' : 'bg-zinc-300 dark:bg-zinc-700'
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

        {/* Time Selector */}
        {enabled && (
          <div className="py-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
              <label className="text-slate-900 dark:text-zinc-100 font-medium">Time</label>
              <select
                className={cn(
                  'text-base',
                  'min-h-[44px] w-full sm:w-[220px] rounded-md border border-slate-200 dark:border-zinc-800',
                  'bg-white dark:bg-zinc-950 px-3 py-2 text-slate-900 dark:text-zinc-100',
                  'focus:outline-none focus:ring-2 focus:ring-teal-500'
                )}
                value={time}
                onChange={(e) => setTime(e.target.value)}
              >
                {TIMES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
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


