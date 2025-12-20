'use client';

import { useEffect, useMemo, useState } from 'react';
import { X, Calculator } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { showError, showSuccess } from '@/lib/toast';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import type { Tables } from '@/types/supabase';
import {
  calculateScenario as calculateScenarioAction,
  getSavedScenarios,
  saveScenario,
} from '@/lib/actions/scenarios';
import { ScenarioResult, type ScenarioPreviewViewModel, type ScenarioResultViewModel } from './scenario-result';

type ScenarioRow = Tables<'scenarios'>;

export interface ScenarioModalProps {
  open: boolean;
  onClose: () => void;
  source?: 'calendar' | 'dashboard' | 'mobile-nav';
}

function tomorrowISO(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  // date-only
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function ScenarioModal({ open, onClose, source }: ScenarioModalProps) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const [step, setStep] = useState<'form' | 'result'>('form');
  const [isWorking, setIsWorking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState('New purchase');
  const [amount, setAmount] = useState<string>('');
  const [date, setDate] = useState<string>(tomorrowISO());
  const [isRecurring, setIsRecurring] = useState(false);

  const [userId, setUserId] = useState<string>('');
  const [currency, setCurrency] = useState<string>('USD');
  const [result, setResult] = useState<ScenarioResultViewModel | null>(null);
  const [preview, setPreview] = useState<ScenarioPreviewViewModel>([]);
  const [nextAffordableDate, setNextAffordableDate] = useState<string | null>(null);

  const [saved, setSaved] = useState<ScenarioRow[]>([]);
  const [loadingSaved, setLoadingSaved] = useState(false);

  // Prevent body scroll while open
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  // Escape closes
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    setStep('form');
    setError(null);
    setResult(null);
    setPreview([]);
    setNextAffordableDate(null);

    (async () => {
      try {
        const { data } = await supabase.auth.getUser();
        const id = data.user?.id ?? '';
        setUserId(id);
      } catch {
        setUserId('');
      }
    })();
  }, [open, supabase]);

  useEffect(() => {
    if (!open) return;
    if (!userId) return;

    setLoadingSaved(true);
    (async () => {
      const res = await getSavedScenarios(userId);
      if (res.ok) setSaved(res.scenarios);
      setLoadingSaved(false);
    })();
  }, [open, userId]);

  if (!open) return null;

  const parsedAmount = Number(amount);

  const validate = (): string | null => {
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) return 'Please enter a valid amount.';
    if (!date) return 'Please select a date.';
    return null;
  };

  const handleCheckImpact = async () => {
    const v = validate();
    if (v) {
      setError(v);
      return;
    }
    if (!userId) {
      setError('You must be logged in.');
      return;
    }

    setIsWorking(true);
    setError(null);

    const res = await calculateScenarioAction(userId, parsedAmount, date, isRecurring, name);
    if (!res.ok) {
      setIsWorking(false);
      setError(res.error);
      return;
    }

    setCurrency(res.currency);
    setResult(res.result);
    setPreview(res.preview);
    setNextAffordableDate(res.nextAffordableDate);
    setStep('result');
    setIsWorking(false);
  };

  const handleAddToBills = async () => {
    const v = validate();
    if (v) {
      showError(v);
      setError(v);
      return;
    }

    setIsWorking(true);
    try {
      const { data } = await supabase.auth.getUser();
      const user = data.user;
      if (!user) {
        showError('You must be logged in.');
        setIsWorking(false);
        return;
      }

      const insertName = (name || '').trim() || 'New purchase';
      const frequency = isRecurring ? 'monthly' : 'one-time';

      const { error: insertError } = await supabase.from('bills').insert({
        user_id: user.id,
        name: insertName,
        amount: parsedAmount,
        due_date: date,
        frequency,
        category: 'other',
        is_active: true,
      });

      if (insertError) {
        showError(insertError.message);
        setIsWorking(false);
        return;
      }

      showSuccess('Bill added');
      router.refresh();
      router.push('/dashboard/bills?success=bill-created');
      onClose();
    } catch (e: any) {
      showError(e?.message ?? 'Failed to add bill.');
    } finally {
      setIsWorking(false);
    }
  };

  const handleSaveForLater = async () => {
    const v = validate();
    if (v) {
      showError(v);
      setError(v);
      return;
    }
    if (!userId) {
      showError('You must be logged in.');
      return;
    }
    if (!result) {
      showError('Run a check first.');
      return;
    }

    setIsWorking(true);
    const payload = {
      name: (name || '').trim() || 'New purchase',
      amount: parsedAmount,
      date,
      isRecurring,
      result: { ...result, preview, nextAffordableDate, source: source ?? null },
    };
    const res = await saveScenario(userId, payload);
    if (!res.ok) {
      showError(res.error);
      setIsWorking(false);
      return;
    }

    showSuccess('Saved for later');
    setSaved((prev) => [res.scenario, ...prev]);
    setIsWorking(false);
  };

  const headerSubtitle = step === 'form' ? 'Scenario tester' : 'Impact results';

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className={cn(
          'w-full sm:max-w-xl sm:mx-4',
          'h-[92vh] sm:h-auto',
          'bg-zinc-900 border border-zinc-800',
          'rounded-t-2xl sm:rounded-lg shadow-xl overflow-hidden flex flex-col',
          'animate-in fade-in duration-150'
        )}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Can I Afford It scenario tester"
      >
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-zinc-800 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-teal-500/15 border border-teal-500/20 flex items-center justify-center">
                <Calculator className="w-5 h-5 text-teal-300" />
              </div>
              <div className="min-w-0">
                <h2 className="text-lg sm:text-xl font-semibold text-zinc-100 truncate">Can I Afford It?</h2>
                <p className="text-sm text-zinc-400">{headerSubtitle}</p>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-md transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {step === 'form' ? (
            <div className="space-y-5">
              <div className="rounded-lg border border-zinc-800 bg-zinc-950/30 p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="sm:col-span-2">
                    <Label htmlFor="scenario-name" className="text-zinc-200 mb-1.5 block">
                      Expense name <span className="text-zinc-500">(optional)</span>
                    </Label>
                    <Input
                      id="scenario-name"
                      placeholder="New purchase"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500 focus:ring-teal-500"
                    />
                  </div>

                  {/* Amount */}
                  <div>
                    <Label htmlFor="scenario-amount" className="text-zinc-200 mb-1.5 block">
                      Amount<span className="text-rose-400 ml-0.5">*</span>
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">$</span>
                      <Input
                        id="scenario-amount"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className={cn(
                          'pl-8 bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500 focus:ring-teal-500',
                          error && !Number.isFinite(parsedAmount) ? 'border-rose-500 focus:ring-rose-500' : ''
                        )}
                      />
                    </div>
                  </div>

                  {/* Date */}
                  <div>
                    <Label htmlFor="scenario-date" className="text-zinc-200 mb-1.5 block">
                      Date<span className="text-rose-400 ml-0.5">*</span>
                    </Label>
                    <Input
                      id="scenario-date"
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500 focus:ring-teal-500"
                    />
                  </div>

                  {/* Recurring toggle */}
                  <div className="sm:col-span-2">
                    <Label className="text-zinc-200 mb-1.5 block">Recurring</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setIsRecurring(false)}
                        className={cn(
                          'rounded-md px-4 py-2.5 min-h-[44px] border text-sm font-medium transition-colors',
                          !isRecurring
                            ? 'bg-teal-500/15 border-teal-500/30 text-teal-100'
                            : 'bg-zinc-800 border-zinc-700 text-zinc-200 hover:bg-zinc-700/60'
                        )}
                      >
                        One-time
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsRecurring(true)}
                        className={cn(
                          'rounded-md px-4 py-2.5 min-h-[44px] border text-sm font-medium transition-colors',
                          isRecurring
                            ? 'bg-teal-500/15 border-teal-500/30 text-teal-100'
                            : 'bg-zinc-800 border-zinc-700 text-zinc-200 hover:bg-zinc-700/60'
                        )}
                      >
                        Monthly
                      </button>
                    </div>
                    <p className="text-xs text-zinc-500 mt-2">
                      Monthly assumes the same day-of-month (month-end edge cases are handled).
                    </p>
                  </div>
                </div>
              </div>

              {error && (
                <div className="rounded-md border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isWorking}
                  className={cn(
                    'w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-medium rounded-md px-4 py-2.5 min-h-[44px] border border-zinc-700',
                    'disabled:opacity-50 disabled:cursor-not-allowed'
                  )}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCheckImpact}
                  disabled={isWorking}
                  className={cn(
                    'w-full bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-md px-4 py-2.5 min-h-[44px]',
                    'disabled:opacity-50 disabled:cursor-not-allowed'
                  )}
                >
                  {isWorking ? 'Checking…' : 'Check Impact'}
                </button>
              </div>

              <div className="pt-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-zinc-200">Saved scenarios</p>
                  {loadingSaved ? <span className="text-xs text-zinc-500">Loading…</span> : null}
                </div>
                <div className="mt-2 space-y-2">
                  {saved.length === 0 ? (
                    <div className="rounded-md border border-zinc-800 bg-zinc-950/30 px-3 py-3 text-sm text-zinc-500">
                      No saved scenarios yet.
                    </div>
                  ) : (
                    saved.slice(0, 6).map((s) => {
                      const r = (s.result as any) || {};
                      const canAfford = Boolean(r?.canAfford ?? r?.result?.canAfford);
                      return (
                        <div
                          key={s.id}
                          className="rounded-md border border-zinc-800 bg-zinc-950/30 px-3 py-3 flex items-start justify-between gap-3"
                        >
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-zinc-200 truncate">{s.name}</p>
                            <p className="text-xs text-zinc-500 mt-0.5">
                              {s.date} · {isRecurring ? 'Monthly' : 'One-time'}
                            </p>
                          </div>
                          <span
                            className={cn(
                              'text-xs font-semibold px-2 py-0.5 rounded-full border',
                              canAfford
                                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
                                : 'bg-rose-500/10 border-rose-500/30 text-rose-200'
                            )}
                          >
                            {canAfford ? 'Safe' : 'Issue'}
                          </span>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          ) : (
            result && (
              <ScenarioResult
                currency={currency}
                scenarioName={(name || '').trim() || 'New purchase'}
                scenarioAmount={parsedAmount}
                scenarioDate={date}
                isRecurring={isRecurring}
                result={result}
                preview={preview}
                nextAffordableDate={nextAffordableDate}
                isWorking={isWorking}
                onAddToBills={handleAddToBills}
                onSaveForLater={handleSaveForLater}
                onDone={() => {
                  onClose();
                }}
                onBack={() => {
                  setStep('form');
                }}
              />
            )
          )}
        </div>
      </div>
    </div>
  );
}


