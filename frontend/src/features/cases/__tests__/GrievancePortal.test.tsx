import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { GrievancePortal } from '../components/GrievancePortal'
import type { Case, ICasesApiClient } from '../types'

function renderWithQueryClient(ui: React.ReactElement) {
  const queryClient = new QueryClient()
  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>)
}

describe('GrievancePortal', () => {
  it('submits the form and shows the confirmation on success', async () => {
    const submittedCase: Case = {
      id: 'case-1',
      case_type: 'grievance',
      status: 'reported',
      title: 'Unwanted marketing',
      description: '',
      reported_by: 'alice@example.com',
      region: 'IN',
      severity: '',
      reported_at: '2026-01-01T00:00:00Z',
      due_at: '2026-01-31T00:00:00Z',
      resolved_at: null,
      notes: '',
    }
    const client: ICasesApiClient = {
      submitGrievance: vi.fn().mockResolvedValue(submittedCase),
    }

    renderWithQueryClient(<GrievancePortal publicKey="key-123" client={client} />)

    fireEvent.change(screen.getByLabelText('Your email address'), {
      target: { value: 'alice@example.com' },
    })
    fireEvent.change(screen.getByLabelText("What's the issue?"), {
      target: { value: 'Unwanted marketing' },
    })
    fireEvent.click(screen.getByText('Submit Grievance'))

    await waitFor(() => expect(screen.getByText('Grievance received')).toBeInTheDocument())
    expect(client.submitGrievance).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'Unwanted marketing', reportedBy: 'alice@example.com' }),
    )
    expect(screen.getByText('case-1')).toBeInTheDocument()
  })

  it('returns to the form when "Submit another grievance" is clicked', async () => {
    const submittedCase: Case = {
      id: 'case-1',
      case_type: 'grievance',
      status: 'reported',
      title: 'Unwanted marketing',
      description: '',
      reported_by: 'alice@example.com',
      region: 'IN',
      severity: '',
      reported_at: '2026-01-01T00:00:00Z',
      due_at: null,
      resolved_at: null,
      notes: '',
    }
    const client: ICasesApiClient = { submitGrievance: vi.fn().mockResolvedValue(submittedCase) }

    renderWithQueryClient(<GrievancePortal publicKey="key-123" client={client} />)
    fireEvent.change(screen.getByLabelText('Your email address'), {
      target: { value: 'alice@example.com' },
    })
    fireEvent.change(screen.getByLabelText("What's the issue?"), {
      target: { value: 'Unwanted marketing' },
    })
    fireEvent.click(screen.getByText('Submit Grievance'))
    await screen.findByText('Grievance received')

    fireEvent.click(screen.getByText('Submit another grievance'))
    await waitFor(() => expect(screen.getByText('Submit Grievance')).toBeInTheDocument())
  })

  it('shows an error message if submission fails', async () => {
    const client: ICasesApiClient = {
      submitGrievance: vi.fn().mockRejectedValue(new Error('network error')),
    }

    renderWithQueryClient(<GrievancePortal publicKey="key-123" client={client} />)
    fireEvent.change(screen.getByLabelText('Your email address'), {
      target: { value: 'alice@example.com' },
    })
    fireEvent.change(screen.getByLabelText("What's the issue?"), {
      target: { value: 'Unwanted marketing' },
    })
    fireEvent.click(screen.getByText('Submit Grievance'))

    await waitFor(() =>
      expect(screen.getByText('Something went wrong — please try again.')).toBeInTheDocument(),
    )
  })
})
