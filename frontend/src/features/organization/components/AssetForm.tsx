import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Field } from '@/components/ui/Field'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'

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
  return {
    workspace: workspaces[0]?.id ?? '',
    asset_type: 'website',
    name: '',
    identifier: '',
  }
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
    <Card as="form" onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-sm font-semibold text-neutral-900">{editingAsset ? 'Edit asset' : 'New asset'}</h2>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Name" htmlFor="asset-name">
          <Input
            id="asset-name"
            value={values.name}
            onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
          />
        </Field>
        <Field label="Identifier (domain, bundle id, ...)" htmlFor="asset-identifier">
          <Input
            id="asset-identifier"
            value={values.identifier}
            onChange={(e) => setValues((v) => ({ ...v, identifier: e.target.value }))}
          />
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Type" htmlFor="asset-type">
          <Select
            id="asset-type"
            value={values.asset_type}
            onChange={(e) =>
              setValues((v) => ({
                ...v,
                asset_type: e.target.value as AssetType,
              }))
            }
          >
            {ASSET_TYPES.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Workspace" htmlFor="asset-workspace">
          <Select
            id="asset-workspace"
            value={values.workspace}
            disabled={Boolean(editingAsset)}
            onChange={(e) => setValues((v) => ({ ...v, workspace: e.target.value }))}
          >
            {workspaces.map((workspace) => (
              <option key={workspace.id} value={workspace.id}>
                {workspace.name}
              </option>
            ))}
          </Select>
        </Field>
      </div>
      <div className="flex gap-2 pt-1">
        <Button type="submit" size="sm" disabled={isSubmitting || workspaces.length === 0}>
          {editingAsset ? 'Save changes' : 'Add asset'}
        </Button>
        {editingAsset && (
          <Button type="button" variant="outline" size="sm" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
      {workspaces.length === 0 && (
        <p className="text-xs text-amber-600">Create a workspace first before adding assets.</p>
      )}
    </Card>
  )
}
