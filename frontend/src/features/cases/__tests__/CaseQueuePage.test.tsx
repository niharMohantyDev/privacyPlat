import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { CaseQueuePage } from '../components/CaseQueuePage'
import type { Case, ICasesAdminApiClient } from '../types'

const CASE: Case = {
  id: 'c1',
  case_type: 'breach',
  status: 'reported',
  title: 'Unencrypted backup exposed',
  description: '',
  reported_by: '',
  region: 'DE',
  severity: 'high',
  reported_at: '2026-01-01T00:00:00Z',
  due_at: '2026-01-04T00:00:00Z',
  resolved_at: null,
  notes: '',
}

function renderWithQueryClient(ui: React.ReactElement) {
  const queryClient = new QueryClient()
  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>)
}

describe('CaseQueuePage', () => {
  it('loads and displays the queue', async () => {
    const client: ICasesAdminApiClient = {
      listCases: vi.fn().mockResolvedValue([CASE]),
      reportCase: vi.fn(),
      transitionCase: vi.fn(),
    }

    renderWithQueryClient(<CaseQueuePage organizationId="org-1" client={client} />)

    await screen.findByText('Unencrypted backup exposed')
    expect(client.listCases).toHaveBeenCalledWith('org-1', undefined)
  })

  it('shows an error message when a transition is rejected', async () => {
    const client: ICasesAdminApiClient = {
      listCases: vi.fn().mockResolvedValue([CASE]),
      reportCase: vi.fn(),
      transitionCase: vi.fn().mockRejectedValue(new Error('invalid transition')),
    }

    renderWithQueryClient(<CaseQueuePage organizationId="org-1" client={client} />)
    await screen.findByText('Unencrypted backup exposed')

    fireEvent.change(screen.getByLabelText('Change status for Unencrypted backup exposed'), {
      target: { value: 'resolved' },
    })

    await waitFor(() =>
      expect(
        screen.getByText("That status change wasn't allowed from the case's current state."),
      ).toBeInTheDocument(),
    )
  })

  it('reports a new case via the inline form', async () => {
    const client: ICasesAdminApiClient = {
      listCases: vi.fn().mockResolvedValue([]),
      reportCase: vi.fn().mockResolvedValue({ ...CASE, id: 'c2', title: 'New leak' }),
      transitionCase: vi.fn(),
    }

    renderWithQueryClient(<CaseQueuePage organizationId="org-1" client={client} />)
    await waitFor(() => expect(client.listCases).toHaveBeenCalled())

    fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'New leak' } })
    fireEvent.click(screen.getByText('Report Case'))

    await waitFor(() =>
      expect(client.reportCase).toHaveBeenCalledWith(
        'org-1',
        expect.objectContaining({ title: 'New leak' }),
      ),
    )
  })
})
