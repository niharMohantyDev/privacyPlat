import { useMemo, useState } from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { RopaApiClient } from '../api/RopaApiClient'
import type { CreateActivityInput, IRopaApiClient, TransitionActivityInput } from '../types'

interface UseRopaRegisterOptions {
  organizationId: string
  client?: IRopaApiClient
}

export function useRopaRegister({ organizationId, client }: UseRopaRegisterOptions) {
  const ropaClient = useMemo(() => client ?? new RopaApiClient(), [client])
  const queryClient = useQueryClient()
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined)
  const queryKey = ['ropa-register', organizationId, statusFilter]

  const registerQuery = useQuery({
    queryKey,
    queryFn: () => ropaClient.listActivities(organizationId, statusFilter),
  })

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['ropa-register', organizationId] })
  }

  const createMutation = useMutation({
    mutationFn: (input: CreateActivityInput) => ropaClient.createActivity(organizationId, input),
    onSuccess: invalidate,
  })

  const transitionMutation = useMutation({
    mutationFn: (input: TransitionActivityInput) => ropaClient.transitionActivity(organizationId, input),
    onSuccess: invalidate,
  })

  const reviewMutation = useMutation({
    mutationFn: (activityId: string) => ropaClient.markReviewed(organizationId, activityId),
    onSuccess: invalidate,
  })

  return {
    activities: registerQuery.data ?? [],
    isLoading: registerQuery.isLoading,
    loadError: registerQuery.error,
    statusFilter,
    setStatusFilter,
    create: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    createError: createMutation.error,
    transition: transitionMutation.mutateAsync,
    isTransitioning: transitionMutation.isPending,
    transitionError: transitionMutation.error,
    markReviewed: reviewMutation.mutateAsync,
    isMarkingReviewed: reviewMutation.isPending,
  }
}
