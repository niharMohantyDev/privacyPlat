import { useGrievanceSubmission } from '../hooks/useGrievanceSubmission'
import type { ICasesApiClient } from '../types'
import { GrievanceConfirmation } from './GrievanceConfirmation'
import { GrievanceForm } from './GrievanceForm'

interface GrievancePortalProps {
  publicKey: string
  /** Injectable for tests — see useGrievanceSubmission. */
  client?: ICasesApiClient
}

/**
 * Container: owns the useGrievanceSubmission wiring. GrievanceForm and
 * GrievanceConfirmation are pure presentational components (Container/
 * Presentational split, same convention as apps/rights's DSARPortal).
 */
export function GrievancePortal({ publicKey, client }: GrievancePortalProps) {
  const { submittedCase, submit, isSubmitting, submitError, reset } = useGrievanceSubmission({
    publicKey,
    client,
  })

  if (submittedCase) {
    return <GrievanceConfirmation caseRecord={submittedCase} onSubmitAnother={reset} />
  }

  return (
    <GrievanceForm
      onSubmit={({ title, description, reportedBy }) => {
        // mutateAsync's promise rejects on failure; submitError already
        // tracks it reactively for the errorMessage prop below, so the
        // rejection itself just needs to not become an unhandled one.
        submit({ title, description, reportedBy }).catch(() => {})
      }}
      isSubmitting={isSubmitting}
      errorMessage={submitError ? 'Something went wrong — please try again.' : null}
    />
  )
}
