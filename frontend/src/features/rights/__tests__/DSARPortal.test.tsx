import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { DSARPortal } from '../components/DSARPortal'
import type { DSARRequest, IRightsApiClient } from '../types'

function renderWithQueryClient(ui: React.ReactElement) {
  const queryClient = new QueryClient()
  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>)
}

describe('DSARPortal', () => {
  it('submits the form and shows the confirmation on success', async () => {
    const submittedRequest: DSARRequest = {
      id: 'req-1',
      subject_key: 'alice@example.com',
      request_type: 'access',
      status: 'submitted',
      region: 'DE',
      submitted_at: '2026-01-01T00:00:00Z',
      due_at: '2026-01-31T00:00:00Z',
      resolved_at: null,
      notes: '',
    }
    const client: IRightsApiClient = {
      submitRequest: vi.fn().mockResolvedValue(submittedRequest),
    }

    renderWithQueryClient(<DSARPortal publicKey="key-123" client={client} />)

    fireEvent.change(screen.getByLabelText('Your email address'), {
      target: { value: 'alice@example.com' },
    })
    fireEvent.click(screen.getByText('Submit Request'))

    await waitFor(() => expect(screen.getByText('Request received')).toBeInTheDocument())
    expect(client.submitRequest).toHaveBeenCalledWith(
      expect.objectContaining({ subject_key: 'alice@example.com', request_type: 'access' }),
    )
    expect(screen.getByText('req-1')).toBeInTheDocument()
  })

  it('returns to the form when "Submit another request" is clicked', async () => {
    const submittedRequest: DSARRequest = {
      id: 'req-1',
      subject_key: 'alice@example.com',
      request_type: 'access',
      status: 'submitted',
      region: 'DE',
      submitted_at: '2026-01-01T00:00:00Z',
      due_at: null,
      resolved_at: null,
      notes: '',
    }
    const client: IRightsApiClient = { submitRequest: vi.fn().mockResolvedValue(submittedRequest) }

    renderWithQueryClient(<DSARPortal publicKey="key-123" client={client} />)
    fireEvent.change(screen.getByLabelText('Your email address'), {
      target: { value: 'alice@example.com' },
    })
    fireEvent.click(screen.getByText('Submit Request'))
    await screen.findByText('Request received')

    fireEvent.click(screen.getByText('Submit another request'))
    await waitFor(() => expect(screen.getByText('Submit Request')).toBeInTheDocument())
  })

  it('shows an error message if submission fails', async () => {
    const client: IRightsApiClient = {
      submitRequest: vi.fn().mockRejectedValue(new Error('network error')),
    }

    renderWithQueryClient(<DSARPortal publicKey="key-123" client={client} />)
    fireEvent.change(screen.getByLabelText('Your email address'), {
      target: { value: 'alice@example.com' },
    })
    fireEvent.click(screen.getByText('Submit Request'))

    await waitFor(() =>
      expect(screen.getByText('Something went wrong — please try again.')).toBeInTheDocument(),
    )
  })
})
