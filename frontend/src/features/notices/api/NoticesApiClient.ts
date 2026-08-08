import type { AxiosInstance } from 'axios'

import { publicApi } from '@/lib/publicApi'

import type { INoticesApiClient, NoticeType, PublicNotice } from '../types'

/**
 * Adapter over the public notice-fetch API — same shape as
 * apps/rights's RightsApiClient (see that file for the full
 * rationale): one place that knows the wire format, HTTP client
 * injected via constructor so tests can substitute a fake.
 */
export class NoticesApiClient implements INoticesApiClient {
  private readonly publicKey: string
  private readonly http: AxiosInstance

  constructor(publicKey: string, http: AxiosInstance = publicApi) {
    this.publicKey = publicKey
    this.http = http
  }

  async getPublishedNotice(noticeType: NoticeType): Promise<PublicNotice> {
    const response = await this.http.get<PublicNotice>(`/api/public/notices/${noticeType}/`, {
      params: { public_key: this.publicKey },
    })
    return response.data
  }
}
