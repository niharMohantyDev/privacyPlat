import { CheckCircleIcon } from '@/components/icons'

import type { Case } from '../types'

interface GrievanceConfirmationProps {
  caseRecord: Case
  onSubmitAnother: () => void
}

/** Presentational only — see GrievanceForm for the same convention. */
export function GrievanceConfirmation({ caseRecord, onSubmitAnother }: GrievanceConfirmationProps) {
  const dueDate = caseRecord.due_at ? new Date(caseRecord.due_at).toLocaleDateString() : 'unknown'

  return (
    <div className="mx-auto max-w-md rounded-xl border border-neutral-200 bg-white p-8 text-center shadow-sm">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
        <CheckCircleIcon width={26} height={26} />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-neutral-900">Grievance received</h3>
      <p className="mt-2 text-sm text-neutral-600">
        We've logged your grievance and will respond by <strong>{dueDate}</strong>.
      </p>
      <dl className="mt-5 space-y-1.5 rounded-lg bg-neutral-50 p-4 text-left text-xs text-neutral-500">
        <div className="flex justify-between">
          <dt>Reference ID</dt>
          <dd className="font-mono">{caseRecord.id}</dd>
        </div>
        <div className="flex justify-between">
          <dt>Status</dt>
          <dd className="font-medium text-neutral-700">{caseRecord.status.replace('_', ' ')}</dd>
        </div>
      </dl>
      <button
        type="button"
        onClick={onSubmitAnother}
        className="mt-5 text-sm font-medium text-indigo-600 hover:text-indigo-700"
      >
        Submit another grievance
      </button>
    </div>
  )
}
