import { useEffect, useState } from 'react'

import { ASSET_TYPES, type Asset, type AssetType, type Workspace } from '../types'

export interface AssetFormValues {
  workspace: string
  asset_type: AssetType
  name: string
  identifier: string
}

interface AssetFormProps {
  editingAsset: Asset | null
  workspaces: Workspace[]
  onSubmit: (values: AssetFormValues) => void
  onCancel: () => void
  isSubmitting: boolean
}

function emptyValues(workspaces: Workspace[]): AssetFormValues {
  return { workspace: workspaces[0]?.id ?? '', asset_type: 'website', name: '', identifier: '' }
}

/** Presentational only — used for both create and edit, driven by editingAsset. */
export function AssetForm({ editingAsset, workspaces, onSubmit, onCancel, isSubmitting }: AssetFormProps) {
  const [values, setValues] = useState<AssetFormValues>(() => emptyValues(workspaces))

  useEffect(() => {
    setValues(
      editingAsset
        ? {
            workspace: editingAsset.workspace,
            asset_type: editingAsset.asset_type,
            name: editingAsset.name,
            identifier: editingAsset.identifier,
          }
        : emptyValues(workspaces),
    )
    // workspaces intentionally excluded: only reset when switching between create/edit targets
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingAsset])

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (!values.name.trim() || !values.workspace) return
    onSubmit(values)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-md border border-neutral-200 p-4 dark:border-neutral-800">
      <h2 className="text-sm font-semibold">{editingAsset ? 'Edit asset' : 'New asset'}</h2>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="asset-name" className="block text-xs font-medium text-neutral-600 dark:text-neutral-300">
            Name
          </label>
          <input
            id="asset-name"
            value={values.name}
            onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
            className="mt-1 w-full rounded-md border border-neutral-300 px-2 py-1 text-sm dark:border-neutral-700 dark:bg-neutral-900"
          />
        </div>
        <div>
          <label htmlFor="asset-identifier" className="block text-xs font-medium text-neutral-600 dark:text-neutral-300">
            Identifier (domain, bundle id, ...)
          </label>
          <input
            id="asset-identifier"
            value={values.identifier}
            onChange={(e) => setValues((v) => ({ ...v, identifier: e.target.value }))}
            className="mt-1 w-full rounded-md border border-neutral-300 px-2 py-1 text-sm dark:border-neutral-700 dark:bg-neutral-900"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="asset-type" className="block text-xs font-medium text-neutral-600 dark:text-neutral-300">
            Type
          </label>
          <select
            id="asset-type"
            value={values.asset_type}
            onChange={(e) => setValues((v) => ({ ...v, asset_type: e.target.value as AssetType }))}
            className="mt-1 w-full rounded-md border border-neutral-300 px-2 py-1 text-sm dark:border-neutral-700 dark:bg-neutral-900"
          >
            {ASSET_TYPES.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="asset-workspace" className="block text-xs font-medium text-neutral-600 dark:text-neutral-300">
            Workspace
          </label>
          <select
            id="asset-workspace"
            value={values.workspace}
            disabled={Boolean(editingAsset)}
            onChange={(e) => setValues((v) => ({ ...v, workspace: e.target.value }))}
            className="mt-1 w-full rounded-md border border-neutral-300 px-2 py-1 text-sm disabled:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900 dark:disabled:bg-neutral-800"
          >
            {workspaces.map((workspace) => (
              <option key={workspace.id} value={workspace.id}>
                {workspace.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isSubmitting || workspaces.length === 0}
          className="rounded-md bg-neutral-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-neutral-700 disabled:opacity-50 dark:bg-white dark:text-neutral-900"
        >
          {editingAsset ? 'Save changes' : 'Add asset'}
        </button>
        {editingAsset && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm dark:border-neutral-700"
          >
            Cancel
          </button>
        )}
      </div>
      {workspaces.length === 0 && (
        <p className="text-xs text-amber-600">Create a workspace first before adding assets.</p>
      )}
    </form>
  )
}
