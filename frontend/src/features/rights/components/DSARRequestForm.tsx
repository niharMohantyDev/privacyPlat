import { useState } from 'react'

import { Button } from '@/components/ui/Button'

import { REQUEST_TYPES, type RequestType } from '../types'

interface DSARRequestFormProps {
  onSubmit: (input: { subjectKey: string; requestType: RequestType }) => void
  isSubmitting: boolean
  errorMessage?: string | null
}

/** Presentational only — all state/logic beyond the form's own inputs lives in DSARPortal. */
export function DSARRequestForm({ onSubmit, isSubmitting, errorMessage }: DSARRequestFormProps) {
  const [subjectKey, setSubjectKey] = useState('')
  const [requestType, setRequestType] = useState<RequestType>('access')

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (!subjectKey.trim()) return
    onSubmit({ subjectKey: subjectKey.trim(), requestType })
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-md space-y-4">
      <div>
        <label htmlFor="subject-key" className="block text-sm font-medium text-neutral-700 dark:text-neutral-200">
          Your email address
        </label>
        <input
          id="subject-key"
          type="email"
          required
          value={subjectKey}
          onChange={(e) => setSubjectKey(e.target.value)}
          placeholder="you@example.com"
          className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
        />
      </div>

      <div>
        <label htmlFor="request-type" className="block text-sm font-medium text-neutral-700 dark:text-neutral-200">
          What would you like to do?
        </label>
        <select
          id="request-type"
          value={requestType}
          onChange={(e) => setRequestType(e.target.value as RequestType)}
          className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
        >
          {REQUEST_TYPES.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? 'Submitting…' : 'Submit Request'}
      </Button>
    </form>
  )
}
