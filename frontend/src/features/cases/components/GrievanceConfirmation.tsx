import type { Case } from '../types'

interface GrievanceConfirmationProps {
  caseRecord: Case
  onSubmitAnother: () => void
}

/** Presentational only — see GrievanceForm for the same convention. */
export function GrievanceConfirmation({ caseRecord, onSubmitAnother }: GrievanceConfirmationProps) {
  const dueDate = caseRecord.due_at ? new Date(caseRecord.due_at).toLocaleDateString() : 'unknown'

  return (
    <div className="mx-auto max-w-md rounded-md border border-neutral-200 p-6 text-center">
      <h3 className="text-lg font-semibold text-neutral-900">Grievance received</h3>
      <p className="mt-2 text-sm text-neutral-600">
        We've logged your grievance and will respond by <strong>{dueDate}</strong>.
      </p>
      <dl className="mt-4 space-y-1 text-left text-xs text-neutral-500">
        <div className="flex justify-between">
          <dt>Reference ID</dt>
          <dd className="font-mono">{caseRecord.id}</dd>
        </div>
        <div className="flex justify-between">
          <dt>Status</dt>
          <dd>{caseRecord.status.replace('_', ' ')}</dd>
        </div>
      </dl>
      <button type="button" onClick={onSubmitAnother} className="mt-4 text-sm text-blue-600 underline">
        Submit another grievance
      </button>
    </div>
  )
}
