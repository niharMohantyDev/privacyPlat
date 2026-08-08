import { CheckCircleIcon } from '@/components/icons'

import type { DSARRequest } from '../types'

interface DSARConfirmationProps {
  request: DSARRequest
  onSubmitAnother: () => void
}

/** Presentational only — see DSARRequestForm for the same convention. */
export function DSARConfirmation({ request, onSubmitAnother }: DSARConfirmationProps) {
  const dueDate = request.due_at ? new Date(request.due_at).toLocaleDateString() : 'unknown'

  return (
    <div className="mx-auto max-w-md rounded-xl border border-neutral-200 bg-white p-8 text-center shadow-sm">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
        <CheckCircleIcon width={26} height={26} />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-neutral-900">Request received</h3>
      <p className="mt-2 text-sm text-neutral-600">
        We've logged your request and will respond by <strong>{dueDate}</strong>.
      </p>
      <dl className="mt-5 space-y-1.5 rounded-lg bg-neutral-50 p-4 text-left text-xs text-neutral-500">
        <div className="flex justify-between">
          <dt>Reference ID</dt>
          <dd className="font-mono">{request.id}</dd>
        </div>
        <div className="flex justify-between">
          <dt>Status</dt>
          <dd className="font-medium text-neutral-700">{request.status.replace('_', ' ')}</dd>
        </div>
      </dl>
      <button
        type="button"
        onClick={onSubmitAnother}
        className="mt-5 text-sm font-medium text-indigo-600 hover:text-indigo-700"
      >
        Submit another request
      </button>
    </div>
  )
}
