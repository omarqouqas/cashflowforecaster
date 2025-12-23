import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AppToaster } from '@/components/ui/toaster';
import { PostHogProvider } from './providers/posthog-provider';
import { Analytics } from '@vercel/analytics/next';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Cash Flow Forecaster - See Your Financial Future',
  description: 'Project your bank balance 60 days into the future. Know exactly when you\'ll run low before it happens. The calendar that stops you from bouncing rent.',
  keywords: 'cash flow forecast, budget calendar, financial planning, income tracking, bill tracking, freelancer budget',
  openGraph: {
    title: 'Cash Flow Forecaster',
    description: 'Project your bank balance 60 days into the future. Know exactly when you\'ll run low before it happens. The calendar that stops you from bouncing rent.',
  },
  // PWA metadata
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Cash Flow',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover', // Enables safe area insets for notched devices
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#09090b' }, // zinc-950
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        {/* Preconnect to improve performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* PWA icons */}
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      </head>
      <body className={`${inter.variable} font-sans antialiased bg-white text-zinc-900 selection-teal h-full`}>
        <PostHogProvider>
          {children}
        </PostHogProvider>
        <AppToaster />
        <Analytics />
      </body>
    </html>
  );
}