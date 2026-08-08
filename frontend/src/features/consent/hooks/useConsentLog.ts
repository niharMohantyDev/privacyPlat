import { useMemo } from 'react'

import { useQuery } from '@tanstack/react-query'

import { ConsentAdminApiClient } from '../api/ConsentAdminApiClient'
import type { IConsentAdminApiClient } from '../types'

interface UseConsentLogOptions {
  organizationId: string
  client?: IConsentAdminApiClient
}

export function useConsentLog({ organizationId, client }: UseConsentLogOptions) {
  const adminClient = useMemo(() => client ?? new ConsentAdminApiClient(), [client])

  const query = useQuery({
    queryKey: ['consent-log', organizationId],
    queryFn: () => adminClient.listRecords(organizationId),
  })

  return {
    records: query.data ?? [],
    isLoading: query.isLoading,
    loadError: query.error,
  }
}
