import { useState } from 'react'

import { Button } from '@/components/ui/Button'

interface GrievanceFormProps {
  onSubmit: (input: { title: string; description: string; reportedBy: string }) => void
  isSubmitting: boolean
  errorMessage?: string | null
}

/** Presentational only — all state/logic beyond the form's own inputs lives in GrievancePortal. */
export function GrievanceForm({ onSubmit, isSubmitting, errorMessage }: GrievanceFormProps) {
  const [reportedBy, setReportedBy] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (!reportedBy.trim() || !title.trim()) return
    onSubmit({ title: title.trim(), description: description.trim(), reportedBy: reportedBy.trim() })
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-md space-y-4">
      <div>
        <label htmlFor="reported-by" className="block text-sm font-medium text-neutral-700">
          Your email address
        </label>
        <input
          id="reported-by"
          type="email"
          required
          value={reportedBy}
          onChange={(e) => setReportedBy(e.target.value)}
          placeholder="you@example.com"
          className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label htmlFor="grievance-title" className="block text-sm font-medium text-neutral-700">
          What's the issue?
        </label>
        <input
          id="grievance-title"
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Short summary"
          className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label htmlFor="grievance-description" className="block text-sm font-medium text-neutral-700">
          Details (optional)
        </label>
        <textarea
          id="grievance-description"
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Tell us more about what happened"
          className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
        />
      </div>

      {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? 'Submitting…' : 'Submit Grievance'}
      </Button>
    </form>
  )
}
