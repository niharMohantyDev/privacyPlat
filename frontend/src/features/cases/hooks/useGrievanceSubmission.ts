import { useMemo } from 'react'

import { useMutation } from '@tanstack/react-query'

import { detectRegion } from '@/lib/region'

import { CasesApiClient } from '../api/CasesApiClient'
import type { Case, ICasesApiClient } from '../types'

interface UseGrievanceSubmissionOptions {
  publicKey: string
  client?: ICasesApiClient
}

export function useGrievanceSubmission({ publicKey, client }: UseGrievanceSubmissionOptions) {
  const casesClient = useMemo(() => client ?? new CasesApiClient(publicKey), [client, publicKey])

  const mutation = useMutation<Case, unknown, { title: string; description: string; reportedBy: string }>({
    mutationFn: ({ title, description, reportedBy }) =>
      casesClient.submitGrievance({
        title,
        description,
        reportedBy,
        region: detectRegion(),
      }),
  })

  return {
    submittedCase: mutation.data ?? null,
    submit: mutation.mutateAsync,
    isSubmitting: mutation.isPending,
    submitError: mutation.error,
    reset: mutation.reset,
  }
}
