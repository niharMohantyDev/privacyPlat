import { useEffect, useState } from 'react'

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
    <form onSubmit={handleSubmit} className="space-y-3 rounded-md border border-neutral-200 p-4 dark:border-neutral-800">
      <h2 className="text-sm font-semibold">{editingWorkspace ? 'Edit workspace' : 'New workspace'}</h2>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="workspace-name" className="block text-xs font-medium text-neutral-600 dark:text-neutral-300">
            Name
          </label>
          <input
            id="workspace-name"
            value={values.name}
            onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
            className="mt-1 w-full rounded-md border border-neutral-300 px-2 py-1 text-sm dark:border-neutral-700 dark:bg-neutral-900"
          />
        </div>
        <div>
          <label htmlFor="workspace-slug" className="block text-xs font-medium text-neutral-600 dark:text-neutral-300">
            Slug
          </label>
          <input
            id="workspace-slug"
            value={values.slug}
            disabled={Boolean(editingWorkspace)}
            onChange={(e) => setValues((v) => ({ ...v, slug: e.target.value }))}
            className="mt-1 w-full rounded-md border border-neutral-300 px-2 py-1 text-sm disabled:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900 dark:disabled:bg-neutral-800"
          />
        </div>
      </div>
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-neutral-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-neutral-700 disabled:opacity-50 dark:bg-white dark:text-neutral-900"
        >
          {editingWorkspace ? 'Save changes' : 'Add workspace'}
        </button>
        {editingWorkspace && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm dark:border-neutral-700"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}
