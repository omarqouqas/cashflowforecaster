'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { deleteAccount } from '@/lib/actions/delete-account';

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

      // Account deleted successfully, redirect to home page
      router.push('/?deleted=true');
    });
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow border border-red-200 dark:border-red-800 p-6">
      <div className="flex items-start gap-3 mb-4">
        <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
          <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-red-900 dark:text-red-100">
            Delete Account
          </h2>
          <p className="text-sm text-red-700 dark:text-red-300 mt-1">
            Permanently delete your account and all associated data
          </p>
        </div>
      </div>

      {!showConfirmDialog ? (
        <div className="space-y-4">
          <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-sm text-red-800 dark:text-red-200 font-medium mb-2">
              This action cannot be undone
            </p>
            <p className="text-sm text-red-700 dark:text-red-300">
              Deleting your account will permanently remove:
            </p>
            <ul className="text-sm text-red-700 dark:text-red-300 mt-2 ml-4 space-y-1 list-disc">
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
          <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-sm text-red-800 dark:text-red-200 font-medium mb-3">
              Are you absolutely sure?
            </p>
            <p className="text-sm text-red-700 dark:text-red-300 mb-4">
              Type <span className="font-mono font-bold">DELETE</span> below to confirm account
              deletion:
            </p>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="Type DELETE"
              className="w-full px-3 py-2 border border-red-300 dark:border-red-700 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-slate-900 dark:text-white"
              disabled={isPending}
            />
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
              <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
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
              {isPending ? 'Deleting...' : 'Permanently Delete Account'}
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
