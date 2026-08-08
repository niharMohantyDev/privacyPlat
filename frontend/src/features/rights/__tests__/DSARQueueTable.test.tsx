import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { DSARQueueTable } from '../components/DSARQueueTable'
import type { DSARRequest } from '../types'

const REQUESTS: DSARRequest[] = [
  {
    id: 'r1',
    subject_key: 'alice@example.com',
    request_type: 'access',
    status: 'submitted',
    region: 'DE',
    submitted_at: '2026-01-01T00:00:00Z',
    due_at: '2026-01-31T00:00:00Z',
    resolved_at: null,
    notes: '',
  },
]

describe('DSARQueueTable', () => {
  it('shows a message when there are no requests', () => {
    render(<DSARQueueTable requests={[]} onTransition={vi.fn()} isTransitioning={false} />)
    expect(screen.getByText('No requests yet.')).toBeInTheDocument()
  })

  it('renders each request with its subject and status', () => {
    render(<DSARQueueTable requests={REQUESTS} onTransition={vi.fn()} isTransitioning={false} />)
    expect(screen.getByText('alice@example.com')).toBeInTheDocument()
    expect(screen.getByText('submitted')).toBeInTheDocument()
  })

  it('calls onTransition with the request id and chosen status', () => {
    const onTransition = vi.fn()
    render(<DSARQueueTable requests={REQUESTS} onTransition={onTransition} isTransitioning={false} />)

    fireEvent.change(screen.getByLabelText('Change status for alice@example.com'), {
      target: { value: 'in_progress' },
    })

    expect(onTransition).toHaveBeenCalledWith('r1', 'in_progress')
  })
})
