import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { CaseReportForm } from '../components/CaseReportForm'

describe('CaseReportForm', () => {
  it('submits the selected type, entered title, and selected severity', () => {
    const onSubmit = vi.fn()
    render(<CaseReportForm onSubmit={onSubmit} isSubmitting={false} />)

    fireEvent.change(screen.getByLabelText('Type'), { target: { value: 'grievance' } })
    fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'Unwanted marketing' } })
    fireEvent.change(screen.getByLabelText('Severity'), { target: { value: 'low' } })
    fireEvent.click(screen.getByText('Report Case'))

    expect(onSubmit).toHaveBeenCalledWith({
      caseType: 'grievance',
      title: 'Unwanted marketing',
      severity: 'low',
    })
  })

  it('does not submit without a title', () => {
    const onSubmit = vi.fn()
    render(<CaseReportForm onSubmit={onSubmit} isSubmitting={false} />)

    fireEvent.click(screen.getByText('Report Case'))
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('shows the error message when provided', () => {
    render(<CaseReportForm onSubmit={vi.fn()} isSubmitting={false} errorMessage="Boom" />)
    expect(screen.getByText('Boom')).toBeInTheDocument()
  })

  it('disables the submit button while submitting', () => {
    render(<CaseReportForm onSubmit={vi.fn()} isSubmitting />)
    expect(screen.getByText('Reporting…')).toBeDisabled()
  })
})
