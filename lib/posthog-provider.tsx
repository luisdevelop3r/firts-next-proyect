'use client'

import posthog from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'

if (typeof window !== 'undefined') {
  const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY
  if (posthogKey) {
    posthog.init(posthogKey, {
      api_host: '/ingest', // Cambio importante: usa el proxy local
      ui_host: 'https://us.posthog.com', // Añade esto también
      person_profiles: 'identified_only',
      capture_pageview: false,
      capture_pageleave: true,
    })
  }
}

export function PHProvider({ children }: { children: React.ReactNode }) {
  return <PostHogProvider client={posthog}>{children}</PostHogProvider>
}