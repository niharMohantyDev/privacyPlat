import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { DSARConfirmation } from '../components/DSARConfirmation'
import type { DSARRequest } from '../types'

const REQUEST: DSARRequest = {
  id: 'req-123',
  subject_key: 'alice@example.com',
  request_type: 'access',
  status: 'submitted',
  region: 'DE',
  submitted_at: '2026-01-01T00:00:00Z',
  due_at: '2026-01-31T00:00:00Z',
  resolved_at: null,
  notes: '',
}

describe('DSARConfirmation', () => {
  it('shows the reference id and status', () => {
    render(<DSARConfirmation request={REQUEST} onSubmitAnother={vi.fn()} />)
    expect(screen.getByText('req-123')).toBeInTheDocument()
    expect(screen.getByText('submitted')).toBeInTheDocument()
  })

  it('calls onSubmitAnother when clicked', () => {
    const onSubmitAnother = vi.fn()
    render(<DSARConfirmation request={REQUEST} onSubmitAnother={onSubmitAnother} />)
    fireEvent.click(screen.getByText('Submit another request'))
    expect(onSubmitAnother).toHaveBeenCalledOnce()
  })
})
