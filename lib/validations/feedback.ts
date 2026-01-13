import { z } from 'zod';

/**
 * Feedback types available in the feedback widget
 */
export const feedbackTypes = ['bug', 'suggestion', 'question', 'other'] as const;

export type FeedbackType = (typeof feedbackTypes)[number];

/**
 * Labels for feedback types (used in the form dropdown)
 */
export const feedbackTypeLabels: Record<FeedbackType, string> = {
  bug: '🐛 Bug Report',
  suggestion: '💡 Suggestion',
  question: '❓ Question',
  other: '💬 Other',
};

/**
 * Zod schema for feedback form validation
 */
export const feedbackSchema = z.object({
  type: z.enum(feedbackTypes, {
    required_error: 'Please select a feedback type',
    invalid_type_error: 'Invalid feedback type',
  }),
  message: z
    .string()
    .min(10, 'Please provide at least 10 characters')
    .max(2000, 'Message is too long (max 2000 characters)'),
  page_url: z.string().optional(),
});

/**
 * TypeScript type inferred from the schema
 */
export type FeedbackFormData = z.infer<typeof feedbackSchema>;

/**
 * Input type for the server action (includes additional metadata)
 */
export type CreateFeedbackInput = FeedbackFormData & {
  user_agent?: string;
};
