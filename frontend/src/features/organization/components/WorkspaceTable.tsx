import { LayersIcon, PencilIcon, TrashIcon } from '@/components/icons'
import { EmptyState } from '@/components/ui/EmptyState'
import { RowAction } from '@/components/ui/RowAction'
import { Table, TableBody, TableContainer, TableHead, TableRow, Td, Th } from '@/components/ui/Table'

import type { Workspace } from '../types'

interface WorkspaceTableProps {
  workspaces: Workspace[]
  onEdit: (workspace: Workspace) => void
  onDelete: (id: string) => void
}

/** Presentational only — see apps/consent's ConsentBanner for the same convention. */
export function WorkspaceTable({ workspaces, onEdit, onDelete }: WorkspaceTableProps) {
  if (workspaces.length === 0) {
    return (
      <EmptyState
        icon={<LayersIcon width={20} height={20} />}
        title="No workspaces yet."
        description="Add one below to start grouping assets under it."
      />
    )
  }

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <Th>Name</Th>
            <Th>Slug</Th>
            <Th>Actions</Th>
          </TableRow>
        </TableHead>
        <TableBody>
          {workspaces.map((workspace) => (
            <TableRow key={workspace.id}>
              <Td className="font-medium text-neutral-900">{workspace.name}</Td>
              <Td className="font-mono text-xs text-neutral-500">{workspace.slug}</Td>
              <Td>
                <div className="flex items-center gap-1">
                  <RowAction
                    onClick={() => onEdit(workspace)}
                    icon={<PencilIcon width={14} height={14} />}
                    label="Edit"
                  />
                  <RowAction
                    onClick={() => onDelete(workspace.id)}
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
