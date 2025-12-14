'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Tables } from '@/types/supabase';
import { updateInvoice } from '@/lib/actions/invoices';

const invoiceSchema = z.object({
  invoice_number: z
    .string()
    .max(50, 'Invoice number too long')
    .optional()
    .or(z.literal('')),
  client_name: z.string().min(1, 'Client name is required').max(100, 'Name too long'),
  client_email: z
    .string()
    .email('Please enter a valid email')
    .optional()
    .or(z.literal('')),
  amount: z.coerce
    .number({
      required_error: 'Amount is required',
      invalid_type_error: 'Amount must be a number',
    })
    .positive('Amount must be positive'),
  due_date: z.string().min(1, 'Due date is required'),
  description: z.string().max(2000, 'Description too long').optional(),
});

type InvoiceFormData = z.infer<typeof invoiceSchema>;

type Invoice = Tables<'invoices'>;

export function EditInvoiceForm({ invoice }: { invoice: Invoice }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      invoice_number: invoice.invoice_number ?? '',
      client_name: invoice.client_name ?? '',
      client_email: invoice.client_email ?? '',
      amount: invoice.amount ?? 0,
      due_date: invoice.due_date ?? '',
      description: invoice.description ?? '',
    },
  });

  const onSubmit = async (data: InvoiceFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      await updateInvoice(invoice.id, {
        invoice_number: data.invoice_number ? data.invoice_number.trim() : null,
        client_name: data.client_name,
        client_email: data.client_email ? data.client_email : null,
        amount: data.amount,
        due_date: data.due_date,
        description: data.description ? data.description : null,
      });

      router.refresh();
      router.push(`/dashboard/invoices/${invoice.id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      <Link
        href={`/dashboard/invoices/${invoice.id}`}
        className="text-sm text-zinc-500 hover:text-zinc-700 flex items-center gap-1 mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Invoice
      </Link>

      <h1 className="text-xl font-semibold text-zinc-900 mb-6">Edit Invoice</h1>

      <div className="border border-zinc-200 bg-white rounded-lg p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Invoice number */}
          <div>
            <Label htmlFor="invoice_number" className="text-zinc-700 mb-1.5 block">
              Invoice number <span className="text-zinc-400">(optional)</span>
            </Label>
            <Input
              id="invoice_number"
              placeholder="e.g., INV-0007"
              {...register('invoice_number')}
              className={errors.invoice_number ? 'border-rose-500 focus:ring-rose-500' : undefined}
            />
            {errors.invoice_number?.message && (
              <p className="text-sm text-rose-600 mt-1.5">{errors.invoice_number.message}</p>
            )}
          </div>

          {/* Client name */}
          <div>
            <Label htmlFor="client_name" className="text-zinc-700 mb-1.5 block">
              Client name<span className="text-rose-500 ml-0.5">*</span>
            </Label>
            <Input
              id="client_name"
              placeholder="e.g., Acme Inc."
              {...register('client_name')}
              className={errors.client_name ? 'border-rose-500 focus:ring-rose-500' : undefined}
            />
            {errors.client_name?.message && (
              <p className="text-sm text-rose-600 mt-1.5">{errors.client_name.message}</p>
            )}
          </div>

          {/* Client email */}
          <div>
            <Label htmlFor="client_email" className="text-zinc-700 mb-1.5 block">
              Client email <span className="text-zinc-400">(optional)</span>
            </Label>
            <Input
              id="client_email"
              type="email"
              placeholder="e.g., billing@acme.com"
              {...register('client_email')}
              className={errors.client_email ? 'border-rose-500 focus:ring-rose-500' : undefined}
            />
            {errors.client_email?.message && (
              <p className="text-sm text-rose-600 mt-1.5">{errors.client_email.message}</p>
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
                className={['pl-8', errors.amount ? 'border-rose-500 focus:ring-rose-500' : ''].join(' ')}
                {...register('amount')}
              />
            </div>
            {errors.amount?.message && (
              <p className="text-sm text-rose-600 mt-1.5">{errors.amount.message}</p>
            )}
          </div>

          {/* Due date */}
          <div>
            <Label htmlFor="due_date" className="text-zinc-700 mb-1.5 block">
              Due date<span className="text-rose-500 ml-0.5">*</span>
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
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description" className="text-zinc-700 mb-1.5 block">
              Description <span className="text-zinc-400">(optional)</span>
            </Label>
            <textarea
              id="description"
              rows={4}
              {...register('description')}
              className={[
                'w-full bg-zinc-50 border border-zinc-200 rounded-md px-3 py-2 text-zinc-900',
                'placeholder:text-zinc-400',
                'focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent',
                'min-h-[96px]',
                errors.description ? 'border-rose-500 focus:ring-rose-500' : '',
              ].join(' ')}
              placeholder="What is this invoice for?"
            />
            {errors.description?.message && (
              <p className="text-sm text-rose-600 mt-1.5">{errors.description.message}</p>
            )}
          </div>

          {error && <p className="text-sm text-rose-600">{error}</p>}

          <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-6 border-t border-zinc-100">
            <button
              type="button"
              onClick={() => router.push(`/dashboard/invoices/${invoice.id}`)}
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
              {isLoading ? 'Saving...' : 'Save changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
