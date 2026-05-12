'use client';

import { Moon } from 'lucide-react';

export function ThemeForm() {
  return (
    <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-sm font-medium text-zinc-100">Appearance</h3>
          <p className="text-sm text-zinc-400 mt-1">
            Dark mode enabled
          </p>
        </div>

        <div className="flex gap-2">
          <div
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border bg-teal-500/10 border-teal-500 text-teal-400"
          >
            <Moon className="w-4 h-4" />
            <span className="hidden sm:inline">Dark</span>
          </div>
        </div>
      </div>
    </div>
  );
}
