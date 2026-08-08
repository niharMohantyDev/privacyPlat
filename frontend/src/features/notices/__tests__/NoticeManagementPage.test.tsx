import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { NoticeManagementPage } from '../components/NoticeManagementPage'
import type { INoticesAdminApiClient, PrivacyNotice } from '../types'

const NOTICE: PrivacyNotice = {
  id: 'n1',
  notice_type: 'privacy_policy',
  title: 'Our Privacy Policy',
  body: '',
  version: 1,
  status: 'draft',
  change_summary: '',
  published_at: null,
  review_due_at: null,
}

function fakeClient(overrides: Partial<INoticesAdminApiClient> = {}): INoticesAdminApiClient {
  return {
    listNotices: vi.fn().mockResolvedValue([]),
    createDraft: vi.fn(),
    publish: vi.fn(),
    archive: vi.fn(),
    ...overrides,
  }
}

function renderWithQueryClient(ui: React.ReactElement) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>)
}

describe('NoticeManagementPage', () => {
  it('loads and displays the register', async () => {
    const client = fakeClient({ listNotices: vi.fn().mockResolvedValue([NOTICE]) })

    renderWithQueryClient(<NoticeManagementPage organizationId="org-1" client={client} />)

    await screen.findByText('Our Privacy Policy')
    expect(client.listNotices).toHaveBeenCalledWith('org-1', undefined)
  })

  it('drafts a new notice via the inline form', async () => {
    const client = fakeClient({
      createDraft: vi.fn().mockResolvedValue({ ...NOTICE, id: 'n2', title: 'Terms' }),
    })

    renderWithQueryClient(<NoticeManagementPage organizationId="org-1" client={client} />)
    await waitFor(() => expect(client.listNotices).toHaveBeenCalled())

    fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'Terms' } })
    fireEvent.click(screen.getByText('Save Draft'))

    await waitFor(() =>
      expect(client.createDraft).toHaveBeenCalledWith('org-1', expect.objectContaining({ title: 'Terms' })),
    )
  })

  it('publishes a draft', async () => {
    const client = fakeClient({
      listNotices: vi.fn().mockResolvedValue([NOTICE]),
      publish: vi.fn().mockResolvedValue({ ...NOTICE, status: 'published' }),
    })

    renderWithQueryClient(<NoticeManagementPage organizationId="org-1" client={client} />)
    await screen.findByText('Our Privacy Policy')

    fireEvent.click(screen.getByText('Publish'))

    await waitFor(() => expect(client.publish).toHaveBeenCalledWith('org-1', 'n1'))
  })

  it('shows an error message when an update is rejected', async () => {
    const client = fakeClient({
      listNotices: vi.fn().mockResolvedValue([NOTICE]),
      publish: vi.fn().mockRejectedValue(new Error('invalid transition')),
    })

    renderWithQueryClient(<NoticeManagementPage organizationId="org-1" client={client} />)
    await screen.findByText('Our Privacy Policy')

    fireEvent.click(screen.getByText('Publish'))

    await waitFor(() =>
      expect(
        screen.getByText("That action wasn't allowed from the notice's current state."),
      ).toBeInTheDocument(),
    )
  })
})
