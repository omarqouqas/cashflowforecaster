'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import type { ButtonProps } from '@/components/ui/button';

type Props = {
  className?: string;
  label?: string;
  variant?: ButtonProps['variant'];
  size?: ButtonProps['size'];
  fullWidth?: ButtonProps['fullWidth'];
  onClick?: () => void;
};

export function GetStartedCTA({
  className,
  label = 'Get Started Free',
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  onClick,
}: Props) {
  const router = useRouter();

  const handleGetStarted = () => {
    // localStorage is client-only
    if (typeof window === 'undefined') {
      router.push('/auth/signup');
      return;
    }

    let hasSignedUp: string | null = null;
    try {
      hasSignedUp = localStorage.getItem('hasSignedUp');
    } catch {
      // ignore
    }

    router.push(hasSignedUp === 'true' ? '/auth/login' : '/auth/signup');
  };

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      onClick={() => {
        onClick?.();
        handleGetStarted();
      }}
      className={className}
    >
      {label}
    </Button>
  );
}


