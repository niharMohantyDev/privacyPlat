import { useState } from 'react'

import { Button } from '@/components/ui/Button'

import { RECIPIENT_TYPES, type RecipientType } from '../types'

interface ObligationFormProps {
  onSubmit: (input: { recipientType: RecipientType; recipientIdentifier: string }) => void
  isSubmitting: boolean
  errorMessage?: string | null
}

/** Presentational only — adds one recipient to a breach's notification checklist. */
export function ObligationForm({ onSubmit, isSubmitting, errorMessage }: ObligationFormProps) {
  const [recipientType, setRecipientType] = useState<RecipientType>('vendor')
  const [recipientIdentifier, setRecipientIdentifier] = useState('')

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    onSubmit({ recipientType, recipientIdentifier: recipientIdentifier.trim() })
    setRecipientIdentifier('')
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-2">
      <div>
        <label htmlFor="obligation-recipient-type" className="block text-xs font-medium text-neutral-700">
          Recipient
        </label>
        <select
          id="obligation-recipient-type"
          value={recipientType}
          onChange={(e) => setRecipientType(e.target.value as RecipientType)}
          className="mt-1 rounded-md border border-neutral-300 px-2 py-1 text-xs"
        >
          {RECIPIENT_TYPES.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex-1">
        <label htmlFor="obligation-recipient-identifier" className="block text-xs font-medium text-neutral-700">
          Name (optional)
        </label>
        <input
          id="obligation-recipient-identifier"
          type="text"
          value={recipientIdentifier}
          onChange={(e) => setRecipientIdentifier(e.target.value)}
          placeholder="e.g. the specific authority or vendor"
          className="mt-1 w-full rounded-md border border-neutral-300 px-2 py-1 text-xs"
        />
      </div>

      <Button type="submit" size="sm" disabled={isSubmitting}>
        {isSubmitting ? 'Adding…' : 'Add recipient'}
      </Button>

      {errorMessage && <p className="w-full text-xs text-red-600">{errorMessage}</p>}
    </form>
  )
}
