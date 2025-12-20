'use client';

import { useState } from 'react';
import { Calculator } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScenarioModal } from './scenario-modal';

export type ScenarioButtonVariant = 'fab' | 'card' | 'mobile-nav';

export interface ScenarioButtonProps {
  variant?: ScenarioButtonVariant;
  className?: string;
  source?: 'calendar' | 'dashboard' | 'mobile-nav';
}

export function ScenarioButton({ variant = 'fab', className, source }: ScenarioButtonProps) {
  const [open, setOpen] = useState(false);

  if (variant === 'card') {
    return (
      <>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={cn(
            'w-full text-left border border-zinc-200 bg-white rounded-lg p-6 hover:bg-zinc-50 transition-colors',
            'flex items-start justify-between gap-4',
            className
          )}
        >
          <div className="min-w-0">
            <p className="text-sm font-medium text-zinc-500 uppercase tracking-wide">Scenario Tester</p>
            <h3 className="mt-2 text-lg font-semibold text-zinc-900">Can I Afford It?</h3>
            <p className="mt-1 text-sm text-zinc-500">
              Test a hypothetical expense before committing.
            </p>
          </div>
          <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
            <Calculator className="w-6 h-6 text-teal-700" />
          </div>
        </button>

        <ScenarioModal open={open} onClose={() => setOpen(false)} source={source ?? 'dashboard'} />
      </>
    );
  }

  if (variant === 'mobile-nav') {
    return (
      <>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={cn(
            'flex flex-col items-center justify-center h-full',
            'transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-teal-300/60 focus:ring-offset-2 focus:ring-offset-zinc-900',
            className
          )}
          aria-label="Can I Afford It?"
        >
          <Calculator className="w-6 h-6" />
          <span className="text-[11px] mt-1 font-medium">Afford?</span>
        </button>

        <ScenarioModal open={open} onClose={() => setOpen(false)} source={source ?? 'mobile-nav'} />
      </>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          // Desktop-only FAB: on mobile we use the fixed bottom nav action instead.
          'hidden md:inline-flex',
          'md:fixed md:bottom-5 md:right-5 md:z-40',
          'items-center gap-2 px-4 py-3 min-h-[48px]',
          'bg-teal-500 hover:bg-teal-600 text-white font-semibold',
          'rounded-full shadow-lg border border-teal-400/30',
          'focus:outline-none focus:ring-2 focus:ring-teal-300 focus:ring-offset-2 focus:ring-offset-zinc-900',
          className
        )}
      >
        <Calculator className="w-5 h-5" />
        <span className="hidden sm:inline">Can I Afford It?</span>
        <span className="sm:hidden">Afford?</span>
      </button>

      <ScenarioModal open={open} onClose={() => setOpen(false)} source={source ?? 'calendar'} />
    </>
  );
}


