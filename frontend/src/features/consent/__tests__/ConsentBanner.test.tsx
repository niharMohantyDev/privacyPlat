import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { ConsentBanner } from '../components/ConsentBanner'

describe('ConsentBanner', () => {
  it('invokes the right callback for each action', () => {
    const onAcceptAll = vi.fn()
    const onRejectAll = vi.fn()
    const onManage = vi.fn()

    render(
      <ConsentBanner
        onAcceptAll={onAcceptAll}
        onRejectAll={onRejectAll}
        onManage={onManage}
        isSubmitting={false}
      />,
    )

    fireEvent.click(screen.getByText('Accept All'))
    fireEvent.click(screen.getByText('Reject All'))
    fireEvent.click(screen.getByText('Manage Preferences'))

    expect(onAcceptAll).toHaveBeenCalledOnce()
    expect(onRejectAll).toHaveBeenCalledOnce()
    expect(onManage).toHaveBeenCalledOnce()
  })

  it('disables the action buttons while submitting', () => {
    render(
      <ConsentBanner onAcceptAll={vi.fn()} onRejectAll={vi.fn()} onManage={vi.fn()} isSubmitting />,
    )

    expect(screen.getByText('Accept All')).toBeDisabled()
    expect(screen.getByText('Reject All')).toBeDisabled()
  })
})
