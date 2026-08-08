import { ArchiveIcon, CheckCircleIcon, MegaphoneIcon } from '@/components/icons'
import { Badge, type BadgeVariant } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import { RowAction } from '@/components/ui/RowAction'
import { Table, TableBody, TableContainer, TableHead, TableRow, Td, Th } from '@/components/ui/Table'

import { NOTICE_TYPES, type PrivacyNotice } from '../types'

interface NoticeTableProps {
  notices: PrivacyNotice[]
  onPublish: (noticeId: string) => void
  onArchive: (noticeId: string) => void
  isUpdating: boolean
}

const STATUS_VARIANTS: Record<string, BadgeVariant> = {
  draft: 'neutral',
  published: 'success',
  archived: 'neutral',
}

function noticeTypeLabel(noticeType: string): string {
  return NOTICE_TYPES.find((option) => option.value === noticeType)?.label ?? noticeType
}

function isOverdue(reviewDueAt: string | null): boolean {
  return Boolean(reviewDueAt && new Date(reviewDueAt).getTime() < Date.now())
}

/** Presentational only — the version history table for every notice type. */
export function NoticeTable({ notices, onPublish, onArchive, isUpdating }: NoticeTableProps) {
  if (notices.length === 0) {
    return (
      <EmptyState
        icon={<MegaphoneIcon width={20} height={20} />}
        title="No notices yet."
        description="Draft one below to start building a version history."
      />
    )
  }

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <Th>Type</Th>
            <Th>Title</Th>
            <Th>Version</Th>
            <Th>Status</Th>
            <Th>Review Due</Th>
            <Th>Actions</Th>
          </TableRow>
        </TableHead>
        <TableBody>
          {notices.map((notice) => (
            <TableRow key={notice.id}>
              <Td className="text-neutral-600">{noticeTypeLabel(notice.notice_type)}</Td>
              <Td className="font-medium text-neutral-900">{notice.title}</Td>
              <Td className="text-neutral-600">v{notice.version}</Td>
              <Td>
                <Badge variant={STATUS_VARIANTS[notice.status] ?? 'neutral'}>{notice.status}</Badge>
              </Td>
              <Td className={isOverdue(notice.review_due_at) ? 'font-medium text-red-600' : 'text-neutral-600'}>
                {notice.review_due_at ? new Date(notice.review_due_at).toLocaleDateString() : '—'}
                {isOverdue(notice.review_due_at) && ' (overdue)'}
              </Td>
              <Td>
                <div className="flex items-center gap-1">
                  {notice.status === 'draft' && (
                    <RowAction
                      onClick={() => onPublish(notice.id)}
                      icon={<CheckCircleIcon width={14} height={14} />}
                      label="Publish"
                    />
                  )}
                  {notice.status !== 'archived' && (
                    <RowAction
                      onClick={() => onArchive(notice.id)}
                      icon={<ArchiveIcon width={14} height={14} />}
                      label="Archive"
                      tone="danger"
                    />
                  )}
                  {notice.status === 'archived' && <span className="text-xs text-neutral-400">—</span>}
                </div>
              </Td>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
