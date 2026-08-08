import type { AxiosInstance } from 'axios'
import { describe, expect, it, vi } from 'vitest'

import { ConsentAdminApiClient } from '../api/ConsentAdminApiClient'

function fakeHttp(overrides: Partial<AxiosInstance> = {}): AxiosInstance {
  return { get: vi.fn(), post: vi.fn(), patch: vi.fn(), delete: vi.fn(), ...overrides } as unknown as AxiosInstance
}

describe('ConsentAdminApiClient', () => {
  it('lists purposes, unwrapping pagination and filtering to the given org', async () => {
    const get = vi.fn().mockResolvedValue({
      data: {
        count: 2,
        results: [
          { id: 'p1', organization: 'org-1', code: 'analytics' },
          { id: 'p2', organization: 'org-2', code: 'marketing' },
        ],
      },
    })
    const client = new ConsentAdminApiClient(fakeHttp({ get }))

    const purposes = await client.listPurposes('org-1')

    expect(get).toHaveBeenCalledWith('/api/consent/purposes/')
    expect(purposes).toEqual([{ id: 'p1', organization: 'org-1', code: 'analytics' }])
  })

  it('creates a purpose', async () => {
    const post = vi.fn().mockResolvedValue({ data: { id: 'p1', code: 'analytics' } })
    const client = new ConsentAdminApiClient(fakeHttp({ post }))

    const result = await client.createPurpose({
      organization: 'org-1',
      code: 'analytics',
      name: 'Analytics',
      description: '',
      is_essential: false,
    })

    expect(post).toHaveBeenCalledWith('/api/consent/purposes/', {
      organization: 'org-1',
      code: 'analytics',
      name: 'Analytics',
      description: '',
      is_essential: false,
    })
    expect(result).toEqual({ id: 'p1', code: 'analytics' })
  })

  it('updates a purpose via PATCH', async () => {
    const patch = vi.fn().mockResolvedValue({ data: { id: 'p1', name: 'Renamed' } })
    const client = new ConsentAdminApiClient(fakeHttp({ patch }))

    await client.updatePurpose('p1', { name: 'Renamed' })

    expect(patch).toHaveBeenCalledWith('/api/consent/purposes/p1/', { name: 'Renamed' })
  })

  it('deletes a purpose', async () => {
    const del = vi.fn().mockResolvedValue({})
    const client = new ConsentAdminApiClient(fakeHttp({ delete: del }))

    await client.deletePurpose('p1')

    expect(del).toHaveBeenCalledWith('/api/consent/purposes/p1/')
  })

  it('lists consent records scoped to the organization', async () => {
    const get = vi.fn().mockResolvedValue({ data: [{ id: 'r1' }] })
    const client = new ConsentAdminApiClient(fakeHttp({ get }))

    const records = await client.listRecords('org-1')

    expect(get).toHaveBeenCalledWith('/api/consent/records/log/', { params: { organization_id: 'org-1' } })
    expect(records).toEqual([{ id: 'r1' }])
  })
})
