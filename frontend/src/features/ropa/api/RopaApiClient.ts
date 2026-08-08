import type { AxiosInstance } from 'axios'

import { api } from '@/lib/api'

import type {
  CreateActivityInput,
  IRopaApiClient,
  ProcessingActivity,
  TransitionActivityInput,
} from '../types'

/**
 * Authenticated-only client — unlike Rights/Cases, RoPA has no public
 * submission path at all (it's internal compliance documentation, not
 * something a data subject files), so there's no separate public
 * client/composition split here.
 */
export class RopaApiClient implements IRopaApiClient {
  private readonly http: AxiosInstance

  constructor(http: AxiosInstance = api) {
    this.http = http
  }

  async listActivities(organizationId: string, status?: string): Promise<ProcessingActivity[]> {
    const response = await this.http.get<ProcessingActivity[]>('/api/ropa/activities/', {
      params: { organization_id: organizationId, status },
    })
    return response.data
  }

  async createActivity(
    organizationId: string,
    { title, legalBasis, riskLevel, owner }: CreateActivityInput,
  ): Promise<ProcessingActivity> {
    const response = await this.http.post<ProcessingActivity>(
      '/api/ropa/activities/create/',
      { title, legal_basis: legalBasis, risk_level: riskLevel, owner },
      { params: { organization_id: organizationId } },
    )
    return response.data
  }

  async transitionActivity(
    organizationId: string,
    { activityId, targetStatus }: TransitionActivityInput,
  ): Promise<ProcessingActivity> {
    const response = await this.http.post<ProcessingActivity>(
      `/api/ropa/activities/${activityId}/transition/`,
      { target_status: targetStatus },
      { params: { organization_id: organizationId } },
    )
    return response.data
  }

  async markReviewed(organizationId: string, activityId: string): Promise<ProcessingActivity> {
    const response = await this.http.post<ProcessingActivity>(
      `/api/ropa/activities/${activityId}/mark-reviewed/`,
      {},
      { params: { organization_id: organizationId } },
    )
    return response.data
  }
}
