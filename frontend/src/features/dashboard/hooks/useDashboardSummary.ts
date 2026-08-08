import { useMemo } from 'react'

import { useQuery } from '@tanstack/react-query'

import { DashboardApiClient } from '../api/DashboardApiClient'
import type { IDashboardApiClient } from '../types'

interface UseDashboardSummaryOptions {
  organizationId: string
  client?: IDashboardApiClient
}

export function useDashboardSummary({ organizationId, client }: UseDashboardSummaryOptions) {
  const dashboardClient = useMemo(() => client ?? new DashboardApiClient(), [client])

  const query = useQuery({
    queryKey: ['dashboard-summary', organizationId],
    queryFn: () => dashboardClient.getSummary(organizationId),
  })

  return {
    summary: query.data ?? null,
    isLoading: query.isLoading,
    loadError: query.error,
  }
}
