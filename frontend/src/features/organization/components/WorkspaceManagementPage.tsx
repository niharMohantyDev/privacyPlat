import { useState } from 'react'

import { PageHeader } from '@/components/ui/PageHeader'

import { useWorkspaces } from '../hooks/useWorkspaces'
import type { ICoreAdminApiClient, Workspace } from '../types'
import { WorkspaceForm, type WorkspaceFormValues } from './WorkspaceForm'
import { WorkspaceTable } from './WorkspaceTable'

interface WorkspaceManagementPageProps {
  organizationId: string
  /** Injectable for tests — see useWorkspaces. */
  client?: ICoreAdminApiClient
}

export function WorkspaceManagementPage({ organizationId, client }: WorkspaceManagementPageProps) {
  const { workspaces, isLoading, loadError, create, update, remove, isMutating, mutationError } =
    useWorkspaces({ organizationId, client })
  const [editingWorkspace, setEditingWorkspace] = useState<Workspace | null>(null)
  // WorkspaceForm resets its internal state from a useEffect keyed on
  // editingWorkspace — that's a no-op on a successful *create*, since
  // editingWorkspace is null both before and after. Remounting the form
  // (via this key) on every successful submit is what actually clears it.
  const [formResetKey, setFormResetKey] = useState(0)

  const handleSubmit = (values: WorkspaceFormValues) => {
    const action = editingWorkspace
      ? update({ id: editingWorkspace.id, input: values })
      : create(values)
    // mutateAsync rejects on failure; mutationError already tracks it
    // reactively, so the rejection itself just needs to not become an
    // unhandled one (see apps/consent's PurposeManagementPage).
    action
      .then(() => {
        setEditingWorkspace(null)
        setFormResetKey((k) => k + 1)
      })
      .catch(() => {})
  }

  const handleDelete = (id: string) => {
    remove(id).catch(() => {})
  }

  return (
    <main className="mx-auto max-w-4xl p-8">
      <PageHeader title="Workspaces" description="Groupings of assets within your organization." />

      {isLoading && <p className="text-sm text-neutral-500">Loading…</p>}
      {loadError && <p className="text-sm text-red-600">Failed to load workspaces.</p>}
      {mutationError && <p className="mb-4 text-sm text-red-600">That action failed — please try again.</p>}

      {!isLoading && !loadError && (
        <div className="space-y-6">
          <WorkspaceTable workspaces={workspaces} onEdit={setEditingWorkspace} onDelete={handleDelete} />
          <WorkspaceForm
            key={formResetKey}
            editingWorkspace={editingWorkspace}
            onSubmit={handleSubmit}
            onCancel={() => setEditingWorkspace(null)}
            isSubmitting={isMutating}
          />
        </div>
      )}
    </main>
  )
}
