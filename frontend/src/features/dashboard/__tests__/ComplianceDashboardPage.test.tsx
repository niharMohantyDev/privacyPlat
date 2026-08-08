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
  it('loads and displays KPI cards and chart sections from all three pillars', async () => {
    const client: IDashboardApiClient = { getSummary: vi.fn().mockResolvedValue(SUMMARY) }

    renderWithQueryClient(<ComplianceDashboardPage organizationId="org-1" client={client} />)

    await screen.findByText('DSAR Resolution')
    expect(client.getSummary).toHaveBeenCalledWith('org-1')
    expect(screen.getByText('Open Case Mix')).toBeInTheDocument()
    expect(screen.getByText('Consent Opt-In Rate')).toBeInTheDocument()
    expect(screen.getByText('Open Items: On Track vs Overdue')).toBeInTheDocument()
    // 83.3% appears twice by design: the KPI card and the donut center label.
    expect(screen.getAllByText('83.3%').length).toBeGreaterThan(0)
    expect(screen.getAllByText('72.5%').length).toBeGreaterThan(0)
  })

  it('shows a dash on the KPI card when a rate has no data yet', async () => {
    const emptySummary: ComplianceDashboardSummary = {
      ...SUMMARY,
      dsar: { ...SUMMARY.dsar, on_time_rate: null },
    }
    const client: IDashboardApiClient = { getSummary: vi.fn().mockResolvedValue(emptySummary) }

    renderWithQueryClient(<ComplianceDashboardPage organizationId="org-1" client={client} />)

    await screen.findByText('DSAR Resolution')
    expect(screen.getByText('—')).toBeInTheDocument()
  })

  it('shows an explicit empty state on a chart with no data', async () => {
    const emptySummary: ComplianceDashboardSummary = {
      ...SUMMARY,
      cases: { total: 0, open: 0, overdue: 0, breach_open: 0, grievance_open: 0 },
    }
    const client: IDashboardApiClient = { getSummary: vi.fn().mockResolvedValue(emptySummary) }

    renderWithQueryClient(<ComplianceDashboardPage organizationId="org-1" client={client} />)

    await screen.findByText('No open cases.')
  })

  it('shows an error message when loading fails', async () => {
    const client: IDashboardApiClient = { getSummary: vi.fn().mockRejectedValue(new Error('boom')) }

    renderWithQueryClient(<ComplianceDashboardPage organizationId="org-1" client={client} />)

    await screen.findByText('Failed to load the dashboard summary.')
  })
})
