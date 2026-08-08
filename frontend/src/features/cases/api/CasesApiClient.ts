import type { AxiosInstance } from 'axios'

import { publicApi } from '@/lib/publicApi'

import type { Case, ICasesApiClient, SubmitGrievanceInput } from '../types'

/**
 * Adapter over the public grievance submission API — same shape as
 * apps/rights's RightsApiClient (see that file for the full rationale):
 * one place that knows the wire format, HTTP client injected via
 * constructor so tests can substitute a fake. No breach path exists
 * here — a breach is always staff-reported, see CasesAdminApiClient.
 */
export class CasesApiClient implements ICasesApiClient {
  private readonly publicKey: string
  private readonly http: AxiosInstance

  constructor(publicKey: string, http: AxiosInstance = publicApi) {
    this.publicKey = publicKey
    this.http = http
  }

  async submitGrievance(input: SubmitGrievanceInput): Promise<Case> {
    const response = await this.http.post<Case>('/api/public/grievances/', {
      public_key: this.publicKey,
      title: input.title,
      description: input.description,
      reported_by: input.reportedBy,
      region: input.region,
    })
    return response.data
  }
}
