'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

export function LogoutButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await fetch('/auth/logout', { method: 'POST' });
      window.location.href = '/auth/login';
    } catch (error) {
      console.error('Logout error:', error);
      // Still redirect to login even if fetch fails
      window.location.href = '/auth/login';
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleLogout}
      variant="outline"
      size="md"
      loading={isLoading}
      disabled={isLoading}
    >
      Log out
    </Button>
  );
}

