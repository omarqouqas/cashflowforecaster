'use client';

import { Toaster } from 'react-hot-toast';

export function AppToaster() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: '#ffffff',
          color: '#18181b',
          border: '1px solid #e4e4e7',
          borderRadius: '12px',
        },
      }}
    />
  );
}
