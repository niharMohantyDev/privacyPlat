import { STATUS_OPTIONS, type DSARRequest } from '../types'

interface DSARQueueTableProps {
  requests: DSARRequest[]
  onTransition: (requestId: string, targetStatus: string) => void
  isTransitioning: boolean
}

/** Presentational only — see apps/consent's ConsentBanner for the same convention. */
export function DSARQueueTable({ requests, onTransition, isTransitioning }: DSARQueueTableProps) {
  if (requests.length === 0) {
    return <p className="text-sm text-neutral-500">No requests yet.</p>
  }

  return (
    <table className="w-full text-left text-sm">
      <thead>
        <tr className="border-b border-neutral-200 text-xs uppercase text-neutral-500 dark:border-neutral-800">
          <th className="py-2 pr-4">Subject</th>
          <th className="py-2 pr-4">Type</th>
          <th className="py-2 pr-4">Status</th>
          <th className="py-2 pr-4">Due</th>
          <th className="py-2">Action</th>
        </tr>
      </thead>
      <tbody>
        {requests.map((request) => (
          <tr key={request.id} className="border-b border-neutral-100 dark:border-neutral-900">
            <td className="py-2 pr-4">{request.subject_key}</td>
            <td className="py-2 pr-4">{request.request_type.replace('_', ' ')}</td>
            <td className="py-2 pr-4">
              <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs dark:bg-neutral-800">
                {request.status.replace('_', ' ')}
              </span>
            </td>
            <td className="py-2 pr-4">{request.due_at ? new Date(request.due_at).toLocaleDateString() : '—'}</td>
            <td className="py-2">
              <select
                aria-label={`Change status for ${request.subject_key}`}
                disabled={isTransitioning}
                defaultValue=""
                onChange={(e) => {
                  if (e.target.value) onTransition(request.id, e.target.value)
                  e.target.value = ''
                }}
                className="rounded-md border border-neutral-300 px-2 py-1 text-xs dark:border-neutral-700 dark:bg-neutral-900"
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
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
