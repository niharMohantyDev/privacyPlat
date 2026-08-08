import type { AxiosInstance } from 'axios'

import { api } from '@/lib/api'

import type { ComplianceDashboardSummary, IDashboardApiClient } from '../types'

/**
 * Adapter over the compliance dashboard summary API — read-only, so
 * unlike CasesAdminApiClient/RightsAdminApiClient there's nothing to
 * mutate here. Same HTTP-client-injected-via-constructor convention as
 * every other admin API client.
 */
export class DashboardApiClient implements IDashboardApiClient {
  private readonly http: AxiosInstance

  constructor(http: AxiosInstance = api) {
    this.http = http
  }

  async getSummary(organizationId: string): Promise<ComplianceDashboardSummary> {
    const response = await this.http.get<ComplianceDashboardSummary>('/api/dashboard/summary/', {
      params: { organization_id: organizationId },
    })
    return response.data
  }
}
