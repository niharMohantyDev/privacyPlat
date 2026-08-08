import type { AxiosInstance } from 'axios'
import { describe, expect, it, vi } from 'vitest'

import { DashboardApiClient } from '../api/DashboardApiClient'

describe('DashboardApiClient', () => {
  it('fetches the summary scoped to the organization', async () => {
    const get = vi.fn().mockResolvedValue({ data: { dsar: { total: 1 } } })
    const client = new DashboardApiClient({ get } as unknown as AxiosInstance)

    const result = await client.getSummary('org-1')

    expect(get).toHaveBeenCalledWith('/api/dashboard/summary/', {
      params: { organization_id: 'org-1' },
    })
    expect(result).toEqual({ dsar: { total: 1 } })
  })
})
