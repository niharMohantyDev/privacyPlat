import type { AxiosInstance } from 'axios'

import { api } from '@/lib/api'

import type { Case, CaseType, ICasesAdminApiClient, ReportCaseInput, TransitionCaseInput } from '../types'

/**
 * Authenticated counterpart to CasesApiClient — staff triage instead
 * of anonymous public submission, so it goes through `api` (attaches
 * the platform JWT) rather than `publicApi`. Mirrors the backend's own
 * views.py/public_views.py split in apps.cases. Unlike RightsAdminApiClient,
 * this also exposes reportCase — staff can log a breach directly (there's
 * no public path for that) or log a grievance on a complainant's behalf.
 */
export class CasesAdminApiClient implements ICasesAdminApiClient {
  private readonly http: AxiosInstance

  constructor(http: AxiosInstance = api) {
    this.http = http
  }

  async listCases(organizationId: string, caseType?: CaseType): Promise<Case[]> {
    const response = await this.http.get<Case[]>('/api/cases/', {
      params: { organization_id: organizationId, case_type: caseType },
    })
    return response.data
  }

  async reportCase(
    organizationId: string,
    { caseType, title, description, reportedBy, region, severity }: ReportCaseInput,
  ): Promise<Case> {
    const response = await this.http.post<Case>(
      '/api/cases/report/',
      {
        case_type: caseType,
        title,
        description,
        reported_by: reportedBy,
        region,
        severity,
      },
      { params: { organization_id: organizationId } },
    )
    return response.data
  }

  async transitionCase(
    organizationId: string,
    { caseId, targetStatus, note }: TransitionCaseInput,
  ): Promise<Case> {
    const response = await this.http.post<Case>(
      `/api/cases/${caseId}/transition/`,
      { target_status: targetStatus, note },
      { params: { organization_id: organizationId } },
    )
    return response.data
  }
}
