import type { AxiosInstance } from 'axios'

import { publicApi } from '@/lib/publicApi'

import type { AuthTokens, IAuthApiClient, LoginInput } from '../types'

/**
 * Uses the same unauthenticated `publicApi` instance as the consent/
 * rights public clients — logging in is, by definition, a request made
 * before any token exists, so it must not go through the interceptor
 * that attaches one.
 */
export class AuthApiClient implements IAuthApiClient {
  private readonly http: AxiosInstance

  constructor(http: AxiosInstance = publicApi) {
    this.http = http
  }

  async login(input: LoginInput): Promise<AuthTokens> {
    const response = await this.http.post<AuthTokens>('/api/token/', input)
    return response.data
  }

  async refresh(refreshToken: string): Promise<AuthTokens> {
    // SIMPLE_JWT has ROTATE_REFRESH_TOKENS on, so the response includes a
    // new refresh token too — fall back to the one we sent only if a
    // server config change ever turns rotation off.
    const response = await this.http.post<{ access: string; refresh?: string }>(
      '/api/token/refresh/',
      { refresh: refreshToken },
    )
    return { access: response.data.access, refresh: response.data.refresh ?? refreshToken }
  }
}
