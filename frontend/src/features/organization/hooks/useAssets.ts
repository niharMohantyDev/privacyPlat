import { useMemo } from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { CoreAdminApiClient } from '../api/CoreAdminApiClient'
import type { CreateAssetInput, ICoreAdminApiClient, UpdateAssetInput } from '../types'

interface UseAssetsOptions {
  organizationId: string
  client?: ICoreAdminApiClient
}

export function useAssets({ organizationId, client }: UseAssetsOptions) {
  const adminClient = useMemo(() => client ?? new CoreAdminApiClient(), [client])
  const queryClient = useQueryClient()
  const queryKey = ['assets', organizationId]

  const assetsQuery = useQuery({
    queryKey,
    queryFn: () => adminClient.listAssets(organizationId),
  })

  const invalidate = () => queryClient.invalidateQueries({ queryKey })

  const createMutation = useMutation({
    mutationFn: (input: CreateAssetInput) => adminClient.createAsset(input),
    onSuccess: invalidate,
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateAssetInput }) =>
      adminClient.updateAsset(id, input),
    onSuccess: invalidate,
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminClient.deleteAsset(id),
    onSuccess: invalidate,
  })

  return {
    assets: assetsQuery.data ?? [],
    isLoading: assetsQuery.isLoading,
    loadError: assetsQuery.error,
    create: createMutation.mutateAsync,
    update: updateMutation.mutateAsync,
    remove: deleteMutation.mutateAsync,
    isMutating: createMutation.isPending || updateMutation.isPending || deleteMutation.isPending,
    mutationError: createMutation.error || updateMutation.error || deleteMutation.error,
  }
}
