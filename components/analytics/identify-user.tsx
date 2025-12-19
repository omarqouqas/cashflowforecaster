// components/analytics/identify-user.tsx
'use client'

import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { identifyUser } from '@/lib/posthog'

export function IdentifyUser() {
  useEffect(() => {
    const identify = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        // Get subscription tier if you have it
        const { data: subscription } = await supabase
          .from('subscriptions')
          .select('tier')
          .eq('user_id', user.id)
          .single()

        identifyUser(user.id, {
          email: user.email,
          name: user.user_metadata?.full_name,
          tier: subscription?.tier || 'free',
          auth_provider: user.app_metadata?.provider as 'email' | 'google',
        })
      }
    }

    identify()
  }, [])

  return null // This component renders nothing
}