'use client'

import posthog from 'posthog-js'
import { PostHogProvider as PHProvider } from 'posthog-js/react'
import { useEffect, useState } from 'react'

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    // Defer PostHog initialization to after page becomes interactive
    // This prevents blocking the main thread during initial load
    const initPostHog = () => {
      if (typeof window !== 'undefined' && !isInitialized) {
        posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
          api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
          capture_pageview: true,
          capture_pageleave: true,
          // Reduce initial payload
          autocapture: false, // Enable selectively if needed
          // Session recording settings
          session_recording: {
            // Delay session recording to not impact initial load
            maskAllInputs: true,
          },
          // Optimize network requests
          request_batching: true,
          // Don't block on slow networks
          disable_session_recording: false,
          loaded: () => {
            setIsInitialized(true)
          }
        })
      }
    }

    // Use requestIdleCallback for non-critical initialization
    // Falls back to setTimeout for browsers that don't support it
    if ('requestIdleCallback' in window) {
      requestIdleCallback(initPostHog, { timeout: 2000 })
    } else {
      setTimeout(initPostHog, 100)
    }
  }, [isInitialized])

  // Render children immediately, don't wait for PostHog
  // PostHog will hydrate when ready
  return <PHProvider client={posthog}>{children}</PHProvider>
}
