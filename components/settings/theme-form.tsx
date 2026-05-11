'use client';

import { useTheme } from '@/components/theme/theme-provider';
import { Sun, Moon, Monitor } from 'lucide-react';

const themeOptions = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Monitor },
] as const;

export function ThemeForm() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="bg-zinc-900 dark:bg-zinc-900 rounded-xl border border-zinc-800 p-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-sm font-medium text-zinc-100">Appearance</h3>
          <p className="text-sm text-zinc-400 mt-1">
            Choose how Cashcast looks to you
          </p>
        </div>

        <div className="flex gap-2">
          {themeOptions.map((option) => {
            const Icon = option.icon;
            const isActive = theme === option.value;
            return (
              <button
                key={option.value}
                onClick={() => setTheme(option.value)}
                className={[
                  'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium',
                  'border transition-colors duration-150',
                  isActive
                    ? 'bg-teal-500/10 border-teal-500 text-teal-400'
                    : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-600 hover:text-zinc-300',
                ].join(' ')}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{option.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
