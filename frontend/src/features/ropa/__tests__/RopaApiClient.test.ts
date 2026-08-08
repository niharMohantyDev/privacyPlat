import type { AxiosInstance } from 'axios'
import { describe, expect, it, vi } from 'vitest'

import { RopaApiClient } from '../api/RopaApiClient'

describe('RopaApiClient', () => {
  it('lists activities scoped to the organization', async () => {
    const get = vi.fn().mockResolvedValue({ data: [{ id: 'a1' }] })
    const client = new RopaApiClient({ get } as unknown as AxiosInstance)

    const activities = await client.listActivities('org-1')

    expect(get).toHaveBeenCalledWith('/api/ropa/activities/', {
      params: { organization_id: 'org-1', status: undefined },
    })
    expect(activities).toEqual([{ id: 'a1' }])
  })

  it('lists activities filtered by status', async () => {
    const get = vi.fn().mockResolvedValue({ data: [] })
    const client = new RopaApiClient({ get } as unknown as AxiosInstance)

    await client.listActivities('org-1', 'active')

    expect(get).toHaveBeenCalledWith('/api/ropa/activities/', {
      params: { organization_id: 'org-1', status: 'active' },
    })
  })

  it('creates an activity scoped to the organization', async () => {
    const post = vi.fn().mockResolvedValue({ data: { id: 'a1', status: 'draft' } })
    const client = new RopaApiClient({ post } as unknown as AxiosInstance)

    const result = await client.createActivity('org-1', {
      title: 'Payroll processing',
      legalBasis: 'contract',
      riskLevel: 'high',
      owner: 'HR',
    })

    expect(post).toHaveBeenCalledWith(
      '/api/ropa/activities/create/',
      { title: 'Payroll processing', legal_basis: 'contract', risk_level: 'high', owner: 'HR' },
      { params: { organization_id: 'org-1' } },
    )
    expect(result).toEqual({ id: 'a1', status: 'draft' })
  })

  it('transitions an activity with the target status and org scoping', async () => {
    const post = vi.fn().mockResolvedValue({ data: { id: 'a1', status: 'active' } })
    const client = new RopaApiClient({ post } as unknown as AxiosInstance)

    const result = await client.transitionActivity('org-1', { activityId: 'a1', targetStatus: 'active' })

    expect(post).toHaveBeenCalledWith(
      '/api/ropa/activities/a1/transition/',
      { target_status: 'active' },
      { params: { organization_id: 'org-1' } },
    )
    expect(result).toEqual({ id: 'a1', status: 'active' })
  })

  it('marks an activity reviewed scoped to the organization', async () => {
    const post = vi.fn().mockResolvedValue({ data: { id: 'a1', reviewed_at: '2026-01-01T00:00:00Z' } })
    const client = new RopaApiClient({ post } as unknown as AxiosInstance)

    const result = await client.markReviewed('org-1', 'a1')

    expect(post).toHaveBeenCalledWith(
      '/api/ropa/activities/a1/mark-reviewed/',
      {},
      { params: { organization_id: 'org-1' } },
    )
    expect(result).toEqual({ id: 'a1', reviewed_at: '2026-01-01T00:00:00Z' })
  })
})
