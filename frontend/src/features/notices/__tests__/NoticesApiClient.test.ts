import type { AxiosInstance } from 'axios'
import { describe, expect, it, vi } from 'vitest'

import { NoticesApiClient } from '../api/NoticesApiClient'

describe('NoticesApiClient', () => {
  it('fetches the published notice including the public_key', async () => {
    const get = vi.fn().mockResolvedValue({ data: { title: 'Privacy Policy', version: 2 } })
    const client = new NoticesApiClient('key-123', { get } as unknown as AxiosInstance)

    const result = await client.getPublishedNotice('privacy_policy')

    expect(get).toHaveBeenCalledWith('/api/public/notices/privacy_policy/', {
      params: { public_key: 'key-123' },
    })
    expect(result).toEqual({ title: 'Privacy Policy', version: 2 })
  })
})
