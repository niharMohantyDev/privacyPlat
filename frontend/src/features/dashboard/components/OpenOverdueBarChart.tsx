import { useEffect, useState } from 'react'

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

export interface OpenOverdueDatum {
  name: string
  onTrack: number
  overdue: number
}

interface OpenOverdueBarChartProps {
  data: OpenOverdueDatum[]
}

/** Presentational only — compares on-track vs overdue open items across pillars. */
export function OpenOverdueBarChart({ data }: OpenOverdueBarChartProps) {
  // See DonutChart for why ResponsiveContainer's mount is deferred like this.
  const [ready, setReady] = useState(false)
  useEffect(() => setReady(true), [])

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
      <h3 className="mb-4 text-sm font-semibold text-neutral-700">Open Items: On Track vs Overdue</h3>
      <div className="h-56">
        {ready && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} barSize={40}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                width={28}
              />
              <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12, border: '1px solid #e5e5e5' }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar
                dataKey="onTrack"
                name="On track"
                stackId="a"
                fill="#4f46e5"
                radius={[0, 0, 4, 4]}
                isAnimationActive={false}
              />
              <Bar
                dataKey="overdue"
                name="Overdue"
                stackId="a"
                fill="#ef4444"
                radius={[4, 4, 0, 0]}
                isAnimationActive={false}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}
