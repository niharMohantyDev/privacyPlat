import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { RopaActivityForm } from '../components/RopaActivityForm'

describe('RopaActivityForm', () => {
  it('submits the entered title, selected legal basis/risk, and owner', () => {
    const onSubmit = vi.fn()
    render(<RopaActivityForm onSubmit={onSubmit} isSubmitting={false} />)

    fireEvent.change(screen.getByLabelText('Processing activity'), {
      target: { value: 'Payroll processing' },
    })
    fireEvent.change(screen.getByLabelText('Legal basis'), { target: { value: 'legal_obligation' } })
    fireEvent.change(screen.getByLabelText('Risk level'), { target: { value: 'high' } })
    fireEvent.change(screen.getByLabelText('Owner'), { target: { value: 'HR' } })
    fireEvent.click(screen.getByText('Add to Register'))

    expect(onSubmit).toHaveBeenCalledWith({
      title: 'Payroll processing',
      legalBasis: 'legal_obligation',
      riskLevel: 'high',
      owner: 'HR',
    })
  })

  it('does not submit without a title', () => {
    const onSubmit = vi.fn()
    render(<RopaActivityForm onSubmit={onSubmit} isSubmitting={false} />)

    fireEvent.click(screen.getByText('Add to Register'))
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('shows the error message when provided', () => {
    render(<RopaActivityForm onSubmit={vi.fn()} isSubmitting={false} errorMessage="Boom" />)
    expect(screen.getByText('Boom')).toBeInTheDocument()
  })

  it('disables the submit button while submitting', () => {
    render(<RopaActivityForm onSubmit={vi.fn()} isSubmitting />)
    expect(screen.getByText('Adding…')).toBeDisabled()
  })
})
