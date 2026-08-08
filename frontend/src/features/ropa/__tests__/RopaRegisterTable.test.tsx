import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { RopaRegisterTable } from '../components/RopaRegisterTable'
import type { ProcessingActivity } from '../types'

const BASE_ACTIVITY: ProcessingActivity = {
  id: 'a1',
  title: 'Payroll processing',
  description: '',
  legal_basis: 'contract',
  risk_level: 'high',
  status: 'draft',
  data_categories: '',
  data_subject_categories: '',
  recipients: '',
  retention_period: '',
  security_measures: '',
  owner: 'HR',
  third_country_transfer: false,
  transfer_safeguards: '',
  purpose_id: null,
  workspace_id: null,
  review_due_at: '2099-01-01T00:00:00Z',
  reviewed_at: null,
}

describe('RopaRegisterTable', () => {
  it('shows a message when there are no activities', () => {
    render(
      <RopaRegisterTable
        activities={[]}
        onTransition={vi.fn()}
        onMarkReviewed={vi.fn()}
        isTransitioning={false}
        isMarkingReviewed={false}
      />,
    )
    expect(screen.getByText('No processing activities recorded yet.')).toBeInTheDocument()
  })

  it('renders each activity with its title, legal basis, and risk', () => {
    render(
      <RopaRegisterTable
        activities={[BASE_ACTIVITY]}
        onTransition={vi.fn()}
        onMarkReviewed={vi.fn()}
        isTransitioning={false}
        isMarkingReviewed={false}
      />,
    )
    expect(screen.getByText('Payroll processing')).toBeInTheDocument()
    expect(screen.getByText('contract')).toBeInTheDocument()
    expect(screen.getByText('high')).toBeInTheDocument()
  })

  it('flags a past-due review date as overdue', () => {
    render(
      <RopaRegisterTable
        activities={[{ ...BASE_ACTIVITY, review_due_at: '2020-01-01T00:00:00Z' }]}
        onTransition={vi.fn()}
        onMarkReviewed={vi.fn()}
        isTransitioning={false}
        isMarkingReviewed={false}
      />,
    )
    expect(screen.getByText(/\(overdue\)/)).toBeInTheDocument()
  })

  it('calls onTransition with the activity id and chosen status', () => {
    const onTransition = vi.fn()
    render(
      <RopaRegisterTable
        activities={[BASE_ACTIVITY]}
        onTransition={onTransition}
        onMarkReviewed={vi.fn()}
        isTransitioning={false}
        isMarkingReviewed={false}
      />,
    )

    fireEvent.change(screen.getByLabelText('Change status for Payroll processing'), {
      target: { value: 'active' },
    })

    expect(onTransition).toHaveBeenCalledWith('a1', 'active')
  })

  it('calls onMarkReviewed with the activity id', () => {
    const onMarkReviewed = vi.fn()
    render(
      <RopaRegisterTable
        activities={[BASE_ACTIVITY]}
        onTransition={vi.fn()}
        onMarkReviewed={onMarkReviewed}
        isTransitioning={false}
        isMarkingReviewed={false}
      />,
    )

    fireEvent.click(screen.getByText('Mark reviewed'))
    expect(onMarkReviewed).toHaveBeenCalledWith('a1')
  })
})
