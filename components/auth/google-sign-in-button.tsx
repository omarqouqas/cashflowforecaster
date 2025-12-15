'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface GoogleSignInButtonProps
  extends Omit<React.ComponentPropsWithoutRef<'button'>, 'children'> {
  loading?: boolean
}

function GoogleLogo({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 48 48"
      width="20"
      height="20"
    >
      <path
        fill="#FFC107"
        d="M43.611 20.083H42V20H24v8h11.303C33.656 32.657 29.236 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.957 3.043l5.657-5.657C34.982 6.053 29.736 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
      />
      <path
        fill="#FF3D00"
        d="M6.306 14.691l6.571 4.819C14.655 16.108 19.009 12 24 12c3.059 0 5.842 1.154 7.957 3.043l5.657-5.657C34.982 6.053 29.736 4 24 4c-7.682 0-14.35 4.327-17.694 10.691z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.166 0 10.315-1.977 14.032-5.692l-6.489-5.489C29.548 34.938 26.888 36 24 36c-5.214 0-9.62-3.319-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.611 20.083H42V20H24v8h11.303c-.792 2.235-2.231 4.157-4.125 5.409h.001l6.489 5.489C36.736 39.053 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
      />
    </svg>
  )
}

function Spinner({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={cn('animate-spin', className)}
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
  )
}

export function GoogleSignInButton({
  className,
  loading = false,
  disabled,
  onClick,
  ...props
}: GoogleSignInButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        'w-full relative flex items-center justify-center',
        'bg-white text-zinc-800 border border-zinc-300 rounded-lg py-3 px-4',
        'hover:bg-zinc-50 transition-colors',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
        className
      )}
      {...props}
    >
      <span className="absolute left-4 flex items-center">
        {loading ? (
          <Spinner className="h-5 w-5 text-zinc-600" />
        ) : (
          <GoogleLogo className="h-5 w-5" />
        )}
      </span>
      <span className="text-sm font-medium">Continue with Google</span>
    </button>
  )
}


