import { useState } from 'react'

import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Field } from '@/components/ui/Field'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'

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
    <Card as="form" onSubmit={handleSubmit} className="mx-auto max-w-md space-y-5">
      <Field label="Your email address" htmlFor="subject-key">
        <Input
          id="subject-key"
          type="email"
          required
          value={subjectKey}
          onChange={(e) => setSubjectKey(e.target.value)}
          placeholder="you@example.com"
        />
      </Field>

      <Field label="What would you like to do?" htmlFor="request-type">
        <Select
          id="request-type"
          value={requestType}
          onChange={(e) => setRequestType(e.target.value as RequestType)}
        >
          {REQUEST_TYPES.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </Field>

      {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? 'Submitting…' : 'Submit Request'}
      </Button>
    </Card>
  )
}
