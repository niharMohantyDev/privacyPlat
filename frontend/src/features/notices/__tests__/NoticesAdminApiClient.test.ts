import type { AxiosInstance } from 'axios'
import { describe, expect, it, vi } from 'vitest'

import { NoticesAdminApiClient } from '../api/NoticesAdminApiClient'

describe('NoticesAdminApiClient', () => {
  it('lists notices scoped to the organization', async () => {
    const get = vi.fn().mockResolvedValue({ data: [{ id: 'n1' }] })
    const client = new NoticesAdminApiClient({ get } as unknown as AxiosInstance)

    const notices = await client.listNotices('org-1')

    expect(get).toHaveBeenCalledWith('/api/notices/', {
      params: { organization_id: 'org-1', notice_type: undefined },
    })
    expect(notices).toEqual([{ id: 'n1' }])
  })

  it('creates a draft scoped to the organization', async () => {
    const post = vi.fn().mockResolvedValue({ data: { id: 'n1', status: 'draft' } })
    const client = new NoticesAdminApiClient({ post } as unknown as AxiosInstance)

    const result = await client.createDraft('org-1', {
      noticeType: 'privacy_policy',
      title: 'Privacy Policy',
      body: 'We respect your privacy.',
      changeSummary: 'Initial version',
    })

    expect(post).toHaveBeenCalledWith(
      '/api/notices/create/',
      {
        notice_type: 'privacy_policy',
        title: 'Privacy Policy',
        body: 'We respect your privacy.',
        change_summary: 'Initial version',
      },
      { params: { organization_id: 'org-1' } },
    )
    expect(result).toEqual({ id: 'n1', status: 'draft' })
  })

  it('publishes a notice scoped to the organization', async () => {
    const post = vi.fn().mockResolvedValue({ data: { id: 'n1', status: 'published' } })
    const client = new NoticesAdminApiClient({ post } as unknown as AxiosInstance)

    const result = await client.publish('org-1', 'n1')

    expect(post).toHaveBeenCalledWith(
      '/api/notices/n1/publish/',
      {},
      { params: { organization_id: 'org-1' } },
    )
    expect(result).toEqual({ id: 'n1', status: 'published' })
  })

  it('archives a notice scoped to the organization', async () => {
    const post = vi.fn().mockResolvedValue({ data: { id: 'n1', status: 'archived' } })
    const client = new NoticesAdminApiClient({ post } as unknown as AxiosInstance)

    const result = await client.archive('org-1', 'n1')

    expect(post).toHaveBeenCalledWith(
      '/api/notices/n1/archive/',
      {},
      { params: { organization_id: 'org-1' } },
    )
    expect(result).toEqual({ id: 'n1', status: 'archived' })
  })
})
