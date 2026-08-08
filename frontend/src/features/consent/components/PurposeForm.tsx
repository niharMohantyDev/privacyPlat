import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/Button'

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

const EMPTY_VALUES: PurposeFormValues = { code: '', name: '', description: '', is_essential: false }

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
    <form onSubmit={handleSubmit} className="space-y-3 rounded-md border border-neutral-200 p-4 dark:border-neutral-800">
      <h2 className="text-sm font-semibold">{editingPurpose ? 'Edit purpose' : 'New purpose'}</h2>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="purpose-code" className="block text-xs font-medium text-neutral-600 dark:text-neutral-300">
            Code
          </label>
          <input
            id="purpose-code"
            value={values.code}
            disabled={Boolean(editingPurpose)}
            onChange={(e) => setValues((v) => ({ ...v, code: e.target.value }))}
            className="mt-1 w-full rounded-md border border-neutral-300 px-2 py-1 text-sm disabled:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900 dark:disabled:bg-neutral-800"
          />
        </div>
        <div>
          <label htmlFor="purpose-name" className="block text-xs font-medium text-neutral-600 dark:text-neutral-300">
            Name
          </label>
          <input
            id="purpose-name"
            value={values.name}
            onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
            className="mt-1 w-full rounded-md border border-neutral-300 px-2 py-1 text-sm dark:border-neutral-700 dark:bg-neutral-900"
          />
        </div>
      </div>
      <div>
        <label htmlFor="purpose-description" className="block text-xs font-medium text-neutral-600 dark:text-neutral-300">
          Description
        </label>
        <input
          id="purpose-description"
          value={values.description}
          onChange={(e) => setValues((v) => ({ ...v, description: e.target.value }))}
          className="mt-1 w-full rounded-md border border-neutral-300 px-2 py-1 text-sm dark:border-neutral-700 dark:bg-neutral-900"
        />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={values.is_essential}
          onChange={(e) => setValues((v) => ({ ...v, is_essential: e.target.checked }))}
        />
        Essential (always granted, cannot be denied)
      </label>
      <div className="flex gap-2">
        <Button type="submit" size="sm" disabled={isSubmitting}>
          {editingPurpose ? 'Save changes' : 'Add purpose'}
        </Button>
        {editingPurpose && (
          <Button type="button" variant="outline" size="sm" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  )
}
