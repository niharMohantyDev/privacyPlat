import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { PurposeManagementPage } from '../components/PurposeManagementPage'
import type { AdminPurpose, IConsentAdminApiClient } from '../types'

const EXISTING: AdminPurpose = {
  id: 'p1',
  organization: 'org-1',
  code: 'analytics',
  name: 'Analytics',
  description: '',
  is_essential: false,
  created_at: '2026-01-01T00:00:00Z',
}

function renderWithQueryClient(ui: React.ReactElement) {
  const queryClient = new QueryClient()
  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>)
}

function fakeClient(overrides: Partial<IConsentAdminApiClient> = {}): IConsentAdminApiClient {
  return {
    listPurposes: vi.fn().mockResolvedValue([EXISTING]),
    createPurpose: vi.fn(),
    updatePurpose: vi.fn(),
    deletePurpose: vi.fn(),
    listRecords: vi.fn(),
    ...overrides,
  }
}

describe('PurposeManagementPage', () => {
  it('loads and displays existing purposes', async () => {
    const client = fakeClient()
    renderWithQueryClient(<PurposeManagementPage organizationId="org-1" client={client} />)

    await screen.findByText('analytics')
    expect(client.listPurposes).toHaveBeenCalledWith('org-1')
  })

  it('creates a new purpose from the form', async () => {
    const createPurpose = vi.fn().mockResolvedValue({ ...EXISTING, id: 'p2', code: 'marketing' })
    const client = fakeClient({ createPurpose })
    renderWithQueryClient(<PurposeManagementPage organizationId="org-1" client={client} />)
    await screen.findByText('analytics')

    fireEvent.change(screen.getByLabelText('Code'), { target: { value: 'marketing' } })
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Marketing' } })
    fireEvent.click(screen.getByText('Add purpose'))

    await waitFor(() =>
      expect(createPurpose).toHaveBeenCalledWith(
        expect.objectContaining({ organization: 'org-1', code: 'marketing' }),
      ),
    )
  })

  it('loads a purpose into the form for editing', async () => {
    const client = fakeClient()
    renderWithQueryClient(<PurposeManagementPage organizationId="org-1" client={client} />)
    await screen.findByText('analytics')

    fireEvent.click(screen.getByText('Edit'))

    expect(screen.getByLabelText('Code')).toHaveValue('analytics')
    expect(screen.getByText('Save changes')).toBeInTheDocument()
  })

  it('deletes a purpose', async () => {
    const deletePurpose = vi.fn().mockResolvedValue(undefined)
    const client = fakeClient({ deletePurpose })
    renderWithQueryClient(<PurposeManagementPage organizationId="org-1" client={client} />)
    await screen.findByText('analytics')

    fireEvent.click(screen.getByText('Delete'))

    await waitFor(() => expect(deletePurpose).toHaveBeenCalledWith('p1'))
  })
})
