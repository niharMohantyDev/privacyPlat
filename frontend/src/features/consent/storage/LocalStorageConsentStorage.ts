import type { ConsentReceipt } from '../types'
import type { ConsentStorageStrategy } from './ConsentStorageStrategy'

const SUBJECT_KEY_STORAGE_KEY = 'privacyplat.subject_key'
const RECEIPT_STORAGE_KEY = 'privacyplat.consent_receipt'

export class LocalStorageConsentStorage implements ConsentStorageStrategy {
  getSubjectKey(): string {
    let key = localStorage.getItem(SUBJECT_KEY_STORAGE_KEY)
    if (!key) {
      key = crypto.randomUUID()
      localStorage.setItem(SUBJECT_KEY_STORAGE_KEY, key)
    }
    return key
  }

  getStoredReceipt(): ConsentReceipt | null {
    const raw = localStorage.getItem(RECEIPT_STORAGE_KEY)
    if (!raw) return null
    try {
      return JSON.parse(raw) as ConsentReceipt
    } catch {
      return null
    }
  }

  saveReceipt(receipt: ConsentReceipt): void {
    localStorage.setItem(RECEIPT_STORAGE_KEY, JSON.stringify(receipt))
  }

  clear(): void {
    localStorage.removeItem(RECEIPT_STORAGE_KEY)
  }
}
