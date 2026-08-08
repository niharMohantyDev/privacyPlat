import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { ConsentLogPage } from '../components/ConsentLogPage'
import type { ConsentLogRecord, IConsentAdminApiClient } from '../types'

function renderWithQueryClient(ui: React.ReactElement) {
  const queryClient = new QueryClient()
  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>)
}

describe('ConsentLogPage', () => {
  it('loads and displays consent records', async () => {
    const record: ConsentLogRecord = {
      id: 'r1',
      subject_key: 'alice@example.com',
      region: 'DE',
      framework: 'GDPR',
      version: 1,
      decisions: [],
      created_at: '2026-01-01T00:00:00Z',
    }
    const client: IConsentAdminApiClient = {
      listPurposes: vi.fn(),
      createPurpose: vi.fn(),
      updatePurpose: vi.fn(),
      deletePurpose: vi.fn(),
      listRecords: vi.fn().mockResolvedValue([record]),
    }

    renderWithQueryClient(<ConsentLogPage organizationId="org-1" client={client} />)

    await screen.findByText('alice@example.com')
    expect(client.listRecords).toHaveBeenCalledWith('org-1')
  })
})
