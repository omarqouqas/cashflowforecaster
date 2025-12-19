import posthog from 'posthog-js'

/**
 * Identify a user in PostHog after login/signup
 * Call this after successful authentication
 */
export function identifyUser(
  userId: string,
  properties?: {
    email?: string
    name?: string
    tier?: 'free' | 'pro' | 'premium'
    created_at?: string
    auth_provider?: 'email' | 'google'
  }
) {
  if (typeof window !== 'undefined' && userId) {
    posthog.identify(userId, {
      ...properties,
      $set_once: {
        first_seen: new Date().toISOString(),
      },
    })
  }
}

/**
 * Update user properties (e.g., after tier change)
 */
export function updateUserProperties(properties: {
  tier?: 'free' | 'pro' | 'premium'
  has_completed_onboarding?: boolean
  account_count?: number
  income_count?: number
  bill_count?: number
  invoice_count?: number
}) {
  if (typeof window !== 'undefined') {
    posthog.people.set(properties)
  }
}

/**
 * Reset PostHog user on logout
 * This clears the identified user and generates a new anonymous ID
 */
export function resetUser() {
  if (typeof window !== 'undefined') {
    posthog.reset()
  }
}

/**
 * Set a one-time property that won't be overwritten
 */
export function setOnceProperty(key: string, value: string | number | boolean) {
  if (typeof window !== 'undefined') {
    posthog.people.set_once({ [key]: value })
  }
}
