'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter, useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { CurrencyInput } from '@/components/ui/currency-input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { ArrowLeft, ChevronDown, ArrowRight, CreditCard, Wallet } from 'lucide-react';
import { Tables } from '@/types/supabase';
import { showError, showSuccess } from '@/lib/toast';
import { getCurrencySymbol } from '@/lib/utils/format';
import { updateTransfer } from '@/lib/actions/transfers';

const transferSchema = z.object({
  from_account_id: z.string().min(1, 'Source account is required'),
  to_account_id: z.string().min(1, 'Destination account is required'),
  amount: z.coerce
    .number({
      required_error: 'Amount is required',
      invalid_type_error: 'Amount must be a number',
    })
    .positive('Amount must be positive'),
  description: z.string().optional(),
  transfer_date: z.string().min(1, 'Transfer date is required'),
  frequency: z.enum(['one-time', 'weekly', 'biweekly', 'semi-monthly', 'monthly', 'quarterly', 'annually'], {
    message: 'Please select a frequency',
  }),
  recurrence_day: z.coerce.number().min(1).max(31).optional().nullable(),
}).refine((data) => data.from_account_id !== data.to_account_id, {
  message: 'Source and destination accounts must be different',
  path: ['to_account_id'],
});

type TransferFormData = z.infer<typeof transferSchema>;
type Account = Tables<'accounts'>;

export default function EditTransferPage() {
  const router = useRouter();
  const params = useParams();
  const transferId = params.id as string;

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [currency, setCurrency] = useState('USD');
  const [dataLoading, setDataLoading] = useState(true);

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm<TransferFormData>({
    resolver: zodResolver(transferSchema),
    defaultValues: {
      frequency: 'one-time',
    },
  });

  const fromAccountId = watch('from_account_id');
  const toAccountId = watch('to_account_id');
  const frequency = watch('frequency');

  // Get account details for display
  const fromAccount = accounts.find(a => a.id === fromAccountId);
  const toAccount = accounts.find(a => a.id === toAccountId);

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient();

      const [transferResult, accountsResult, settingsResult] = await Promise.all([
        supabase
          .from('transfers')
          .select('*')
          .eq('id', transferId)
          .single(),
        supabase
          .from('accounts')
          .select('*')
          .order('name'),
        supabase
          .from('user_settings')
          .select('currency')
          .single(),
      ]);

      if (transferResult.error || !transferResult.data) {
        showError('Transfer not found');
        router.push('/dashboard/transfers');
        return;
      }

      const transferData = transferResult.data;
      setAccounts((accountsResult.data || []) as Account[]);

      if (settingsResult.data?.currency) {
        setCurrency(settingsResult.data.currency);
      }

      // Populate form with existing data
      reset({
        from_account_id: transferData.from_account_id,
        to_account_id: transferData.to_account_id,
        amount: transferData.amount,
        description: transferData.description || '',
        transfer_date: transferData.transfer_date,
        frequency: transferData.frequency as TransferFormData['frequency'],
        recurrence_day: transferData.recurrence_day,
      });

      setDataLoading(false);
    }

    if (transferId) {
      fetchData();
    }
  }, [transferId, reset, router]);

  const onSubmit = async (data: TransferFormData) => {
    setIsLoading(true);
    setError(null);

    const result = await updateTransfer({
      id: transferId,
      from_account_id: data.from_account_id,
      to_account_id: data.to_account_id,
      amount: data.amount,
      description: data.description,
      transfer_date: data.transfer_date,
      frequency: data.frequency,
      recurrence_day: data.recurrence_day || undefined,
    });

    if (!result.success) {
      showError(result.error || 'Failed to update transfer');
      setError(result.error || 'Failed to update transfer');
      setIsLoading(false);
      return;
    }

    showSuccess('Transfer updated');
    router.refresh();
    router.push('/dashboard/transfers');
  };

  // Filter accounts based on selection
  const sourceAccounts = accounts.filter(a => a.id !== toAccountId);
  const destinationAccounts = accounts.filter(a => a.id !== fromAccountId);

  // Determine if this is a CC payment (to a credit card)
  const isCCPayment = toAccount?.account_type === 'credit_card';

  if (dataLoading) {
    return (
      <div className="max-w-lg mx-auto">
        <Link
          href="/dashboard/transfers"
          className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-teal-400 mb-6 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Transfers
        </Link>

        <h1 className="text-2xl font-semibold text-zinc-100 mb-6">Edit Transfer</h1>

        <div className="border border-zinc-700/50 bg-zinc-800/50 backdrop-blur-sm rounded-lg p-6 shadow-xl">
          <div className="flex flex-col items-center justify-center gap-4 py-10">
            <svg
              className="animate-spin h-8 w-8 text-teal-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <p className="text-zinc-400">Loading transfer...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      <Link
        href="/dashboard/transfers"
        className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-teal-400 mb-6 transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Transfers
      </Link>

      <h1 className="text-2xl font-semibold text-zinc-100 mb-2">
        {isCCPayment ? 'Edit Credit Card Payment' : 'Edit Transfer'}
      </h1>
      <p className="text-zinc-400 text-sm mb-6">
        {isCCPayment
          ? 'Update your scheduled credit card payment'
          : 'Update the transfer details'}
      </p>

      <div className="border border-zinc-700/50 bg-zinc-800/50 backdrop-blur-sm rounded-lg p-6 shadow-xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Transfer Visual */}
          {fromAccount && toAccount && (
            <div className="flex items-center justify-center gap-4 p-4 bg-zinc-900/50 rounded-lg border border-zinc-700/50 mb-6">
              <div className="flex items-center gap-2">
                <Wallet className="w-5 h-5 text-blue-400" />
                <span className="text-zinc-200 font-medium truncate max-w-[100px]">{fromAccount.name}</span>
              </div>
              <ArrowRight className="w-5 h-5 text-teal-400 flex-shrink-0" />
              <div className="flex items-center gap-2">
                {toAccount.account_type === 'credit_card' ? (
                  <CreditCard className="w-5 h-5 text-amber-400" />
                ) : (
                  <Wallet className="w-5 h-5 text-emerald-400" />
                )}
                <span className="text-zinc-200 font-medium truncate max-w-[100px]">{toAccount.name}</span>
              </div>
            </div>
          )}

          {/* From Account */}
          <div>
            <Label htmlFor="from_account_id" className="text-zinc-300 mb-1.5 block font-medium">
              From Account<span className="text-rose-400 ml-0.5">*</span>
            </Label>
            <div className="relative">
              <select
                id="from_account_id"
                {...register('from_account_id')}
                className={[
                  'w-full bg-zinc-800 border border-zinc-700 rounded-md px-3 py-2 min-h-[44px]',
                  'text-zinc-100',
                  '[&>option]:bg-zinc-800 [&>option]:text-zinc-100',
                  'focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent',
                  'appearance-none pr-10 cursor-pointer',
                  errors.from_account_id ? 'border-rose-400 focus:ring-rose-400' : '',
                ].join(' ')}
              >
                <option value="">Select source account...</option>
                {sourceAccounts.map((account) => {
                  const balance = account.current_balance;
                  const formattedBalance = new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: currency,
                  }).format(Math.abs(balance));
                  const balanceDisplay = account.account_type === 'credit_card'
                    ? (balance > 0 ? `owes ${formattedBalance}` : formattedBalance)
                    : formattedBalance;
                  return (
                    <option key={account.id} value={account.id}>
                      {account.name} • {balanceDisplay}
                    </option>
                  );
                })}
              </select>
              <ChevronDown className="w-5 h-5 text-zinc-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            {errors.from_account_id?.message && (
              <p className="text-sm text-rose-400 mt-1.5">{errors.from_account_id.message}</p>
            )}
            <p className="text-sm text-zinc-400 mt-1.5">Money will be withdrawn from this account</p>
          </div>

          {/* To Account */}
          <div>
            <Label htmlFor="to_account_id" className="text-zinc-300 mb-1.5 block font-medium">
              To Account<span className="text-rose-400 ml-0.5">*</span>
            </Label>
            <div className="relative">
              <select
                id="to_account_id"
                {...register('to_account_id')}
                className={[
                  'w-full bg-zinc-800 border border-zinc-700 rounded-md px-3 py-2 min-h-[44px]',
                  'text-zinc-100',
                  '[&>option]:bg-zinc-800 [&>option]:text-zinc-100',
                  'focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent',
                  'appearance-none pr-10 cursor-pointer',
                  errors.to_account_id ? 'border-rose-400 focus:ring-rose-400' : '',
                ].join(' ')}
              >
                <option value="">Select destination account...</option>
                {destinationAccounts.map((account) => {
                  const balance = account.current_balance;
                  const formattedBalance = new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: currency,
                  }).format(Math.abs(balance));
                  const balanceDisplay = account.account_type === 'credit_card'
                    ? (balance > 0 ? `owes ${formattedBalance}` : formattedBalance)
                    : formattedBalance;
                  return (
                    <option key={account.id} value={account.id}>
                      {account.name} • {balanceDisplay}
                    </option>
                  );
                })}
              </select>
              <ChevronDown className="w-5 h-5 text-zinc-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            {errors.to_account_id?.message && (
              <p className="text-sm text-rose-400 mt-1.5">{errors.to_account_id.message}</p>
            )}
            <p className="text-sm text-zinc-400 mt-1.5">
              {isCCPayment ? 'This payment will reduce your credit card balance' : 'Money will be deposited to this account'}
            </p>
          </div>

          {/* Amount */}
          <div>
            <Label htmlFor="amount" className="text-zinc-300 mb-1.5 block font-medium">
              Amount<span className="text-rose-400 ml-0.5">*</span>
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 z-10">{getCurrencySymbol(currency)}</span>
              <Controller
                name="amount"
                control={control}
                render={({ field }) => (
                  <CurrencyInput
                    id="amount"
                    placeholder="0.00"
                    value={field.value}
                    onChange={field.onChange}
                    className={[
                      'pl-12 bg-zinc-900 border-zinc-700 text-zinc-100 placeholder:text-zinc-500',
                      'focus:border-teal-500 focus:ring-teal-500/20',
                      errors.amount ? 'border-rose-400 focus:border-rose-400 focus:ring-rose-400/20' : '',
                    ].join(' ')}
                  />
                )}
              />
            </div>
            {errors.amount?.message && (
              <p className="text-sm text-rose-400 mt-1.5">{errors.amount.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description" className="text-zinc-300 mb-1.5 block font-medium">
              Description (Optional)
            </Label>
            <Input
              id="description"
              placeholder={isCCPayment ? 'e.g., Monthly CC payment' : 'e.g., Monthly savings transfer'}
              {...register('description')}
              className="bg-zinc-900 border-zinc-700 text-zinc-100 placeholder:text-zinc-500 focus:border-teal-500 focus:ring-teal-500/20"
            />
          </div>

          {/* Transfer Date */}
          <div>
            <Label htmlFor="transfer_date" className="text-zinc-300 mb-1.5 block font-medium">
              Transfer Date<span className="text-rose-400 ml-0.5">*</span>
            </Label>
            <Input
              id="transfer_date"
              type="date"
              {...register('transfer_date')}
              className={[
                'bg-zinc-800 border-zinc-700 text-zinc-100 cursor-pointer',
                '[color-scheme:dark]',
                errors.transfer_date ? 'border-rose-400 focus:ring-rose-400' : '',
              ].join(' ')}
            />
            {errors.transfer_date?.message && (
              <p className="text-sm text-rose-400 mt-1.5">{errors.transfer_date.message}</p>
            )}
          </div>

          {/* Frequency */}
          <div>
            <Label htmlFor="frequency" className="text-zinc-300 mb-1.5 block font-medium">
              Frequency<span className="text-rose-400 ml-0.5">*</span>
            </Label>
            <div className="relative">
              <select
                id="frequency"
                {...register('frequency')}
                className={[
                  'w-full bg-zinc-800 border border-zinc-700 rounded-md px-3 py-2 min-h-[44px]',
                  'text-zinc-100',
                  '[&>option]:bg-zinc-800 [&>option]:text-zinc-100',
                  'focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent',
                  'appearance-none pr-10 cursor-pointer',
                  errors.frequency ? 'border-rose-400 focus:ring-rose-400' : '',
                ].join(' ')}
              >
                <option value="one-time">One-time transfer</option>
                <option value="weekly">Weekly</option>
                <option value="biweekly">Bi-weekly (every 2 weeks)</option>
                <option value="semi-monthly">Semi-monthly (twice a month)</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="annually">Annually</option>
              </select>
              <ChevronDown className="w-5 h-5 text-zinc-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            {errors.frequency?.message && (
              <p className="text-sm text-rose-400 mt-1.5">{errors.frequency.message}</p>
            )}
          </div>

          {/* Recurrence Day (for monthly/quarterly/annually) */}
          {['monthly', 'quarterly', 'annually'].includes(frequency) && (
            <div>
              <Label htmlFor="recurrence_day" className="text-zinc-300 mb-1.5 block font-medium">
                Day of Month (Optional)
              </Label>
              <Input
                id="recurrence_day"
                type="number"
                min="1"
                max="31"
                placeholder="e.g., 15"
                {...register('recurrence_day')}
                className="bg-zinc-900 border-zinc-700 text-zinc-100 placeholder:text-zinc-500 focus:border-teal-500 focus:ring-teal-500/20"
              />
              <p className="text-sm text-zinc-400 mt-1.5">
                Override the day of month for recurring transfers (1-31)
              </p>
            </div>
          )}

          {error && <p className="text-sm text-rose-400">{error}</p>}

          <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-6 border-t border-zinc-700/50">
            <button
              type="button"
              onClick={() => router.push('/dashboard/transfers')}
              disabled={isLoading}
              className="w-full bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 text-zinc-300 font-medium rounded-md px-4 py-2.5 min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-teal-600 hover:bg-teal-500 text-white font-medium rounded-md px-4 py-2.5 min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-teal-500/20 transition-all hover:shadow-teal-500/30"
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
