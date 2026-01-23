import type { Metadata } from 'next';
import LandingHeader from '@/components/landing/landing-header';
import { LandingFooter } from '@/components/landing/footer';

export const metadata: Metadata = {
  title: {
    template: '%s | Cash Flow Forecaster Blog',
    default: 'Freelancer Finance Blog | Cash Flow Forecaster',
  },
  description: 'Expert guides on managing irregular income, cash flow forecasting, and financial planning for freelancers.',
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-zinc-950 text-white selection-teal scroll-smooth">
      {/* subtle dot grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 opacity-[0.22]"
        style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          backgroundPosition: 'center',
        }}
      />

      <LandingHeader />

      <main className="px-6 py-12">
        {children}
      </main>

      <LandingFooter />
    </div>
  );
}
