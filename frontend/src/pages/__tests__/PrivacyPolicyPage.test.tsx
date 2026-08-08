import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'

import { PrivacyPolicyPage } from '../PrivacyPolicyPage'

describe('PrivacyPolicyPage', () => {
  it('renders the title and links to the real DSAR rights portal', () => {
    render(
      <MemoryRouter>
        <PrivacyPolicyPage />
      </MemoryRouter>,
    )
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Privacy Policy')
    expect(screen.getByText('7. Your Rights')).toBeInTheDocument()
    expect(screen.getByText('data-subject rights portal')).toHaveAttribute('href', '/rights')
  })
})
