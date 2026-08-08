import { useState } from 'react'

import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Field } from '@/components/ui/Field'
import { Input } from '@/components/ui/Input'

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
    <Card as="form" onSubmit={handleSubmit} className="mx-auto max-w-md space-y-5">
      <Field label="Your email address" htmlFor="reported-by">
        <Input
          id="reported-by"
          type="email"
          required
          value={reportedBy}
          onChange={(e) => setReportedBy(e.target.value)}
          placeholder="you@example.com"
        />
      </Field>

      <Field label="What's the issue?" htmlFor="grievance-title">
        <Input
          id="grievance-title"
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Short summary"
        />
      </Field>

      <Field label="Details (optional)" htmlFor="grievance-description">
        <textarea
          id="grievance-description"
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Tell us more about what happened"
          className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 shadow-sm transition-colors placeholder:text-neutral-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        />
      </Field>

      {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? 'Submitting…' : 'Submit Grievance'}
      </Button>
    </Card>
  )
}
