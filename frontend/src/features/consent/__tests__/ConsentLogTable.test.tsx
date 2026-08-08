import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { ConsentLogTable } from '../components/ConsentLogTable'
import type { ConsentLogRecord } from '../types'

const RECORDS: ConsentLogRecord[] = [
  {
    id: 'r1',
    subject_key: 'alice@example.com',
    region: 'DE',
    framework: 'GDPR',
    version: 1,
    decisions: [
      { purpose_code: 'analytics', granted: true },
      { purpose_code: 'marketing', granted: false },
    ],
    created_at: '2026-01-01T00:00:00Z',
  },
]

describe('ConsentLogTable', () => {
  it('shows a message when there are no records', () => {
    render(<ConsentLogTable records={[]} />)
    expect(screen.getByText('No consent records yet.')).toBeInTheDocument()
  })

  it('renders subject, framework, version and decisions', () => {
    render(<ConsentLogTable records={RECORDS} />)
    expect(screen.getByText('alice@example.com')).toBeInTheDocument()
    expect(screen.getByText('GDPR')).toBeInTheDocument()
    expect(screen.getByText('v1')).toBeInTheDocument()
    expect(screen.getByText('analytics')).toBeInTheDocument()
    expect(screen.getByText('marketing')).toBeInTheDocument()
  })
})
