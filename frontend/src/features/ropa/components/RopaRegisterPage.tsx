import { useRopaRegister } from '../hooks/useRopaRegister'
import type { IRopaApiClient } from '../types'
import { RopaActivityForm } from './RopaActivityForm'
import { RopaRegisterTable } from './RopaRegisterTable'

interface RopaRegisterPageProps {
  organizationId: string
  /** Injectable for tests — see useRopaRegister. */
  client?: IRopaApiClient
}

export function RopaRegisterPage({ organizationId, client }: RopaRegisterPageProps) {
  const {
    activities,
    isLoading,
    loadError,
    statusFilter,
    setStatusFilter,
    create,
    isCreating,
    createError,
    transition,
    isTransitioning,
    transitionError,
    markReviewed,
    isMarkingReviewed,
  } = useRopaRegister({ organizationId, client })

  const handleTransition = (activityId: string, targetStatus: string) => {
    // transitionMutation's promise rejects on an invalid transition
    // (backend returns 400) — already surfaced via transitionError below,
    // so the rejection itself just needs to not become an unhandled one.
    transition({ activityId, targetStatus }).catch(() => {})
  }

  return (
    <main className="mx-auto max-w-5xl p-8">
      <h1 className="mb-1 text-xl font-semibold">Records of Processing Activities</h1>
      <p className="mb-6 text-sm text-neutral-500">
        The Article 30 register of what personal data your organization processes, why, and under what
        legal basis.
      </p>

      <div className="mb-6 rounded-md border border-neutral-200 p-4">
        <h2 className="mb-3 text-sm font-semibold text-neutral-900">Add a processing activity</h2>
        <RopaActivityForm
          onSubmit={(input) => {
            create(input).catch(() => {})
          }}
          isSubmitting={isCreating}
          errorMessage={createError ? 'Could not add this activity — please try again.' : null}
        />
      </div>

      <div className="mb-4 flex items-center gap-2">
        <label htmlFor="ropa-status-filter" className="text-xs font-medium text-neutral-700">
          Filter
        </label>
        <select
          id="ropa-status-filter"
          value={statusFilter ?? ''}
          onChange={(e) => setStatusFilter(e.target.value || undefined)}
          className="rounded-md border border-neutral-300 px-2 py-1 text-xs"
        >
          <option value="">All statuses</option>
          <option value="draft">Draft</option>
          <option value="active">Active</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {isLoading && <p className="text-sm text-neutral-500">Loading…</p>}
      {loadError && <p className="text-sm text-red-600">Failed to load the register.</p>}
      {transitionError && (
        <p className="mb-4 text-sm text-red-600">
          That status change wasn't allowed from the activity's current state.
        </p>
      )}

      {!isLoading && !loadError && (
        <RopaRegisterTable
          activities={activities}
          onTransition={handleTransition}
          onMarkReviewed={(activityId) => markReviewed(activityId).catch(() => {})}
          isTransitioning={isTransitioning}
          isMarkingReviewed={isMarkingReviewed}
        />
      )}
    </main>
  )
}
