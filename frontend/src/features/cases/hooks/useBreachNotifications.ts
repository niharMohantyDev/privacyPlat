import { useMemo } from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { CasesAdminApiClient } from '../api/CasesAdminApiClient'
import type { CreateObligationInput, ICasesAdminApiClient } from '../types'

interface UseBreachNotificationsOptions {
  organizationId: string
  caseId: string
  client?: ICasesAdminApiClient
}

export function useBreachNotifications({ organizationId, caseId, client }: UseBreachNotificationsOptions) {
  const casesClient = useMemo(() => client ?? new CasesAdminApiClient(), [client])
  const queryClient = useQueryClient()
  const queryKey = ['case-obligations', organizationId, caseId]

  const obligationsQuery = useQuery({
    queryKey,
    queryFn: () => casesClient.listObligations(organizationId, caseId),
  })

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey })
  }

  const createMutation = useMutation({
    mutationFn: (input: CreateObligationInput) => casesClient.createObligation(organizationId, caseId, input),
    onSuccess: invalidate,
  })

  const markNotifiedMutation = useMutation({
    mutationFn: (obligationId: string) => casesClient.markObligationNotified(organizationId, obligationId),
    onSuccess: invalidate,
  })

  const markNotRequiredMutation = useMutation({
    mutationFn: (obligationId: string) => casesClient.markObligationNotRequired(organizationId, obligationId),
    onSuccess: invalidate,
  })

  return {
    obligations: obligationsQuery.data ?? [],
    isLoading: obligationsQuery.isLoading,
    loadError: obligationsQuery.error,
    create: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    createError: createMutation.error,
    markNotified: markNotifiedMutation.mutateAsync,
    markNotRequired: markNotRequiredMutation.mutateAsync,
    isUpdating: markNotifiedMutation.isPending || markNotRequiredMutation.isPending,
  }
}
