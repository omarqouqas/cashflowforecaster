'use client'

import posthog from 'posthog-js'
import { PostHogProvider as PHProvider, usePostHog } from 'posthog-js/react'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, Suspense } from 'react'

// Initialize PostHog on client side only
if (typeof window !== 'undefined') {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || '/ingest',
    person_profiles: 'identified_only', // Only create profiles for logged-in users
    capture_pageview: false, // We capture manually for better SPA support
    capture_pageleave: true, // Track when users leave pages
    autocapture: true, // Auto-capture clicks, form submissions, etc.
    persistence: 'localStorage+cookie', // Better persistence across sessions
    
    // Session Replay - watch real user sessions
    capture_performance: true, // Capture web vitals and performance data
    disable_session_recording: false, // Enable session recording
    session_recording: {
      maskAllInputs: false, // Don't mask regular inputs (names, emails you need to see)
      maskInputOptions: {
        password: true, // Always mask passwords
      },
      maskTextSelector: '[data-ph-no-capture]', // Mask elements with this attribute
    },
  })
}

// Component to track pageviews in Next.js App Router
function PostHogPageView() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const posthog = usePostHog()

  useEffect(() => {
    if (pathname && posthog) {
      let url = window.origin + pathname
      if (searchParams.toString()) {
        url = url + `?${searchParams.toString()}`
      }
      posthog.capture('$pageview', {
        $current_url: url,
      })
    }
  }, [pathname, searchParams, posthog])

  return null
}

// Wrapped in Suspense because useSearchParams needs it
function SuspendedPostHogPageView() {
  return (
    <Suspense fallback={null}>
      <PostHogPageView />
    </Suspense>
  )
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  return (
    <PHProvider client={posthog}>
      <SuspendedPostHogPageView />
      {children}
    </PHProvider>
  )
}

export { posthog }