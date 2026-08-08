import type { AxiosInstance } from 'axios'
import { describe, expect, it, vi } from 'vitest'

import { RightsAdminApiClient } from '../api/RightsAdminApiClient'

describe('RightsAdminApiClient', () => {
  it('lists requests scoped to the organization', async () => {
    const get = vi.fn().mockResolvedValue({ data: [{ id: 'r1' }] })
    const client = new RightsAdminApiClient({ get } as unknown as AxiosInstance)

    const requests = await client.listRequests('org-1')

    expect(get).toHaveBeenCalledWith('/api/rights/requests/', { params: { organization_id: 'org-1' } })
    expect(requests).toEqual([{ id: 'r1' }])
  })

  it('transitions a request with the target status and org scoping', async () => {
    const post = vi.fn().mockResolvedValue({ data: { id: 'r1', status: 'in_progress' } })
    const client = new RightsAdminApiClient({ post } as unknown as AxiosInstance)

    const result = await client.transitionRequest('org-1', {
      requestId: 'r1',
      targetStatus: 'in_progress',
    })

    expect(post).toHaveBeenCalledWith(
      '/api/rights/requests/r1/transition/',
      { target_status: 'in_progress', note: undefined },
      { params: { organization_id: 'org-1' } },
    )
    expect(result).toEqual({ id: 'r1', status: 'in_progress' })
  })
})
