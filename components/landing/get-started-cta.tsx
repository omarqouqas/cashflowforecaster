'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

type Props = {
  className?: string;
  label?: string;
};

export function GetStartedCTA({ className, label = 'Get Started Free' }: Props) {
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
      variant="primary"
      onClick={handleGetStarted}
      className={className}
    >
      {label}
    </Button>
  );
}


