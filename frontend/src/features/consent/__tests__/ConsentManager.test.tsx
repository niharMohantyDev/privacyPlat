import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { ConsentManager } from '../components/ConsentManager'
import type { ConsentStorageStrategy } from '../storage/ConsentStorageStrategy'
import type { ConsentReceipt, IConsentApiClient } from '../types'

const PURPOSES = [
  { code: 'security', name: 'Security', description: 'Required.', is_essential: true },
  { code: 'analytics', name: 'Analytics', description: 'Optional.', is_essential: false },
]

function renderWithQueryClient(ui: React.ReactElement) {
  const queryClient = new QueryClient()
  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>)
}

function fakeStorage(initialReceipt: ConsentReceipt | null = null): ConsentStorageStrategy {
  let receipt = initialReceipt
  return {
    getSubjectKey: () => 'fake-subject-key',
    getStoredReceipt: () => receipt,
    saveReceipt: (r) => {
      receipt = r
    },
    clear: () => {
      receipt = null
    },
  }
}

describe('ConsentManager', () => {
  it('shows the banner, then submits all-granted decisions on Accept All', async () => {
    const recordConsent = vi.fn().mockResolvedValue({ record_id: 'r1' })
    const client: IConsentApiClient = {
      listPurposes: vi.fn().mockResolvedValue(PURPOSES),
      recordConsent,
    }

    renderWithQueryClient(
      <ConsentManager publicKey="key-123" client={client} storage={fakeStorage()} />,
    )

    await screen.findByText('Accept All')
    fireEvent.click(screen.getByText('Accept All'))

    await waitFor(() =>
      expect(recordConsent).toHaveBeenCalledWith({
        subject_key: 'fake-subject-key',
        region: expect.any(String),
        decisions: { security: true, analytics: true },
      }),
    )
  })

  it('reject all still grants essential purposes', async () => {
    const recordConsent = vi.fn().mockResolvedValue({ record_id: 'r1' })
    const client: IConsentApiClient = {
      listPurposes: vi.fn().mockResolvedValue(PURPOSES),
      recordConsent,
    }

    renderWithQueryClient(
      <ConsentManager publicKey="key-123" client={client} storage={fakeStorage()} />,
    )

    await screen.findByText('Reject All')
    fireEvent.click(screen.getByText('Reject All'))

    await waitFor(() =>
      expect(recordConsent).toHaveBeenCalledWith({
        subject_key: 'fake-subject-key',
        region: expect.any(String),
        decisions: { security: true, analytics: false },
      }),
    )
  })

  it('renders nothing if a receipt is already stored', async () => {
    const client: IConsentApiClient = {
      listPurposes: vi.fn().mockResolvedValue(PURPOSES),
      recordConsent: vi.fn(),
    }
    const existingReceipt = { record_id: 'r1' } as ConsentReceipt

    const { container } = renderWithQueryClient(
      <ConsentManager publicKey="key-123" client={client} storage={fakeStorage(existingReceipt)} />,
    )

    await waitFor(() => expect(container).toBeEmptyDOMElement())
  })
})
