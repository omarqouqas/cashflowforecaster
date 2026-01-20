'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { deleteAccount } from '@/lib/actions/delete-account';
import { cn } from '@/lib/utils/cn';

export function DeleteAccountSection() {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDelete = async () => {
    if (confirmText !== 'DELETE') {
      setError('Please type DELETE to confirm');
      return;
    }

    setError(null);

    startTransition(async () => {
      const result = await deleteAccount();

      if (!result.success) {
        setError(result.error || 'Failed to delete account');
        return;
      }

      router.push('/?deleted=true');
    });
  };

  return (
    <div className="bg-zinc-900 rounded-xl border border-rose-500/30 p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-rose-500/10 flex items-center justify-center">
          <AlertTriangle className="w-5 h-5 text-rose-400" />
        </div>
        <div>
          <h3 className="font-semibold text-rose-400">Delete Account</h3>
          <p className="text-sm text-zinc-400">
            Permanently delete your account and all data
          </p>
        </div>
      </div>

      {!showConfirmDialog ? (
        <div className="space-y-4">
          <div className="bg-rose-500/5 border border-rose-500/20 rounded-lg p-4">
            <p className="text-sm text-rose-300 font-medium mb-2">
              This action cannot be undone
            </p>
            <p className="text-sm text-zinc-400 mb-2">
              Deleting your account will permanently remove:
            </p>
            <ul className="text-sm text-zinc-500 ml-4 space-y-1 list-disc">
              <li>All your accounts and financial data</li>
              <li>All income and bill records</li>
              <li>All invoices and reminders</li>
              <li>All imported transactions</li>
              <li>All scenarios and forecasts</li>
              <li>Your subscription and payment history</li>
              <li>All settings and preferences</li>
            </ul>
          </div>

          <Button
            variant="danger"
            onClick={() => setShowConfirmDialog(true)}
            className="flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Delete My Account
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-rose-500/5 border border-rose-500/20 rounded-lg p-4">
            <p className="text-sm text-rose-300 font-medium mb-3">
              Are you absolutely sure?
            </p>
            <p className="text-sm text-zinc-400 mb-4">
              Type <span className="font-mono font-bold text-rose-400">DELETE</span> below to confirm:
            </p>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="Type DELETE"
              className={cn(
                'w-full px-3 py-2 rounded-lg text-sm',
                'bg-zinc-950 border border-zinc-800 text-zinc-100',
                'placeholder:text-zinc-600',
                'focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500'
              )}
              disabled={isPending}
            />
          </div>

          {error && (
            <div className="bg-rose-500/10 border border-rose-500/20 rounded-lg p-3">
              <p className="text-sm text-rose-400">{error}</p>
            </div>
          )}

          <div className="flex gap-3">
            <Button
              variant="danger"
              onClick={handleDelete}
              disabled={isPending || confirmText !== 'DELETE'}
              loading={isPending}
              className="flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              {isPending ? 'Deleting...' : 'Permanently Delete'}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setShowConfirmDialog(false);
                setConfirmText('');
                setError(null);
              }}
              disabled={isPending}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
