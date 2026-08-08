import { useAuth } from '@/features/auth/hooks/useAuth'

import { useDSARQueue } from '../hooks/useDSARQueue'
import type { IRightsAdminApiClient } from '../types'
import { DSARQueueTable } from './DSARQueueTable'

interface DSARQueuePageProps {
  organizationId: string
  /** Injectable for tests — see useDSARQueue. */
  client?: IRightsAdminApiClient
}

export function DSARQueuePage({ organizationId, client }: DSARQueuePageProps) {
  const { logout } = useAuth()
  const { requests, isLoading, loadError, transition, isTransitioning, transitionError } = useDSARQueue({
    organizationId,
    client,
  })

  const handleTransition = (requestId: string, targetStatus: string) => {
    // transitionMutation's promise rejects on an invalid transition
    // (backend returns 400) — already surfaced via transitionError below,
    // so the rejection itself just needs to not become an unhandled one.
    transition({ requestId, targetStatus }).catch(() => {})
  }

  return (
    <main className="mx-auto max-w-4xl p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold">DSAR Triage Queue</h1>
        <button type="button" onClick={logout} className="text-sm text-blue-600 underline">
          Sign out
        </button>
      </div>

      {isLoading && <p className="text-sm text-neutral-500">Loading…</p>}
      {loadError && <p className="text-sm text-red-600">Failed to load requests.</p>}
      {transitionError && (
        <p className="mb-4 text-sm text-red-600">
          That status change wasn't allowed from the request's current state.
        </p>
      )}

      {!isLoading && !loadError && (
        <DSARQueueTable
          requests={requests}
          onTransition={handleTransition}
          isTransitioning={isTransitioning}
        />
      )}
    </main>
  )
}
