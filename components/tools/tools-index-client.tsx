'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import posthog from 'posthog-js';
import { BadgeDollarSign, Calendar, DollarSign, ArrowRight, TrendingUp } from 'lucide-react';
import { GetStartedCTA } from '@/components/landing/get-started-cta';

const TOOLS = [
  {
    slug: 'can-i-afford-it',
    title: 'Can I Afford It?',
    description:
      'Enter your current balance, upcoming bills, next income, and a purchase to see your projected lowest point.',
    href: '/tools/can-i-afford-it',
    icon: BadgeDollarSign,
  },
  {
    slug: 'freelance-rate-calculator',
    title: 'Freelance Rate Calculator',
    description:
      'Calculate your minimum hourly rate based on income goals, expenses, and realistic billable hours.',
    href: '/tools/freelance-rate-calculator',
    icon: DollarSign,
  },
  {
    slug: 'invoice-payment-predictor',
    title: 'Invoice Payment Predictor',
    description:
      "Calculate when you'll actually get paid based on invoice date, payment terms, and client history.",
    href: '/tools/invoice-payment-predictor',
    icon: Calendar,
  },
  {
    slug: 'income-variability-calculator',
    title: 'Income Variability Calculator',
    description:
      'Measure how stable your freelance income is. Get your variability score and emergency fund recommendation.',
    href: '/tools/income-variability-calculator',
    icon: TrendingUp,
  },
] as const;

export function ToolsIndexClient() {
  useEffect(() => {
    try {
      posthog.capture('tools_index_viewed');
    } catch {
      // best-effort
    }
  }, []);

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {TOOLS.map((tool) => {
          const Icon = tool.icon;
          return (
            <Link
              key={tool.slug}
              href={tool.href}
              onClick={() => {
                try {
                  posthog.capture('tools_index_tool_clicked', { tool: tool.slug });
                } catch {}
              }}
              className="group rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 hover:bg-zinc-900/55 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-zinc-950/40 border border-zinc-800 px-3 py-1 text-xs text-zinc-300">
                    <Icon className="h-3.5 w-3.5 text-teal-300" />
                    <span>Free tool</span>
                  </div>
                  <h2 className="mt-4 text-xl font-semibold text-white">{tool.title}</h2>
                  <p className="mt-2 text-sm text-zinc-400 leading-relaxed">{tool.description}</p>
                </div>

                <div className="flex-shrink-0 rounded-full border border-zinc-800 bg-zinc-950/40 h-10 w-10 flex items-center justify-center text-zinc-300 group-hover:text-white group-hover:border-zinc-700 transition-colors">
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div>
            <p className="text-lg font-semibold text-white">Want the full 90-day forecast?</p>
            <p className="mt-1 text-sm text-zinc-400">
              Cash Flow Forecaster gives you a calendar projection across multiple accounts, recurring items, and scenarios.
            </p>
          </div>
          <GetStartedCTA
            label="Get Started Free"
            className="bg-teal-500 hover:bg-teal-400 text-zinc-950 focus:ring-teal-400 focus:ring-offset-zinc-950"
            onClick={() => {
              try {
                posthog.capture('tools_index_cta_clicked');
              } catch {}
            }}
          />
        </div>
      </div>
    </div>
  );
}

