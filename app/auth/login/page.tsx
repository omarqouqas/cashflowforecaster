'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { GoogleSignInButton } from '@/components/auth/google-sign-in-button';
import { OrDivider } from '@/components/auth/or-divider';
import { signInWithGoogle } from '@/lib/auth/oauth';
import { trackLogin } from '@/lib/posthog/events';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isOAuthLoading, setIsOAuthLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  const isBusy = isLoading || isOAuthLoading;

  // Show a friendly message if the OAuth callback redirected here with an error.
  useEffect(() => {
    if (searchParams.get('error') === 'oauth_error') {
      setError('Google sign-in failed. Please try again.');
    }
  }, [searchParams]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const formatErrorMessage = (errorMessage: string): string => {
    const lowerMessage = errorMessage.toLowerCase();

    if (
      lowerMessage.includes('invalid login credentials') ||
      lowerMessage.includes('invalid email or password') ||
      lowerMessage.includes('email or password') ||
      lowerMessage.includes('wrong password')
    ) {
      return 'Invalid email or password';
    }
    if (
      lowerMessage.includes('email not confirmed') ||
      lowerMessage.includes('email not verified') ||
      lowerMessage.includes('confirm your account')
    ) {
      return 'Please check your email to confirm your account';
    }
    if (
      lowerMessage.includes('network') ||
      lowerMessage.includes('fetch') ||
      lowerMessage.includes('connection') ||
      lowerMessage.includes('failed to fetch')
    ) {
      return 'Unable to connect. Please try again.';
    }

    return errorMessage;
  };

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (signInError) {
        setError(formatErrorMessage(signInError.message));
      } else {
        // Track login event
        trackLogin('email');
        router.push('/dashboard');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const onGoogleSignIn = async () => {
    setIsOAuthLoading(true);
    setError(null);

    try {
      const { error: oauthError } = await signInWithGoogle();
      if (oauthError) {
        setError('Google sign-in failed. Please try again.');
      }
    } catch {
      setError('Google sign-in failed. Please try again.');
    } finally {
      setIsOAuthLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 px-6 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-8 space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Welcome back
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Sign in to your Cash Flow Forecaster account
            </p>
          </div>

          <div className="space-y-4">
            <GoogleSignInButton
              onClick={onGoogleSignIn}
              loading={isOAuthLoading}
              disabled={isBusy}
            />
            <OrDivider />
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
                disabled={isBusy}
              />
              {errors.email && (
                <p className="text-sm text-red-600 dark:text-red-400">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  className="w-full px-4 py-2 pr-10 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Enter your password"
                  disabled={isBusy}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 focus:outline-none"
                  tabIndex={-1}
                  disabled={isBusy}
                >
                  {showPassword ? (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-600 dark:text-red-400">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Forgot Password Link */}
            <div className="flex items-center justify-between">
              <Link
                href="/auth/reset-password"
                className="text-sm text-blue-600 hover:underline"
              >
                Forgot password?
              </Link>
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
              disabled={isBusy}
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>

          {/* Signup Link */}
          <div className="text-center pt-4 border-t border-slate-200 dark:border-slate-700">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Don&apos;t have an account?{' '}
              <Link
                href="/auth/signup"
                className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

