import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { TestimonialCarousel } from '../TestimonialCarousel'
import type { Testimonial } from '../marketingData'

const TESTIMONIALS: Testimonial[] = [
  { quote: 'First quote.', name: 'Alice Anders', title: 'CTO', company: 'Acme' },
  { quote: 'Second quote.', name: 'Bob Baker', title: 'CPO', company: 'Widgets Inc' },
  { quote: 'Third quote.', name: 'Cara Cole', title: 'DPO', company: 'Northwind' },
]

describe('TestimonialCarousel', () => {
  it('shows the first testimonial initially', () => {
    render(<TestimonialCarousel testimonials={TESTIMONIALS} />)
    expect(screen.getByText('“First quote.”')).toBeInTheDocument()
    expect(screen.getByText('Alice Anders')).toBeInTheDocument()
  })

  it('advances to the next testimonial', () => {
    render(<TestimonialCarousel testimonials={TESTIMONIALS} />)
    fireEvent.click(screen.getByLabelText('Next testimonial'))
    expect(screen.getByText('“Second quote.”')).toBeInTheDocument()
  })

  it('wraps around from the last to the first testimonial', () => {
    render(<TestimonialCarousel testimonials={TESTIMONIALS} />)
    fireEvent.click(screen.getByLabelText('Previous testimonial'))
    expect(screen.getByText('“Third quote.”')).toBeInTheDocument()
  })

  it('jumps to a specific testimonial via the dot indicators', () => {
    render(<TestimonialCarousel testimonials={TESTIMONIALS} />)
    fireEvent.click(screen.getByLabelText('Go to testimonial 3'))
    expect(screen.getByText('“Third quote.”')).toBeInTheDocument()
  })
})
