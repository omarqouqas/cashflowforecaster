import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'
import type { Database } from '@/types/supabase'

/**
 * Creates a Supabase client for API Route Handlers
 * 
 * Route Handlers are different from Server Components because:
 * - They receive NextRequest objects
 * - They return NextResponse objects
 * - Cookie handling works with request/response objects, not Next.js cookies()
 * 
 * This function creates a Supabase client that properly handles cookies
 * by reading from the request and writing to a response object.
 * 
 * @param request - The NextRequest object from the Route Handler
 * @returns An object containing the Supabase client and a response object with cookies applied
 * 
 * @throws {Error} If NEXT_PUBLIC_SUPABASE_URL is missing or empty
 * @throws {Error} If NEXT_PUBLIC_SUPABASE_ANON_KEY is missing or empty
 * 
 * @example
 * ```typescript
 * // app/api/bills/route.ts
 * import { createClient } from '@/lib/supabase/route-handler'
 * import { NextRequest, NextResponse } from 'next/server'
 * 
 * export async function GET(request: NextRequest) {
 *   const { supabase, response } = createClient(request)
 *   
 *   // Get authenticated user
 *   const { data: { user } } = await supabase.auth.getUser()
 *   
 *   if (!user) {
 *     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
 *   }
 *   
 *   // Fetch user's bills
 *   const { data: bills } = await supabase
 *     .from('bills')
 *     .select('*')
 *     .eq('user_id', user.id)
 *   
 *   // Return JSON response with cookies applied
 *   return NextResponse.json({ bills }, { headers: response.headers })
 * }
 * ```
 */
export function createClient(request: NextRequest) {
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

  // Create a response object to store cookie changes
  const response = new NextResponse()

  // Create Supabase client with cookie handlers
  const supabase = createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        // Read cookies from the request
        return request.cookies.get(name)?.value
      },
      set(name: string, value: string, options: CookieOptions) {
        // Store cookie changes in the response
        response.cookies.set(name, value, options)
      },
      remove(name: string, options: CookieOptions) {
        // Mark cookie for deletion in the response
        response.cookies.set(name, '', { ...options, maxAge: 0 })
      },
    },
  })

  return { supabase, response }
}

