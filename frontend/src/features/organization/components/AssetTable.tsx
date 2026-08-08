import { GlobeIcon, PencilIcon, TrashIcon } from '@/components/icons'
import { BadgeButton } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import { RowAction } from '@/components/ui/RowAction'
import { Table, TableBody, TableContainer, TableHead, TableRow, Td, Th } from '@/components/ui/Table'

import type { Asset } from '../types'

interface AssetTableProps {
  assets: Asset[]
  onEdit: (asset: Asset) => void
  onDelete: (id: string) => void
  onToggleActive: (asset: Asset) => void
}

/** Presentational only — see apps/consent's ConsentBanner for the same convention. */
export function AssetTable({ assets, onEdit, onDelete, onToggleActive }: AssetTableProps) {
  if (assets.length === 0) {
    return (
      <EmptyState
        icon={<GlobeIcon width={20} height={20} />}
        title="No assets yet."
        description="Add a website, app, or system below to get its public key."
      />
    )
  }

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <Th>Name</Th>
            <Th>Type</Th>
            <Th>Public key</Th>
            <Th>Status</Th>
            <Th>Actions</Th>
          </TableRow>
        </TableHead>
        <TableBody>
          {assets.map((asset) => (
            <TableRow key={asset.id}>
              <Td className="font-medium text-neutral-900">{asset.name}</Td>
              <Td className="capitalize text-neutral-600">{asset.asset_type.replace('_', ' ')}</Td>
              <Td>
                <code className="rounded-md bg-neutral-100 px-1.5 py-0.5 text-xs text-neutral-600">
                  {asset.public_key}
                </code>
              </Td>
              <Td>
                <BadgeButton
                  variant={asset.is_active ? 'success' : 'neutral'}
                  onClick={() => onToggleActive(asset)}
                >
                  {asset.is_active ? 'Active' : 'Revoked'}
                </BadgeButton>
              </Td>
              <Td>
                <div className="flex items-center gap-1">
                  <RowAction
                    onClick={() => onEdit(asset)}
                    icon={<PencilIcon width={14} height={14} />}
                    label="Edit"
                  />
                  <RowAction
                    onClick={() => onDelete(asset.id)}
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
