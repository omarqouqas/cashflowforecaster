'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormError } from '@/components/ui/form-error';
import { formatCurrency } from '@/lib/utils/format';

const safetyBufferSchema = z.object({
  safetyBuffer: z.coerce
    .number({
      required_error: 'Safety buffer is required',
      invalid_type_error: 'Safety buffer must be a number',
    })
    .min(50, 'Safety buffer must be at least $50')
    .multipleOf(50, 'Safety buffer must be a multiple of 50'),
});

type SafetyBufferFormData = z.infer<typeof safetyBufferSchema>;

interface SafetyBufferFormProps {
  initialValue?: number;
}

export function SafetyBufferForm({ initialValue = 500 }: SafetyBufferFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<SafetyBufferFormData>({
    resolver: zodResolver(safetyBufferSchema),
    defaultValues: {
      safetyBuffer: initialValue,
    },
  });

  const safetyBuffer = watch('safetyBuffer') || initialValue;

  // Calculate thresholds
  const thresholds = {
    safe: safetyBuffer * 2,
    caution: safetyBuffer * 1.5,
    low: safetyBuffer,
  };

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
        .select('safety_buffer')
        .eq('user_id', user.id)
        .single();

      if (!fetchError && data?.safety_buffer !== null && data?.safety_buffer !== undefined) {
        reset({ safetyBuffer: data.safety_buffer });
      }

      setIsLoading(false);
    }

    fetchSettings();
  }, [reset]);

  const onSubmit = async (data: SafetyBufferFormData) => {
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    const supabase = createClient();

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError('You must be logged in');
      setIsSubmitting(false);
      return;
    }

    // Upsert user settings
    const { error: upsertError } = await supabase
      .from('user_settings')
      .upsert(
        {
          user_id: user.id,
          safety_buffer: data.safetyBuffer,
        },
        {
          onConflict: 'user_id',
        }
      );

    if (upsertError) {
      setError(upsertError.message);
    } else {
      setSuccess(true);
      // Refresh to update cached data
      router.refresh();
      // Clear success message after 3 seconds
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
        Safety Buffer
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Safety Buffer Input */}
        <div>
          <Label htmlFor="safetyBuffer">Minimum Balance (Safety Buffer)</Label>
          <div className="relative mt-1">
            <span className="absolute left-3 top-2.5 text-gray-500 dark:text-gray-400">$</span>
            <Input
              id="safetyBuffer"
              type="number"
              min="50"
              step="50"
              placeholder="500"
              className="pl-8"
              {...register('safetyBuffer')}
            />
          </div>
          <FormError message={errors.safetyBuffer?.message} />
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            We&apos;ll warn you when your projected balance drops below this amount
          </p>
        </div>

        {/* Threshold Preview */}
        <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
          <p className="text-sm font-medium text-slate-900 dark:text-white mb-3">
            Threshold Preview
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded p-2">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Safe (green)</p>
              <p className="text-sm font-semibold text-green-700 dark:text-green-300">
                {formatCurrency(thresholds.safe)}+
              </p>
            </div>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded p-2">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Caution (yellow)</p>
              <p className="text-sm font-semibold text-yellow-700 dark:text-yellow-300">
                {formatCurrency(thresholds.caution)}+
              </p>
            </div>
            <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded p-2">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Low (orange)</p>
              <p className="text-sm font-semibold text-orange-700 dark:text-orange-300">
                {formatCurrency(thresholds.low)}+
              </p>
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded p-2">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Danger (red)</p>
              <p className="text-sm font-semibold text-red-700 dark:text-red-300">
                Below {formatCurrency(thresholds.low)}
              </p>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded p-3 text-sm text-green-800 dark:text-green-200">
            ✓ Settings saved successfully
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded p-3 text-sm text-red-800 dark:text-red-200">
            {error}
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting} loading={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </form>
    </div>
  );
}

