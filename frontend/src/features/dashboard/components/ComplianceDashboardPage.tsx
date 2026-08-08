import {
  AlertTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  FileTextIcon,
  ShieldIcon,
  UsersIcon,
} from '@/components/icons'

import { useDashboardSummary } from '../hooks/useDashboardSummary'
import type { IDashboardApiClient } from '../types'
import { DonutChart } from './DonutChart'
import { MetricCard } from './MetricCard'
import { OpenOverdueBarChart } from './OpenOverdueBarChart'

interface ComplianceDashboardPageProps {
  organizationId: string
  /** Injectable for tests — see useDashboardSummary. */
  client?: IDashboardApiClient
}

/**
 * Container: owns the useDashboardSummary wiring. Read-only executive
 * rollup across Consent/Rights/Cases — see apps.dashboard.services on
 * the backend for where these numbers actually come from. KPI cards up
 * top, breakdown charts below; every chart degrades to an explicit
 * empty state rather than rendering a misleading blank donut when a
 * pillar has no data yet.
 */
export function ComplianceDashboardPage({ organizationId, client }: ComplianceDashboardPageProps) {
  const { summary, isLoading, loadError } = useDashboardSummary({ organizationId, client })

  return (
    <main className="mx-auto max-w-6xl p-8">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-neutral-900">Compliance Overview</h1>
        <p className="mt-1 text-sm text-neutral-500">
          A live rollup of data subject requests, breach &amp; grievance cases, and consent activity.
        </p>
      </div>

      {isLoading && <p className="text-sm text-neutral-500">Loading…</p>}
      {loadError && <p className="text-sm text-red-600">Failed to load the dashboard summary.</p>}

      {summary && (
        <div className="space-y-8">
          <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <MetricCard
              label="Open DSARs"
              value={summary.dsar.open}
              icon={<UsersIcon width={16} height={16} />}
            />
            <MetricCard
              label="Overdue DSARs"
              value={summary.dsar.overdue}
              tone={summary.dsar.overdue > 0 ? 'danger' : 'default'}
              icon={<AlertTriangleIcon width={16} height={16} />}
            />
            <MetricCard
              label="Open Cases"
              value={summary.cases.open}
              icon={<ShieldIcon width={16} height={16} />}
            />
            <MetricCard
              label="Open Breaches"
              value={summary.cases.breach_open}
              tone={summary.cases.breach_open > 0 ? 'warning' : 'default'}
              icon={<AlertTriangleIcon width={16} height={16} />}
            />
            <MetricCard
              label="DSAR On-Time Rate"
              value={summary.dsar.on_time_rate === null ? '—' : `${summary.dsar.on_time_rate}%`}
              icon={<ClockIcon width={16} height={16} />}
            />
            <MetricCard
              label="Consent Opt-In Rate"
              value={summary.consent.opt_in_rate === null ? '—' : `${summary.consent.opt_in_rate}%`}
              icon={<CheckCircleIcon width={16} height={16} />}
            />
            <MetricCard
              label="Consent Purposes"
              value={summary.consent.total_purposes}
              icon={<FileTextIcon width={16} height={16} />}
            />
            <MetricCard
              label="Consent Records"
              value={summary.consent.total_consent_records}
              icon={<UsersIcon width={16} height={16} />}
            />
          </section>

          <section className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            <DonutChart
              title="DSAR Resolution"
              emptyMessage="No requests resolved yet."
              centerLabel={summary.dsar.on_time_rate === null ? undefined : `${summary.dsar.on_time_rate}%`}
              data={[
                { name: 'On time', value: summary.dsar.resolved_on_time, color: '#10b981' },
                { name: 'Late', value: summary.dsar.resolved_late, color: '#ef4444' },
              ]}
            />
            <DonutChart
              title="Open Case Mix"
              emptyMessage="No open cases."
              data={[
                { name: 'Breach', value: summary.cases.breach_open, color: '#ef4444' },
                { name: 'Grievance', value: summary.cases.grievance_open, color: '#3b82f6' },
              ]}
            />
            <DonutChart
              title="Consent Opt-In"
              emptyMessage="No consent decisions recorded yet."
              centerLabel={
                summary.consent.opt_in_rate === null ? undefined : `${summary.consent.opt_in_rate}%`
              }
              data={
                summary.consent.opt_in_rate === null
                  ? []
                  : [
                      { name: 'Opted in', value: summary.consent.opt_in_rate, color: '#4f46e5' },
                      { name: 'Opted out', value: 100 - summary.consent.opt_in_rate, color: '#e5e5e5' },
                    ]
              }
            />
          </section>

          <section>
            <OpenOverdueBarChart
              data={[
                {
                  name: 'DSARs',
                  onTrack: summary.dsar.open - summary.dsar.overdue,
                  overdue: summary.dsar.overdue,
                },
                {
                  name: 'Cases',
                  onTrack: summary.cases.open - summary.cases.overdue,
                  overdue: summary.cases.overdue,
                },
              ]}
            />
          </section>

          <p className="text-xs text-neutral-400">
            Generated {new Date(summary.generated_at).toLocaleString()}
          </p>
        </div>
      )}
    </main>
  )
}
