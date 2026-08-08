import type { ConsentLogRecord } from '../types'

interface ConsentLogTableProps {
  records: ConsentLogRecord[]
}

/** Presentational only — see apps/consent's ConsentBanner for the same convention. */
export function ConsentLogTable({ records }: ConsentLogTableProps) {
  if (records.length === 0) {
    return <p className="text-sm text-neutral-500">No consent records yet.</p>
  }

  return (
    <table className="w-full text-left text-sm">
      <thead>
        <tr className="border-b border-neutral-200 text-xs uppercase text-neutral-500">
          <th className="py-2 pr-4">Subject</th>
          <th className="py-2 pr-4">Framework</th>
          <th className="py-2 pr-4">Version</th>
          <th className="py-2 pr-4">Decisions</th>
          <th className="py-2">Recorded</th>
        </tr>
      </thead>
      <tbody>
        {records.map((record) => (
          <tr key={record.id} className="border-b border-neutral-100">
            <td className="py-2 pr-4">{record.subject_key}</td>
            <td className="py-2 pr-4">{record.framework}</td>
            <td className="py-2 pr-4">v{record.version}</td>
            <td className="py-2 pr-4">
              <div className="flex flex-wrap gap-1">
                {record.decisions.map((d) => (
                  <span
                    key={d.purpose_code}
                    className={
                      d.granted
                        ? 'rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-800'
                        : 'rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-600'
                    }
                  >
                    {d.purpose_code}
                  </span>
                ))}
              </div>
            </td>
            <td className="py-2">{new Date(record.created_at).toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
