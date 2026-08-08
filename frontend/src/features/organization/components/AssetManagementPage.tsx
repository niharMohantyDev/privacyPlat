import { useState } from 'react'

import { useAssets } from '../hooks/useAssets'
import { useWorkspaces } from '../hooks/useWorkspaces'
import type { Asset, ICoreAdminApiClient } from '../types'
import { AssetForm, type AssetFormValues } from './AssetForm'
import { AssetTable } from './AssetTable'

interface AssetManagementPageProps {
  organizationId: string
  /** Injectable for tests — see useAssets/useWorkspaces. */
  client?: ICoreAdminApiClient
}

export function AssetManagementPage({ organizationId, client }: AssetManagementPageProps) {
  const { workspaces, isLoading: workspacesLoading } = useWorkspaces({ organizationId, client })
  const { assets, isLoading, loadError, create, update, remove, isMutating, mutationError } =
    useAssets({ organizationId, client })
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null)
  // See WorkspaceManagementPage's formResetKey for why this is needed:
  // AssetForm's reset effect is keyed on editingAsset, which is a no-op
  // on a successful create.
  const [formResetKey, setFormResetKey] = useState(0)

  const handleSubmit = (values: AssetFormValues) => {
    const action = editingAsset
      ? update({ id: editingAsset.id, input: values })
      : create(values)
    action
      .then(() => {
        setEditingAsset(null)
        setFormResetKey((k) => k + 1)
      })
      .catch(() => {})
  }

  const handleDelete = (id: string) => {
    remove(id).catch(() => {})
  }

  const handleToggleActive = (asset: Asset) => {
    update({ id: asset.id, input: { is_active: !asset.is_active } }).catch(() => {})
  }

  const loading = isLoading || workspacesLoading

  return (
    <main className="mx-auto max-w-4xl p-8">
      <h1 className="mb-6 text-xl font-semibold">Assets</h1>
      <p className="mb-6 text-sm text-neutral-600 dark:text-neutral-300">
        The public key here is what the embeddable Consent Banner and DSAR portal are keyed by —
        copy it into <code className="rounded bg-neutral-100 px-1">VITE_DEMO_ASSET_PUBLIC_KEY</code>{' '}
        or a real embed script.
      </p>

      {loading && <p className="text-sm text-neutral-500">Loading…</p>}
      {loadError && <p className="text-sm text-red-600">Failed to load assets.</p>}
      {mutationError && <p className="mb-4 text-sm text-red-600">That action failed — please try again.</p>}

      {!loading && !loadError && (
        <div className="space-y-6">
          <AssetTable
            assets={assets}
            onEdit={setEditingAsset}
            onDelete={handleDelete}
            onToggleActive={handleToggleActive}
          />
          <AssetForm
            key={formResetKey}
            editingAsset={editingAsset}
            workspaces={workspaces}
            onSubmit={handleSubmit}
            onCancel={() => setEditingAsset(null)}
            isSubmitting={isMutating}
          />
        </div>
      )}
    </main>
  )
}
