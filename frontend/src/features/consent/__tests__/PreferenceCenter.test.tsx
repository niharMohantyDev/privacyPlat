import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { PreferenceCenter } from '../components/PreferenceCenter'
import type { ConsentPurpose } from '../types'

const PURPOSES: ConsentPurpose[] = [
  { code: 'security', name: 'Security', description: 'Required.', is_essential: true },
  { code: 'analytics', name: 'Analytics', description: 'Optional.', is_essential: false },
]

describe('PreferenceCenter', () => {
  it('renders essential purposes as always-on and disabled', () => {
    render(
      <PreferenceCenter
        purposes={PURPOSES}
        decisions={{}}
        onToggle={vi.fn()}
        onSave={vi.fn()}
        onClose={vi.fn()}
        isSubmitting={false}
      />,
    )

    const securityToggle = screen.getByRole('switch', { name: 'Security' })
    expect(securityToggle).toBeChecked()
    expect(securityToggle).toBeDisabled()
  })

  it('calls onToggle with the purpose code when a non-essential toggle is clicked', () => {
    const onToggle = vi.fn()
    render(
      <PreferenceCenter
        purposes={PURPOSES}
        decisions={{}}
        onToggle={onToggle}
        onSave={vi.fn()}
        onClose={vi.fn()}
        isSubmitting={false}
      />,
    )

    fireEvent.click(screen.getByRole('switch', { name: 'Analytics' }))
    expect(onToggle).toHaveBeenCalledWith('analytics')
  })

  it('reflects the decisions prop for non-essential purposes', () => {
    render(
      <PreferenceCenter
        purposes={PURPOSES}
        decisions={{ analytics: true }}
        onToggle={vi.fn()}
        onSave={vi.fn()}
        onClose={vi.fn()}
        isSubmitting={false}
      />,
    )

    expect(screen.getByRole('switch', { name: 'Analytics' })).toBeChecked()
  })

  it('calls onSave when Save Preferences is clicked', () => {
    const onSave = vi.fn()
    render(
      <PreferenceCenter
        purposes={PURPOSES}
        decisions={{}}
        onToggle={vi.fn()}
        onSave={onSave}
        onClose={vi.fn()}
        isSubmitting={false}
      />,
    )

    fireEvent.click(screen.getByText('Save Preferences'))
    expect(onSave).toHaveBeenCalledOnce()
  })
})
