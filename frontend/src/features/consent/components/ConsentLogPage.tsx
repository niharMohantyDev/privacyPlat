import { useConsentLog } from '../hooks/useConsentLog'
import type { IConsentAdminApiClient } from '../types'
import { ConsentLogTable } from './ConsentLogTable'

interface ConsentLogPageProps {
  organizationId: string
  /** Injectable for tests — see useConsentLog. */
  client?: IConsentAdminApiClient
}

export function ConsentLogPage({ organizationId, client }: ConsentLogPageProps) {
  const { records, isLoading, loadError } = useConsentLog({ organizationId, client })

  return (
    <main className="mx-auto max-w-4xl p-8">
      <h1 className="mb-6 text-xl font-semibold">Consent Log</h1>

      {isLoading && <p className="text-sm text-neutral-500">Loading…</p>}
      {loadError && <p className="text-sm text-red-600">Failed to load consent records.</p>}

      {!isLoading && !loadError && <ConsentLogTable records={records} />}
    </main>
  )
}
