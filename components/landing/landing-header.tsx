'use client';

import * as React from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { GetStartedCTA } from '@/components/landing/get-started-cta';

const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: "Who It's For", href: '#who-its-for' },
  { label: 'Pricing', href: '#pricing' },
] as const;

export default function LandingHeader() {
  const [open, setOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur">
      <nav className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-white font-semibold">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500/15 ring-1 ring-teal-500/30">
            <span className="h-3 w-3 rounded-sm bg-teal-500" aria-hidden="true" />
          </span>
          <span>Cash Flow Forecaster</span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm text-zinc-300">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="hover:text-white transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <GetStartedCTA
            size="md"
            className="bg-teal-500 hover:bg-teal-400 text-zinc-950 focus:ring-teal-400 focus:ring-offset-zinc-950"
          />
        </div>

        <button
          type="button"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="landing-mobile-nav"
          onClick={() => setOpen((v) => !v)}
          className="md:hidden inline-flex items-center justify-center h-10 w-10 rounded-md border border-zinc-800 bg-zinc-950/40 text-zinc-200 hover:text-white hover:bg-zinc-900/40 transition-colors"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {open && (
        <div
          id="landing-mobile-nav"
          className="md:hidden border-t border-zinc-800 bg-zinc-950/95 backdrop-blur"
        >
          <div className="mx-auto max-w-6xl px-6 py-4 space-y-3">
            <div className="grid gap-1">
              {NAV_LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="rounded-md px-3 py-2 text-sm text-zinc-200 hover:text-white hover:bg-zinc-900/50 transition-colors"
                >
                  {l.label}
                </Link>
              ))}
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <GetStartedCTA
                size="md"
                fullWidth
                onClick={() => setOpen(false)}
                className="bg-teal-500 hover:bg-teal-400 text-zinc-950 focus:ring-teal-400 focus:ring-offset-zinc-950"
              />
              <Link
                href="/auth/login"
                onClick={() => setOpen(false)}
                className="text-center text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
              >
                Log in
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}


