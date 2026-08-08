import type { ReactNode } from 'react'

interface MetricCardProps {
  label: string
  value: string | number
  tone?: 'default' | 'warning' | 'danger'
  icon?: ReactNode
}

const VALUE_TONE_CLASSES = {
  default: 'text-neutral-900',
  warning: 'text-amber-600',
  danger: 'text-red-600',
} as const

const ICON_TONE_CLASSES = {
  default: 'bg-indigo-50 text-indigo-600',
  warning: 'bg-amber-50 text-amber-600',
  danger: 'bg-red-50 text-red-600',
} as const

/** Presentational only — same convention as apps/cases's CaseQueueTable. */
export function MetricCard({ label, value, tone = 'default', icon }: MetricCardProps) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">{label}</p>
        {icon && <span className={`rounded-lg p-1.5 ${ICON_TONE_CLASSES[tone]}`}>{icon}</span>}
      </div>
      <p className={`mt-2 text-2xl font-semibold ${VALUE_TONE_CLASSES[tone]}`}>{value}</p>
    </div>
  )
}
