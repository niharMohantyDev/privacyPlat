import type { AxiosInstance } from 'axios'

import { api } from '@/lib/api'

import type {
  AdminPurpose,
  ConsentLogRecord,
  CreatePurposeInput,
  IConsentAdminApiClient,
  UpdatePurposeInput,
} from '../types'

interface PaginatedResponse<T> {
  count: number
  results: T[]
}

/**
 * Authenticated staff surface for Purpose CRUD and the consent log —
 * distinct from the public, anonymous ConsentApiClient. Purpose CRUD
 * goes through PurposeViewSet (a DRF ModelViewSet, so list responses
 * are paginated — unlike the plain-array endpoints elsewhere in this
 * codebase); this client is the one place that unwraps that.
 */
export class ConsentAdminApiClient implements IConsentAdminApiClient {
  private readonly http: AxiosInstance

  constructor(http: AxiosInstance = api) {
    this.http = http
  }

  async listPurposes(organizationId: string): Promise<AdminPurpose[]> {
    const response = await this.http.get<PaginatedResponse<AdminPurpose>>(
      '/api/consent/purposes/',
    )
    return response.data.results.filter((p) => p.organization === organizationId)
  }

  async createPurpose(input: CreatePurposeInput): Promise<AdminPurpose> {
    const response = await this.http.post<AdminPurpose>('/api/consent/purposes/', input)
    return response.data
  }

  async updatePurpose(id: string, input: UpdatePurposeInput): Promise<AdminPurpose> {
    const response = await this.http.patch<AdminPurpose>(`/api/consent/purposes/${id}/`, input)
    return response.data
  }

  async deletePurpose(id: string): Promise<void> {
    await this.http.delete(`/api/consent/purposes/${id}/`)
  }

  async listRecords(organizationId: string): Promise<ConsentLogRecord[]> {
    const response = await this.http.get<ConsentLogRecord[]>('/api/consent/records/log/', {
      params: { organization_id: organizationId },
    })
    return response.data
  }
}
