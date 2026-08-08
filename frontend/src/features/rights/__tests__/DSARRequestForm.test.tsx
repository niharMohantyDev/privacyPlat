import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { DSARRequestForm } from '../components/DSARRequestForm'

describe('DSARRequestForm', () => {
  it('submits the entered email and selected request type', () => {
    const onSubmit = vi.fn()
    render(<DSARRequestForm onSubmit={onSubmit} isSubmitting={false} />)

    fireEvent.change(screen.getByLabelText('Your email address'), {
      target: { value: 'alice@example.com' },
    })
    fireEvent.change(screen.getByLabelText('What would you like to do?'), {
      target: { value: 'deletion' },
    })
    fireEvent.click(screen.getByText('Submit Request'))

    expect(onSubmit).toHaveBeenCalledWith({
      subjectKey: 'alice@example.com',
      requestType: 'deletion',
    })
  })

  it('does not submit without an email', () => {
    const onSubmit = vi.fn()
    render(<DSARRequestForm onSubmit={onSubmit} isSubmitting={false} />)

    fireEvent.click(screen.getByText('Submit Request'))
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('shows the error message when provided', () => {
    render(<DSARRequestForm onSubmit={vi.fn()} isSubmitting={false} errorMessage="Boom" />)
    expect(screen.getByText('Boom')).toBeInTheDocument()
  })

  it('disables the submit button while submitting', () => {
    render(<DSARRequestForm onSubmit={vi.fn()} isSubmitting />)
    expect(screen.getByText('Submitting…')).toBeDisabled()
  })
})
