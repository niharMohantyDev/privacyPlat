import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { MetricCard } from '../components/MetricCard'

describe('MetricCard', () => {
  it('renders the label and value', () => {
    render(<MetricCard label="Overdue" value={3} />)
    expect(screen.getByText('Overdue')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('applies the danger tone class when specified', () => {
    render(<MetricCard label="Overdue" value={3} tone="danger" />)
    expect(screen.getByText('3')).toHaveClass('text-red-600')
  })
})
