/**
 * Utility functions for working with Supabase errors and configuration.
 *
 * This module provides helper functions to:
 * - Convert technical Supabase errors to user-friendly messages
 * - Check if Supabase is properly configured
 * - Extract error messages from various error formats
 */

/**
 * Converts Supabase error codes to user-friendly messages.
 *
 * Maps common Supabase/PostgreSQL error codes to messages that are safe
 * to show to end users. Technical error details are logged separately.
 *
 * @param error - The error from a Supabase operation
 * @returns User-friendly error message
 *
 * @example
 * ```typescript
 * const { error } = await supabase.from('bills').select()
 * if (error) {
 *   const message = handleSupabaseError(error)
 *   toast.error(message) // "Unable to load data"
 * }
 * ```
 *
 * @example
 * ```typescript
 * const { error } = await supabase.auth.signInWithPassword({
 *   email: 'user@example.com',
 *   password: 'wrong'
 * })
 * if (error) {
 *   const message = handleSupabaseError(error)
 *   toast.error(message) // "Invalid email or password"
 * }
 * ```
 */
export function handleSupabaseError(error: any): string {
  // If error is null or undefined, return generic message
  if (!error) {
    return 'An unexpected error occurred'
  }

  // Extract error code (can be from various locations)
  const errorCode = error.code || error.error_code || error.statusCode
  const errorMessage = error.message || ''

  // Map common Supabase PostgREST error codes
  // PGRST116: Not found
  if (errorCode === 'PGRST116' || errorMessage.includes('PGRST116')) {
    return 'The requested item was not found'
  }

  // PGRST301: Unique constraint violation
  if (errorCode === 'PGRST301' || errorMessage.includes('PGRST301')) {
    return 'This item already exists'
  }

  // PostgreSQL error codes (from database directly)
  // 23505: Unique constraint violation
  if (errorCode === '23505' || errorMessage.includes('23505')) {
    if (errorMessage.includes('email')) {
      return 'An account with this email already exists'
    }
    if (errorMessage.includes('username')) {
      return 'This username is already taken'
    }
    return 'This item already exists'
  }

  // 23503: Foreign key violation
  if (errorCode === '23503' || errorMessage.includes('23503')) {
    return 'Cannot perform this action: related item is missing'
  }

  // 42P01: Table does not exist
  if (errorCode === '42P01' || errorMessage.includes('42P01')) {
    return 'Database table not found. Please contact support if this persists.'
  }

  // 42501: Insufficient privileges
  if (
    errorCode === '42501' ||
    errorMessage.includes('42501') ||
    errorMessage.toLowerCase().includes('permission denied')
  ) {
    return 'You do not have permission to perform this action'
  }

  // 23502: Not null violation
  if (errorCode === '23502' || errorMessage.includes('23502')) {
    return 'Required information is missing'
  }

  // 23514: Check constraint violation
  if (errorCode === '23514' || errorMessage.includes('23514')) {
    return 'The provided data is invalid'
  }

  // 40001: Serialization failure
  if (errorCode === '40001' || errorMessage.includes('40001')) {
    return 'The operation could not be completed. Please try again.'
  }

  // Auth-specific errors
  if (errorMessage.toLowerCase().includes('invalid login credentials')) {
    return 'Invalid email or password'
  }

  if (
    errorMessage.toLowerCase().includes('email not confirmed') ||
    errorMessage.toLowerCase().includes('email_not_confirmed')
  ) {
    return 'Please verify your email address before signing in'
  }

  if (
    errorMessage.toLowerCase().includes('invalid email') ||
    errorMessage.toLowerCase().includes('email address is invalid')
  ) {
    return 'Please enter a valid email address'
  }

  if (
    errorMessage.toLowerCase().includes('password') &&
    (errorMessage.toLowerCase().includes('weak') ||
      errorMessage.toLowerCase().includes('too short'))
  ) {
    return 'Password is too weak. Please use a stronger password.'
  }

  if (
    errorMessage.toLowerCase().includes('user not found') ||
    errorMessage.toLowerCase().includes('invalid_credentials')
  ) {
    return 'Invalid email or password'
  }

  if (
    errorMessage.toLowerCase().includes('token') &&
    errorMessage.toLowerCase().includes('expired')
  ) {
    return 'Your session has expired. Please sign in again.'
  }

  // Network/connection errors
  if (
    errorMessage.toLowerCase().includes('network') ||
    errorMessage.toLowerCase().includes('fetch failed') ||
    errorMessage.toLowerCase().includes('connection')
  ) {
    return 'Unable to connect to the server. Please check your internet connection.'
  }

  // Rate limiting
  if (
    errorMessage.toLowerCase().includes('rate limit') ||
    errorMessage.toLowerCase().includes('too many requests')
  ) {
    return 'Too many requests. Please wait a moment and try again.'
  }

  // JWT errors
  if (
    errorMessage.toLowerCase().includes('jwt') ||
    errorMessage.toLowerCase().includes('token')
  ) {
    return 'Your session is invalid. Please sign in again.'
  }

  // Default: Try to extract a user-friendly message from the error
  // If we can't find one, return a generic message
  if (errorMessage) {
    // Check if message is already user-friendly (no technical codes)
    if (
      !errorMessage.match(/PGRST\d+|235\d+|42P\d+|42501|40001/) &&
      !errorMessage.toLowerCase().includes('postgresql') &&
      !errorMessage.toLowerCase().includes('postgres')
    ) {
      return errorMessage
    }
  }

  return 'An unexpected error occurred. Please try again or contact support if the problem persists.'
}

/**
 * Checks if Supabase environment variables are properly configured.
 *
 * Validates that all required Supabase configuration variables are present
 * and non-empty. Useful for startup checks, debugging, and conditional rendering.
 *
 * @returns Object with configuration status and details
 *
 * @example
 * ```typescript
 * const config = isSupabaseConfigured()
 * if (!config.isConfigured) {
 *   console.error('Missing:', config.missing)
 *   return <div>Configuration error: {config.missing.join(', ')}</div>
 * }
 * ```
 *
 * @example
 * ```typescript
 * // In a component or page
 * const config = isSupabaseConfigured()
 * if (!config.isConfigured) {
 *   return <SetupRequired missing={config.missing} />
 * }
 * ```
 */
export function isSupabaseConfigured(): {
  isConfigured: boolean
  missing: string[]
  url?: string
} {
  const missing: string[] = []
  let url: string | undefined

  // Check for NEXT_PUBLIC_SUPABASE_URL
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!supabaseUrl || supabaseUrl.trim() === '') {
    missing.push('NEXT_PUBLIC_SUPABASE_URL')
  } else {
    url = supabaseUrl
  }

  // Check for NEXT_PUBLIC_SUPABASE_ANON_KEY
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!supabaseAnonKey || supabaseAnonKey.trim() === '') {
    missing.push('NEXT_PUBLIC_SUPABASE_ANON_KEY')
  }

  return {
    isConfigured: missing.length === 0,
    missing,
    ...(url && { url }),
  }
}

/**
 * Extracts error message from various Supabase error formats.
 *
 * Handles different error object structures that can come from Supabase operations,
 * including PostgrestError, AuthError, and generic Error objects. Always returns
 * a string message, never throws.
 *
 * @param error - Any error object from Supabase
 * @returns Extracted error message or fallback message
 *
 * @example
 * ```typescript
 * try {
 *   await supabase.auth.signIn({...})
 * } catch (error) {
 *   const msg = getSupabaseErrorMessage(error)
 *   console.error(msg)
 * }
 * ```
 *
 * @example
 * ```typescript
 * const { error } = await supabase.from('bills').insert(data)
 * if (error) {
 *   const msg = getSupabaseErrorMessage(error)
 *   // msg could be: "duplicate key value violates unique constraint"
 * }
 * ```
 */
export function getSupabaseErrorMessage(error: any): string {
  // Handle null/undefined
  if (!error) {
    return 'An unknown error occurred'
  }

  // Handle string errors (rare but possible)
  if (typeof error === 'string') {
    return error
  }

  // Try error.message (most common)
  if (error.message && typeof error.message === 'string') {
    return error.message
  }

  // Try error.error_description (common in OAuth/Auth errors)
  if (error.error_description && typeof error.error_description === 'string') {
    return error.error_description
  }

  // Try error.msg (some error formats)
  if (error.msg && typeof error.msg === 'string') {
    return error.msg
  }

  // Try error.error (nested error object)
  if (error.error) {
    if (typeof error.error === 'string') {
      return error.error
    }
    if (error.error.message && typeof error.error.message === 'string') {
      return error.error.message
    }
    if (error.error.error_description && typeof error.error.error_description === 'string') {
      return error.error.error_description
    }
  }

  // Try error.details (PostgreSQL error details)
  if (error.details && typeof error.details === 'string') {
    return error.details
  }

  // Try error.hint (PostgreSQL error hints)
  if (error.hint && typeof error.hint === 'string') {
    return error.hint
  }

  // Try error.reason (some API errors)
  if (error.reason && typeof error.reason === 'string') {
    return error.reason
  }

  // Try converting to string if it's an object with toString
  if (typeof error.toString === 'function' && error.toString() !== '[object Object]') {
    const stringValue = error.toString()
    if (stringValue) {
      return stringValue
    }
  }

  // Last resort: check if error has any string property
  for (const key in error) {
    if (typeof error[key] === 'string' && error[key]) {
      return error[key]
    }
  }

  // Final fallback
  return 'An unknown error occurred'
}

