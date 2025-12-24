import { createClient } from '@/lib/supabase/client'

export async function signInWithGoogle() {
  const supabase = createClient()
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      // After the server callback exchanges the code for a session, it will redirect
      // to a client page that can safely write to localStorage.
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  })
  
  return { data, error }
}


