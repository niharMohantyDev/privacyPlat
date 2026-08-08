export interface ConsentPurpose {
  code: string
  name: string
  description: string
  is_essential: boolean
}

export interface ConsentDecision {
  purpose_code: string
  granted: boolean
}

export interface ConsentReceipt {
  record_id: string
  subject_key: string
  region: string
  framework: string
  version: number
  decisions: ConsentDecision[]
  issued_at: string
  signature: string
}

export interface RecordConsentInput {
  subject_key: string
  region: string
  decisions: Record<string, boolean>
}

/** What useConsent/ConsentManager depend on — ConsentApiClient implements
 * this, and tests can substitute a plain object instead of a real instance. */
export interface IConsentApiClient {
  listPurposes(): Promise<ConsentPurpose[]>
  recordConsent(input: RecordConsentInput): Promise<ConsentReceipt>
}

// --- Staff/admin surface (authenticated) — distinct from the public,
// minimal ConsentPurpose above (which mirrors PublicPurposeListView's
// deliberately narrow response shape). ---

export interface AdminPurpose {
  id: string
  organization: string
  code: string
  name: string
  description: string
  is_essential: boolean
  created_at: string
}

export interface CreatePurposeInput {
  organization: string
  code: string
  name: string
  description: string
  is_essential: boolean
}

export type UpdatePurposeInput = Partial<Omit<CreatePurposeInput, 'organization'>>

export interface ConsentLogRecord {
  id: string
  subject_key: string
  region: string
  framework: string
  version: number
  decisions: ConsentDecision[]
  created_at: string
}

/** What usePurposes/useConsentLog depend on — ConsentAdminApiClient implements this. */
export interface IConsentAdminApiClient {
  listPurposes(organizationId: string): Promise<AdminPurpose[]>
  createPurpose(input: CreatePurposeInput): Promise<AdminPurpose>
  updatePurpose(id: string, input: UpdatePurposeInput): Promise<AdminPurpose>
  deletePurpose(id: string): Promise<void>
  listRecords(organizationId: string): Promise<ConsentLogRecord[]>
}
