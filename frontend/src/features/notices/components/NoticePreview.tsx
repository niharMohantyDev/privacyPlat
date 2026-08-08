import { Card } from '@/components/ui/Card'

import { useNotice } from '../hooks/useNotice'
import type { INoticesApiClient, NoticeType } from '../types'

interface NoticePreviewProps {
  publicKey: string
  noticeType: NoticeType
  /** Injectable for tests — see useNotice. */
  client?: INoticesApiClient
}

/**
 * Container: fetches and renders the currently published version of a
 * notice — the same read a real customer's site would embed. No form
 * here; unlike Rights/Cases, a visitor only ever reads a notice, they
 * don't submit one.
 */
export function NoticePreview({ publicKey, noticeType, client }: NoticePreviewProps) {
  const { notice, isLoading, loadError } = useNotice({ publicKey, noticeType, client })

  if (isLoading) {
    return <p className="text-sm text-neutral-500">Loading…</p>
  }

  if (loadError) {
    return <p className="text-sm text-red-600">This organization hasn't published this notice yet.</p>
  }

  if (!notice) {
    return null
  }

  return (
    <Card className="mx-auto max-w-2xl">
      <div className="mb-4 flex items-center justify-between border-b border-neutral-100 pb-4">
        <h1 className="text-xl font-semibold text-neutral-900">{notice.title}</h1>
        <span className="text-xs text-neutral-400">
          v{notice.version}
          {notice.published_at && ` · Published ${new Date(notice.published_at).toLocaleDateString()}`}
        </span>
      </div>
      <p className="whitespace-pre-line text-sm leading-relaxed text-neutral-700">{notice.body}</p>
    </Card>
  )
}
