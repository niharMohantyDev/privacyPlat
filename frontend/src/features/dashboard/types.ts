export interface DSARMetrics {
  total: number
  open: number
  overdue: number
  resolved_on_time: number
  resolved_late: number
  on_time_rate: number | null
}

export interface CaseMetrics {
  total: number
  open: number
  overdue: number
  breach_open: number
  grievance_open: number
}

export interface ConsentMetrics {
  total_purposes: number
  total_consent_records: number
  opt_in_rate: number | null
}

export interface ComplianceDashboardSummary {
  dsar: DSARMetrics
  cases: CaseMetrics
  consent: ConsentMetrics
  generated_at: string
}

/** What useDashboardSummary/ComplianceDashboardPage depend on —
 * DashboardApiClient implements this, tests can substitute a plain object. */
export interface IDashboardApiClient {
  getSummary(organizationId: string): Promise<ComplianceDashboardSummary>
}
