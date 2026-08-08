import { PageHeader } from '@/components/ui/PageHeader'

import { useNoticeRegister } from '../hooks/useNoticeRegister'
import type { INoticesAdminApiClient } from '../types'
import { NoticeDraftForm } from './NoticeDraftForm'
import { NoticeTable } from './NoticeTable'

interface NoticeManagementPageProps {
  organizationId: string
  /** Injectable for tests — see useNoticeRegister. */
  client?: INoticesAdminApiClient
}

export function NoticeManagementPage({ organizationId, client }: NoticeManagementPageProps) {
  const {
    notices,
    isLoading,
    loadError,
    createDraft,
    isCreating,
    createError,
    publish,
    archive,
    isUpdating,
    updateError,
  } = useNoticeRegister({ organizationId, client })

  return (
    <main className="mx-auto max-w-5xl p-8">
      <PageHeader
        title="Privacy Notices"
        description="Version history and publish workflow for your privacy policy, terms, and cookie policy."
      />

      <div className="mb-6">
        <NoticeDraftForm
          onSubmit={(input) => createDraft(input).catch(() => {})}
          isSubmitting={isCreating}
          errorMessage={createError ? 'Could not save this draft — please try again.' : null}
        />
      </div>

      {isLoading && <p className="text-sm text-neutral-500">Loading…</p>}
      {loadError && <p className="text-sm text-red-600">Failed to load notices.</p>}
      {updateError && (
        <p className="mb-4 text-sm text-red-600">
          That action wasn't allowed from the notice's current state.
        </p>
      )}

      {!isLoading && !loadError && (
        <NoticeTable
          notices={notices}
          onPublish={(noticeId) => publish(noticeId).catch(() => {})}
          onArchive={(noticeId) => archive(noticeId).catch(() => {})}
          isUpdating={isUpdating}
        />
      )}
    </main>
  )
}
