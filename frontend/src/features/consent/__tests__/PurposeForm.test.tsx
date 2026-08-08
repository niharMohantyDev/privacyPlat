import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { PurposeForm } from '../components/PurposeForm'
import type { AdminPurpose } from '../types'

const EXISTING: AdminPurpose = {
  id: 'p1',
  organization: 'org-1',
  code: 'analytics',
  name: 'Analytics',
  description: 'Helps us understand usage.',
  is_essential: false,
  created_at: '2026-01-01T00:00:00Z',
}

describe('PurposeForm', () => {
  it('submits new-purpose values in create mode', () => {
    const onSubmit = vi.fn()
    render(<PurposeForm editingPurpose={null} onSubmit={onSubmit} onCancel={vi.fn()} isSubmitting={false} />)

    fireEvent.change(screen.getByLabelText('Code'), { target: { value: 'marketing' } })
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Marketing' } })
    fireEvent.click(screen.getByText('Add purpose'))

    expect(onSubmit).toHaveBeenCalledWith({
      code: 'marketing',
      name: 'Marketing',
      description: '',
      is_essential: false,
    })
  })

  it('pre-fills and disables the code field in edit mode', () => {
    render(<PurposeForm editingPurpose={EXISTING} onSubmit={vi.fn()} onCancel={vi.fn()} isSubmitting={false} />)

    expect(screen.getByLabelText('Code')).toHaveValue('analytics')
    expect(screen.getByLabelText('Code')).toBeDisabled()
    expect(screen.getByText('Save changes')).toBeInTheDocument()
  })

  it('calls onCancel when Cancel is clicked in edit mode', () => {
    const onCancel = vi.fn()
    render(<PurposeForm editingPurpose={EXISTING} onSubmit={vi.fn()} onCancel={onCancel} isSubmitting={false} />)

    fireEvent.click(screen.getByText('Cancel'))
    expect(onCancel).toHaveBeenCalledOnce()
  })

  it('does not submit without a code and name', () => {
    const onSubmit = vi.fn()
    render(<PurposeForm editingPurpose={null} onSubmit={onSubmit} onCancel={vi.fn()} isSubmitting={false} />)
    fireEvent.click(screen.getByText('Add purpose'))
    expect(onSubmit).not.toHaveBeenCalled()
  })
})
