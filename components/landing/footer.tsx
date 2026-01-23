'use client';

import Link from 'next/link';
import posthog from 'posthog-js';

export function LandingFooter() {
  return (
    <footer className="px-6 py-12 border-t border-zinc-900">
      <div className="mx-auto max-w-6xl grid grid-cols-2 md:grid-cols-5 gap-8 text-sm">
        <div className="col-span-2 md:col-span-1">
          <p className="text-white font-semibold">Cash Flow Forecaster</p>
          <p className="mt-2 text-zinc-400">Made for freelancers, by a freelancer.</p>
          <p className="mt-3 text-zinc-500 text-xs">
            The cash flow calendar app that shows your bank balance up to 365 days ahead.
          </p>
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
              All Free Tools
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
              Can I Afford It?
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
              Rate Calculator
            </Link>
            <Link
              href="/tools/invoice-payment-predictor"
              className="hover:text-zinc-200 transition-colors"
              onClick={() => {
                try {
                  posthog.capture('footer_free_tools_clicked', { link: '/tools/invoice-payment-predictor' });
                } catch {}
              }}
            >
              Payment Predictor
            </Link>
          </div>
        </div>

        <div>
          <p className="text-zinc-300 font-medium">Learn</p>
          <div className="mt-3 flex flex-col gap-2 text-zinc-400">
            <Link
              href="/blog"
              className="hover:text-zinc-200 transition-colors"
              onClick={() => {
                try {
                  posthog.capture('footer_blog_clicked', { link: '/blog' });
                } catch {}
              }}
            >
              Blog
            </Link>
            <Link
              href="/blog/how-to-manage-irregular-income-as-freelancer"
              className="hover:text-zinc-200 transition-colors"
              onClick={() => {
                try {
                  posthog.capture('footer_blog_clicked', { link: '/blog/how-to-manage-irregular-income-as-freelancer' });
                } catch {}
              }}
            >
              Irregular Income Guide
            </Link>
            <Link
              href="/blog/what-is-safe-to-spend"
              className="hover:text-zinc-200 transition-colors"
              onClick={() => {
                try {
                  posthog.capture('footer_blog_clicked', { link: '/blog/what-is-safe-to-spend' });
                } catch {}
              }}
            >
              What is Safe to Spend?
            </Link>
            <Link
              href="/compare/cash-flow-calendar-apps"
              className="hover:text-zinc-200 transition-colors"
              onClick={() => {
                try {
                  posthog.capture('footer_compare_clicked', { link: '/compare/cash-flow-calendar-apps' });
                } catch {}
              }}
            >
              Compare Apps
            </Link>
          </div>
        </div>

        <div>
          <p className="text-zinc-300 font-medium">Product</p>
          <div className="mt-3 flex flex-col gap-2 text-zinc-400">
            <Link href="/#features" className="hover:text-zinc-200 transition-colors">
              Features
            </Link>
            <Link href="/#how-it-works" className="hover:text-zinc-200 transition-colors">
              How It Works
            </Link>
            <Link href="/pricing" className="hover:text-zinc-200 transition-colors">
              Pricing
            </Link>
            <Link href="/auth/signup" className="hover:text-zinc-200 transition-colors">
              Get Started Free
            </Link>
          </div>
        </div>

        <div>
          <p className="text-zinc-300 font-medium">Company</p>
          <div className="mt-3 flex flex-col gap-2 text-zinc-400">
            <Link href="/privacy" className="hover:text-zinc-200 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-zinc-200 transition-colors">
              Terms of Service
            </Link>
            <Link href="mailto:support@cashflowforecaster.io" className="hover:text-zinc-200 transition-colors">
              Contact Us
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl mt-10 pt-6 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-500">
        <p>&copy; {new Date().getFullYear()} Cash Flow Forecaster. All rights reserved.</p>
        <p className="inline-flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-teal-500" aria-hidden="true" />
          Built to help you stay cash-positive
        </p>
      </div>
    </footer>
  );
}

