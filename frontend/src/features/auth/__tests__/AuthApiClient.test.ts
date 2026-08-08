import type { AxiosInstance } from 'axios'
import { describe, expect, it, vi } from 'vitest'

import { AuthApiClient } from '../api/AuthApiClient'

describe('AuthApiClient', () => {
  it('posts email/password to /api/token/', async () => {
    const post = vi.fn().mockResolvedValue({ data: { access: 'a', refresh: 'r' } })
    const client = new AuthApiClient({ post } as unknown as AxiosInstance)

    const tokens = await client.login({ email: 'staff@demo-org.test', password: 'x' })

    expect(post).toHaveBeenCalledWith('/api/token/', {
      email: 'staff@demo-org.test',
      password: 'x',
    })
    expect(tokens).toEqual({ access: 'a', refresh: 'r' })
  })

  it('posts the refresh token to /api/token/refresh/ and returns the rotated pair', async () => {
    const post = vi.fn().mockResolvedValue({ data: { access: 'a2', refresh: 'r2' } })
    const client = new AuthApiClient({ post } as unknown as AxiosInstance)

    const tokens = await client.refresh('r1')

    expect(post).toHaveBeenCalledWith('/api/token/refresh/', { refresh: 'r1' })
    expect(tokens).toEqual({ access: 'a2', refresh: 'r2' })
  })

  it('falls back to the sent refresh token if the response omits one', async () => {
    const post = vi.fn().mockResolvedValue({ data: { access: 'a2' } })
    const client = new AuthApiClient({ post } as unknown as AxiosInstance)

    const tokens = await client.refresh('r1')

    expect(tokens).toEqual({ access: 'a2', refresh: 'r1' })
  })
})
