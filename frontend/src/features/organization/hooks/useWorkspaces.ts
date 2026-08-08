import { useMemo } from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { CoreAdminApiClient } from '../api/CoreAdminApiClient'
import type { CreateWorkspaceInput, ICoreAdminApiClient, UpdateWorkspaceInput } from '../types'

interface UseWorkspacesOptions {
  organizationId: string
  client?: ICoreAdminApiClient
}

export function useWorkspaces({ organizationId, client }: UseWorkspacesOptions) {
  const adminClient = useMemo(() => client ?? new CoreAdminApiClient(), [client])
  const queryClient = useQueryClient()
  const queryKey = ['workspaces', organizationId]

  const workspacesQuery = useQuery({
    queryKey,
    queryFn: () => adminClient.listWorkspaces(organizationId),
  })

  const invalidate = () => queryClient.invalidateQueries({ queryKey })

  const createMutation = useMutation({
    mutationFn: (input: Omit<CreateWorkspaceInput, 'organization'>) =>
      adminClient.createWorkspace({ ...input, organization: organizationId }),
    onSuccess: invalidate,
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateWorkspaceInput }) =>
      adminClient.updateWorkspace(id, input),
    onSuccess: invalidate,
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminClient.deleteWorkspace(id),
    onSuccess: invalidate,
  })

  return {
    workspaces: workspacesQuery.data ?? [],
    isLoading: workspacesQuery.isLoading,
    loadError: workspacesQuery.error,
    create: createMutation.mutateAsync,
    update: updateMutation.mutateAsync,
    remove: deleteMutation.mutateAsync,
    isMutating: createMutation.isPending || updateMutation.isPending || deleteMutation.isPending,
    mutationError: createMutation.error || updateMutation.error || deleteMutation.error,
  }
}
