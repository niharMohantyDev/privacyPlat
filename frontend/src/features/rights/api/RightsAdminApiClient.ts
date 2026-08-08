import type { AxiosInstance } from 'axios'

import { api } from '@/lib/api'

import type { DSARRequest, IRightsAdminApiClient, TransitionDSARInput } from '../types'

/**
 * Authenticated counterpart to RightsApiClient — staff triage instead
 * of anonymous public submission, so it goes through `api` (attaches
 * the platform JWT) rather than `publicApi`. Mirrors the backend's own
 * views.py/public_views.py split in apps.rights.
 */
export class RightsAdminApiClient implements IRightsAdminApiClient {
  private readonly http: AxiosInstance

  constructor(http: AxiosInstance = api) {
    this.http = http
  }

  async listRequests(organizationId: string): Promise<DSARRequest[]> {
    const response = await this.http.get<DSARRequest[]>('/api/rights/requests/', {
      params: { organization_id: organizationId },
    })
    return response.data
  }

  async transitionRequest(
    organizationId: string,
    { requestId, targetStatus, note }: TransitionDSARInput,
  ): Promise<DSARRequest> {
    const response = await this.http.post<DSARRequest>(
      `/api/rights/requests/${requestId}/transition/`,
      { target_status: targetStatus, note },
      { params: { organization_id: organizationId } },
    )
    return response.data
  }
}
