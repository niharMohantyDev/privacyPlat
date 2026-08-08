import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { NoticeDraftForm } from '../components/NoticeDraftForm'

describe('NoticeDraftForm', () => {
  it('submits the selected type, title, body, and change summary', () => {
    const onSubmit = vi.fn()
    render(<NoticeDraftForm onSubmit={onSubmit} isSubmitting={false} />)

    fireEvent.change(screen.getByLabelText('Notice type'), { target: { value: 'cookie_policy' } })
    fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'Cookie Policy' } })
    fireEvent.change(screen.getByLabelText('Body'), { target: { value: 'We use cookies.' } })
    fireEvent.change(screen.getByLabelText('Change summary (optional)'), {
      target: { value: 'Added new tracker' },
    })
    fireEvent.click(screen.getByText('Save Draft'))

    expect(onSubmit).toHaveBeenCalledWith({
      noticeType: 'cookie_policy',
      title: 'Cookie Policy',
      body: 'We use cookies.',
      changeSummary: 'Added new tracker',
    })
  })

  it('does not submit without a title', () => {
    const onSubmit = vi.fn()
    render(<NoticeDraftForm onSubmit={onSubmit} isSubmitting={false} />)

    fireEvent.click(screen.getByText('Save Draft'))
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('shows the error message when provided', () => {
    render(<NoticeDraftForm onSubmit={vi.fn()} isSubmitting={false} errorMessage="Boom" />)
    expect(screen.getByText('Boom')).toBeInTheDocument()
  })

  it('disables the submit button while submitting', () => {
    render(<NoticeDraftForm onSubmit={vi.fn()} isSubmitting />)
    expect(screen.getByText('Saving…')).toBeDisabled()
  })
})
