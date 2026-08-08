import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { WorkspaceForm } from '../components/WorkspaceForm'
import type { Workspace } from '../types'

const EXISTING: Workspace = {
  id: 'w1',
  organization: 'org-1',
  name: 'Marketing Site',
  slug: 'marketing-site',
  created_at: '2026-01-01T00:00:00Z',
}

describe('WorkspaceForm', () => {
  it('submits new-workspace values in create mode', () => {
    const onSubmit = vi.fn()
    render(<WorkspaceForm editingWorkspace={null} onSubmit={onSubmit} onCancel={vi.fn()} isSubmitting={false} />)

    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Mobile App' } })
    fireEvent.change(screen.getByLabelText('Slug'), { target: { value: 'mobile-app' } })
    fireEvent.click(screen.getByText('Add workspace'))

    expect(onSubmit).toHaveBeenCalledWith({ name: 'Mobile App', slug: 'mobile-app' })
  })

  it('pre-fills and disables the slug field in edit mode', () => {
    render(<WorkspaceForm editingWorkspace={EXISTING} onSubmit={vi.fn()} onCancel={vi.fn()} isSubmitting={false} />)

    expect(screen.getByLabelText('Slug')).toHaveValue('marketing-site')
    expect(screen.getByLabelText('Slug')).toBeDisabled()
    expect(screen.getByText('Save changes')).toBeInTheDocument()
  })

  it('does not submit without a name and slug', () => {
    const onSubmit = vi.fn()
    render(<WorkspaceForm editingWorkspace={null} onSubmit={onSubmit} onCancel={vi.fn()} isSubmitting={false} />)
    fireEvent.click(screen.getByText('Add workspace'))
    expect(onSubmit).not.toHaveBeenCalled()
  })
})
