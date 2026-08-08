import { useMemo } from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { ConsentAdminApiClient } from '../api/ConsentAdminApiClient'
import type { CreatePurposeInput, IConsentAdminApiClient, UpdatePurposeInput } from '../types'

interface UsePurposesOptions {
  organizationId: string
  client?: IConsentAdminApiClient
}

export function usePurposes({ organizationId, client }: UsePurposesOptions) {
  const adminClient = useMemo(() => client ?? new ConsentAdminApiClient(), [client])
  const queryClient = useQueryClient()
  const queryKey = ['purposes', organizationId]

  const purposesQuery = useQuery({
    queryKey,
    queryFn: () => adminClient.listPurposes(organizationId),
  })

  const invalidate = () => queryClient.invalidateQueries({ queryKey })

  const createMutation = useMutation({
    mutationFn: (input: Omit<CreatePurposeInput, 'organization'>) =>
      adminClient.createPurpose({ ...input, organization: organizationId }),
    onSuccess: invalidate,
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdatePurposeInput }) =>
      adminClient.updatePurpose(id, input),
    onSuccess: invalidate,
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminClient.deletePurpose(id),
    onSuccess: invalidate,
  })

  return {
    purposes: purposesQuery.data ?? [],
    isLoading: purposesQuery.isLoading,
    loadError: purposesQuery.error,
    create: createMutation.mutateAsync,
    update: updateMutation.mutateAsync,
    remove: deleteMutation.mutateAsync,
    isMutating: createMutation.isPending || updateMutation.isPending || deleteMutation.isPending,
    mutationError: createMutation.error || updateMutation.error || deleteMutation.error,
  }
}
