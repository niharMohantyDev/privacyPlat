import { RECIPIENT_TYPES, type BreachNotificationObligation } from '../types'

interface ObligationListProps {
  obligations: BreachNotificationObligation[]
  onMarkNotified: (obligationId: string) => void
  onMarkNotRequired: (obligationId: string) => void
  isUpdating: boolean
}

const STATUS_BADGE_CLASSES: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-800',
  notified: 'bg-emerald-100 text-emerald-800',
  not_required: 'bg-neutral-100 text-neutral-600',
}

function recipientLabel(recipientType: string): string {
  return RECIPIENT_TYPES.find((option) => option.value === recipientType)?.label ?? recipientType
}

function isOverdue(obligation: BreachNotificationObligation): boolean {
  return (
    obligation.status === 'pending' &&
    Boolean(obligation.due_at) &&
    new Date(obligation.due_at as string).getTime() < Date.now()
  )
}

/** Presentational only — a breach case's notification checklist. */
export function ObligationList({ obligations, onMarkNotified, onMarkNotRequired, isUpdating }: ObligationListProps) {
  if (obligations.length === 0) {
    return <p className="text-xs text-neutral-500">No notification recipients tracked yet.</p>
  }

  return (
    <table className="w-full text-left text-xs">
      <thead>
        <tr className="text-neutral-500">
          <th className="py-1 pr-3 font-medium">Recipient</th>
          <th className="py-1 pr-3 font-medium">Status</th>
          <th className="py-1 pr-3 font-medium">Due</th>
          <th className="py-1 font-medium">Action</th>
        </tr>
      </thead>
      <tbody>
        {obligations.map((obligation) => (
          <tr key={obligation.id} className="border-t border-neutral-100">
            <td className="py-1.5 pr-3">
              {recipientLabel(obligation.recipient_type)}
              {obligation.recipient_identifier && (
                <span className="ml-1 text-neutral-400">({obligation.recipient_identifier})</span>
              )}
            </td>
            <td className="py-1.5 pr-3">
              <span
                className={`rounded-full px-2 py-0.5 ${STATUS_BADGE_CLASSES[obligation.status] ?? ''}`}
              >
                {obligation.status.replace('_', ' ')}
              </span>
            </td>
            <td className={`py-1.5 pr-3 ${isOverdue(obligation) ? 'font-medium text-red-600' : ''}`}>
              {obligation.due_at ? new Date(obligation.due_at).toLocaleString() : '—'}
              {isOverdue(obligation) && ' (overdue)'}
            </td>
            <td className="py-1.5">
              {obligation.status === 'pending' ? (
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={isUpdating}
                    onClick={() => onMarkNotified(obligation.id)}
                    className="rounded-md border border-neutral-300 px-2 py-0.5 text-neutral-600 hover:bg-neutral-50 disabled:opacity-50"
                  >
                    Mark notified
                  </button>
                  <button
                    type="button"
                    disabled={isUpdating}
                    onClick={() => onMarkNotRequired(obligation.id)}
                    className="rounded-md border border-neutral-300 px-2 py-0.5 text-neutral-600 hover:bg-neutral-50 disabled:opacity-50"
                  >
                    Not required
                  </button>
                </div>
              ) : (
                <span className="text-neutral-400">
                  {obligation.notified_at ? new Date(obligation.notified_at).toLocaleDateString() : '—'}
                </span>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
