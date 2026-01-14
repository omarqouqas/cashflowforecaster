import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AppToaster } from '@/components/ui/toaster';
import { PostHogProvider } from './providers/posthog-provider';
import { Analytics } from '@vercel/analytics/next';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Cash Flow Calendar for Freelancers | Cash Flow Forecaster',
  description:
    'Cash flow calendar for freelancers with irregular income—see your bank balance 60 days ahead and avoid overdrafts before they happen.',
  keywords: [
    'cash flow calendar',
    'cash flow calendar app',
    'budget calendar app',
    'cash flow calendar for freelancers',
    'cash flow forecasting',
    'cash flow forecast app',
    'cash flow forecasting tool',
    'cash flow forecasting software',
    'freelancer budgeting',
    'irregular income budgeting',
    'bank balance forecast',
    'bill tracking',
  ],
  openGraph: {
    title: 'Cash Flow Calendar for Freelancers | Cash Flow Forecaster',
    description:
      'Cash flow calendar for freelancers with irregular income—see your bank balance 60 days ahead and avoid overdrafts before they happen.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cash Flow Calendar for Freelancers | Cash Flow Forecaster',
    description:
      'Cash flow calendar for freelancers with irregular income—see your bank balance 60 days ahead and avoid overdrafts before they happen.',
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
        
        {/* PWA icons - TODO: Add proper icons when branding is ready */}
        {/* <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" /> */}
        {/* <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" /> */}
        {/* <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" /> */}
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