import { useMemo, useState } from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { NoticesAdminApiClient } from '../api/NoticesAdminApiClient'
import type { CreateDraftInput, INoticesAdminApiClient, NoticeType } from '../types'

interface UseNoticeRegisterOptions {
  organizationId: string
  client?: INoticesAdminApiClient
}

export function useNoticeRegister({ organizationId, client }: UseNoticeRegisterOptions) {
  const noticesClient = useMemo(() => client ?? new NoticesAdminApiClient(), [client])
  const queryClient = useQueryClient()
  const [noticeTypeFilter, setNoticeTypeFilter] = useState<NoticeType | undefined>(undefined)
  const queryKey = ['notice-register', organizationId, noticeTypeFilter]

  const registerQuery = useQuery({
    queryKey,
    queryFn: () => noticesClient.listNotices(organizationId, noticeTypeFilter),
  })

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['notice-register', organizationId] })
  }

  const createMutation = useMutation({
    mutationFn: (input: CreateDraftInput) => noticesClient.createDraft(organizationId, input),
    onSuccess: invalidate,
  })

  const publishMutation = useMutation({
    mutationFn: (noticeId: string) => noticesClient.publish(organizationId, noticeId),
    onSuccess: invalidate,
  })

  const archiveMutation = useMutation({
    mutationFn: (noticeId: string) => noticesClient.archive(organizationId, noticeId),
    onSuccess: invalidate,
  })

  return {
    notices: registerQuery.data ?? [],
    isLoading: registerQuery.isLoading,
    loadError: registerQuery.error,
    noticeTypeFilter,
    setNoticeTypeFilter,
    createDraft: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    createError: createMutation.error,
    publish: publishMutation.mutateAsync,
    archive: archiveMutation.mutateAsync,
    isUpdating: publishMutation.isPending || archiveMutation.isPending,
    updateError: publishMutation.error || archiveMutation.error,
  }
}
