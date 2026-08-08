import type { AxiosInstance } from 'axios'
import { describe, expect, it, vi } from 'vitest'

import { CasesAdminApiClient } from '../api/CasesAdminApiClient'

describe('CasesAdminApiClient', () => {
  it('lists cases scoped to the organization', async () => {
    const get = vi.fn().mockResolvedValue({ data: [{ id: 'c1' }] })
    const client = new CasesAdminApiClient({ get } as unknown as AxiosInstance)

    const cases = await client.listCases('org-1')

    expect(get).toHaveBeenCalledWith('/api/cases/', {
      params: { organization_id: 'org-1', case_type: undefined },
    })
    expect(cases).toEqual([{ id: 'c1' }])
  })

  it('lists cases filtered by case type', async () => {
    const get = vi.fn().mockResolvedValue({ data: [] })
    const client = new CasesAdminApiClient({ get } as unknown as AxiosInstance)

    await client.listCases('org-1', 'grievance')

    expect(get).toHaveBeenCalledWith('/api/cases/', {
      params: { organization_id: 'org-1', case_type: 'grievance' },
    })
  })

  it('reports a case scoped to the organization', async () => {
    const post = vi.fn().mockResolvedValue({ data: { id: 'c1', status: 'reported' } })
    const client = new CasesAdminApiClient({ post } as unknown as AxiosInstance)

    const result = await client.reportCase('org-1', { caseType: 'breach', title: 'Data leak' })

    expect(post).toHaveBeenCalledWith(
      '/api/cases/report/',
      {
        case_type: 'breach',
        title: 'Data leak',
        description: undefined,
        reported_by: undefined,
        region: undefined,
        severity: undefined,
      },
      { params: { organization_id: 'org-1' } },
    )
    expect(result).toEqual({ id: 'c1', status: 'reported' })
  })

  it('transitions a case with the target status and org scoping', async () => {
    const post = vi.fn().mockResolvedValue({ data: { id: 'c1', status: 'investigating' } })
    const client = new CasesAdminApiClient({ post } as unknown as AxiosInstance)

    const result = await client.transitionCase('org-1', {
      caseId: 'c1',
      targetStatus: 'investigating',
    })

    expect(post).toHaveBeenCalledWith(
      '/api/cases/c1/transition/',
      { target_status: 'investigating', note: undefined },
      { params: { organization_id: 'org-1' } },
    )
    expect(result).toEqual({ id: 'c1', status: 'investigating' })
  })
})
