import { ListIcon, PencilIcon, TrashIcon } from '@/components/icons'
import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import { RowAction } from '@/components/ui/RowAction'
import { Table, TableBody, TableContainer, TableHead, TableRow, Td, Th } from '@/components/ui/Table'

import type { AdminPurpose } from '../types'

interface PurposeTableProps {
  purposes: AdminPurpose[]
  onEdit: (purpose: AdminPurpose) => void
  onDelete: (id: string) => void
}

/** Presentational only — see apps/consent's ConsentBanner for the same convention. */
export function PurposeTable({ purposes, onEdit, onDelete }: PurposeTableProps) {
  if (purposes.length === 0) {
    return (
      <EmptyState
        icon={<ListIcon width={20} height={20} />}
        title="No purposes yet."
        description="Add one below to start collecting consent for it."
      />
    )
  }

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <Th>Code</Th>
            <Th>Name</Th>
            <Th>Essential</Th>
            <Th>Actions</Th>
          </TableRow>
        </TableHead>
        <TableBody>
          {purposes.map((purpose) => (
            <TableRow key={purpose.id}>
              <Td className="font-mono text-xs text-neutral-500">{purpose.code}</Td>
              <Td className="font-medium text-neutral-900">{purpose.name}</Td>
              <Td>
                <Badge variant={purpose.is_essential ? 'brand' : 'neutral'}>
                  {purpose.is_essential ? 'Yes' : 'No'}
                </Badge>
              </Td>
              <Td>
                <div className="flex items-center gap-1">
                  <RowAction
                    onClick={() => onEdit(purpose)}
                    icon={<PencilIcon width={14} height={14} />}
                    label="Edit"
                  />
                  <RowAction
                    onClick={() => onDelete(purpose.id)}
                    icon={<TrashIcon width={14} height={14} />}
                    label="Delete"
                    tone="danger"
                  />
                </div>
              </Td>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
