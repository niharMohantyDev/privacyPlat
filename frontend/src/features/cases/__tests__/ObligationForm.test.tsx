import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { ObligationForm } from '../components/ObligationForm'

describe('ObligationForm', () => {
  it('submits the selected recipient type and entered identifier', () => {
    const onSubmit = vi.fn()
    render(<ObligationForm onSubmit={onSubmit} isSubmitting={false} />)

    fireEvent.change(screen.getByLabelText('Recipient'), { target: { value: 'regulator' } })
    fireEvent.change(screen.getByLabelText('Name (optional)'), { target: { value: 'ICO' } })
    fireEvent.click(screen.getByText('Add recipient'))

    expect(onSubmit).toHaveBeenCalledWith({ recipientType: 'regulator', recipientIdentifier: 'ICO' })
  })

  it('allows submitting without a name', () => {
    const onSubmit = vi.fn()
    render(<ObligationForm onSubmit={onSubmit} isSubmitting={false} />)

    fireEvent.click(screen.getByText('Add recipient'))

    expect(onSubmit).toHaveBeenCalledWith({ recipientType: 'vendor', recipientIdentifier: '' })
  })

  it('shows the error message when provided', () => {
    render(<ObligationForm onSubmit={vi.fn()} isSubmitting={false} errorMessage="Boom" />)
    expect(screen.getByText('Boom')).toBeInTheDocument()
  })

  it('disables the submit button while submitting', () => {
    render(<ObligationForm onSubmit={vi.fn()} isSubmitting />)
    expect(screen.getByText('Adding…')).toBeDisabled()
  })
})
