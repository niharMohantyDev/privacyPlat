import { useEffect, useState } from 'react'

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'

export interface DonutChartDatum {
  name: string
  value: number
  color: string
}

interface DonutChartProps {
  title: string
  data: DonutChartDatum[]
  emptyMessage: string
  centerLabel?: string
}

/** Presentational only — generic donut used by every dashboard slice-breakdown chart. */
export function DonutChart({ title, data, emptyMessage, centerLabel }: DonutChartProps) {
  const total = data.reduce((sum, datum) => sum + datum.value, 0)
  // recharts miscalculates a slice's sweep angle when a sibling slice has
  // value 0 (observed with recharts 3.10 — the non-zero slice renders as
  // roughly a quarter-circle instead of the full ring its 100% share should
  // be), so zero-value entries are dropped before reaching <Pie>. They're
  // harmless to omit from the legend too — a "0" slice carries no signal.
  const nonZeroData = data.filter((datum) => datum.value > 0)

  // ResponsiveContainer measures its box on mount; inside a CSS grid, that
  // first measurement can land before the grid has resolved column widths,
  // so the pie renders off-center in whatever space it grabbed too early.
  // Deferring the mount to an effect (which fires after layout commits)
  // guarantees its first measurement reflects the settled grid layout.
  const [ready, setReady] = useState(false)
  useEffect(() => setReady(true), [])

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
      <h3 className="mb-2 text-sm font-semibold text-neutral-700">{title}</h3>
      {total === 0 ? (
        <div className="flex h-48 items-center justify-center text-center text-sm text-neutral-400">
          {emptyMessage}
        </div>
      ) : (
        <div className="relative h-48">
          {ready && (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={nonZeroData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={52}
                  outerRadius={78}
                  paddingAngle={nonZeroData.length > 1 ? 3 : 0}
                  strokeWidth={0}
                  isAnimationActive={false}
                >
                  {nonZeroData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12, border: '1px solid #e5e5e5' }} />
                <Legend
                  verticalAlign="bottom"
                  height={28}
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: 12 }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
          {centerLabel && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center pb-7">
              <span className="text-xl font-semibold text-neutral-900">{centerLabel}</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
