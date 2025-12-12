'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { ArrowLeft, ChevronDown } from 'lucide-react';

const billSchema = z.object({
  name: z.string().min(1, 'Bill name is required').max(100, 'Name too long'),
  amount: z.coerce.number({
    required_error: 'Amount is required',
    invalid_type_error: 'Amount must be a number',
  }).positive('Amount must be positive'),
  due_date: z.string().min(1, 'Due date is required'),
  frequency: z.enum(['weekly', 'biweekly', 'monthly', 'quarterly', 'annually', 'one-time'], {
    message: 'Please select a frequency',
  }),
  category: z.enum(['rent', 'utilities', 'subscriptions', 'insurance', 'other'], {
    message: 'Please select a category',
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
    <div className="max-w-lg mx-auto">
      <Link
        href="/dashboard/bills"
        className="text-sm text-zinc-500 hover:text-zinc-700 flex items-center gap-1 mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Bills
      </Link>

      <h1 className="text-xl font-semibold text-zinc-900 mb-6">Add Bill</h1>

      <div className="border border-zinc-200 bg-white rounded-lg p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Bill Name */}
          <div>
            <Label htmlFor="name" className="text-zinc-700 mb-1.5 block">
              Bill Name<span className="text-rose-500 ml-0.5">*</span>
            </Label>
            <Input
              id="name"
              placeholder="e.g., Rent, Netflix, Car Insurance"
              {...register('name')}
              className={errors.name ? 'border-rose-500 focus:ring-rose-500' : undefined}
            />
            {errors.name?.message && (
              <p className="text-sm text-rose-600 mt-1.5">{errors.name.message}</p>
            )}
          </div>

          {/* Amount */}
          <div>
            <Label htmlFor="amount" className="text-zinc-700 mb-1.5 block">
              Amount<span className="text-rose-500 ml-0.5">*</span>
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">$</span>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                className={[
                  'pl-8',
                  errors.amount ? 'border-rose-500 focus:ring-rose-500' : '',
                ].join(' ')}
                {...register('amount')}
              />
            </div>
            {errors.amount?.message && (
              <p className="text-sm text-rose-600 mt-1.5">{errors.amount.message}</p>
            )}
            <p className="text-sm text-zinc-500 mt-1.5">Enter the amount for this bill</p>
          </div>

          {/* Due Date */}
          <div>
            <Label htmlFor="due_date" className="text-zinc-700 mb-1.5 block">
              Due Date<span className="text-rose-500 ml-0.5">*</span>
            </Label>
            <Input
              id="due_date"
              type="date"
              {...register('due_date')}
              className={errors.due_date ? 'border-rose-500 focus:ring-rose-500' : undefined}
            />
            {errors.due_date?.message && (
              <p className="text-sm text-rose-600 mt-1.5">{errors.due_date.message}</p>
            )}
            <p className="text-sm text-zinc-500 mt-1.5">When is this bill due?</p>
          </div>

          {/* Frequency */}
          <div>
            <Label htmlFor="frequency" className="text-zinc-700 mb-1.5 block">
              Frequency<span className="text-rose-500 ml-0.5">*</span>
            </Label>
            <div className="relative">
              <select
                id="frequency"
                {...register('frequency')}
                className={[
                  'w-full bg-zinc-50 border border-zinc-200 rounded-md px-3 py-2 text-zinc-900 min-h-[44px]',
                  'placeholder:text-zinc-400',
                  'focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent',
                  'appearance-none pr-10',
                  errors.frequency ? 'border-rose-500 focus:ring-rose-500' : '',
                ].join(' ')}
              >
                <option value="">Select frequency...</option>
                <option value="weekly">Weekly</option>
                <option value="biweekly">Biweekly</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="annually">Annually</option>
                <option value="one-time">One-time</option>
              </select>
              <ChevronDown className="w-4 h-4 text-zinc-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            {errors.frequency?.message && (
              <p className="text-sm text-rose-600 mt-1.5">{errors.frequency.message}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <Label htmlFor="category" className="text-zinc-700 mb-1.5 block">
              Category<span className="text-rose-500 ml-0.5">*</span>
            </Label>
            <div className="relative">
              <select
                id="category"
                {...register('category')}
                className={[
                  'w-full bg-zinc-50 border border-zinc-200 rounded-md px-3 py-2 text-zinc-900 min-h-[44px]',
                  'placeholder:text-zinc-400',
                  'focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent',
                  'appearance-none pr-10',
                  errors.category ? 'border-rose-500 focus:ring-rose-500' : '',
                ].join(' ')}
              >
                <option value="">Select category...</option>
                <option value="rent">Rent</option>
                <option value="utilities">Utilities</option>
                <option value="subscriptions">Subscriptions</option>
                <option value="insurance">Insurance</option>
                <option value="other">Other</option>
              </select>
              <ChevronDown className="w-4 h-4 text-zinc-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            {errors.category?.message && (
              <p className="text-sm text-rose-600 mt-1.5">{errors.category.message}</p>
            )}
          </div>

          {/* Is Active Checkbox */}
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="is_active"
              {...register('is_active')}
              defaultChecked
              className="mt-1 h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-2 focus:ring-zinc-900"
            />
            <div>
              <Label htmlFor="is_active" className="text-zinc-700 cursor-pointer">
                Include in forecast
              </Label>
              <p className="text-sm text-zinc-500 mt-1">
                Uncheck to pause this bill without deleting it
              </p>
            </div>
          </div>

          {error && <p className="text-sm text-rose-600">{error}</p>}

          <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-6 border-t border-zinc-100">
            <button
              type="button"
              onClick={() => router.push('/dashboard/bills')}
              disabled={isLoading}
              className="w-full bg-white border border-zinc-200 hover:bg-zinc-50 text-zinc-700 font-medium rounded-md px-4 py-2.5 min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-md px-4 py-2.5 min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

