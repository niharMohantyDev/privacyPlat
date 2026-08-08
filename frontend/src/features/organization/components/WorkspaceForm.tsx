import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Field } from '@/components/ui/Field'
import { Input } from '@/components/ui/Input'

import type { Workspace } from '../types'

export interface WorkspaceFormValues {
  name: string
  slug: string
}

interface WorkspaceFormProps {
  editingWorkspace: Workspace | null
  onSubmit: (values: WorkspaceFormValues) => void
  onCancel: () => void
  isSubmitting: boolean
}

const EMPTY_VALUES: WorkspaceFormValues = { name: '', slug: '' }

/** Presentational only — used for both create and edit, driven by editingWorkspace. */
export function WorkspaceForm({ editingWorkspace, onSubmit, onCancel, isSubmitting }: WorkspaceFormProps) {
  const [values, setValues] = useState<WorkspaceFormValues>(EMPTY_VALUES)

  useEffect(() => {
    setValues(editingWorkspace ? { name: editingWorkspace.name, slug: editingWorkspace.slug } : EMPTY_VALUES)
  }, [editingWorkspace])

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (!values.name.trim() || !values.slug.trim()) return
    onSubmit(values)
  }

  return (
    <Card as="form" onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-sm font-semibold text-neutral-900">
        {editingWorkspace ? 'Edit workspace' : 'New workspace'}
      </h2>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Name" htmlFor="workspace-name">
          <Input
            id="workspace-name"
            value={values.name}
            onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
          />
        </Field>
        <Field label="Slug" htmlFor="workspace-slug">
          <Input
            id="workspace-slug"
            value={values.slug}
            disabled={Boolean(editingWorkspace)}
            onChange={(e) => setValues((v) => ({ ...v, slug: e.target.value }))}
          />
        </Field>
      </div>
      <div className="flex gap-2 pt-1">
        <Button type="submit" size="sm" disabled={isSubmitting}>
          {editingWorkspace ? 'Save changes' : 'Add workspace'}
        </Button>
        {editingWorkspace && (
          <Button type="button" variant="outline" size="sm" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </Card>
  )
}
