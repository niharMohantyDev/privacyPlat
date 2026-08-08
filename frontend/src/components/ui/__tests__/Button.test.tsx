import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { Button } from '../Button'

describe('Button', () => {
  it('renders children and calls onClick', () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Click me</Button>)
    fireEvent.click(screen.getByText('Click me'))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('respects the disabled prop', () => {
    render(<Button disabled>Disabled</Button>)
    expect(screen.getByText('Disabled')).toBeDisabled()
  })

  it('applies variant-specific classes', () => {
    render(<Button variant="danger">Delete</Button>)
    expect(screen.getByText('Delete').className).toContain('bg-red-600')
  })
})
