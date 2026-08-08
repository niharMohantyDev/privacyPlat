import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { NoticePreview } from '../components/NoticePreview'
import type { INoticesApiClient, PublicNotice } from '../types'

const PUBLIC_NOTICE: PublicNotice = {
  notice_type: 'privacy_policy',
  title: 'Privacy Policy',
  body: 'We respect your privacy.',
  version: 3,
  published_at: '2026-01-01T00:00:00Z',
}

function renderWithQueryClient(ui: React.ReactElement) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>)
}

describe('NoticePreview', () => {
  it('renders the published notice title, body, and version', async () => {
    const client: INoticesApiClient = { getPublishedNotice: vi.fn().mockResolvedValue(PUBLIC_NOTICE) }

    renderWithQueryClient(<NoticePreview publicKey="key-123" noticeType="privacy_policy" client={client} />)

    await screen.findByText('Privacy Policy')
    expect(screen.getByText('We respect your privacy.')).toBeInTheDocument()
    expect(screen.getByText(/v3/)).toBeInTheDocument()
    expect(client.getPublishedNotice).toHaveBeenCalledWith('privacy_policy')
  })

  it('shows a message when nothing is published yet', async () => {
    const client: INoticesApiClient = {
      getPublishedNotice: vi.fn().mockRejectedValue(new Error('not found')),
    }

    renderWithQueryClient(<NoticePreview publicKey="key-123" noticeType="privacy_policy" client={client} />)

    await screen.findByText("This organization hasn't published this notice yet.")
  })
})
