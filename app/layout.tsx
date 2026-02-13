import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AppToaster } from '@/components/ui/toaster';
import { PostHogProvider } from './providers/posthog-provider';
import { Analytics } from '@vercel/analytics/next';
import { organizationSchema, websiteSchema } from '@/components/seo/schemas';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.cashflowforecaster.io'),
  title: 'Cash Flow Calendar for Freelancers | Cash Flow Forecaster',
  description:
    'Cash flow calendar for freelancers with irregular income—see your bank balance up to 365 days ahead and avoid overdrafts before they happen.',
  keywords: [
    // Core product terms
    'cash flow calendar',
    'cash flow calendar app',
    'cash flow forecasting',
    'cash flow forecast app',
    // Freelancer terms
    'freelancer cash flow',
    'freelancer budgeting',
    'freelancer finances',
    // Solopreneur terms
    'solopreneur cash flow',
    'solopreneur finances',
    'solopreneur budgeting app',
    // Self-employed terms
    'self-employed budgeting',
    'self-employed money management',
    'self-employed cash flow',
    // Gig worker / 1099 terms
    'gig worker budget',
    'gig worker finances',
    '1099 contractor finances',
    '1099 income tracking',
    // Income type terms
    'irregular income budgeting',
    'variable income budgeting',
    'side hustle income tracking',
    // Feature terms
    'bank balance forecast',
    'bill tracking app',
  ],
  openGraph: {
    title: 'Cash Flow Calendar for Freelancers | Cash Flow Forecaster',
    description:
      'Cash flow calendar for freelancers with irregular income—see your bank balance up to 365 days ahead and avoid overdrafts before they happen.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cash Flow Calendar for Freelancers | Cash Flow Forecaster',
    description:
      'Cash flow calendar for freelancers with irregular income—see your bank balance up to 365 days ahead and avoid overdrafts before they happen.',
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

        {/* Favicon */}
        <link rel="icon" type="image/png" href="/logo.png" />

        {/* Organization and Website structured data for SEO/AEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
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