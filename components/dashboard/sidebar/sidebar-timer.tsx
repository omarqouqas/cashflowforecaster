'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Play, Square, Clock, ChevronUp } from 'lucide-react';
import { useTimer } from '@/components/time/timer-context';
import { formatTimerCompact } from '@/lib/time/format-duration';
import { createTimeEntry } from '@/lib/actions/time-entries';
import { showSuccess, showError } from '@/lib/toast';
import { SidebarTooltip } from './sidebar-tooltip';
import posthog from 'posthog-js';

interface SidebarTimerProps {
  defaultHourlyRate: number;
  isCollapsed: boolean;
}

export function SidebarTimer({ defaultHourlyRate, isCollapsed }: SidebarTimerProps) {
  const { timer, startTimer, stopTimer, resetTimer } = useTimer();
  const [isExpanded, setIsExpanded] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [clientName, setClientName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus input when expanded
  useEffect(() => {
    if (isExpanded && inputRef.current && !timer.isRunning) {
      inputRef.current.focus();
    }
  }, [isExpanded, timer.isRunning]);

  const handleStart = () => {
    if (!projectName.trim()) {
      inputRef.current?.focus();
      return;
    }

    startTimer(projectName.trim(), clientName.trim());
    setIsExpanded(false);

    try {
      posthog.capture('timer_started', { project: projectName });
    } catch {}
  };

  const handleStop = async () => {
    setIsSaving(true);

    try {
      const stoppedTimer = await stopTimer();
      if (!stoppedTimer || !stoppedTimer.startTime) return;

      const result = await createTimeEntry({
        project_name: stoppedTimer.projectName,
        client_name: stoppedTimer.clientName || null,
        start_time: stoppedTimer.startTime,
        end_time: new Date().toISOString(),
        hourly_rate: defaultHourlyRate,
        is_billable: true,
      });

      if (result.error) {
        showError(result.error);
        return;
      }

      showSuccess('Time entry saved!');
      setProjectName('');
      setClientName('');

      try {
        posthog.capture('timer_stopped', {
          project: stoppedTimer.projectName,
          duration_seconds: stoppedTimer.elapsedSeconds,
        });
      } catch {}
    } catch {
      showError('Failed to save time entry');
    } finally {
      setIsSaving(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !timer.isRunning) {
      handleStart();
    }
    if (e.key === 'Escape') {
      setIsExpanded(false);
    }
  };

  const buttonContent = (
    <button
      onClick={() => setIsExpanded(!isExpanded)}
      className={[
        'flex items-center gap-3 w-full px-3 py-2 rounded-lg',
        'text-sm font-medium transition-colors',
        timer.isRunning
          ? 'bg-teal-500/20 text-teal-600 dark:text-teal-300 border border-teal-500/30'
          : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-zinc-100',
        isCollapsed ? 'justify-center' : '',
      ].join(' ')}
    >
      {timer.isRunning ? (
        <>
          <span className="relative flex h-2 w-2 flex-shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500" />
          </span>
          {!isCollapsed && (
            <>
              <span className="font-mono flex-1 text-left">{formatTimerCompact(timer.elapsedSeconds)}</span>
              <ChevronUp className="h-3.5 w-3.5 text-zinc-500" />
            </>
          )}
        </>
      ) : (
        <>
          <Clock className="h-5 w-5 flex-shrink-0" />
          {!isCollapsed && (
            <>
              <span className="flex-1 text-left">Timer</span>
              <ChevronUp className="h-3.5 w-3.5 text-zinc-500" />
            </>
          )}
        </>
      )}
    </button>
  );

  return (
    <div className="relative px-2 py-2" ref={dropdownRef}>
      {isCollapsed ? (
        <SidebarTooltip content={timer.isRunning ? formatTimerCompact(timer.elapsedSeconds) : 'Timer'} show>
          {buttonContent}
        </SidebarTooltip>
      ) : (
        buttonContent
      )}

      {/* Expanded dropdown - positioned above the button */}
      {isExpanded && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40" onClick={() => setIsExpanded(false)} />

          <div
            className={[
              'absolute z-50 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 shadow-xl',
              isCollapsed ? 'left-full ml-2 bottom-0 w-72' : 'left-2 right-2 bottom-full mb-2',
            ].join(' ')}
          >
            <div className="p-4">
              {timer.isRunning ? (
                <>
                  {/* Running timer view */}
                  <div className="text-center mb-4">
                    <p className="text-xs text-zinc-500 mb-1">Currently tracking</p>
                    <p className="text-lg font-semibold text-zinc-900 dark:text-white truncate">
                      {timer.projectName}
                    </p>
                    {timer.clientName && (
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">{timer.clientName}</p>
                    )}
                    <p className="text-3xl font-mono text-teal-600 dark:text-teal-400 mt-3">
                      {formatTimerCompact(timer.elapsedSeconds)}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={handleStop}
                      disabled={isSaving}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-rose-500 hover:bg-rose-400 text-white font-medium transition-colors disabled:opacity-50"
                    >
                      <Square className="h-4 w-4" />
                      {isSaving ? 'Saving...' : 'Stop'}
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      resetTimer();
                      setIsExpanded(false);
                    }}
                    className="w-full mt-2 text-xs text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-400"
                  >
                    Discard without saving
                  </button>
                </>
              ) : (
                <>
                  {/* Start timer view */}
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-zinc-500 block mb-1">
                        Project / Task
                      </label>
                      <input
                        ref={inputRef}
                        type="text"
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="What are you working on?"
                        className="w-full px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white text-sm placeholder:text-zinc-500 focus:outline-none focus:border-teal-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-zinc-500 block mb-1">
                        Client (optional)
                      </label>
                      <input
                        type="text"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Client name"
                        className="w-full px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white text-sm placeholder:text-zinc-500 focus:outline-none focus:border-teal-500"
                      />
                    </div>

                    <button
                      onClick={handleStart}
                      disabled={!projectName.trim()}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-teal-500 hover:bg-teal-400 text-zinc-950 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Play className="h-4 w-4" />
                      Start Timer
                    </button>
                  </div>

                  <div className="mt-3 pt-3 border-t border-zinc-200 dark:border-zinc-700">
                    <Link
                      href="/dashboard/time"
                      onClick={() => setIsExpanded(false)}
                      className="block text-center text-sm text-teal-600 dark:text-teal-400 hover:text-teal-500 dark:hover:text-teal-300"
                    >
                      View all time entries
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
