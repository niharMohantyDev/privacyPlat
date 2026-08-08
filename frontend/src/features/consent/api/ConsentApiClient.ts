import type { AxiosInstance } from 'axios'

import { publicApi } from '@/lib/publicApi'

import type { ConsentPurpose, ConsentReceipt, IConsentApiClient, RecordConsentInput } from '../types'

/**
 * Adapter over the public Consent API — mirrors the backend's own
 * "one place that translates between the wire format and our types"
 * convention (apps.consent.repositories on the backend). Takes the
 * HTTP client via constructor injection so tests can substitute a fake
 * instead of mocking a module-level singleton.
 */
export class ConsentApiClient implements IConsentApiClient {
  private readonly publicKey: string
  private readonly http: AxiosInstance

  constructor(publicKey: string, http: AxiosInstance = publicApi) {
    this.publicKey = publicKey
    this.http = http
  }

  async listPurposes(): Promise<ConsentPurpose[]> {
    const response = await this.http.get<ConsentPurpose[]>('/api/consent/public/purposes/', {
      params: { public_key: this.publicKey },
    })
    return response.data
  }

  async recordConsent(input: RecordConsentInput): Promise<ConsentReceipt> {
    const response = await this.http.post<ConsentReceipt>('/api/consent/public/records/', {
      public_key: this.publicKey,
      ...input,
    })
    return response.data
  }
}
