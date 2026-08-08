import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { BreachNotificationPanel } from '../components/BreachNotificationPanel'
import type { BreachNotificationObligation, ICasesAdminApiClient } from '../types'

const OBLIGATION: BreachNotificationObligation = {
  id: 'o1',
  case_id: 'c1',
  recipient_type: 'regulator',
  recipient_identifier: '',
  status: 'pending',
  due_at: '2099-01-01T00:00:00Z',
  notified_at: null,
  notes: '',
}

function fakeClient(overrides: Partial<ICasesAdminApiClient> = {}): ICasesAdminApiClient {
  return {
    listCases: vi.fn(),
    reportCase: vi.fn(),
    transitionCase: vi.fn(),
    listObligations: vi.fn().mockResolvedValue([]),
    createObligation: vi.fn(),
    markObligationNotified: vi.fn(),
    markObligationNotRequired: vi.fn(),
    ...overrides,
  }
}

function renderWithQueryClient(ui: React.ReactElement) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>)
}

describe('BreachNotificationPanel', () => {
  it('loads and displays the checklist for the case', async () => {
    const client = fakeClient({ listObligations: vi.fn().mockResolvedValue([OBLIGATION]) })

    renderWithQueryClient(<BreachNotificationPanel organizationId="org-1" caseId="c1" client={client} />)

    await screen.findByText('Mark notified')
    expect(client.listObligations).toHaveBeenCalledWith('org-1', 'c1')
  })

  it('adds a recipient via the inline form', async () => {
    const client = fakeClient({
      createObligation: vi.fn().mockResolvedValue({ ...OBLIGATION, id: 'o2', recipient_type: 'vendor' }),
    })

    renderWithQueryClient(<BreachNotificationPanel organizationId="org-1" caseId="c1" client={client} />)
    await waitFor(() => expect(client.listObligations).toHaveBeenCalled())

    fireEvent.click(screen.getByText('Add recipient'))

    await waitFor(() =>
      expect(client.createObligation).toHaveBeenCalledWith(
        'org-1',
        'c1',
        expect.objectContaining({ recipientType: 'vendor' }),
      ),
    )
  })

  it('marks a recipient notified', async () => {
    const client = fakeClient({
      listObligations: vi.fn().mockResolvedValue([OBLIGATION]),
      markObligationNotified: vi.fn().mockResolvedValue({ ...OBLIGATION, status: 'notified' }),
    })

    renderWithQueryClient(<BreachNotificationPanel organizationId="org-1" caseId="c1" client={client} />)

    fireEvent.click(await screen.findByText('Mark notified'))

    await waitFor(() => expect(client.markObligationNotified).toHaveBeenCalledWith('org-1', 'o1'))
  })

  it('shows an error message when loading the checklist fails', async () => {
    const client = fakeClient({ listObligations: vi.fn().mockRejectedValue(new Error('boom')) })

    renderWithQueryClient(<BreachNotificationPanel organizationId="org-1" caseId="c1" client={client} />)

    await screen.findByText('Failed to load the notification checklist.')
  })
})
