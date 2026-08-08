import type { AxiosInstance } from 'axios'
import { describe, expect, it, vi } from 'vitest'

import { CoreAdminApiClient } from '../api/CoreAdminApiClient'

function fakeHttp(overrides: Partial<AxiosInstance> = {}): AxiosInstance {
  return { get: vi.fn(), post: vi.fn(), patch: vi.fn(), delete: vi.fn(), ...overrides } as unknown as AxiosInstance
}

describe('CoreAdminApiClient', () => {
  it('lists workspaces, unwrapping pagination and filtering to the given org', async () => {
    const get = vi.fn().mockResolvedValue({
      data: {
        count: 2,
        results: [
          { id: 'w1', organization: 'org-1', name: 'Site' },
          { id: 'w2', organization: 'org-2', name: 'Other' },
        ],
      },
    })
    const client = new CoreAdminApiClient(fakeHttp({ get }))

    const workspaces = await client.listWorkspaces('org-1')

    expect(get).toHaveBeenCalledWith('/api/workspaces/')
    expect(workspaces).toEqual([{ id: 'w1', organization: 'org-1', name: 'Site' }])
  })

  it('creates a workspace', async () => {
    const post = vi.fn().mockResolvedValue({ data: { id: 'w1', name: 'Site' } })
    const client = new CoreAdminApiClient(fakeHttp({ post }))

    await client.createWorkspace({ organization: 'org-1', name: 'Site', slug: 'site' })

    expect(post).toHaveBeenCalledWith('/api/workspaces/', {
      organization: 'org-1',
      name: 'Site',
      slug: 'site',
    })
  })

  it('deletes a workspace', async () => {
    const del = vi.fn().mockResolvedValue({})
    const client = new CoreAdminApiClient(fakeHttp({ delete: del }))

    await client.deleteWorkspace('w1')

    expect(del).toHaveBeenCalledWith('/api/workspaces/w1/')
  })

  it('lists assets by first resolving the org workspace ids, then filtering', async () => {
    const get = vi.fn().mockImplementation((url: string) => {
      if (url === '/api/workspaces/') {
        return Promise.resolve({
          data: { count: 1, results: [{ id: 'w1', organization: 'org-1', name: 'Site' }] },
        })
      }
      return Promise.resolve({
        data: {
          count: 2,
          results: [
            { id: 'a1', workspace: 'w1', name: 'acme.com' },
            { id: 'a2', workspace: 'w-other-org', name: 'other.com' },
          ],
        },
      })
    })
    const client = new CoreAdminApiClient(fakeHttp({ get }))

    const assets = await client.listAssets('org-1')

    expect(assets).toEqual([{ id: 'a1', workspace: 'w1', name: 'acme.com' }])
  })

  it('creates an asset', async () => {
    const post = vi.fn().mockResolvedValue({ data: { id: 'a1', name: 'acme.com' } })
    const client = new CoreAdminApiClient(fakeHttp({ post }))

    await client.createAsset({ workspace: 'w1', asset_type: 'website', name: 'acme.com', identifier: 'acme.com' })

    expect(post).toHaveBeenCalledWith('/api/assets/', {
      workspace: 'w1',
      asset_type: 'website',
      name: 'acme.com',
      identifier: 'acme.com',
    })
  })

  it('updates an asset via PATCH (e.g. toggling is_active)', async () => {
    const patch = vi.fn().mockResolvedValue({ data: { id: 'a1', is_active: false } })
    const client = new CoreAdminApiClient(fakeHttp({ patch }))

    await client.updateAsset('a1', { is_active: false })

    expect(patch).toHaveBeenCalledWith('/api/assets/a1/', { is_active: false })
  })
})
