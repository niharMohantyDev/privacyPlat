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
