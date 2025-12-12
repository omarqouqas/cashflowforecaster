'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';

const resetSchema = z.object({
  email: z.string().email('Invalid email address'),
});

type ResetFormData = z.infer<typeof resetSchema>;

export default function ResetPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetFormData>({
    resolver: zodResolver(resetSchema),
  });

  const formatErrorMessage = (errorMessage: string): string => {
    const lowerMessage = errorMessage.toLowerCase();

    if (
      lowerMessage.includes('network') ||
      lowerMessage.includes('fetch') ||
      lowerMessage.includes('connection') ||
      lowerMessage.includes('failed to fetch')
    ) {
      return 'Unable to connect. Please try again.';
    }
    if (
      lowerMessage.includes('email not found') ||
      lowerMessage.includes('user not found')
    ) {
      return 'No account found with this email address';
    }

    return errorMessage;
  };

  const onSubmit = async (data: ResetFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        data.email,
        {
          redirectTo: `${window.location.origin}/auth/update-password`,
        }
      );

      if (resetError) {
        setError(formatErrorMessage(resetError.message));
      } else {
        setEmailSent(true);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTryAgain = () => {
    setEmailSent(false);
    setError(null);
  };

  if (emailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 px-6 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-8 space-y-6">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-green-600 dark:text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                Check your email
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                We&apos;ve sent a password reset link to your email address.
                Click the link in the email to reset your password.
              </p>
            </div>

            <div className="space-y-3">
              <Link href="/auth/login">
                <Button
                  type="button"
                  variant="primary"
                  size="md"
                  fullWidth
                >
                  Back to login
                </Button>
              </Link>

              <button
                type="button"
                onClick={handleTryAgain}
                className="w-full text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
              >
                Didn&apos;t receive email? Try again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 px-6 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-8 space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Reset Your Password
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Enter your email and we&apos;ll send you a reset link
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                {...register('email')}
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="you@example.com"
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-sm text-red-600 dark:text-red-400">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="md"
              fullWidth
              loading={isLoading}
              disabled={isLoading}
            >
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </Button>
          </form>

          {/* Back to Login Link */}
          <div className="text-center pt-4 border-t border-slate-200 dark:border-slate-700">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Remember your password?{' '}
              <Link
                href="/auth/login"
                className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
              >
                Back to login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

