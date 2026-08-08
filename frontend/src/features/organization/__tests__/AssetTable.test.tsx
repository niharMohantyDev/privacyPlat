import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { AssetTable } from '../components/AssetTable'
import type { Asset } from '../types'

const ASSETS: Asset[] = [
  {
    id: 'a1',
    workspace: 'w1',
    asset_type: 'website',
    name: 'acme.com',
    identifier: 'acme.com',
    public_key: 'pk-123',
    is_active: true,
    created_at: '2026-01-01T00:00:00Z',
  },
]

describe('AssetTable', () => {
  it('shows a message when there are no assets', () => {
    render(<AssetTable assets={[]} onEdit={vi.fn()} onDelete={vi.fn()} onToggleActive={vi.fn()} />)
    expect(screen.getByText('No assets yet.')).toBeInTheDocument()
  })

  it('renders the asset name and public key', () => {
    render(<AssetTable assets={ASSETS} onEdit={vi.fn()} onDelete={vi.fn()} onToggleActive={vi.fn()} />)
    expect(screen.getByText('acme.com')).toBeInTheDocument()
    expect(screen.getByText('pk-123')).toBeInTheDocument()
    expect(screen.getByText('Active')).toBeInTheDocument()
  })

  it('calls onToggleActive with the asset when the status badge is clicked', () => {
    const onToggleActive = vi.fn()
    render(<AssetTable assets={ASSETS} onEdit={vi.fn()} onDelete={vi.fn()} onToggleActive={onToggleActive} />)
    fireEvent.click(screen.getByText('Active'))
    expect(onToggleActive).toHaveBeenCalledWith(ASSETS[0])
  })

  it('calls onDelete with the asset id', () => {
    const onDelete = vi.fn()
    render(<AssetTable assets={ASSETS} onEdit={vi.fn()} onDelete={onDelete} onToggleActive={vi.fn()} />)
    fireEvent.click(screen.getByText('Delete'))
    expect(onDelete).toHaveBeenCalledWith('a1')
  })
})
