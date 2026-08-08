import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { PurposeTable } from '../components/PurposeTable'
import type { AdminPurpose } from '../types'

const PURPOSES: AdminPurpose[] = [
  {
    id: 'p1',
    organization: 'org-1',
    code: 'analytics',
    name: 'Analytics',
    description: '',
    is_essential: false,
    created_at: '2026-01-01T00:00:00Z',
  },
]

describe('PurposeTable', () => {
  it('shows a message when there are no purposes', () => {
    render(<PurposeTable purposes={[]} onEdit={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getByText('No purposes yet.')).toBeInTheDocument()
  })

  it('renders each purpose', () => {
    render(<PurposeTable purposes={PURPOSES} onEdit={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getByText('analytics')).toBeInTheDocument()
    expect(screen.getByText('Analytics')).toBeInTheDocument()
  })

  it('calls onEdit with the purpose', () => {
    const onEdit = vi.fn()
    render(<PurposeTable purposes={PURPOSES} onEdit={onEdit} onDelete={vi.fn()} />)
    fireEvent.click(screen.getByText('Edit'))
    expect(onEdit).toHaveBeenCalledWith(PURPOSES[0])
  })

  it('calls onDelete with the purpose id', () => {
    const onDelete = vi.fn()
    render(<PurposeTable purposes={PURPOSES} onEdit={vi.fn()} onDelete={onDelete} />)
    fireEvent.click(screen.getByText('Delete'))
    expect(onDelete).toHaveBeenCalledWith('p1')
  })
})
