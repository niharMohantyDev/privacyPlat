import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { WorkspaceTable } from '../components/WorkspaceTable'
import type { Workspace } from '../types'

const WORKSPACES: Workspace[] = [
  { id: 'w1', organization: 'org-1', name: 'Marketing Site', slug: 'marketing-site', created_at: '2026-01-01T00:00:00Z' },
]

describe('WorkspaceTable', () => {
  it('shows a message when there are no workspaces', () => {
    render(<WorkspaceTable workspaces={[]} onEdit={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getByText('No workspaces yet.')).toBeInTheDocument()
  })

  it('renders each workspace', () => {
    render(<WorkspaceTable workspaces={WORKSPACES} onEdit={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getByText('Marketing Site')).toBeInTheDocument()
    expect(screen.getByText('marketing-site')).toBeInTheDocument()
  })

  it('calls onEdit with the workspace', () => {
    const onEdit = vi.fn()
    render(<WorkspaceTable workspaces={WORKSPACES} onEdit={onEdit} onDelete={vi.fn()} />)
    fireEvent.click(screen.getByText('Edit'))
    expect(onEdit).toHaveBeenCalledWith(WORKSPACES[0])
  })

  it('calls onDelete with the workspace id', () => {
    const onDelete = vi.fn()
    render(<WorkspaceTable workspaces={WORKSPACES} onEdit={vi.fn()} onDelete={onDelete} />)
    fireEvent.click(screen.getByText('Delete'))
    expect(onDelete).toHaveBeenCalledWith('w1')
  })
})
