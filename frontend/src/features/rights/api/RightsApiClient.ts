import type { AxiosInstance } from 'axios'

import { publicApi } from '@/lib/publicApi'

import type { DSARRequest, IRightsApiClient, SubmitDSARInput } from '../types'

/**
 * Adapter over the public DSAR submission API — same shape as
 * apps/consent's ConsentApiClient (see that file for the full
 * rationale): one place that knows the wire format, HTTP client
 * injected via constructor so tests can substitute a fake.
 */
export class RightsApiClient implements IRightsApiClient {
  private readonly publicKey: string
  private readonly http: AxiosInstance

  constructor(publicKey: string, http: AxiosInstance = publicApi) {
    this.publicKey = publicKey
    this.http = http
  }

  async submitRequest(input: SubmitDSARInput): Promise<DSARRequest> {
    const response = await this.http.post<DSARRequest>('/api/rights/public/requests/', {
      public_key: this.publicKey,
      ...input,
    })
    return response.data
  }
}
