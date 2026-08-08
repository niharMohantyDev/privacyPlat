import { useState } from 'react'

import { Button } from '@/components/ui/Button'

import { LEGAL_BASES, RISK_LEVELS, type LegalBasis, type RiskLevel } from '../types'

interface RopaActivityFormProps {
  onSubmit: (input: { title: string; legalBasis: LegalBasis; riskLevel: RiskLevel; owner: string }) => void
  isSubmitting: boolean
  errorMessage?: string | null
}

/** Presentational only — staff-side entry form for a new RoPA register row. */
export function RopaActivityForm({ onSubmit, isSubmitting, errorMessage }: RopaActivityFormProps) {
  const [title, setTitle] = useState('')
  const [legalBasis, setLegalBasis] = useState<LegalBasis>('contract')
  const [riskLevel, setRiskLevel] = useState<RiskLevel>('medium')
  const [owner, setOwner] = useState('')

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (!title.trim()) return
    onSubmit({ title: title.trim(), legalBasis, riskLevel, owner: owner.trim() })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-3">
      <div className="flex-1">
        <label htmlFor="ropa-title" className="block text-xs font-medium text-neutral-700">
          Processing activity
        </label>
        <input
          id="ropa-title"
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Employee payroll processing"
          className="mt-1 w-full rounded-md border border-neutral-300 px-2 py-1.5 text-sm"
        />
      </div>

      <div>
        <label htmlFor="ropa-legal-basis" className="block text-xs font-medium text-neutral-700">
          Legal basis
        </label>
        <select
          id="ropa-legal-basis"
          value={legalBasis}
          onChange={(e) => setLegalBasis(e.target.value as LegalBasis)}
          className="mt-1 rounded-md border border-neutral-300 px-2 py-1.5 text-sm"
        >
          {LEGAL_BASES.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="ropa-risk-level" className="block text-xs font-medium text-neutral-700">
          Risk level
        </label>
        <select
          id="ropa-risk-level"
          value={riskLevel}
          onChange={(e) => setRiskLevel(e.target.value as RiskLevel)}
          className="mt-1 rounded-md border border-neutral-300 px-2 py-1.5 text-sm"
        >
          {RISK_LEVELS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="ropa-owner" className="block text-xs font-medium text-neutral-700">
          Owner
        </label>
        <input
          id="ropa-owner"
          type="text"
          value={owner}
          onChange={(e) => setOwner(e.target.value)}
          placeholder="Team or role"
          className="mt-1 w-40 rounded-md border border-neutral-300 px-2 py-1.5 text-sm"
        />
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Adding…' : 'Add to Register'}
      </Button>

      {errorMessage && <p className="w-full text-sm text-red-600">{errorMessage}</p>}
    </form>
  )
}
