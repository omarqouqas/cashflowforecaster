'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Globe } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { FormError } from '@/components/ui/form-error';
import { cn } from '@/lib/utils/cn';

const TIMEZONE_GROUPS: Array<{
  label: string;
  options: Array<{ value: string; label: string }>;
}> = [
  {
    label: 'North America',
    options: [
      { value: 'America/Vancouver', label: 'Vancouver (Pacific)' },
      { value: 'America/Los_Angeles', label: 'Los Angeles (Pacific)' },
      { value: 'America/Denver', label: 'Denver (Mountain)' },
      { value: 'America/Chicago', label: 'Chicago (Central)' },
      { value: 'America/Toronto', label: 'Toronto (Eastern)' },
      { value: 'America/New_York', label: 'New York (Eastern)' },
    ],
  },
  {
    label: 'Europe',
    options: [
      { value: 'Europe/London', label: 'London (GMT)' },
      { value: 'Europe/Paris', label: 'Paris (CET)' },
    ],
  },
  {
    label: 'Asia Pacific',
    options: [
      { value: 'Asia/Singapore', label: 'Singapore (SGT)' },
      { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
    ],
  },
  {
    label: 'Australia',
    options: [{ value: 'Australia/Sydney', label: 'Sydney (AEST)' }],
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
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
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
  const [savedTimezone, setSavedTimezone] = useState<string | null>(
    initialValue ?? null
  );
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

    const { error: upsertError } = await supabase.from('user_settings').upsert(
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
      <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6">
        <div className="flex items-center justify-center py-8">
          <svg
            className="animate-spin h-6 w-6 text-teal-500"
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
    <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center">
          <Globe className="w-5 h-5 text-teal-400" />
        </div>
        <div>
          <h3 className="font-semibold text-zinc-100">Timezone</h3>
          <p className="text-sm text-zinc-400">
            Used for date calculations in your calendar
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <div className="flex items-center justify-between gap-3 mb-1.5">
            <Label htmlFor="timezone" className="text-zinc-300">
              Select Timezone
            </Label>
            {showUseDetected && (
              <button
                type="button"
                onClick={() =>
                  setValue('timezone', browserTz, {
                    shouldDirty: true,
                    shouldValidate: true,
                  })
                }
                className="text-xs text-teal-400 hover:text-teal-300 transition-colors"
              >
                Use detected ({browserTz.split('/').pop()})
              </button>
            )}
          </div>
          <select
            id="timezone"
            className={cn(
              'flex h-11 w-full rounded-lg border border-zinc-800',
              'bg-zinc-950 px-3 py-2 text-sm text-zinc-100',
              'focus:outline-none focus:ring-2 focus:ring-teal-500',
              'disabled:cursor-not-allowed disabled:opacity-50'
            )}
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
          <FormError message={errors.timezone?.message} />
        </div>

        {/* Preview */}
        <div className="bg-zinc-950 rounded-lg p-4 border border-zinc-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-zinc-500 mb-0.5">Current time in</p>
              <p className="text-sm font-mono text-zinc-300">{timezone}</p>
            </div>
            <p className="text-lg font-mono text-zinc-100 tabular-nums">
              {formatTimeInTimezone(now, timezone)}
            </p>
          </div>
        </div>

        {success && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3 text-sm text-emerald-400">
            Timezone saved successfully
          </div>
        )}

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/20 rounded-lg p-3 text-sm text-rose-400">
            {error}
          </div>
        )}

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting} loading={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  );
}
