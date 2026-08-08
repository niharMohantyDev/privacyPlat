export const REQUEST_TYPES = [
  { value: 'access', label: 'Access my data' },
  { value: 'correction', label: 'Correct my data' },
  { value: 'deletion', label: 'Delete my data' },
  { value: 'portability', label: 'Export my data (portability)' },
  { value: 'restriction', label: 'Restrict processing / opt out' },
  { value: 'consent_withdrawal', label: 'Withdraw consent' },
  { value: 'processing_info', label: 'Information about processing' },
] as const

export type RequestType = (typeof REQUEST_TYPES)[number]['value']

export interface SubmitDSARInput {
  subject_key: string
  request_type: RequestType
  region: string
}

export interface DSARRequest {
  id: string
  subject_key: string
  request_type: string
  status: string
  region: string
  submitted_at: string
  due_at: string | null
  resolved_at: string | null
  notes: string
}

/** What useDSARSubmission/DSARPortal depend on — RightsApiClient
 * implements this, tests can substitute a plain object. */
export interface IRightsApiClient {
  submitRequest(input: SubmitDSARInput): Promise<DSARRequest>
}
