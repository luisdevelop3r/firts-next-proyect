'use client'

import posthog from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'

if (typeof window !== 'undefined') {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    api_host: '/ingest', // Cambio importante: usa el proxy local
    ui_host: 'https://us.posthog.com', // Añade esto también
    person_profiles: 'identified_only',
    capture_pageview: false,
    capture_pageleave: true,
  })
}

export function PHProvider({ children }: { children: React.ReactNode }) {
  return <PostHogProvider client={posthog}>{children}</PostHogProvider>
}