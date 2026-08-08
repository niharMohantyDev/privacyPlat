import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Field } from '@/components/ui/Field'
import { Input } from '@/components/ui/Input'

import type { AdminPurpose } from '../types'

export interface PurposeFormValues {
  code: string
  name: string
  description: string
  is_essential: boolean
}

interface PurposeFormProps {
  editingPurpose: AdminPurpose | null
  onSubmit: (values: PurposeFormValues) => void
  onCancel: () => void
  isSubmitting: boolean
}

const EMPTY_VALUES: PurposeFormValues = {
  code: '',
  name: '',
  description: '',
  is_essential: false,
}

/** Presentational only — used for both create and edit, driven by editingPurpose. */
export function PurposeForm({ editingPurpose, onSubmit, onCancel, isSubmitting }: PurposeFormProps) {
  const [values, setValues] = useState<PurposeFormValues>(EMPTY_VALUES)

  useEffect(() => {
    setValues(
      editingPurpose
        ? {
            code: editingPurpose.code,
            name: editingPurpose.name,
            description: editingPurpose.description,
            is_essential: editingPurpose.is_essential,
          }
        : EMPTY_VALUES,
    )
  }, [editingPurpose])

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (!values.code.trim() || !values.name.trim()) return
    onSubmit(values)
  }

  return (
    <Card as="form" onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-sm font-semibold text-neutral-900">
        {editingPurpose ? 'Edit purpose' : 'New purpose'}
      </h2>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Code" htmlFor="purpose-code">
          <Input
            id="purpose-code"
            value={values.code}
            disabled={Boolean(editingPurpose)}
            onChange={(e) => setValues((v) => ({ ...v, code: e.target.value }))}
          />
        </Field>
        <Field label="Name" htmlFor="purpose-name">
          <Input
            id="purpose-name"
            value={values.name}
            onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
          />
        </Field>
      </div>
      <Field label="Description" htmlFor="purpose-description">
        <Input
          id="purpose-description"
          value={values.description}
          onChange={(e) => setValues((v) => ({ ...v, description: e.target.value }))}
        />
      </Field>
      <label className="flex items-center gap-2 text-sm text-neutral-700">
        <input
          type="checkbox"
          checked={values.is_essential}
          onChange={(e) => setValues((v) => ({ ...v, is_essential: e.target.checked }))}
          className="h-4 w-4 rounded border-neutral-300 text-indigo-600 focus:ring-2 focus:ring-indigo-500/30"
        />
        Essential (always granted, cannot be denied)
      </label>
      <div className="flex gap-2 pt-1">
        <Button type="submit" size="sm" disabled={isSubmitting}>
          {editingPurpose ? 'Save changes' : 'Add purpose'}
        </Button>
        {editingPurpose && (
          <Button type="button" variant="outline" size="sm" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </Card>
  )
}
