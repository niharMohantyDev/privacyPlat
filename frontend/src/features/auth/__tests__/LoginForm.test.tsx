import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { LoginForm } from '../components/LoginForm'

describe('LoginForm', () => {
  it('submits the entered email and password', () => {
    const onSubmit = vi.fn()
    render(<LoginForm onSubmit={onSubmit} isSubmitting={false} />)

    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'staff@demo-org.test' } })
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'secret' } })
    fireEvent.click(screen.getByText('Sign in'))

    expect(onSubmit).toHaveBeenCalledWith({ email: 'staff@demo-org.test', password: 'secret' })
  })

  it('does not submit without both fields', () => {
    const onSubmit = vi.fn()
    render(<LoginForm onSubmit={onSubmit} isSubmitting={false} />)
    fireEvent.click(screen.getByText('Sign in'))
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('shows the error message when provided', () => {
    render(<LoginForm onSubmit={vi.fn()} isSubmitting={false} errorMessage="Nope" />)
    expect(screen.getByText('Nope')).toBeInTheDocument()
  })
})
