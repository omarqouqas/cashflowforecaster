'use client';

import { useState } from 'react';
import { MessageSquare } from 'lucide-react';
import { FeedbackModal } from './feedback-modal';

/**
 * Floating feedback button that appears in the bottom-left corner of the dashboard.
 * Opens a modal for users to submit feedback.
 * Positioned on the left to avoid conflicts with PostHog surveys and navigation tabs.
 */
export function FeedbackButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      {/* Floating Button - Bottom Left */}
      <button
        onClick={() => setIsModalOpen(true)}
        className={[
          // Positioning - bottom left, above mobile nav on mobile
          'fixed z-40',
          'bottom-24 left-4', // Mobile: above bottom nav
          'md:bottom-6 md:left-6', // Desktop: normal positioning
          // Styling - zinc-800 bg with teal-500 accent on hover
          'flex items-center gap-2 px-4 py-3',
          'bg-zinc-800 hover:bg-zinc-700',
          'border border-zinc-700 hover:border-teal-500',
          'text-zinc-300 hover:text-teal-400',
          'rounded-full shadow-lg',
          'transition-all duration-200',
          // Focus state
          'focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-zinc-900',
        ].join(' ')}
        aria-label="Send feedback"
      >
        <MessageSquare className="w-5 h-5" />
        <span className="text-sm font-medium hidden sm:inline">Feedback</span>
      </button>

      {/* Modal */}
      <FeedbackModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
