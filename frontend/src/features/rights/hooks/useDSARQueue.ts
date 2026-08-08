import { useMemo } from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { RightsAdminApiClient } from '../api/RightsAdminApiClient'
import type { IRightsAdminApiClient, TransitionDSARInput } from '../types'

interface UseDSARQueueOptions {
  organizationId: string
  client?: IRightsAdminApiClient
}

export function useDSARQueue({ organizationId, client }: UseDSARQueueOptions) {
  const adminClient = useMemo(() => client ?? new RightsAdminApiClient(), [client])
  const queryClient = useQueryClient()
  const queryKey = ['dsar-queue', organizationId]

  const queueQuery = useQuery({
    queryKey,
    queryFn: () => adminClient.listRequests(organizationId),
  })

  const transitionMutation = useMutation({
    mutationFn: (input: TransitionDSARInput) => adminClient.transitionRequest(organizationId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey })
    },
  })

  return {
    requests: queueQuery.data ?? [],
    isLoading: queueQuery.isLoading,
    loadError: queueQuery.error,
    transition: transitionMutation.mutateAsync,
    isTransitioning: transitionMutation.isPending,
    transitionError: transitionMutation.error,
  }
}
