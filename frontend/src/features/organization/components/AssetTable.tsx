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
    return <p className="text-sm text-neutral-500">No assets yet.</p>
  }

  return (
    <table className="w-full text-left text-sm">
      <thead>
        <tr className="border-b border-neutral-200 text-xs uppercase text-neutral-500">
          <th className="py-2 pr-4">Name</th>
          <th className="py-2 pr-4">Type</th>
          <th className="py-2 pr-4">Public key</th>
          <th className="py-2 pr-4">Status</th>
          <th className="py-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {assets.map((asset) => (
          <tr key={asset.id} className="border-b border-neutral-100">
            <td className="py-2 pr-4">{asset.name}</td>
            <td className="py-2 pr-4">{asset.asset_type.replace('_', ' ')}</td>
            <td className="py-2 pr-4">
              <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-xs">{asset.public_key}</code>
            </td>
            <td className="py-2 pr-4">
              <button
                type="button"
                onClick={() => onToggleActive(asset)}
                className={
                  asset.is_active
                    ? 'rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-800'
                    : 'rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-600'
                }
              >
                {asset.is_active ? 'Active' : 'Revoked'}
              </button>
            </td>
            <td className="py-2">
              <button type="button" onClick={() => onEdit(asset)} className="mr-3 text-blue-600 underline">
                Edit
              </button>
              <button type="button" onClick={() => onDelete(asset.id)} className="text-red-600 underline">
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
