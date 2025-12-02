import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import type { User, Session } from '@supabase/supabase-js'

/**
 * Gets the current authenticated user in a Server Component
 * Returns null if not authenticated (does NOT redirect)
 * 
 * @example
 * ```tsx
 * export default async function Page() {
 *   const user = await getCurrentUser()
 *   
 *   if (!user) {
 *     return <LoginPrompt />
 *   }
 *   
 *   return <Dashboard user={user} />
 * }
 * ```
 * 
 * @returns The authenticated user, or null if not authenticated
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error) {
      // Log error in development, but don't throw
      // Return null to indicate no authenticated user
      return null
    }
    
    return user
  } catch (error) {
    // Handle any unexpected errors gracefully
    // Return null instead of throwing
    return null
  }
}

/**
 * Requires authentication - redirects to /auth/login if not authenticated
 * Returns the authenticated user (never returns null)
 * 
 * @example
 * ```tsx
 * export default async function ProtectedPage() {
 *   const user = await requireAuth() // Redirects if not logged in
 *   
 *   // If we get here, user is definitely authenticated
 *   return <SecretContent user={user} />
 * }
 * ```
 * 
 * @returns The authenticated user (never null)
 * @throws Never throws - redirects instead if not authenticated
 */
export async function requireAuth(): Promise<User> {
  const user = await getCurrentUser()
  
  if (!user) {
    // Redirect to login page if not authenticated
    redirect('/auth/login')
  }
  
  // TypeScript knows user is not null here due to the redirect above
  return user
}

/**
 * Gets the current session including user and access token
 * Returns null if no session exists
 * 
 * @example
 * ```tsx
 * export default async function Page() {
 *   const session = await getSession()
 *   
 *   if (session) {
 *     console.log('Access token:', session.access_token)
 *     console.log('User:', session.user)
 *   }
 * }
 * ```
 * 
 * @returns The current session, or null if no session exists
 */
export async function getSession(): Promise<Session | null> {
  try {
    const supabase = await createClient()
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error) {
      // Log error in development, but don't throw
      // Return null to indicate no session
      return null
    }
    
    return session
  } catch (error) {
    // Handle any unexpected errors gracefully
    // Return null instead of throwing
    return null
  }
}

