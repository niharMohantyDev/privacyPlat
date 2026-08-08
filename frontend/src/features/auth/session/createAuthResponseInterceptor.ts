import type { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios'

import type { AuthSessionManager } from './AuthSessionManager'

interface RetryableConfig extends InternalAxiosRequestConfig {
  _retry?: boolean
}

/**
 * Response-interceptor error handler for `api` (lib/api.ts) — factored
 * out as a plain function of (sessionManager, http) so it can be unit
 * tested without a real axios instance or network call. On a first-time
 * 401, refresh the session and retry the original request once; on any
 * other status, or a second 401 after already retrying, pass the error
 * through untouched.
 */
export function createAuthResponseInterceptor(sessionManager: AuthSessionManager, http: AxiosInstance) {
  return async (error: AxiosError) => {
    const originalRequest = error.config as RetryableConfig | undefined

    if (error.response?.status !== 401 || !originalRequest || originalRequest._retry) {
      return Promise.reject(error)
    }
    originalRequest._retry = true

    try {
      const accessToken = await sessionManager.refreshAccessToken()
      originalRequest.headers.Authorization = `Bearer ${accessToken}`
      return http(originalRequest)
    } catch {
      sessionManager.expire()
      return Promise.reject(error)
    }
  }
}
