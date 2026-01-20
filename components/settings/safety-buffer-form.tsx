'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Gauge } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormError } from '@/components/ui/form-error';
import { formatCurrency } from '@/lib/utils/format';

const safetyBufferSchema = z.object({
  safetyBuffer: z.coerce
    .number({ message: 'Safety buffer must be a valid number' })
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
          <Gauge className="w-5 h-5 text-teal-400" />
        </div>
        <div>
          <h3 className="font-semibold text-zinc-100">Safety Buffer</h3>
          <p className="text-sm text-zinc-400">
            Minimum balance threshold for warnings
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Safety Buffer Input */}
        <div>
          <Label htmlFor="safetyBuffer" className="text-zinc-300">
            Minimum Balance
          </Label>
          <div className="relative mt-1.5">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
              $
            </span>
            <Input
              id="safetyBuffer"
              type="number"
              min="50"
              step="50"
              placeholder="500"
              className="pl-8 bg-zinc-950 border-zinc-800 text-zinc-100 focus:border-teal-500"
              {...register('safetyBuffer')}
            />
          </div>
          <FormError message={errors.safetyBuffer?.message} />
          <p className="text-sm text-zinc-500 mt-1.5">
            We&apos;ll warn you when your projected balance drops below this amount
          </p>
        </div>

        {/* Threshold Preview */}
        <div className="bg-zinc-950 rounded-lg p-4 border border-zinc-800">
          <p className="text-sm font-medium text-zinc-300 mb-3">
            Color Thresholds Preview
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-2.5">
              <p className="text-xs text-zinc-400 mb-0.5">Safe</p>
              <p className="text-sm font-semibold text-emerald-400">
                {formatCurrency(thresholds.safe)}+
              </p>
            </div>
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-2.5">
              <p className="text-xs text-zinc-400 mb-0.5">Caution</p>
              <p className="text-sm font-semibold text-amber-400">
                {formatCurrency(thresholds.caution)}+
              </p>
            </div>
            <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-2.5">
              <p className="text-xs text-zinc-400 mb-0.5">Low</p>
              <p className="text-sm font-semibold text-orange-400">
                {formatCurrency(thresholds.low)}+
              </p>
            </div>
            <div className="bg-rose-500/10 border border-rose-500/20 rounded-lg p-2.5">
              <p className="text-xs text-zinc-400 mb-0.5">Danger</p>
              <p className="text-sm font-semibold text-rose-400">
                &lt; {formatCurrency(thresholds.low)}
              </p>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3 text-sm text-emerald-400">
            Settings saved successfully
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-rose-500/10 border border-rose-500/20 rounded-lg p-3 text-sm text-rose-400">
            {error}
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting} loading={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  );
}
