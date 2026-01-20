import { z } from 'zod';

/**
 * Centralized email validation schema.
 * Use this throughout the app for consistent email validation.
 */
export const emailSchema = z.string().email('Please enter a valid email address');

/**
 * Optional email field that accepts empty string or valid email.
 * Use for optional email fields in forms.
 */
export const optionalEmailSchema = z
  .string()
  .email('Please enter a valid email address')
  .optional()
  .or(z.literal(''));
