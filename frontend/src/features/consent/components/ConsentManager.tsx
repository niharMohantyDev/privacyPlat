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

  const handleAcceptAll = async () => {
    const decisions = Object.fromEntries(purposes.map((p) => [p.code, true]))
    await submit(decisions)
    setView('hidden')
  }

  const handleRejectAll = async () => {
    const decisions = Object.fromEntries(purposes.map((p) => [p.code, p.is_essential]))
    await submit(decisions)
    setView('hidden')
  }

  const handleToggle = (code: string) => {
    setPendingDecisions((prev) => ({ ...prev, [code]: !prev[code] }))
  }

  const handleSavePreferences = async () => {
    const decisions = Object.fromEntries(
      purposes.map((p) => [p.code, p.is_essential || Boolean(pendingDecisions[p.code])]),
    )
    await submit(decisions)
    setView('hidden')
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
