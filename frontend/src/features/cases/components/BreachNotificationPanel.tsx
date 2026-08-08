import { useBreachNotifications } from '../hooks/useBreachNotifications'
import type { ICasesAdminApiClient } from '../types'
import { ObligationForm } from './ObligationForm'
import { ObligationList } from './ObligationList'

interface BreachNotificationPanelProps {
  organizationId: string
  caseId: string
  /** Injectable for tests — see useBreachNotifications. */
  client?: ICasesAdminApiClient
}

/**
 * Container: owns the useBreachNotifications wiring for one breach
 * case's notification checklist (regulator/data-subject/vendor). Lives
 * inside CaseQueueTable's expandable row — see that component for
 * where it's mounted.
 */
export function BreachNotificationPanel({ organizationId, caseId, client }: BreachNotificationPanelProps) {
  const {
    obligations,
    isLoading,
    loadError,
    create,
    isCreating,
    createError,
    markNotified,
    markNotRequired,
    isUpdating,
  } = useBreachNotifications({ organizationId, caseId, client })

  return (
    <div className="space-y-3 rounded-md bg-neutral-50 p-3">
      <h4 className="text-xs font-semibold text-neutral-700">Notification checklist</h4>

      {isLoading && <p className="text-xs text-neutral-500">Loading…</p>}
      {loadError && <p className="text-xs text-red-600">Failed to load the notification checklist.</p>}

      {!isLoading && !loadError && (
        <ObligationList
          obligations={obligations}
          onMarkNotified={(obligationId) => markNotified(obligationId).catch(() => {})}
          onMarkNotRequired={(obligationId) => markNotRequired(obligationId).catch(() => {})}
          isUpdating={isUpdating}
        />
      )}

      <ObligationForm
        onSubmit={(input) => create(input).catch(() => {})}
        isSubmitting={isCreating}
        errorMessage={createError ? 'Could not add this recipient — please try again.' : null}
      />
    </div>
  )
}
