import { useDSARSubmission } from '../hooks/useDSARSubmission'
import type { IRightsApiClient } from '../types'
import { DSARConfirmation } from './DSARConfirmation'
import { DSARRequestForm } from './DSARRequestForm'

interface DSARPortalProps {
  publicKey: string
  /** Injectable for tests — see useDSARSubmission. */
  client?: IRightsApiClient
}

/**
 * Container: owns the useDSARSubmission wiring. DSARRequestForm and
 * DSARConfirmation are pure presentational components (Container/
 * Presentational split, same convention as apps/consent's ConsentManager).
 */
export function DSARPortal({ publicKey, client }: DSARPortalProps) {
  const { submittedRequest, submit, isSubmitting, submitError, reset } = useDSARSubmission({
    publicKey,
    client,
  })

  if (submittedRequest) {
    return <DSARConfirmation request={submittedRequest} onSubmitAnother={reset} />
  }

  return (
    <DSARRequestForm
      onSubmit={({ subjectKey, requestType }) => {
        // mutateAsync's promise rejects on failure; submitError already
        // tracks it reactively for the errorMessage prop below, so the
        // rejection itself just needs to not become an unhandled one.
        submit({ subjectKey, requestType }).catch(() => {})
      }}
      isSubmitting={isSubmitting}
      errorMessage={submitError ? 'Something went wrong — please try again.' : null}
    />
  )
}
