import type { AxiosInstance } from 'axios'
import { describe, expect, it, vi } from 'vitest'

import { CasesApiClient } from '../api/CasesApiClient'

function fakeHttp(overrides: Partial<AxiosInstance> = {}): AxiosInstance {
  return { post: vi.fn(), ...overrides } as unknown as AxiosInstance
}

describe('CasesApiClient', () => {
  it('submits a grievance including public_key in the body', async () => {
    const post = vi.fn().mockResolvedValue({ data: { id: 'case-1', status: 'reported' } })
    const client = new CasesApiClient('key-123', fakeHttp({ post }))

    const result = await client.submitGrievance({
      title: 'Unwanted marketing',
      description: 'Too many emails',
      reportedBy: 'alice@example.com',
      region: 'IN',
    })

    expect(post).toHaveBeenCalledWith('/api/public/grievances/', {
      public_key: 'key-123',
      title: 'Unwanted marketing',
      description: 'Too many emails',
      reported_by: 'alice@example.com',
      region: 'IN',
    })
    expect(result).toEqual({ id: 'case-1', status: 'reported' })
  })
})
