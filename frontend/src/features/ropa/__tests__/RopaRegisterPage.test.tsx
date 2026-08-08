import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { RopaRegisterPage } from '../components/RopaRegisterPage'
import type { IRopaApiClient, ProcessingActivity } from '../types'

const ACTIVITY: ProcessingActivity = {
  id: 'a1',
  title: 'Payroll processing',
  description: '',
  legal_basis: 'contract',
  risk_level: 'high',
  status: 'draft',
  data_categories: '',
  data_subject_categories: '',
  recipients: '',
  retention_period: '',
  security_measures: '',
  owner: 'HR',
  third_country_transfer: false,
  transfer_safeguards: '',
  purpose_id: null,
  workspace_id: null,
  review_due_at: '2099-01-01T00:00:00Z',
  reviewed_at: null,
}

function renderWithQueryClient(ui: React.ReactElement) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>)
}

describe('RopaRegisterPage', () => {
  it('loads and displays the register', async () => {
    const client: IRopaApiClient = {
      listActivities: vi.fn().mockResolvedValue([ACTIVITY]),
      createActivity: vi.fn(),
      transitionActivity: vi.fn(),
      markReviewed: vi.fn(),
    }

    renderWithQueryClient(<RopaRegisterPage organizationId="org-1" client={client} />)

    await screen.findByText('Payroll processing')
    expect(client.listActivities).toHaveBeenCalledWith('org-1', undefined)
  })

  it('adds a new activity via the inline form', async () => {
    const client: IRopaApiClient = {
      listActivities: vi.fn().mockResolvedValue([]),
      createActivity: vi.fn().mockResolvedValue({ ...ACTIVITY, id: 'a2', title: 'New activity' }),
      transitionActivity: vi.fn(),
      markReviewed: vi.fn(),
    }

    renderWithQueryClient(<RopaRegisterPage organizationId="org-1" client={client} />)
    await waitFor(() => expect(client.listActivities).toHaveBeenCalled())

    fireEvent.change(screen.getByLabelText('Processing activity'), { target: { value: 'New activity' } })
    fireEvent.click(screen.getByText('Add to Register'))

    await waitFor(() =>
      expect(client.createActivity).toHaveBeenCalledWith(
        'org-1',
        expect.objectContaining({ title: 'New activity' }),
      ),
    )
  })

  it('shows an error message when a transition is rejected', async () => {
    const client: IRopaApiClient = {
      listActivities: vi.fn().mockResolvedValue([ACTIVITY]),
      createActivity: vi.fn(),
      transitionActivity: vi.fn().mockRejectedValue(new Error('invalid transition')),
      markReviewed: vi.fn(),
    }

    renderWithQueryClient(<RopaRegisterPage organizationId="org-1" client={client} />)
    await screen.findByText('Payroll processing')

    fireEvent.change(screen.getByLabelText('Change status for Payroll processing'), {
      target: { value: 'archived' },
    })

    await waitFor(() =>
      expect(
        screen.getByText("That status change wasn't allowed from the activity's current state."),
      ).toBeInTheDocument(),
    )
  })

  it('marks an activity reviewed', async () => {
    const client: IRopaApiClient = {
      listActivities: vi.fn().mockResolvedValue([ACTIVITY]),
      createActivity: vi.fn(),
      transitionActivity: vi.fn(),
      markReviewed: vi.fn().mockResolvedValue({ ...ACTIVITY, reviewed_at: '2026-01-01T00:00:00Z' }),
    }

    renderWithQueryClient(<RopaRegisterPage organizationId="org-1" client={client} />)
    await screen.findByText('Payroll processing')

    fireEvent.click(screen.getByText('Mark reviewed'))

    await waitFor(() => expect(client.markReviewed).toHaveBeenCalledWith('org-1', 'a1'))
  })
})
