import { beforeEach, describe, expect, it } from 'vitest'

import { LocalStorageConsentStorage } from '../storage/LocalStorageConsentStorage'
import type { ConsentReceipt } from '../types'

const RECEIPT: ConsentReceipt = {
  record_id: 'r1',
  subject_key: 's1',
  region: 'DE',
  framework: 'GDPR',
  version: 1,
  decisions: [{ purpose_code: 'analytics', granted: true }],
  issued_at: '2026-01-01T00:00:00Z',
  signature: 'abc123',
}

describe('LocalStorageConsentStorage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('generates and persists a subject key on first access', () => {
    const storage = new LocalStorageConsentStorage()
    const first = storage.getSubjectKey()
    const second = storage.getSubjectKey()
    expect(first).toBe(second)
    expect(first).toHaveLength(36) // uuid
  })

  it('returns null when no receipt is stored', () => {
    const storage = new LocalStorageConsentStorage()
    expect(storage.getStoredReceipt()).toBeNull()
  })

  it('round-trips a saved receipt', () => {
    const storage = new LocalStorageConsentStorage()
    storage.saveReceipt(RECEIPT)
    expect(storage.getStoredReceipt()).toEqual(RECEIPT)
  })

  it('clear() removes the receipt but keeps the subject key', () => {
    const storage = new LocalStorageConsentStorage()
    const subjectKey = storage.getSubjectKey()
    storage.saveReceipt(RECEIPT)
    storage.clear()
    expect(storage.getStoredReceipt()).toBeNull()
    expect(storage.getSubjectKey()).toBe(subjectKey)
  })
})
