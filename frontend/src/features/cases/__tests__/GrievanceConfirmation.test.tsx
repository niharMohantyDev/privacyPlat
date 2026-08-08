import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { GrievanceConfirmation } from '../components/GrievanceConfirmation'
import type { Case } from '../types'

const CASE_RECORD: Case = {
  id: 'case-123',
  case_type: 'grievance',
  status: 'reported',
  title: 'Unwanted marketing',
  description: '',
  reported_by: 'alice@example.com',
  region: 'IN',
  severity: '',
  reported_at: '2026-01-01T00:00:00Z',
  due_at: '2026-01-31T00:00:00Z',
  resolved_at: null,
  notes: '',
}

describe('GrievanceConfirmation', () => {
  it('shows the reference id and status', () => {
    render(<GrievanceConfirmation caseRecord={CASE_RECORD} onSubmitAnother={vi.fn()} />)
    expect(screen.getByText('case-123')).toBeInTheDocument()
    expect(screen.getByText('reported')).toBeInTheDocument()
  })

  it('calls onSubmitAnother when clicked', () => {
    const onSubmitAnother = vi.fn()
    render(<GrievanceConfirmation caseRecord={CASE_RECORD} onSubmitAnother={onSubmitAnother} />)
    fireEvent.click(screen.getByText('Submit another grievance'))
    expect(onSubmitAnother).toHaveBeenCalledOnce()
  })
})
