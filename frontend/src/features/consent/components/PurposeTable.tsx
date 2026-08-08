import type { AdminPurpose } from '../types'

interface PurposeTableProps {
  purposes: AdminPurpose[]
  onEdit: (purpose: AdminPurpose) => void
  onDelete: (id: string) => void
}

/** Presentational only — see apps/consent's ConsentBanner for the same convention. */
export function PurposeTable({ purposes, onEdit, onDelete }: PurposeTableProps) {
  if (purposes.length === 0) {
    return <p className="text-sm text-neutral-500">No purposes yet.</p>
  }

  return (
    <table className="w-full text-left text-sm">
      <thead>
        <tr className="border-b border-neutral-200 text-xs uppercase text-neutral-500">
          <th className="py-2 pr-4">Code</th>
          <th className="py-2 pr-4">Name</th>
          <th className="py-2 pr-4">Essential</th>
          <th className="py-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {purposes.map((purpose) => (
          <tr key={purpose.id} className="border-b border-neutral-100">
            <td className="py-2 pr-4 font-mono text-xs">{purpose.code}</td>
            <td className="py-2 pr-4">{purpose.name}</td>
            <td className="py-2 pr-4">{purpose.is_essential ? 'Yes' : 'No'}</td>
            <td className="py-2">
              <button type="button" onClick={() => onEdit(purpose)} className="mr-3 text-blue-600 underline">
                Edit
              </button>
              <button type="button" onClick={() => onDelete(purpose.id)} className="text-red-600 underline">
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
