import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Cash Flow Forecaster - See Your Financial Future',
  description: 'Project your bank balance 60 days into the future. Know exactly when you\'ll run low before it happens. The calendar that stops you from bouncing rent.',
  keywords: 'cash flow forecast, budget calendar, financial planning, income tracking, bill tracking, freelancer budget',
  openGraph: {
    title: 'Cash Flow Forecaster',
    description: 'Project your bank balance 60 days into the future. Know exactly when you\'ll run low before it happens. The calendar that stops you from bouncing rent.',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0f172a',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>{children}</body>
    </html>
  );
}
