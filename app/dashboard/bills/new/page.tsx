'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormError } from '@/components/ui/form-error';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

const billSchema = z.object({
  name: z.string().min(1, 'Bill name is required').max(100, 'Name too long'),
  amount: z.coerce.number({
    required_error: 'Amount is required',
    invalid_type_error: 'Amount must be a number',
  }).positive('Amount must be positive'),
  due_date: z.string().min(1, 'Due date is required'),
  frequency: z.enum(['weekly', 'biweekly', 'monthly', 'quarterly', 'annually', 'one-time'], {
    required_error: 'Please select a frequency',
  }),
  category: z.enum(['rent', 'utilities', 'subscriptions', 'insurance', 'other'], {
    required_error: 'Please select a category',
  }),
  is_active: z.boolean().default(true),
});

type BillFormData = z.infer<typeof billSchema>;

export default function NewBillPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BillFormData>({
    resolver: zodResolver(billSchema),
    defaultValues: {
      is_active: true,
    },
  });

  const onSubmit = async (data: BillFormData) => {
    setIsLoading(true);
    setError(null);

    const supabase = createClient();

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setError('You must be logged in');
      setIsLoading(false);
      return;
    }

    // Insert bill
    const { error: insertError } = await supabase.from('bills').insert({
      user_id: user.id,
      name: data.name,
      amount: data.amount,
      due_date: data.due_date,
      frequency: data.frequency,
      category: data.category,
      is_active: data.is_active,
    });

    if (insertError) {
      setError(insertError.message);
      setIsLoading(false);
    } else {
      router.refresh();
      router.push('/dashboard/bills?success=created');
    }
  };

  return (
    <>
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link
          href="/dashboard/bills"
          className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Bills
        </Link>
      </div>

      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Add Bill</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Add a new bill to track in your cash flow calendar
        </p>
      </div>

      {/* Form Card */}
      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-6 shadow-sm">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Bill Name */}
            <div>
              <Label htmlFor="name">Bill Name</Label>
              <Input
                id="name"
                placeholder="e.g., Rent, Netflix, Car Insurance"
                className="mt-1"
                {...register('name')}
              />
              <FormError message={errors.name?.message} />
            </div>

            {/* Amount */}
            <div>
              <Label htmlFor="amount">Amount</Label>
              <div className="relative mt-1">
                <span className="absolute left-3 top-2.5 text-gray-500 dark:text-gray-400">$</span>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  className="pl-8"
                  {...register('amount')}
                />
              </div>
              <FormError message={errors.amount?.message} />
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Enter the amount for this bill
              </p>
            </div>

            {/* Due Date */}
            <div>
              <Label htmlFor="due_date">Due Date</Label>
              <Input
                id="due_date"
                type="date"
                className="mt-1"
                {...register('due_date')}
              />
              <FormError message={errors.due_date?.message} />
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                When is this bill due?
              </p>
            </div>

            {/* Frequency */}
            <div>
              <Label htmlFor="frequency">Frequency</Label>
              <select
                id="frequency"
                {...register('frequency')}
                className={cn(
                  'w-full mt-1 px-3 py-2 rounded-md border border-gray-300 bg-white',
                  'text-sm',
                  'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                  'disabled:cursor-not-allowed disabled:opacity-50',
                  'dark:bg-slate-700 dark:border-slate-600 dark:text-white'
                )}
              >
                <option value="">Select frequency...</option>
                <option value="weekly">Weekly</option>
                <option value="biweekly">Biweekly</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="annually">Annually</option>
                <option value="one-time">One-time</option>
              </select>
              <FormError message={errors.frequency?.message} />
            </div>

            {/* Category */}
            <div>
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                {...register('category')}
                className={cn(
                  'w-full mt-1 px-3 py-2 rounded-md border border-gray-300 bg-white',
                  'text-sm',
                  'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                  'disabled:cursor-not-allowed disabled:opacity-50',
                  'dark:bg-slate-700 dark:border-slate-600 dark:text-white'
                )}
              >
                <option value="">Select category...</option>
                <option value="rent">Rent</option>
                <option value="utilities">Utilities</option>
                <option value="subscriptions">Subscriptions</option>
                <option value="insurance">Insurance</option>
                <option value="other">Other</option>
              </select>
              <FormError message={errors.category?.message} />
            </div>

            {/* Is Active Checkbox */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="is_active"
                {...register('is_active')}
                defaultChecked
                className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700"
              />
              <div>
                <Label htmlFor="is_active" className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                  Include in forecast
                </Label>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Uncheck to pause this bill without deleting it
                </p>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded p-3 text-sm text-red-800 dark:text-red-200">
                {error}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/dashboard/bills')}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading} loading={isLoading}>
                {isLoading ? 'Adding...' : 'Add Bill'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

