// components/analytics/identify-user.tsx
'use client'

import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { identifyUser } from '@/lib/posthog'
import { normalizeSubscriptionTier } from '@/lib/stripe/config'

export function IdentifyUser() {
  useEffect(() => {
    const identify = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        // Get subscription tier if you have it
        const { data: subscriptionData } = await supabase
          .from('subscriptions')
          .select('tier')
          .eq('user_id', user.id)
          .single()

        const subscription = subscriptionData as any
        const tier = normalizeSubscriptionTier(subscription?.tier, 'free')

        identifyUser(user.id, {
          email: user.email,
          name: user.user_metadata?.full_name,
          tier,
          created_at: user.created_at, // Used for survey targeting (e.g., 7 days after signup)
          auth_provider: user.app_metadata?.provider as 'email' | 'google',
        })
      }
    }

    identify()
  }, [])

  return null // This component renders nothing
}