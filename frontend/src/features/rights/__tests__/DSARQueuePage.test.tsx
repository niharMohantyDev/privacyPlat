import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { DSARQueuePage } from '../components/DSARQueuePage'
import type { DSARRequest, IRightsAdminApiClient } from '../types'

const REQUEST: DSARRequest = {
  id: 'r1',
  subject_key: 'alice@example.com',
  request_type: 'access',
  status: 'submitted',
  region: 'DE',
  submitted_at: '2026-01-01T00:00:00Z',
  due_at: '2026-01-31T00:00:00Z',
  resolved_at: null,
  notes: '',
}

function renderWithQueryClient(ui: React.ReactElement) {
  const queryClient = new QueryClient()
  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>)
}

describe('DSARQueuePage', () => {
  it('loads and displays the queue', async () => {
    const client: IRightsAdminApiClient = {
      listRequests: vi.fn().mockResolvedValue([REQUEST]),
      transitionRequest: vi.fn(),
    }

    renderWithQueryClient(<DSARQueuePage organizationId="org-1" client={client} />)

    await screen.findByText('alice@example.com')
    expect(client.listRequests).toHaveBeenCalledWith('org-1')
  })

  it('shows an error message when a transition is rejected', async () => {
    const client: IRightsAdminApiClient = {
      listRequests: vi.fn().mockResolvedValue([REQUEST]),
      transitionRequest: vi.fn().mockRejectedValue(new Error('invalid transition')),
    }

    renderWithQueryClient(<DSARQueuePage organizationId="org-1" client={client} />)
    await screen.findByText('alice@example.com')

    fireEvent.change(screen.getByLabelText('Change status for alice@example.com'), {
      target: { value: 'completed' },
    })

    await waitFor(() =>
      expect(
        screen.getByText("That status change wasn't allowed from the request's current state."),
      ).toBeInTheDocument(),
    )
  })
})
