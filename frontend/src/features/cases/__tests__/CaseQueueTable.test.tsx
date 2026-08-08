import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { CaseQueueTable } from '../components/CaseQueueTable'
import type { Case, ICasesAdminApiClient } from '../types'

const CASES: Case[] = [
  {
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
  },
]

const GRIEVANCE_CASES: Case[] = [
  {
    ...CASES[0],
    id: 'c2',
    case_type: 'grievance',
    title: 'Unwanted marketing',
  },
]

function renderWithQueryClient(ui: React.ReactElement) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>)
}

describe('CaseQueueTable', () => {
  it('shows a message when there are no cases', () => {
    render(<CaseQueueTable cases={[]} organizationId="org-1" onTransition={vi.fn()} isTransitioning={false} />)
    expect(screen.getByText('No cases yet.')).toBeInTheDocument()
  })

  it('renders each case with its title, type, and status', () => {
    render(<CaseQueueTable cases={CASES} organizationId="org-1" onTransition={vi.fn()} isTransitioning={false} />)
    expect(screen.getByText('Unencrypted backup exposed')).toBeInTheDocument()
    expect(screen.getByText('breach')).toBeInTheDocument()
    expect(screen.getByText('reported')).toBeInTheDocument()
  })

  it('calls onTransition with the case id and chosen status', () => {
    const onTransition = vi.fn()
    render(
      <CaseQueueTable cases={CASES} organizationId="org-1" onTransition={onTransition} isTransitioning={false} />,
    )

    fireEvent.change(screen.getByLabelText('Change status for Unencrypted backup exposed'), {
      target: { value: 'investigating' },
    })

    expect(onTransition).toHaveBeenCalledWith('c1', 'investigating')
  })

  it('shows a notifications toggle for a breach case but not a grievance', () => {
    render(
      <CaseQueueTable
        cases={[...CASES, ...GRIEVANCE_CASES]}
        organizationId="org-1"
        onTransition={vi.fn()}
        isTransitioning={false}
      />,
    )

    expect(
      screen.getByLabelText('Toggle notifications for Unencrypted backup exposed'),
    ).toBeInTheDocument()
    expect(screen.queryByLabelText('Toggle notifications for Unwanted marketing')).not.toBeInTheDocument()
  })

  it('expands to show the notification checklist for a breach case', async () => {
    const client: ICasesAdminApiClient = {
      listCases: vi.fn(),
      reportCase: vi.fn(),
      transitionCase: vi.fn(),
      listObligations: vi.fn().mockResolvedValue([]),
      createObligation: vi.fn(),
      markObligationNotified: vi.fn(),
      markObligationNotRequired: vi.fn(),
    }

    renderWithQueryClient(
      <CaseQueueTable
        cases={CASES}
        organizationId="org-1"
        onTransition={vi.fn()}
        isTransitioning={false}
        client={client}
      />,
    )

    fireEvent.click(screen.getByLabelText('Toggle notifications for Unencrypted backup exposed'))

    await waitFor(() => expect(client.listObligations).toHaveBeenCalledWith('org-1', 'c1'))
    expect(await screen.findByText('Notification checklist')).toBeInTheDocument()
  })
})
