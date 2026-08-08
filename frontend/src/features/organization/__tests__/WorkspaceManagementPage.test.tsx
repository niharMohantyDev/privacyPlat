import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { WorkspaceManagementPage } from '../components/WorkspaceManagementPage'
import type { ICoreAdminApiClient, Workspace } from '../types'

const EXISTING: Workspace = {
  id: 'w1',
  organization: 'org-1',
  name: 'Marketing Site',
  slug: 'marketing-site',
  created_at: '2026-01-01T00:00:00Z',
}

function renderWithQueryClient(ui: React.ReactElement) {
  const queryClient = new QueryClient()
  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>)
}

function fakeClient(overrides: Partial<ICoreAdminApiClient> = {}): ICoreAdminApiClient {
  return {
    listWorkspaces: vi.fn().mockResolvedValue([EXISTING]),
    createWorkspace: vi.fn(),
    updateWorkspace: vi.fn(),
    deleteWorkspace: vi.fn(),
    listAssets: vi.fn(),
    createAsset: vi.fn(),
    updateAsset: vi.fn(),
    deleteAsset: vi.fn(),
    ...overrides,
  }
}

describe('WorkspaceManagementPage', () => {
  it('loads and displays existing workspaces', async () => {
    const client = fakeClient()
    renderWithQueryClient(<WorkspaceManagementPage organizationId="org-1" client={client} />)

    await screen.findByText('Marketing Site')
    expect(client.listWorkspaces).toHaveBeenCalledWith('org-1')
  })

  it('creates a new workspace from the form', async () => {
    const createWorkspace = vi.fn().mockResolvedValue({ ...EXISTING, id: 'w2', name: 'Mobile' })
    const client = fakeClient({ createWorkspace })
    renderWithQueryClient(<WorkspaceManagementPage organizationId="org-1" client={client} />)
    await screen.findByText('Marketing Site')

    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Mobile' } })
    fireEvent.change(screen.getByLabelText('Slug'), { target: { value: 'mobile' } })
    fireEvent.click(screen.getByText('Add workspace'))

    await waitFor(() =>
      expect(createWorkspace).toHaveBeenCalledWith(
        expect.objectContaining({ organization: 'org-1', name: 'Mobile', slug: 'mobile' }),
      ),
    )
  })

  it('deletes a workspace', async () => {
    const deleteWorkspace = vi.fn().mockResolvedValue(undefined)
    const client = fakeClient({ deleteWorkspace })
    renderWithQueryClient(<WorkspaceManagementPage organizationId="org-1" client={client} />)
    await screen.findByText('Marketing Site')

    fireEvent.click(screen.getByText('Delete'))

    await waitFor(() => expect(deleteWorkspace).toHaveBeenCalledWith('w1'))
  })
})
