import type { DSARRequest } from '../types'

interface DSARConfirmationProps {
  request: DSARRequest
  onSubmitAnother: () => void
}

/** Presentational only — see DSARRequestForm for the same convention. */
export function DSARConfirmation({ request, onSubmitAnother }: DSARConfirmationProps) {
  const dueDate = request.due_at ? new Date(request.due_at).toLocaleDateString() : 'unknown'

  return (
    <div className="mx-auto max-w-md rounded-md border border-neutral-200 p-6 text-center dark:border-neutral-800">
      <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">Request received</h3>
      <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">
        We've logged your request and will respond by <strong>{dueDate}</strong>.
      </p>
      <dl className="mt-4 space-y-1 text-left text-xs text-neutral-500 dark:text-neutral-400">
        <div className="flex justify-between">
          <dt>Reference ID</dt>
          <dd className="font-mono">{request.id}</dd>
        </div>
        <div className="flex justify-between">
          <dt>Status</dt>
          <dd>{request.status.replace('_', ' ')}</dd>
        </div>
      </dl>
      <button
        type="button"
        onClick={onSubmitAnother}
        className="mt-4 text-sm text-blue-600 underline"
      >
        Submit another request
      </button>
    </div>
  )
}
