import { useMemo } from 'react'

import { useQuery } from '@tanstack/react-query'

import { NoticesApiClient } from '../api/NoticesApiClient'
import type { INoticesApiClient, NoticeType } from '../types'

interface UseNoticeOptions {
  publicKey: string
  noticeType: NoticeType
  client?: INoticesApiClient
}

export function useNotice({ publicKey, noticeType, client }: UseNoticeOptions) {
  const noticesClient = useMemo(() => client ?? new NoticesApiClient(publicKey), [client, publicKey])

  const query = useQuery({
    queryKey: ['public-notice', publicKey, noticeType],
    queryFn: () => noticesClient.getPublishedNotice(noticeType),
  })

  return {
    notice: query.data ?? null,
    isLoading: query.isLoading,
    loadError: query.error,
  }
}
