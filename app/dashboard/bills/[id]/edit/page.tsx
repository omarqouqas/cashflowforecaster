'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormError } from '@/components/ui/form-error';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tables } from '@/types/supabase';

const billSchema = z.object({
  name: z.string().min(1, 'Bill name is required').max(100, 'Name too long'),
  amount: z.coerce.number({
    required_error: 'Amount is required',
    invalid_type_error: 'Amount must be a number',
  }).positive('Amount must be positive'),
  due_date: z.string().min(1, 'Due date is required'),
  frequency: z.enum(['monthly', 'quarterly', 'annually', 'one-time'], {
    required_error: 'Please select a frequency',
  }),
  category: z.enum(['rent', 'utilities', 'subscriptions', 'insurance', 'other'], {
    required_error: 'Please select a category',
  }),
  is_active: z.boolean().default(true),
});

type BillFormData = z.infer<typeof billSchema>;
type Bill = Tables<'bills'>['Row'];

export default function EditBillPage() {
  const params = useParams();
  const router = useRouter();
  const billId = params.id as string;

  const [bill, setBill] = useState<Bill | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<BillFormData>({
    resolver: zodResolver(billSchema),
  });

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient();

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setError('You must be logged in');
        setIsLoading(false);
        return;
      }

      // Fetch bill
      const { data: billData, error: billError } = await supabase
        .from('bills')
        .select('*')
        .eq('id', billId)
        .single();

      if (billError) {
        console.error('Error fetching bill:', billError);
        setError('Bill not found');
        setIsLoading(false);
        return;
      }

      // Verify bill belongs to current user
      if (billData.user_id !== user.id) {
        setError('Unauthorized: This bill does not belong to you');
        setIsLoading(false);
        return;
      }

      setBill(billData);

      // Pre-fill form with existing data
      if (billData) {
        // Format date for HTML date input (YYYY-MM-DD)
        const formattedDate = billData.due_date
          ? billData.due_date.split('T')[0]
          : '';

        reset({
          name: billData.name,
          amount: billData.amount,
          due_date: formattedDate,
          frequency: billData.frequency as BillFormData['frequency'],
          category: billData.category as BillFormData['category'],
          is_active: billData.is_active ?? true,
        });
      }

      setIsLoading(false);
    }

    fetchData();
  }, [billId, reset]);

  const onSubmit = async (data: BillFormData) => {
    setIsSubmitting(true);
    setError(null);

    const supabase = createClient();

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setError('You must be logged in');
      setIsSubmitting(false);
      return;
    }

    // Verify bill still belongs to current user
    const { data: billData, error: verifyError } = await supabase
      .from('bills')
      .select('user_id')
      .eq('id', billId)
      .single();

    if (verifyError || !billData) {
      setError('Bill not found');
      setIsSubmitting(false);
      return;
    }

    if (billData.user_id !== user.id) {
      setError('Unauthorized: This bill does not belong to you');
      setIsSubmitting(false);
      return;
    }

    // Update bill
    const { error: updateError } = await supabase
      .from('bills')
      .update({
        name: data.name,
        amount: data.amount,
        due_date: data.due_date,
        frequency: data.frequency,
        category: data.category,
        is_active: data.is_active,
        updated_at: new Date().toISOString(),
      })
      .eq('id', billId);

    if (updateError) {
      setError(updateError.message);
    } else {
      router.refresh();
      router.push('/dashboard/bills?success=updated');
    }

    setIsSubmitting(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!bill || error) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          {error || 'Bill not found'}
        </p>
        <Link href="/dashboard/bills" className="mt-4 inline-block">
          <Button variant="outline">Back to Bills</Button>
        </Link>
      </div>
    );
  }

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
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Bill</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Update your bill information
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
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_active"
                {...register('is_active')}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700"
              />
              <Label htmlFor="is_active" className="font-normal cursor-pointer">
                This is an active bill
              </Label>
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
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} loading={isSubmitting}>
                {isSubmitting ? 'Updating...' : 'Update Bill'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

