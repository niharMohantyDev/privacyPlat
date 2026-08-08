import { useMemo, useState } from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { CasesAdminApiClient } from '../api/CasesAdminApiClient'
import type { CaseType, ICasesAdminApiClient, ReportCaseInput, TransitionCaseInput } from '../types'

interface UseCaseQueueOptions {
  organizationId: string
  client?: ICasesAdminApiClient
}

export function useCaseQueue({ organizationId, client }: UseCaseQueueOptions) {
  const adminClient = useMemo(() => client ?? new CasesAdminApiClient(), [client])
  const queryClient = useQueryClient()
  const [caseTypeFilter, setCaseTypeFilter] = useState<CaseType | undefined>(undefined)
  const queryKey = ['case-queue', organizationId, caseTypeFilter]

  const queueQuery = useQuery({
    queryKey,
    queryFn: () => adminClient.listCases(organizationId, caseTypeFilter),
  })

  const invalidateQueue = () => {
    queryClient.invalidateQueries({ queryKey: ['case-queue', organizationId] })
  }

  const reportMutation = useMutation({
    mutationFn: (input: ReportCaseInput) => adminClient.reportCase(organizationId, input),
    onSuccess: invalidateQueue,
  })

  const transitionMutation = useMutation({
    mutationFn: (input: TransitionCaseInput) => adminClient.transitionCase(organizationId, input),
    onSuccess: invalidateQueue,
  })

  return {
    cases: queueQuery.data ?? [],
    isLoading: queueQuery.isLoading,
    loadError: queueQuery.error,
    caseTypeFilter,
    setCaseTypeFilter,
    report: reportMutation.mutateAsync,
    isReporting: reportMutation.isPending,
    reportError: reportMutation.error,
    transition: transitionMutation.mutateAsync,
    isTransitioning: transitionMutation.isPending,
    transitionError: transitionMutation.error,
  }
}
