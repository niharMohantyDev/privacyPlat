import type { AxiosInstance } from 'axios'

import { api } from '@/lib/api'

import type { CreateDraftInput, INoticesAdminApiClient, NoticeType, PrivacyNotice } from '../types'

/**
 * Authenticated-only client — no public submission path exists here
 * (that's the separate NoticesApiClient, keyed by asset public_key,
 * for the read-only public fetch). Mirrors the split already used by
 * apps.cases/apps.ropa between staff and public API clients.
 */
export class NoticesAdminApiClient implements INoticesAdminApiClient {
  private readonly http: AxiosInstance

  constructor(http: AxiosInstance = api) {
    this.http = http
  }

  async listNotices(organizationId: string, noticeType?: NoticeType): Promise<PrivacyNotice[]> {
    const response = await this.http.get<PrivacyNotice[]>('/api/notices/', {
      params: { organization_id: organizationId, notice_type: noticeType },
    })
    return response.data
  }

  async createDraft(
    organizationId: string,
    { noticeType, title, body, changeSummary }: CreateDraftInput,
  ): Promise<PrivacyNotice> {
    const response = await this.http.post<PrivacyNotice>(
      '/api/notices/create/',
      { notice_type: noticeType, title, body, change_summary: changeSummary },
      { params: { organization_id: organizationId } },
    )
    return response.data
  }

  async publish(organizationId: string, noticeId: string): Promise<PrivacyNotice> {
    const response = await this.http.post<PrivacyNotice>(
      `/api/notices/${noticeId}/publish/`,
      {},
      { params: { organization_id: organizationId } },
    )
    return response.data
  }

  async archive(organizationId: string, noticeId: string): Promise<PrivacyNotice> {
    const response = await this.http.post<PrivacyNotice>(
      `/api/notices/${noticeId}/archive/`,
      {},
      { params: { organization_id: organizationId } },
    )
    return response.data
  }
}
