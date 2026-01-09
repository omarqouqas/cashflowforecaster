'use client';

import Link from 'next/link';
import posthog from 'posthog-js';

export function LandingFooter() {
  return (
    <footer className="px-6 py-12 border-t border-zinc-900">
      <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
        <div>
          <p className="text-white font-semibold">Cash Flow Forecaster</p>
          <p className="mt-2 text-zinc-400">Made for freelancers, by a freelancer.</p>
        </div>

        <div>
          <p className="text-zinc-300 font-medium">Free Tools</p>
          <div className="mt-3 flex flex-col gap-2 text-zinc-400">
            <Link
              href="/tools"
              className="hover:text-zinc-200 transition-colors"
              onClick={() => {
                try {
                  posthog.capture('footer_free_tools_clicked', { link: '/tools' });
                } catch {}
              }}
            >
              Tools index
            </Link>
            <Link
              href="/tools/can-i-afford-it"
              className="hover:text-zinc-200 transition-colors"
              onClick={() => {
                try {
                  posthog.capture('footer_free_tools_clicked', { link: '/tools/can-i-afford-it' });
                } catch {}
              }}
            >
              Can I Afford It? Calculator
            </Link>
            <Link
              href="/tools/freelance-rate-calculator"
              className="hover:text-zinc-200 transition-colors"
              onClick={() => {
                try {
                  posthog.capture('footer_free_tools_clicked', { link: '/tools/freelance-rate-calculator' });
                } catch {}
              }}
            >
              Freelance Rate Calculator
            </Link>
          </div>
        </div>

        <div className="md:text-right">
          <p className="text-zinc-300 font-medium">Links</p>
          <div className="mt-3 flex flex-col md:items-end gap-2 text-zinc-400">
            <Link href="/privacy" className="hover:text-zinc-200 transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-zinc-200 transition-colors">
              Terms
            </Link>
            <Link href="mailto:support@cashflowforecaster.io" className="hover:text-zinc-200 transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl mt-10 pt-6 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-500">
        <p>(c) {new Date().getFullYear()} Cash Flow Forecaster</p>
        <p className="inline-flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-teal-500" aria-hidden="true" />
          Built to help you stay cash-positive
        </p>
      </div>
    </footer>
  );
}

