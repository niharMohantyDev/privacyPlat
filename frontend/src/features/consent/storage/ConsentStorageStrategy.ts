import type { ConsentReceipt } from '../types'

/**
 * Strategy interface for persisting the anonymous subject key and the
 * last consent receipt. LocalStorageConsentStorage is the only
 * implementation today; a cookie-backed one (for cross-subdomain
 * consent, per the roadmap's "consent orchestration" phase) can be
 * added later without touching useConsent or the components.
 */
export interface ConsentStorageStrategy {
  getSubjectKey(): string
  getStoredReceipt(): ConsentReceipt | null
  saveReceipt(receipt: ConsentReceipt): void
  clear(): void
}
