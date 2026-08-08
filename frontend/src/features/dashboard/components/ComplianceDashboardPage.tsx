import { useDashboardSummary } from '../hooks/useDashboardSummary'
import type { IDashboardApiClient } from '../types'
import { MetricCard } from './MetricCard'

interface ComplianceDashboardPageProps {
  organizationId: string
  /** Injectable for tests — see useDashboardSummary. */
  client?: IDashboardApiClient
}

/**
 * Container: owns the useDashboardSummary wiring. Read-only executive
 * rollup across Consent/Rights/Cases — see apps.dashboard.services on
 * the backend for where these numbers actually come from.
 */
export function ComplianceDashboardPage({ organizationId, client }: ComplianceDashboardPageProps) {
  const { summary, isLoading, loadError } = useDashboardSummary({ organizationId, client })

  return (
    <main className="mx-auto max-w-5xl p-8">
      <h1 className="mb-6 text-xl font-semibold">Compliance Dashboard</h1>

      {isLoading && <p className="text-sm text-neutral-500">Loading…</p>}
      {loadError && <p className="text-sm text-red-600">Failed to load the dashboard summary.</p>}

      {summary && (
        <div className="space-y-8">
          <section>
            <h2 className="mb-3 text-sm font-semibold text-neutral-700">Data Subject Requests</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <MetricCard label="Total" value={summary.dsar.total} />
              <MetricCard label="Open" value={summary.dsar.open} />
              <MetricCard
                label="Overdue"
                value={summary.dsar.overdue}
                tone={summary.dsar.overdue > 0 ? 'danger' : 'default'}
              />
              <MetricCard
                label="On-time rate"
                value={summary.dsar.on_time_rate === null ? '—' : `${summary.dsar.on_time_rate}%`}
              />
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-sm font-semibold text-neutral-700">Breach &amp; Grievance Cases</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <MetricCard label="Total" value={summary.cases.total} />
              <MetricCard label="Open" value={summary.cases.open} />
              <MetricCard
                label="Overdue"
                value={summary.cases.overdue}
                tone={summary.cases.overdue > 0 ? 'danger' : 'default'}
              />
              <MetricCard
                label="Open breaches"
                value={summary.cases.breach_open}
                tone={summary.cases.breach_open > 0 ? 'warning' : 'default'}
              />
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-sm font-semibold text-neutral-700">Consent</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <MetricCard label="Purposes" value={summary.consent.total_purposes} />
              <MetricCard label="Consent records" value={summary.consent.total_consent_records} />
              <MetricCard
                label="Opt-in rate"
                value={summary.consent.opt_in_rate === null ? '—' : `${summary.consent.opt_in_rate}%`}
              />
            </div>
          </section>

          <p className="text-xs text-neutral-400">
            Generated {new Date(summary.generated_at).toLocaleString()}
          </p>
        </div>
      )}
    </main>
  )
}
