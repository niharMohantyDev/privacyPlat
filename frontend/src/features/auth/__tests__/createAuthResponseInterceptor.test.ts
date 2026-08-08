import type { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios'
import { describe, expect, it, vi } from 'vitest'

import { createAuthResponseInterceptor } from '../session/createAuthResponseInterceptor'

function fakeError(status: number | undefined, config: Partial<InternalAxiosRequestConfig> = {}): AxiosError {
  return {
    response: status === undefined ? undefined : ({ status } as AxiosError['response']),
    config: { headers: {}, ...config } as InternalAxiosRequestConfig,
    isAxiosError: true,
    toJSON: () => ({}),
    name: 'AxiosError',
    message: 'Request failed',
  } as AxiosError
}

describe('createAuthResponseInterceptor', () => {
  it('passes through errors that are not 401', async () => {
    const sessionManager = { refreshAccessToken: vi.fn(), expire: vi.fn() }
    const http = vi.fn() as unknown as AxiosInstance
    const handler = createAuthResponseInterceptor(sessionManager as never, http)

    const error = fakeError(500)
    await expect(handler(error)).rejects.toBe(error)
    expect(sessionManager.refreshAccessToken).not.toHaveBeenCalled()
  })

  it('refreshes and retries the original request on a first-time 401', async () => {
    const sessionManager = { refreshAccessToken: vi.fn().mockResolvedValue('new-token'), expire: vi.fn() }
    const http = vi.fn().mockResolvedValue({ data: 'ok' }) as unknown as AxiosInstance
    const handler = createAuthResponseInterceptor(sessionManager as never, http)

    const error = fakeError(401, { headers: {} })
    const result = await handler(error)

    expect(sessionManager.refreshAccessToken).toHaveBeenCalledOnce()
    expect(error.config?.headers.Authorization).toBe('Bearer new-token')
    expect(http).toHaveBeenCalledWith(error.config)
    expect(result).toEqual({ data: 'ok' })
  })

  it('does not retry a request a second time', async () => {
    const sessionManager = { refreshAccessToken: vi.fn(), expire: vi.fn() }
    const http = vi.fn() as unknown as AxiosInstance
    const handler = createAuthResponseInterceptor(sessionManager as never, http)

    const error = fakeError(401, { headers: {}, _retry: true } as never)
    await expect(handler(error)).rejects.toBe(error)
    expect(sessionManager.refreshAccessToken).not.toHaveBeenCalled()
  })

  it('expires the session and rejects when refreshing fails', async () => {
    const sessionManager = {
      refreshAccessToken: vi.fn().mockRejectedValue(new Error('refresh failed')),
      expire: vi.fn(),
    }
    const http = vi.fn() as unknown as AxiosInstance
    const handler = createAuthResponseInterceptor(sessionManager as never, http)

    const error = fakeError(401, { headers: {} })
    await expect(handler(error)).rejects.toBe(error)
    expect(sessionManager.expire).toHaveBeenCalledOnce()
    expect(http).not.toHaveBeenCalled()
  })
})
