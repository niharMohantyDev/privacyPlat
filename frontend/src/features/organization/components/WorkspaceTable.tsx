import type { Workspace } from '../types'

interface WorkspaceTableProps {
  workspaces: Workspace[]
  onEdit: (workspace: Workspace) => void
  onDelete: (id: string) => void
}

/** Presentational only — see apps/consent's ConsentBanner for the same convention. */
export function WorkspaceTable({ workspaces, onEdit, onDelete }: WorkspaceTableProps) {
  if (workspaces.length === 0) {
    return <p className="text-sm text-neutral-500">No workspaces yet.</p>
  }

  return (
    <table className="w-full text-left text-sm">
      <thead>
        <tr className="border-b border-neutral-200 text-xs uppercase text-neutral-500 dark:border-neutral-800">
          <th className="py-2 pr-4">Name</th>
          <th className="py-2 pr-4">Slug</th>
          <th className="py-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {workspaces.map((workspace) => (
          <tr key={workspace.id} className="border-b border-neutral-100 dark:border-neutral-900">
            <td className="py-2 pr-4">{workspace.name}</td>
            <td className="py-2 pr-4 font-mono text-xs">{workspace.slug}</td>
            <td className="py-2">
              <button type="button" onClick={() => onEdit(workspace)} className="mr-3 text-blue-600 underline">
                Edit
              </button>
              <button type="button" onClick={() => onDelete(workspace.id)} className="text-red-600 underline">
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
