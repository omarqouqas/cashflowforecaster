'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { FormError } from '@/components/ui/form-error';

const TIMEZONE_GROUPS: Array<{ label: string; options: Array<{ value: string; label: string }> }> =
  [
    {
      label: 'North America',
      options: [
        { value: 'America/Vancouver', label: 'Vancouver (America/Vancouver)' },
        { value: 'America/Los_Angeles', label: 'Los Angeles (America/Los_Angeles)' },
        { value: 'America/Denver', label: 'Denver (America/Denver)' },
        { value: 'America/Chicago', label: 'Chicago (America/Chicago)' },
        { value: 'America/Toronto', label: 'Toronto (America/Toronto)' },
        { value: 'America/New_York', label: 'New York (America/New_York)' },
      ],
    },
    {
      label: 'Europe',
      options: [
        { value: 'Europe/London', label: 'London (Europe/London)' },
        { value: 'Europe/Paris', label: 'Paris (Europe/Paris)' },
      ],
    },
    {
      label: 'Asia Pacific',
      options: [
        { value: 'Asia/Singapore', label: 'Singapore (Asia/Singapore)' },
        { value: 'Asia/Tokyo', label: 'Tokyo (Asia/Tokyo)' },
      ],
    },
    {
      label: 'Australia',
      options: [{ value: 'Australia/Sydney', label: 'Sydney (Australia/Sydney)' }],
    },
    {
      label: 'UTC',
      options: [{ value: 'UTC', label: 'UTC' }],
    },
  ];

const ALLOWED_TIMEZONES = new Set(
  TIMEZONE_GROUPS.flatMap((g) => g.options.map((o) => o.value))
);

const timezoneSchema = z.object({
  timezone: z
    .string()
    .min(1, 'Timezone is required')
    .refine((tz) => ALLOWED_TIMEZONES.has(tz), 'Please select a valid timezone'),
});

type TimezoneFormData = z.infer<typeof timezoneSchema>;

interface TimezoneFormProps {
  initialValue?: string | null;
}

function getBrowserTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  } catch {
    return 'UTC';
  }
}

function formatTimeInTimezone(date: Date, tz: string): string {
  try {
    return new Intl.DateTimeFormat('en-US', {
      timeZone: tz,
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(date);
  } catch {
    return date.toLocaleString();
  }
}

export function TimezoneForm({ initialValue }: TimezoneFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [savedTimezone, setSavedTimezone] = useState<string | null>(initialValue ?? null);
  const [now, setNow] = useState<Date>(() => new Date());

  const browserTz = useMemo(() => getBrowserTimezone(), []);
  const defaultTz = useMemo(() => {
    if (initialValue && ALLOWED_TIMEZONES.has(initialValue)) return initialValue;
    if (ALLOWED_TIMEZONES.has(browserTz)) return browserTz;
    return 'UTC';
  }, [browserTz, initialValue]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<TimezoneFormData>({
    resolver: zodResolver(timezoneSchema),
    defaultValues: {
      timezone: defaultTz,
    },
  });

  const timezone = watch('timezone') || defaultTz;

  const showUseDetected =
    Boolean(browserTz) &&
    Boolean(savedTimezone) &&
    browserTz !== savedTimezone &&
    ALLOWED_TIMEZONES.has(browserTz);

  useEffect(() => {
    async function fetchSettings() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setIsLoading(false);
        return;
      }

      const { data, error: fetchError } = await supabase
        .from('user_settings')
        .select('timezone')
        .eq('user_id', user.id)
        .single();

      if (!fetchError) {
        const tz = data?.timezone ?? null;
        setSavedTimezone(tz);
        if (tz && ALLOWED_TIMEZONES.has(tz)) {
          reset({ timezone: tz });
        }
      }

      setIsLoading(false);
    }

    fetchSettings();
  }, [reset]);

  // Live time preview
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const onSubmit = async (data: TimezoneFormData) => {
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError('You must be logged in');
      setIsSubmitting(false);
      return;
    }

    const { error: upsertError } = await supabase
      .from('user_settings')
      .upsert(
        {
          user_id: user.id,
          timezone: data.timezone,
        },
        {
          onConflict: 'user_id',
        }
      );

    if (upsertError) {
      setError(upsertError.message);
    } else {
      setSuccess(true);
      setSavedTimezone(data.timezone);
      router.refresh();
      setTimeout(() => setSuccess(false), 3000);
    }

    setIsSubmitting(false);
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow border border-slate-200 dark:border-slate-700 p-6">
        <div className="flex items-center justify-center py-8">
          <svg
            className="animate-spin h-6 w-6 text-blue-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow border border-slate-200 dark:border-slate-700 p-6">
      <h2 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">
        Timezone
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <div className="flex items-center justify-between gap-3">
            <Label htmlFor="timezone">Timezone</Label>
            {showUseDetected && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setValue('timezone', browserTz, { shouldDirty: true, shouldValidate: true })}
              >
                Use detected timezone
              </Button>
            )}
          </div>
          <div className="mt-1">
            <select
              id="timezone"
              className={[
                'flex h-11 w-full rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-900',
                'focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent',
                'disabled:cursor-not-allowed disabled:opacity-50',
              ].join(' ')}
              {...register('timezone')}
            >
              {TIMEZONE_GROUPS.map((group) => (
                <optgroup key={group.label} label={group.label}>
                  {group.options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
          <FormError message={errors.timezone?.message} />
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Used to display dates correctly in your calendar. Detected: <span className="font-mono">{browserTz}</span>
          </p>
        </div>

        {/* Preview */}
        <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
          <p className="text-sm font-medium text-slate-900 dark:text-white mb-1">
            Current time preview
          </p>
          <div className="space-y-1">
            <p className="text-xs text-gray-600 dark:text-gray-400">Timezone</p>
            <p className="text-sm text-gray-900 dark:text-gray-100 font-mono">{timezone}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">Current time</p>
            <p className="text-sm text-gray-900 dark:text-gray-100 font-mono">
              {formatTimeInTimezone(now, timezone)}
            </p>
          </div>
        </div>

        {success && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded p-3 text-sm text-green-800 dark:text-green-200">
            ✓ Settings saved successfully
          </div>
        )}

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded p-3 text-sm text-red-800 dark:text-red-200">
            {error}
          </div>
        )}

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting} loading={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </form>
    </div>
  );
}


