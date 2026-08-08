import { useState } from 'react'

import { useConsent } from '../hooks/useConsent'
import type { ConsentStorageStrategy } from '../storage/ConsentStorageStrategy'
import type { IConsentApiClient } from '../types'
import { ConsentBanner } from './ConsentBanner'
import { PreferenceCenter } from './PreferenceCenter'

interface ConsentManagerProps {
  publicKey: string
  /** Injectable for tests — see useConsent. */
  client?: IConsentApiClient
  storage?: ConsentStorageStrategy
}

type View = 'hidden' | 'banner' | 'preferences'

/**
 * Container: owns all state and the useConsent wiring. ConsentBanner and
 * PreferenceCenter are pure presentational components driven entirely
 * by props (Container/Presentational split) — easy to test each in
 * isolation without a real API or localStorage.
 */
export function ConsentManager({ publicKey, client, storage }: ConsentManagerProps) {
  const { purposes, isLoadingPurposes, receipt, submit, isSubmitting } = useConsent({
    publicKey,
    client,
    storage,
  })
  const [view, setView] = useState<View>('banner')
  const [pendingDecisions, setPendingDecisions] = useState<Record<string, boolean>>({})

  if (isLoadingPurposes || receipt || view === 'hidden') {
    return null
  }

  // mutateAsync's returned promise rejects on failure. Each handler here
  // is fired directly from onClick with nothing downstream to catch a
  // rejection, so an uncaught network/API error becomes an unhandled
  // promise rejection — a real bug, not just noisy tests. Catching and
  // leaving the current view in place (rather than hiding the banner)
  // is the correct fallback: the visitor should get another chance
  // rather than silently losing their decision. submitError is already
  // tracked reactively by useConsent if a future milestone wants to
  // surface a message here.
  const handleAcceptAll = async () => {
    const decisions = Object.fromEntries(purposes.map((p) => [p.code, true]))
    try {
      await submit(decisions)
      setView('hidden')
    } catch {
      // stay on the banner; submitError is available via useConsent
    }
  }

  const handleRejectAll = async () => {
    const decisions = Object.fromEntries(purposes.map((p) => [p.code, p.is_essential]))
    try {
      await submit(decisions)
      setView('hidden')
    } catch {
      // stay on the banner; submitError is available via useConsent
    }
  }

  const handleToggle = (code: string) => {
    setPendingDecisions((prev) => ({ ...prev, [code]: !prev[code] }))
  }

  const handleSavePreferences = async () => {
    const decisions = Object.fromEntries(
      purposes.map((p) => [p.code, p.is_essential || Boolean(pendingDecisions[p.code])]),
    )
    try {
      await submit(decisions)
      setView('hidden')
    } catch {
      // stay on the preference center; submitError is available via useConsent
    }
  }

  if (view === 'preferences') {
    return (
      <PreferenceCenter
        purposes={purposes}
        decisions={pendingDecisions}
        onToggle={handleToggle}
        onSave={handleSavePreferences}
        onClose={() => setView('banner')}
        isSubmitting={isSubmitting}
      />
    )
  }

  return (
    <ConsentBanner
      onAcceptAll={handleAcceptAll}
      onRejectAll={handleRejectAll}
      onManage={() => setView('preferences')}
      isSubmitting={isSubmitting}
    />
  )
}
