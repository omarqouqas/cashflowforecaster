'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ComponentPropsWithoutRef<'button'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-teal-600 text-white hover:bg-teal-700 shadow-sm',
  secondary: 'bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50 shadow-sm',
  outline: 'bg-transparent border border-zinc-200 text-zinc-700 hover:bg-zinc-50',
  ghost: 'bg-transparent text-zinc-700 hover:bg-zinc-100',
  danger: 'bg-rose-600 text-white hover:bg-rose-700 shadow-sm',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-11 px-3 text-sm',
  md: 'h-11 px-4 text-sm',
  lg: 'h-12 px-6 text-base',
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      loading = false,
      fullWidth = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center gap-2 font-medium rounded-md transition-colors duration-150',
          'focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 focus:ring-offset-white',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
          variantStyles[variant],
          sizeStyles[size],
          fullWidth && 'w-full',
          className
        )}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
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
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
export default Button;
