'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { X } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { createFeedback } from '@/lib/actions/feedback';
import {
  feedbackSchema,
  feedbackTypes,
  feedbackTypeLabels,
  type FeedbackFormData,
} from '@/lib/validations/feedback';
import { showError, showSuccess } from '@/lib/toast';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FeedbackFormData>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      type: 'suggestion',
      message: '',
    },
  });

  const onSubmit = async (data: FeedbackFormData) => {
    setIsLoading(true);

    try {
      await createFeedback({
        ...data,
        page_url: typeof window !== 'undefined' ? window.location.href : undefined,
        user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
      });

      showSuccess('Thank you for your feedback!');
      reset();
      onClose();
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Failed to submit feedback';
      showError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={handleBackdropClick}
    >
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-700">
          <h2 className="text-lg font-semibold text-white">Send Feedback</h2>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-700 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-5">
          {/* Feedback Type */}
          <div>
            <Label htmlFor="type" className="text-zinc-300 mb-2 block">
              What type of feedback?
            </Label>
            <select
              id="type"
              {...register('type')}
              className={[
                'w-full h-11 px-3 bg-zinc-800 border border-zinc-600 rounded-md',
                'text-white text-sm',
                'focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                errors.type ? 'border-rose-500 focus:ring-rose-500' : '',
              ].join(' ')}
            >
              {feedbackTypes.map((type) => (
                <option key={type} value={type}>
                  {feedbackTypeLabels[type]}
                </option>
              ))}
            </select>
            {errors.type?.message && (
              <p className="text-sm text-rose-400 mt-1.5">{errors.type.message}</p>
            )}
          </div>

          {/* Message */}
          <div>
            <Label htmlFor="message" className="text-zinc-300 mb-2 block">
              Your feedback
            </Label>
            <textarea
              id="message"
              rows={5}
              placeholder="Tell us what's on your mind..."
              {...register('message')}
              className={[
                'w-full px-3 py-2.5 bg-zinc-800 border border-zinc-600 rounded-md',
                'text-white text-sm placeholder:text-zinc-500',
                'focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                'resize-none',
                errors.message ? 'border-rose-500 focus:ring-rose-500' : '',
              ].join(' ')}
            />
            {errors.message?.message && (
              <p className="text-sm text-rose-400 mt-1.5">{errors.message.message}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 h-11 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 h-11 bg-teal-600 hover:bg-teal-500 text-white font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Sending...' : 'Send Feedback'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
