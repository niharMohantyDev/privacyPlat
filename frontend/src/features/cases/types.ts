export const CASE_TYPES = [
  { value: 'breach', label: 'Breach / Incident' },
  { value: 'grievance', label: 'Grievance' },
] as const

export type CaseType = (typeof CASE_TYPES)[number]['value']

export const SEVERITIES = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'critical', label: 'Critical' },
] as const

export type Severity = (typeof SEVERITIES)[number]['value']

export interface SubmitGrievanceInput {
  title: string
  description?: string
  reportedBy: string
  region: string
}

export interface Case {
  id: string
  case_type: string
  status: string
  title: string
  description: string
  reported_by: string
  region: string
  severity: string
  reported_at: string
  due_at: string | null
  resolved_at: string | null
  notes: string
}

/** What useGrievanceSubmission/GrievancePortal depend on — CasesApiClient
 * implements this, tests can substitute a plain object. */
export interface ICasesApiClient {
  submitGrievance(input: SubmitGrievanceInput): Promise<Case>
}

// 'reported' excluded — it's the initial state, never a transition
// target (see apps.cases.domain.states on the backend, which is the
// actual source of truth; this list is UX-only, see CasesAdminApiClient).
export const STATUS_OPTIONS = [
  { value: 'investigating', label: 'Investigating' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'closed', label: 'Closed' },
  { value: 'dismissed', label: 'Dismissed' },
] as const

export interface TransitionCaseInput {
  caseId: string
  targetStatus: string
  note?: string
}

export interface ReportCaseInput {
  caseType: CaseType
  title: string
  description?: string
  reportedBy?: string
  region?: string
  severity?: Severity
}

export const RECIPIENT_TYPES = [
  { value: 'regulator', label: 'Regulator' },
  { value: 'data_subject', label: 'Data Subject(s)' },
  { value: 'vendor', label: 'Vendor' },
] as const

export type RecipientType = (typeof RECIPIENT_TYPES)[number]['value']

export interface BreachNotificationObligation {
  id: string
  case_id: string
  recipient_type: string
  recipient_identifier: string
  status: string
  due_at: string | null
  notified_at: string | null
  notes: string
}

export interface CreateObligationInput {
  recipientType: RecipientType
  recipientIdentifier?: string
}

/** What useCaseQueue/CaseQueuePage depend on — CasesAdminApiClient implements this. */
export interface ICasesAdminApiClient {
  listCases(organizationId: string, caseType?: CaseType): Promise<Case[]>
  reportCase(organizationId: string, input: ReportCaseInput): Promise<Case>
  transitionCase(organizationId: string, input: TransitionCaseInput): Promise<Case>
  listObligations(organizationId: string, caseId: string): Promise<BreachNotificationObligation[]>
  createObligation(
    organizationId: string,
    caseId: string,
    input: CreateObligationInput,
  ): Promise<BreachNotificationObligation>
  markObligationNotified(
    organizationId: string,
    obligationId: string,
    notes?: string,
  ): Promise<BreachNotificationObligation>
  markObligationNotRequired(
    organizationId: string,
    obligationId: string,
    notes?: string,
  ): Promise<BreachNotificationObligation>
}
