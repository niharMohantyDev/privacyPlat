import type { AxiosInstance } from 'axios'
import { describe, expect, it, vi } from 'vitest'

import { ConsentApiClient } from '../api/ConsentApiClient'

function fakeHttp(overrides: Partial<AxiosInstance> = {}): AxiosInstance {
  return {
    get: vi.fn(),
    post: vi.fn(),
    ...overrides,
  } as unknown as AxiosInstance
}

describe('ConsentApiClient', () => {
  it('lists purposes, passing public_key as a query param', async () => {
    const get = vi.fn().mockResolvedValue({ data: [{ code: 'analytics' }] })
    const client = new ConsentApiClient('key-123', fakeHttp({ get }))

    const purposes = await client.listPurposes()

    expect(get).toHaveBeenCalledWith('/api/consent/public/purposes/', {
      params: { public_key: 'key-123' },
    })
    expect(purposes).toEqual([{ code: 'analytics' }])
  })

  it('records consent, including public_key in the body', async () => {
    const post = vi.fn().mockResolvedValue({ data: { record_id: 'r1' } })
    const client = new ConsentApiClient('key-123', fakeHttp({ post }))

    const receipt = await client.recordConsent({
      subject_key: 's1',
      region: 'DE',
      decisions: { analytics: true },
    })

    expect(post).toHaveBeenCalledWith('/api/consent/public/records/', {
      public_key: 'key-123',
      subject_key: 's1',
      region: 'DE',
      decisions: { analytics: true },
    })
    expect(receipt).toEqual({ record_id: 'r1' })
  })
})
