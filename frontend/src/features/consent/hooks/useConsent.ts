import { useMemo, useState } from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { ConsentApiClient } from '../api/ConsentApiClient'
import { detectRegion } from '../region'
import { LocalStorageConsentStorage } from '../storage/LocalStorageConsentStorage'
import type { ConsentStorageStrategy } from '../storage/ConsentStorageStrategy'
import type { ConsentReceipt, IConsentApiClient } from '../types'

interface UseConsentOptions {
  publicKey: string
  client?: IConsentApiClient
  storage?: ConsentStorageStrategy
}

export function useConsent({ publicKey, client, storage }: UseConsentOptions) {
  const consentClient = useMemo(() => client ?? new ConsentApiClient(publicKey), [client, publicKey])
  const consentStorage = useMemo(() => storage ?? new LocalStorageConsentStorage(), [storage])
  const subjectKey = useMemo(() => consentStorage.getSubjectKey(), [consentStorage])

  const [receipt, setReceipt] = useState<ConsentReceipt | null>(() =>
    consentStorage.getStoredReceipt(),
  )

  const queryClient = useQueryClient()

  const purposesQuery = useQuery({
    queryKey: ['consent-purposes', publicKey],
    queryFn: () => consentClient.listPurposes(),
  })

  const submitMutation = useMutation({
    mutationFn: (decisions: Record<string, boolean>) =>
      consentClient.recordConsent({ subject_key: subjectKey, region: detectRegion(), decisions }),
    onSuccess: (newReceipt) => {
      consentStorage.saveReceipt(newReceipt)
      setReceipt(newReceipt)
      queryClient.invalidateQueries({ queryKey: ['consent-purposes', publicKey] })
    },
  })

  return {
    purposes: purposesQuery.data ?? [],
    isLoadingPurposes: purposesQuery.isLoading,
    purposesError: purposesQuery.error,
    receipt,
    submit: submitMutation.mutateAsync,
    isSubmitting: submitMutation.isPending,
    submitError: submitMutation.error,
  }
}
