import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { AssetManagementPage } from '../components/AssetManagementPage'
import type { Asset, ICoreAdminApiClient, Workspace } from '../types'

const WORKSPACE: Workspace = {
  id: 'w1',
  organization: 'org-1',
  name: 'Marketing Site',
  slug: 'marketing-site',
  created_at: '2026-01-01T00:00:00Z',
}

const ASSET: Asset = {
  id: 'a1',
  workspace: 'w1',
  asset_type: 'website',
  name: 'acme.com',
  identifier: 'acme.com',
  public_key: 'pk-123',
  is_active: true,
  created_at: '2026-01-01T00:00:00Z',
}

function renderWithQueryClient(ui: React.ReactElement) {
  const queryClient = new QueryClient()
  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>)
}

function fakeClient(overrides: Partial<ICoreAdminApiClient> = {}): ICoreAdminApiClient {
  return {
    listWorkspaces: vi.fn().mockResolvedValue([WORKSPACE]),
    createWorkspace: vi.fn(),
    updateWorkspace: vi.fn(),
    deleteWorkspace: vi.fn(),
    listAssets: vi.fn().mockResolvedValue([ASSET]),
    createAsset: vi.fn(),
    updateAsset: vi.fn(),
    deleteAsset: vi.fn(),
    ...overrides,
  }
}

describe('AssetManagementPage', () => {
  it('loads and displays existing assets', async () => {
    const client = fakeClient()
    renderWithQueryClient(<AssetManagementPage organizationId="org-1" client={client} />)

    await screen.findByText('acme.com')
    expect(client.listAssets).toHaveBeenCalledWith('org-1')
  })

  it('toggling the status badge calls updateAsset with the flipped is_active', async () => {
    const updateAsset = vi.fn().mockResolvedValue({ ...ASSET, is_active: false })
    const client = fakeClient({ updateAsset })
    renderWithQueryClient(<AssetManagementPage organizationId="org-1" client={client} />)
    await screen.findByText('acme.com')

    fireEvent.click(screen.getByText('Active'))

    await waitFor(() => expect(updateAsset).toHaveBeenCalledWith('a1', { is_active: false }))
  })

  it('deletes an asset', async () => {
    const deleteAsset = vi.fn().mockResolvedValue(undefined)
    const client = fakeClient({ deleteAsset })
    renderWithQueryClient(<AssetManagementPage organizationId="org-1" client={client} />)
    await screen.findByText('acme.com')

    fireEvent.click(screen.getByText('Delete'))

    await waitFor(() => expect(deleteAsset).toHaveBeenCalledWith('a1'))
  })
})
