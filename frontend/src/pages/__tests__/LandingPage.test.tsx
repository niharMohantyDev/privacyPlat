import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'

import { LandingPage } from '../LandingPage'

function renderPage() {
  return render(
    <MemoryRouter>
      <LandingPage />
    </MemoryRouter>,
  )
}

describe('LandingPage', () => {
  it('renders the hero headline and brand name', () => {
    renderPage()
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Privacy compliance, wired in.')
    expect(screen.getAllByText('Consentra').length).toBeGreaterThan(0)
  })

  it('renders the six pillar feature cards', () => {
    renderPage()
    expect(screen.getByText('Discover')).toBeInTheDocument()
    expect(screen.getByText('Consent')).toBeInTheDocument()
    expect(screen.getByText('Rights')).toBeInTheDocument()
    expect(screen.getByText('Govern')).toBeInTheDocument()
    expect(screen.getByText('Protect')).toBeInTheDocument()
    expect(screen.getByText('Prove')).toBeInTheDocument()
  })

  it('renders footer links to Terms and Privacy Policy', () => {
    renderPage()
    expect(screen.getByText('Terms of Service')).toBeInTheDocument()
    expect(screen.getByText('Privacy Policy')).toBeInTheDocument()
  })

  it('renders a testimonial', () => {
    renderPage()
    expect(screen.getByText('What teams are saying')).toBeInTheDocument()
  })
})
