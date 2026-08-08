import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { GrievanceForm } from '../components/GrievanceForm'

describe('GrievanceForm', () => {
  it('submits the entered email, title, and description', () => {
    const onSubmit = vi.fn()
    render(<GrievanceForm onSubmit={onSubmit} isSubmitting={false} />)

    fireEvent.change(screen.getByLabelText('Your email address'), {
      target: { value: 'alice@example.com' },
    })
    fireEvent.change(screen.getByLabelText("What's the issue?"), {
      target: { value: 'Unwanted marketing' },
    })
    fireEvent.change(screen.getByLabelText('Details (optional)'), {
      target: { value: 'Too many emails' },
    })
    fireEvent.click(screen.getByText('Submit Grievance'))

    expect(onSubmit).toHaveBeenCalledWith({
      title: 'Unwanted marketing',
      description: 'Too many emails',
      reportedBy: 'alice@example.com',
    })
  })

  it('does not submit without an email or title', () => {
    const onSubmit = vi.fn()
    render(<GrievanceForm onSubmit={onSubmit} isSubmitting={false} />)

    fireEvent.click(screen.getByText('Submit Grievance'))
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('shows the error message when provided', () => {
    render(<GrievanceForm onSubmit={vi.fn()} isSubmitting={false} errorMessage="Boom" />)
    expect(screen.getByText('Boom')).toBeInTheDocument()
  })

  it('disables the submit button while submitting', () => {
    render(<GrievanceForm onSubmit={vi.fn()} isSubmitting />)
    expect(screen.getByText('Submitting…')).toBeDisabled()
  })
})
