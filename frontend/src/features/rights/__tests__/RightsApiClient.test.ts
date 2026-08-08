import type { AxiosInstance } from 'axios'
import { describe, expect, it, vi } from 'vitest'

import { RightsApiClient } from '../api/RightsApiClient'

function fakeHttp(overrides: Partial<AxiosInstance> = {}): AxiosInstance {
  return { post: vi.fn(), ...overrides } as unknown as AxiosInstance
}

describe('RightsApiClient', () => {
  it('submits a request including public_key in the body', async () => {
    const post = vi.fn().mockResolvedValue({ data: { id: 'req-1', status: 'submitted' } })
    const client = new RightsApiClient('key-123', fakeHttp({ post }))

    const result = await client.submitRequest({
      subject_key: 'alice@example.com',
      request_type: 'access',
      region: 'DE',
    })

    expect(post).toHaveBeenCalledWith('/api/rights/public/requests/', {
      public_key: 'key-123',
      subject_key: 'alice@example.com',
      request_type: 'access',
      region: 'DE',
    })
    expect(result).toEqual({ id: 'req-1', status: 'submitted' })
  })
})
