interface MetricCardProps {
  label: string
  value: string | number
  tone?: 'default' | 'warning' | 'danger'
}

const TONE_CLASSES = {
  default: 'text-neutral-900',
  warning: 'text-amber-600',
  danger: 'text-red-600',
} as const

/** Presentational only — same convention as apps/cases's CaseQueueTable. */
export function MetricCard({ label, value, tone = 'default' }: MetricCardProps) {
  return (
    <div className="rounded-md border border-neutral-200 p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">{label}</p>
      <p className={`mt-1 text-2xl font-semibold ${TONE_CLASSES[tone]}`}>{value}</p>
    </div>
  )
}
