'use client';

import { Check } from 'lucide-react';

type Step = {
  number: number;
  title: string;
  status: 'completed' | 'current' | 'pending';
};

type Props = {
  steps: Step[];
};

export function StepIndicator({ steps }: Props) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {steps.map((step, idx) => (
          <div key={step.number} className="flex items-center flex-1">
            {/* Step Circle */}
            <div className="flex flex-col items-center">
              <div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm
                  transition-all duration-200
                  ${
                    step.status === 'completed'
                      ? 'bg-teal-500 text-white'
                      : step.status === 'current'
                      ? 'bg-teal-500 text-white ring-4 ring-teal-500/20'
                      : 'bg-zinc-800 text-zinc-500 border-2 border-zinc-700'
                  }
                `}
              >
                {step.status === 'completed' ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <span>{step.number}</span>
                )}
              </div>
              <p
                className={`
                  mt-2 text-xs font-medium whitespace-nowrap
                  ${
                    step.status === 'current'
                      ? 'text-teal-400'
                      : step.status === 'completed'
                      ? 'text-zinc-400'
                      : 'text-zinc-600'
                  }
                `}
              >
                {step.title}
              </p>
            </div>

            {/* Connector Line */}
            {idx < steps.length - 1 && (
              <div className="flex-1 h-0.5 mx-2 -mt-6">
                <div
                  className={`
                    h-full transition-all duration-200
                    ${step.status === 'completed' ? 'bg-teal-500' : 'bg-zinc-800'}
                  `}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
