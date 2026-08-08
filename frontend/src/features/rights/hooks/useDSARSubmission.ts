import { useMemo } from 'react'

import { useMutation } from '@tanstack/react-query'

import { detectRegion } from '@/lib/region'

import { RightsApiClient } from '../api/RightsApiClient'
import type { DSARRequest, IRightsApiClient, RequestType } from '../types'

interface UseDSARSubmissionOptions {
  publicKey: string
  client?: IRightsApiClient
}

export function useDSARSubmission({ publicKey, client }: UseDSARSubmissionOptions) {
  const rightsClient = useMemo(() => client ?? new RightsApiClient(publicKey), [client, publicKey])

  const mutation = useMutation<DSARRequest, unknown, { subjectKey: string; requestType: RequestType }>({
    mutationFn: ({ subjectKey, requestType }) =>
      rightsClient.submitRequest({
        subject_key: subjectKey,
        request_type: requestType,
        region: detectRegion(),
      }),
  })

  return {
    submittedRequest: mutation.data ?? null,
    submit: mutation.mutateAsync,
    isSubmitting: mutation.isPending,
    submitError: mutation.error,
    reset: mutation.reset,
  }
}
