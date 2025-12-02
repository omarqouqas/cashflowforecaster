import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '@/types/supabase'
import type { CookieOptions } from '@supabase/ssr'

/**
 * Creates a Supabase client for Server Components and Route Handlers.
 * 
 * This function returns a Supabase client configured for server-side use.
 * It automatically handles authentication cookies and session management
 * using Next.js 14's async cookies() function.
 * 
 * **Important:** This function is async because Next.js 14's cookies() function
 * is async. This client should ONLY be used in Server Components (no 'use client')
 * or Route Handlers. For Client Components, use the client-side client instead.
 * 
 * @returns A configured Supabase client instance
 * 
 * @throws {Error} If NEXT_PUBLIC_SUPABASE_URL is missing or empty
 * @throws {Error} If NEXT_PUBLIC_SUPABASE_ANON_KEY is missing or empty
 * 
 * @example
 * ```tsx
 * // ✅ Use in Server Components (no 'use client')
 * import { createClient } from '@/lib/supabase/server'
 * 
 * export default async function DashboardPage() {
 *   const supabase = await createClient()
 *   
 *   // Fetch data server-side (faster, more secure)
 *   const { data: user } = await supabase.auth.getUser()
 *   
 *   if (!user) {
 *     redirect('/login')
 *   }
 *   
 *   return <div>Welcome {user.email}</div>
 * }
 * ```
 * 
 * @example
 * ```tsx
 * // ✅ Use in Route Handlers
 * import { createClient } from '@/lib/supabase/server'
 * 
 * export async function GET(request: Request) {
 *   const supabase = await createClient()
 *   const { data } = await supabase.from('table').select()
 *   return Response.json(data)
 * }
 * ```
 */
export async function createClient() {
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

  // Get cookie store from Next.js
  const cookieStore = await cookies()

  // Create and return Supabase client with cookie handlers
  return createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set(name: string, value: string, options: CookieOptions) {
        try {
          cookieStore.set(name, value, options)
        } catch (error) {
          // The `set` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
      remove(name: string, options: CookieOptions) {
        try {
          cookieStore.set(name, '', { ...options, maxAge: 0 })
        } catch (error) {
          // The `delete` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  })
}

