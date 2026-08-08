import type { ReactNode } from 'react'

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
}

/** Consistent "nothing here yet" treatment — replaces the bare
 * `<p>No X yet.</p>` that used to sit unstyled beneath the page title. */
export function EmptyState({ icon, title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-neutral-200 bg-neutral-50/50 px-6 py-14 text-center">
      {icon && (
        <div className="mb-1 flex h-11 w-11 items-center justify-center rounded-full bg-white text-neutral-400 shadow-sm">
          {icon}
        </div>
      )}
      <p className="text-sm font-medium text-neutral-700">{title}</p>
      {description && <p className="text-xs text-neutral-500">{description}</p>}
    </div>
  )
}
