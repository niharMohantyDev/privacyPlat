import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { CaseQueueTable } from '../components/CaseQueueTable'
import type { Case } from '../types'

const CASES: Case[] = [
  {
    id: 'c1',
    case_type: 'breach',
    status: 'reported',
    title: 'Unencrypted backup exposed',
    description: '',
    reported_by: '',
    region: 'DE',
    severity: 'high',
    reported_at: '2026-01-01T00:00:00Z',
    due_at: '2026-01-04T00:00:00Z',
    resolved_at: null,
    notes: '',
  },
]

describe('CaseQueueTable', () => {
  it('shows a message when there are no cases', () => {
    render(<CaseQueueTable cases={[]} onTransition={vi.fn()} isTransitioning={false} />)
    expect(screen.getByText('No cases yet.')).toBeInTheDocument()
  })

  it('renders each case with its title, type, and status', () => {
    render(<CaseQueueTable cases={CASES} onTransition={vi.fn()} isTransitioning={false} />)
    expect(screen.getByText('Unencrypted backup exposed')).toBeInTheDocument()
    expect(screen.getByText('breach')).toBeInTheDocument()
    expect(screen.getByText('reported')).toBeInTheDocument()
  })

  it('calls onTransition with the case id and chosen status', () => {
    const onTransition = vi.fn()
    render(<CaseQueueTable cases={CASES} onTransition={onTransition} isTransitioning={false} />)

    fireEvent.change(screen.getByLabelText('Change status for Unencrypted backup exposed'), {
      target: { value: 'investigating' },
    })

    expect(onTransition).toHaveBeenCalledWith('c1', 'investigating')
  })
})
