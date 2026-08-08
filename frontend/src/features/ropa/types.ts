export const LEGAL_BASES = [
  { value: 'consent', label: 'Consent' },
  { value: 'contract', label: 'Contract' },
  { value: 'legal_obligation', label: 'Legal Obligation' },
  { value: 'vital_interests', label: 'Vital Interests' },
  { value: 'public_task', label: 'Public Task' },
  { value: 'legitimate_interests', label: 'Legitimate Interests' },
] as const

export type LegalBasis = (typeof LEGAL_BASES)[number]['value']

export const RISK_LEVELS = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
] as const

export type RiskLevel = (typeof RISK_LEVELS)[number]['value']

export interface ProcessingActivity {
  id: string
  title: string
  description: string
  legal_basis: string
  risk_level: string
  status: string
  data_categories: string
  data_subject_categories: string
  recipients: string
  retention_period: string
  security_measures: string
  owner: string
  third_country_transfer: boolean
  transfer_safeguards: string
  purpose_id: string | null
  workspace_id: string | null
  review_due_at: string | null
  reviewed_at: string | null
}

export interface CreateActivityInput {
  title: string
  legalBasis: LegalBasis
  riskLevel?: RiskLevel
  owner?: string
}

// 'draft' excluded — it's the initial state, never a transition target
// (see apps.ropa.domain.states on the backend, the actual source of
// truth; this list is UX-only, invalid picks surface the backend's
// 400 as a friendly message rather than being pre-filtered here).
export const STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'draft', label: 'Draft (revise)' },
  { value: 'archived', label: 'Archived' },
] as const

export interface TransitionActivityInput {
  activityId: string
  targetStatus: string
}

/** What useRopaRegister/RopaRegisterPage depend on — RopaApiClient implements this. */
export interface IRopaApiClient {
  listActivities(organizationId: string, status?: string): Promise<ProcessingActivity[]>
  createActivity(organizationId: string, input: CreateActivityInput): Promise<ProcessingActivity>
  transitionActivity(organizationId: string, input: TransitionActivityInput): Promise<ProcessingActivity>
  markReviewed(organizationId: string, activityId: string): Promise<ProcessingActivity>
}
