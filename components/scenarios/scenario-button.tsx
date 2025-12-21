'use client';

import { useState } from 'react';
import { Calculator } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScenarioModal } from './scenario-modal';

export type ScenarioButtonVariant = 'fab' | 'card' | 'mobile-nav' | 'nav';

export interface ScenarioButtonProps {
  variant?: ScenarioButtonVariant;
  className?: string;
  source?: 'calendar' | 'dashboard' | 'mobile-nav';
  label?: string;
}

export function ScenarioButton({ variant = 'fab', className, source, label }: ScenarioButtonProps) {
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

  if (variant === 'nav') {
    const buttonLabel = label ?? 'Afford it?';
    return (
      <>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={cn(
            'px-3 py-2 min-h-[44px]',
            'text-sm font-medium rounded-md whitespace-nowrap',
            'transition-colors',
            'inline-flex items-center gap-2',
            // Make it feel like a native "primary action" in the nav (more discoverable than a plain tab)
            'bg-teal-50 text-teal-800 hover:bg-teal-100 hover:text-teal-900',
            'border border-teal-200/80',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white',
            className
          )}
          aria-label="Can I Afford It?"
          title="Can I Afford It?"
        >
          <Calculator className="w-4 h-4" />
          <span>{buttonLabel}</span>
        </button>

        <ScenarioModal open={open} onClose={() => setOpen(false)} source={source ?? 'dashboard'} />
      </>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          // Mobile FAB (above bottom nav) + desktop FAB
          'fixed z-40 inline-flex',
          'right-4 bottom-[calc(4rem+env(safe-area-inset-bottom,0px)+1rem)]',
          'md:right-5 md:bottom-5',
          'items-center justify-center',
          'bg-teal-500 hover:bg-teal-600 text-white font-semibold',
          'shadow-lg border border-teal-400/30',
          'w-14 h-14 rounded-full',
          'md:w-auto md:h-auto md:gap-2 md:px-4 md:py-3 md:min-h-[48px]',
          'focus:outline-none focus:ring-2 focus:ring-teal-300 focus:ring-offset-2 focus:ring-offset-zinc-900',
          className
        )}
        aria-label="Can I Afford It?"
      >
        <Calculator className="w-6 h-6 md:w-5 md:h-5" />
        <span className="hidden md:inline">Can I Afford It?</span>
      </button>

      <ScenarioModal open={open} onClose={() => setOpen(false)} source={source ?? 'calendar'} />
    </>
  );
}


