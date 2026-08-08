import { STATUS_OPTIONS, type ProcessingActivity } from '../types'

interface RopaRegisterTableProps {
  activities: ProcessingActivity[]
  onTransition: (activityId: string, targetStatus: string) => void
  onMarkReviewed: (activityId: string) => void
  isTransitioning: boolean
  isMarkingReviewed: boolean
}

const RISK_BADGE_CLASSES: Record<string, string> = {
  low: 'bg-emerald-100 text-emerald-800',
  medium: 'bg-amber-100 text-amber-800',
  high: 'bg-red-100 text-red-800',
}

function isOverdue(reviewDueAt: string | null): boolean {
  return Boolean(reviewDueAt && new Date(reviewDueAt).getTime() < Date.now())
}

/** Presentational only — same convention as apps/cases's CaseQueueTable. */
export function RopaRegisterTable({
  activities,
  onTransition,
  onMarkReviewed,
  isTransitioning,
  isMarkingReviewed,
}: RopaRegisterTableProps) {
  if (activities.length === 0) {
    return <p className="text-sm text-neutral-500">No processing activities recorded yet.</p>
  }

  return (
    <table className="w-full text-left text-sm">
      <thead>
        <tr className="border-b border-neutral-200 text-xs uppercase text-neutral-500">
          <th className="py-2 pr-4">Activity</th>
          <th className="py-2 pr-4">Legal Basis</th>
          <th className="py-2 pr-4">Risk</th>
          <th className="py-2 pr-4">Status</th>
          <th className="py-2 pr-4">Review Due</th>
          <th className="py-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {activities.map((activity) => (
          <tr key={activity.id} className="border-b border-neutral-100">
            <td className="py-2 pr-4">
              {activity.title}
              {activity.owner && <span className="ml-2 text-xs text-neutral-400">({activity.owner})</span>}
            </td>
            <td className="py-2 pr-4">{activity.legal_basis.replace('_', ' ')}</td>
            <td className="py-2 pr-4">
              <span className={`rounded-full px-2 py-0.5 text-xs ${RISK_BADGE_CLASSES[activity.risk_level] ?? ''}`}>
                {activity.risk_level}
              </span>
            </td>
            <td className="py-2 pr-4">
              <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs">{activity.status}</span>
            </td>
            <td className={`py-2 pr-4 ${isOverdue(activity.review_due_at) ? 'font-medium text-red-600' : ''}`}>
              {activity.review_due_at ? new Date(activity.review_due_at).toLocaleDateString() : '—'}
              {isOverdue(activity.review_due_at) && ' (overdue)'}
            </td>
            <td className="py-2">
              <div className="flex items-center gap-2">
                <select
                  aria-label={`Change status for ${activity.title}`}
                  disabled={isTransitioning}
                  defaultValue=""
                  onChange={(e) => {
                    if (e.target.value) onTransition(activity.id, e.target.value)
                    e.target.value = ''
                  }}
                  className="rounded-md border border-neutral-300 px-2 py-1 text-xs"
                >
                  <option value="" disabled>
                    Change status…
                  </option>
                  {STATUS_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  disabled={isMarkingReviewed}
                  onClick={() => onMarkReviewed(activity.id)}
                  className="rounded-md border border-neutral-300 px-2 py-1 text-xs text-neutral-600 hover:bg-neutral-50 disabled:opacity-50"
                >
                  Mark reviewed
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
