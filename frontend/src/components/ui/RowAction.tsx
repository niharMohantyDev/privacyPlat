import type { ReactNode } from 'react'

interface RowActionProps {
  onClick: () => void
  icon: ReactNode
  label: string
  tone?: 'neutral' | 'danger'
}

const TONE_CLASSES = {
  neutral: 'text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900',
  danger: 'text-neutral-500 hover:bg-red-50 hover:text-red-600',
} as const

/** Small icon+label action for table rows — replaces bare underlined text links. */
export function RowAction({ onClick, icon, label, tone = 'neutral' }: RowActionProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium transition-colors ${TONE_CLASSES[tone]}`}
    >
      {icon}
      {label}
    </button>
  )
}
