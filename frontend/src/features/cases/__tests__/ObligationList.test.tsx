import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { ObligationList } from '../components/ObligationList'
import type { BreachNotificationObligation } from '../types'

const PENDING: BreachNotificationObligation = {
  id: 'o1',
  case_id: 'c1',
  recipient_type: 'regulator',
  recipient_identifier: '',
  status: 'pending',
  due_at: '2099-01-01T00:00:00Z',
  notified_at: null,
  notes: '',
}

describe('ObligationList', () => {
  it('shows a message when there are no obligations', () => {
    render(
      <ObligationList
        obligations={[]}
        onMarkNotified={vi.fn()}
        onMarkNotRequired={vi.fn()}
        isUpdating={false}
      />,
    )
    expect(screen.getByText('No notification recipients tracked yet.')).toBeInTheDocument()
  })

  it('renders a pending obligation with its recipient label and status', () => {
    render(
      <ObligationList
        obligations={[PENDING]}
        onMarkNotified={vi.fn()}
        onMarkNotRequired={vi.fn()}
        isUpdating={false}
      />,
    )
    expect(screen.getByText('Regulator')).toBeInTheDocument()
    expect(screen.getByText('pending')).toBeInTheDocument()
  })

  it('flags a past-due pending obligation as overdue', () => {
    render(
      <ObligationList
        obligations={[{ ...PENDING, due_at: '2020-01-01T00:00:00Z' }]}
        onMarkNotified={vi.fn()}
        onMarkNotRequired={vi.fn()}
        isUpdating={false}
      />,
    )
    expect(screen.getByText(/\(overdue\)/)).toBeInTheDocument()
  })

  it('calls onMarkNotified with the obligation id', () => {
    const onMarkNotified = vi.fn()
    render(
      <ObligationList
        obligations={[PENDING]}
        onMarkNotified={onMarkNotified}
        onMarkNotRequired={vi.fn()}
        isUpdating={false}
      />,
    )
    fireEvent.click(screen.getByText('Mark notified'))
    expect(onMarkNotified).toHaveBeenCalledWith('o1')
  })

  it('calls onMarkNotRequired with the obligation id', () => {
    const onMarkNotRequired = vi.fn()
    render(
      <ObligationList
        obligations={[PENDING]}
        onMarkNotified={vi.fn()}
        onMarkNotRequired={onMarkNotRequired}
        isUpdating={false}
      />,
    )
    fireEvent.click(screen.getByText('Not required'))
    expect(onMarkNotRequired).toHaveBeenCalledWith('o1')
  })

  it('does not show action buttons for a notified obligation', () => {
    render(
      <ObligationList
        obligations={[{ ...PENDING, status: 'notified', notified_at: '2026-01-01T00:00:00Z' }]}
        onMarkNotified={vi.fn()}
        onMarkNotRequired={vi.fn()}
        isUpdating={false}
      />,
    )
    expect(screen.queryByText('Mark notified')).not.toBeInTheDocument()
    expect(screen.queryByText('Not required')).not.toBeInTheDocument()
  })
})
