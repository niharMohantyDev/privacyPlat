import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { ComplianceDashboardPage } from '../components/ComplianceDashboardPage'
import type { ComplianceDashboardSummary, IDashboardApiClient } from '../types'

const SUMMARY: ComplianceDashboardSummary = {
  dsar: { total: 10, open: 4, overdue: 1, resolved_on_time: 5, resolved_late: 1, on_time_rate: 83.3 },
  cases: { total: 3, open: 2, overdue: 1, breach_open: 1, grievance_open: 1 },
  consent: { total_purposes: 5, total_consent_records: 100, opt_in_rate: 72.5 },
  generated_at: '2026-01-01T00:00:00Z',
}

function renderWithQueryClient(ui: React.ReactElement) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>)
}

describe('ComplianceDashboardPage', () => {
  it('loads and displays metrics from all three pillars', async () => {
    const client: IDashboardApiClient = { getSummary: vi.fn().mockResolvedValue(SUMMARY) }

    renderWithQueryClient(<ComplianceDashboardPage organizationId="org-1" client={client} />)

    await screen.findByText('83.3%')
    expect(client.getSummary).toHaveBeenCalledWith('org-1')
    expect(screen.getByText('Data Subject Requests')).toBeInTheDocument()
    expect(screen.getByText('Breach & Grievance Cases')).toBeInTheDocument()
    expect(screen.getByText('Consent')).toBeInTheDocument()
    expect(screen.getByText('72.5%')).toBeInTheDocument()
  })

  it('shows a dash when a rate has no data yet', async () => {
    const emptySummary: ComplianceDashboardSummary = {
      ...SUMMARY,
      dsar: { ...SUMMARY.dsar, on_time_rate: null },
    }
    const client: IDashboardApiClient = { getSummary: vi.fn().mockResolvedValue(emptySummary) }

    renderWithQueryClient(<ComplianceDashboardPage organizationId="org-1" client={client} />)

    await screen.findByText('Data Subject Requests')
    expect(screen.getByText('—')).toBeInTheDocument()
  })

  it('shows an error message when loading fails', async () => {
    const client: IDashboardApiClient = { getSummary: vi.fn().mockRejectedValue(new Error('boom')) }

    renderWithQueryClient(<ComplianceDashboardPage organizationId="org-1" client={client} />)

    await screen.findByText('Failed to load the dashboard summary.')
  })
})
