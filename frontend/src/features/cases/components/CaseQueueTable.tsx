import { Fragment, useState } from 'react'

import { STATUS_OPTIONS, type Case, type ICasesAdminApiClient } from '../types'
import { BreachNotificationPanel } from './BreachNotificationPanel'

interface CaseQueueTableProps {
  cases: Case[]
  organizationId: string
  onTransition: (caseId: string, targetStatus: string) => void
  isTransitioning: boolean
  /** Injectable for tests — forwarded to BreachNotificationPanel. */
  client?: ICasesAdminApiClient
}

/** Presentational (with local expand/collapse state) — see apps/rights's DSARQueueTable for the base convention. */
export function CaseQueueTable({ cases, organizationId, onTransition, isTransitioning, client }: CaseQueueTableProps) {
  const [expandedCaseIds, setExpandedCaseIds] = useState<Set<string>>(new Set())

  if (cases.length === 0) {
    return <p className="text-sm text-neutral-500">No cases yet.</p>
  }

  const toggleExpanded = (caseId: string) => {
    setExpandedCaseIds((prev) => {
      const next = new Set(prev)
      if (next.has(caseId)) {
        next.delete(caseId)
      } else {
        next.add(caseId)
      }
      return next
    })
  }

  return (
    <table className="w-full text-left text-sm">
      <thead>
        <tr className="border-b border-neutral-200 text-xs uppercase text-neutral-500">
          <th className="py-2 pr-4">Title</th>
          <th className="py-2 pr-4">Type</th>
          <th className="py-2 pr-4">Severity</th>
          <th className="py-2 pr-4">Status</th>
          <th className="py-2 pr-4">Due</th>
          <th className="py-2">Action</th>
        </tr>
      </thead>
      <tbody>
        {cases.map((caseRecord) => {
          const isBreach = caseRecord.case_type === 'breach'
          const isExpanded = expandedCaseIds.has(caseRecord.id)
          return (
            <Fragment key={caseRecord.id}>
              <tr className="border-b border-neutral-100">
                <td className="py-2 pr-4">
                  {isBreach && (
                    <button
                      type="button"
                      onClick={() => toggleExpanded(caseRecord.id)}
                      aria-label={`Toggle notifications for ${caseRecord.title}`}
                      className="mr-1 text-neutral-400 hover:text-neutral-700"
                    >
                      {isExpanded ? '▾' : '▸'}
                    </button>
                  )}
                  {caseRecord.title}
                </td>
                <td className="py-2 pr-4">
                  <span
                    className={
                      caseRecord.case_type === 'breach'
                        ? 'rounded-full bg-red-100 px-2 py-0.5 text-xs text-red-800'
                        : 'rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-800'
                    }
                  >
                    {caseRecord.case_type}
                  </span>
                </td>
                <td className="py-2 pr-4">{caseRecord.severity || '—'}</td>
                <td className="py-2 pr-4">
                  <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs">
                    {caseRecord.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="py-2 pr-4">
                  {caseRecord.due_at ? new Date(caseRecord.due_at).toLocaleDateString() : '—'}
                </td>
                <td className="py-2">
                  <select
                    aria-label={`Change status for ${caseRecord.title}`}
                    disabled={isTransitioning}
                    defaultValue=""
                    onChange={(e) => {
                      if (e.target.value) onTransition(caseRecord.id, e.target.value)
                      e.target.value = ''
                    }}
                    className="rounded-md border border-neutral-300 px-2 py-1 text-xs"
                  >
                    <option value="" disabled>
                      Change status…
                    </option>
                    {STATUS_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
              {isBreach && isExpanded && (
                <tr className="border-b border-neutral-100">
                  <td colSpan={6} className="py-2">
                    <BreachNotificationPanel
                      organizationId={organizationId}
                      caseId={caseRecord.id}
                      client={client}
                    />
                  </td>
                </tr>
              )}
            </Fragment>
          )
        })}
      </tbody>
    </table>
  )
}
