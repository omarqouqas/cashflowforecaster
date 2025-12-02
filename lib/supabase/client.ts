import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/supabase'

/**
 * Creates a Supabase client for use in Client Components.
 * 
 * This function returns a Supabase client configured for browser use.
 * It automatically handles authentication cookies and session management.
 * 
 * **Important:** This function should ONLY be used in Client Components
 * (components marked with the 'use client' directive). For Server Components
 * or Server Actions, use the server-side client instead.
 * 
 * @returns A configured Supabase client instance
 * 
 * @throws {Error} If NEXT_PUBLIC_SUPABASE_URL is missing or empty
 * @throws {Error} If NEXT_PUBLIC_SUPABASE_ANON_KEY is missing or empty
 * 
 * @example
 * ```tsx
 * 'use client'
 * 
 * import { createClient } from '@/lib/supabase/client'
 * 
 * export function UserProfile() {
 *   const supabase = createClient()
 *   
 *   // User can log in
 *   const handleLogin = async () => {
 *     const { data, error } = await supabase.auth.signInWithPassword({
 *       email: 'user@example.com',
 *       password: 'password'
 *     })
 *   }
 *   
 *   // Fetch data with user's permissions
 *   const fetchBills = async () => {
 *     const { data, error } = await supabase
 *       .from('bills')
 *       .select()
 *   }
 * }
 * ```
 */
export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || supabaseUrl.trim() === '') {
    throw new Error(
      'Missing NEXT_PUBLIC_SUPABASE_URL environment variable. ' +
      'Please add it to your .env.local file. ' +
      'Example: NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co'
    )
  }

  if (!supabaseAnonKey || supabaseAnonKey.trim() === '') {
    throw new Error(
      'Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable. ' +
      'Please add it to your .env.local file. ' +
      'Example: NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key'
    )
  }

  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey)
}

