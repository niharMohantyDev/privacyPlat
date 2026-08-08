import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { NoticeTable } from '../components/NoticeTable'
import type { PrivacyNotice } from '../types'

const DRAFT: PrivacyNotice = {
  id: 'n1',
  notice_type: 'privacy_policy',
  title: 'Our Privacy Policy',
  body: '',
  version: 1,
  status: 'draft',
  change_summary: '',
  published_at: null,
  review_due_at: null,
}

describe('NoticeTable', () => {
  it('shows a message when there are no notices', () => {
    render(<NoticeTable notices={[]} onPublish={vi.fn()} onArchive={vi.fn()} isUpdating={false} />)
    expect(screen.getByText('No notices yet.')).toBeInTheDocument()
  })

  it('renders each notice with its type, title, version, and status', () => {
    render(<NoticeTable notices={[DRAFT]} onPublish={vi.fn()} onArchive={vi.fn()} isUpdating={false} />)
    expect(screen.getByText('Our Privacy Policy')).toBeInTheDocument()
    expect(screen.getByText('v1')).toBeInTheDocument()
    expect(screen.getByText('draft')).toBeInTheDocument()
  })

  it('shows a Publish action for a draft and calls onPublish', () => {
    const onPublish = vi.fn()
    render(<NoticeTable notices={[DRAFT]} onPublish={onPublish} onArchive={vi.fn()} isUpdating={false} />)
    fireEvent.click(screen.getByText('Publish'))
    expect(onPublish).toHaveBeenCalledWith('n1')
  })

  it('does not show a Publish action for an already-published notice', () => {
    render(
      <NoticeTable
        notices={[{ ...DRAFT, status: 'published' }]}
        onPublish={vi.fn()}
        onArchive={vi.fn()}
        isUpdating={false}
      />,
    )
    expect(screen.queryByText('Publish')).not.toBeInTheDocument()
  })

  it('calls onArchive with the notice id', () => {
    const onArchive = vi.fn()
    render(<NoticeTable notices={[DRAFT]} onPublish={vi.fn()} onArchive={onArchive} isUpdating={false} />)
    fireEvent.click(screen.getByText('Archive'))
    expect(onArchive).toHaveBeenCalledWith('n1')
  })

  it('flags a past-due review date as overdue', () => {
    render(
      <NoticeTable
        notices={[{ ...DRAFT, status: 'published', review_due_at: '2020-01-01T00:00:00Z' }]}
        onPublish={vi.fn()}
        onArchive={vi.fn()}
        isUpdating={false}
      />,
    )
    expect(screen.getByText(/\(overdue\)/)).toBeInTheDocument()
  })
})
