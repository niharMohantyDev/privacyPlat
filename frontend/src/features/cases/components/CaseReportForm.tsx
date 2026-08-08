import { useState } from 'react'

import { Button } from '@/components/ui/Button'

import { CASE_TYPES, SEVERITIES, type CaseType, type Severity } from '../types'

interface CaseReportFormProps {
  onSubmit: (input: { caseType: CaseType; title: string; severity: Severity }) => void
  isSubmitting: boolean
  errorMessage?: string | null
}

/** Presentational only — staff-side counterpart to GrievanceForm, used to
 * log a breach discovered internally or a grievance on a complainant's behalf. */
export function CaseReportForm({ onSubmit, isSubmitting, errorMessage }: CaseReportFormProps) {
  const [caseType, setCaseType] = useState<CaseType>('breach')
  const [title, setTitle] = useState('')
  const [severity, setSeverity] = useState<Severity>('medium')

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (!title.trim()) return
    onSubmit({ caseType, title: title.trim(), severity })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-3">
      <div>
        <label htmlFor="report-case-type" className="block text-xs font-medium text-neutral-700">
          Type
        </label>
        <select
          id="report-case-type"
          value={caseType}
          onChange={(e) => setCaseType(e.target.value as CaseType)}
          className="mt-1 rounded-md border border-neutral-300 px-2 py-1.5 text-sm"
        >
          {CASE_TYPES.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex-1">
        <label htmlFor="report-case-title" className="block text-xs font-medium text-neutral-700">
          Title
        </label>
        <input
          id="report-case-title"
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Short summary"
          className="mt-1 w-full rounded-md border border-neutral-300 px-2 py-1.5 text-sm"
        />
      </div>

      <div>
        <label htmlFor="report-case-severity" className="block text-xs font-medium text-neutral-700">
          Severity
        </label>
        <select
          id="report-case-severity"
          value={severity}
          onChange={(e) => setSeverity(e.target.value as Severity)}
          className="mt-1 rounded-md border border-neutral-300 px-2 py-1.5 text-sm"
        >
          {SEVERITIES.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Reporting…' : 'Report Case'}
      </Button>

      {errorMessage && <p className="w-full text-sm text-red-600">{errorMessage}</p>}
    </form>
  )
}
