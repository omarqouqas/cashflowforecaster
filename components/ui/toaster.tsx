'use client';

import { Toaster } from 'react-hot-toast';

export function AppToaster() {
  return (
    <Toaster
      position="bottom-center"
      toastOptions={{
        duration: 3000,
        style: {
          background: '#27272a', // zinc-800
          color: '#fafafa',
          border: '1px solid #3f3f46', // zinc-700
          borderRadius: '12px',
        },
        success: {
          iconTheme: {
            primary: '#14b8a6', // teal-500
            secondary: '#fafafa',
          },
        },
        error: {
          iconTheme: {
            primary: '#ef4444', // red-500
            secondary: '#fafafa',
          },
        },
      }}
    />
  );
}
