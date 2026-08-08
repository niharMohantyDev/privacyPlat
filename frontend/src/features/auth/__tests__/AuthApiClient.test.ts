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
})
