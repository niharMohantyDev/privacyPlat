import { useState } from 'react'

import { usePurposes } from '../hooks/usePurposes'
import type { AdminPurpose, IConsentAdminApiClient } from '../types'
import { PurposeForm, type PurposeFormValues } from './PurposeForm'
import { PurposeTable } from './PurposeTable'

interface PurposeManagementPageProps {
  organizationId: string
  /** Injectable for tests — see usePurposes. */
  client?: IConsentAdminApiClient
}

export function PurposeManagementPage({ organizationId, client }: PurposeManagementPageProps) {
  const { purposes, isLoading, loadError, create, update, remove, isMutating, mutationError } =
    usePurposes({ organizationId, client })
  const [editingPurpose, setEditingPurpose] = useState<AdminPurpose | null>(null)

  const handleSubmit = (values: PurposeFormValues) => {
    const action = editingPurpose
      ? update({ id: editingPurpose.id, input: values })
      : create(values)
    // mutateAsync rejects on failure; mutationError already tracks it
    // reactively (see usePurposes), so the rejection itself just needs
    // to not become an unhandled one.
    action.then(() => setEditingPurpose(null)).catch(() => {})
  }

  const handleDelete = (id: string) => {
    remove(id).catch(() => {})
  }

  return (
    <main className="mx-auto max-w-4xl p-8">
      <h1 className="mb-6 text-xl font-semibold">Purpose Management</h1>

      {isLoading && <p className="text-sm text-neutral-500">Loading…</p>}
      {loadError && <p className="text-sm text-red-600">Failed to load purposes.</p>}
      {mutationError && <p className="mb-4 text-sm text-red-600">That action failed — please try again.</p>}

      {!isLoading && !loadError && (
        <div className="space-y-6">
          <PurposeTable purposes={purposes} onEdit={setEditingPurpose} onDelete={handleDelete} />
          <PurposeForm
            editingPurpose={editingPurpose}
            onSubmit={handleSubmit}
            onCancel={() => setEditingPurpose(null)}
            isSubmitting={isMutating}
          />
        </div>
      )}
    </main>
  )
}
