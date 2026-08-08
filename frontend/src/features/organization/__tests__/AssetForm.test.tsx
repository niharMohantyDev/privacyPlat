import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { AssetForm } from '../components/AssetForm'
import type { Asset, Workspace } from '../types'

const WORKSPACES: Workspace[] = [
  { id: 'w1', organization: 'org-1', name: 'Marketing Site', slug: 'marketing-site', created_at: '2026-01-01T00:00:00Z' },
]

const EXISTING: Asset = {
  id: 'a1',
  workspace: 'w1',
  asset_type: 'website',
  name: 'acme.com',
  identifier: 'acme.com',
  public_key: 'pk-123',
  is_active: true,
  created_at: '2026-01-01T00:00:00Z',
}

describe('AssetForm', () => {
  it('submits new-asset values, defaulting to the first workspace', () => {
    const onSubmit = vi.fn()
    render(
      <AssetForm editingAsset={null} workspaces={WORKSPACES} onSubmit={onSubmit} onCancel={vi.fn()} isSubmitting={false} />,
    )

    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'acme.com' } })
    fireEvent.click(screen.getByText('Add asset'))

    expect(onSubmit).toHaveBeenCalledWith({
      workspace: 'w1',
      asset_type: 'website',
      name: 'acme.com',
      identifier: '',
    })
  })

  it('disables submit and shows a hint when there are no workspaces', () => {
    render(<AssetForm editingAsset={null} workspaces={[]} onSubmit={vi.fn()} onCancel={vi.fn()} isSubmitting={false} />)
    expect(screen.getByText('Add asset')).toBeDisabled()
    expect(screen.getByText('Create a workspace first before adding assets.')).toBeInTheDocument()
  })

  it('pre-fills and disables the workspace field in edit mode', () => {
    render(
      <AssetForm editingAsset={EXISTING} workspaces={WORKSPACES} onSubmit={vi.fn()} onCancel={vi.fn()} isSubmitting={false} />,
    )
    expect(screen.getByLabelText('Workspace')).toBeDisabled()
    expect(screen.getByText('Save changes')).toBeInTheDocument()
  })
})
