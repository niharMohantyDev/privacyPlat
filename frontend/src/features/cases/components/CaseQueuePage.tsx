import { useCaseQueue } from '../hooks/useCaseQueue'
import type { CaseType, ICasesAdminApiClient } from '../types'
import { CASE_TYPES } from '../types'
import { CaseQueueTable } from './CaseQueueTable'
import { CaseReportForm } from './CaseReportForm'

interface CaseQueuePageProps {
  organizationId: string
  /** Injectable for tests — see useCaseQueue. */
  client?: ICasesAdminApiClient
}

export function CaseQueuePage({ organizationId, client }: CaseQueuePageProps) {
  const {
    cases,
    isLoading,
    loadError,
    caseTypeFilter,
    setCaseTypeFilter,
    report,
    isReporting,
    reportError,
    transition,
    isTransitioning,
    transitionError,
  } = useCaseQueue({ organizationId, client })

  const handleTransition = (caseId: string, targetStatus: string) => {
    // transitionMutation's promise rejects on an invalid transition
    // (backend returns 400) — already surfaced via transitionError below,
    // so the rejection itself just needs to not become an unhandled one.
    transition({ caseId, targetStatus }).catch(() => {})
  }

  return (
    <main className="mx-auto max-w-4xl p-8">
      <h1 className="mb-6 text-xl font-semibold">Breach &amp; Grievance Cases</h1>

      <div className="mb-6 rounded-md border border-neutral-200 p-4">
        <h2 className="mb-3 text-sm font-semibold text-neutral-900">Report a new case</h2>
        <CaseReportForm
          onSubmit={(input) => {
            // reportMutation's promise rejects on failure; reportError
            // already tracks it reactively below.
            report(input).catch(() => {})
          }}
          isSubmitting={isReporting}
          errorMessage={reportError ? 'Could not report this case — please try again.' : null}
        />
      </div>

      <div className="mb-4 flex items-center gap-2">
        <label htmlFor="case-type-filter" className="text-xs font-medium text-neutral-700">
          Filter
        </label>
        <select
          id="case-type-filter"
          value={caseTypeFilter ?? ''}
          onChange={(e) => setCaseTypeFilter((e.target.value || undefined) as CaseType | undefined)}
          className="rounded-md border border-neutral-300 px-2 py-1 text-xs"
        >
          <option value="">All types</option>
          {CASE_TYPES.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {isLoading && <p className="text-sm text-neutral-500">Loading…</p>}
      {loadError && <p className="text-sm text-red-600">Failed to load cases.</p>}
      {transitionError && (
        <p className="mb-4 text-sm text-red-600">
          That status change wasn't allowed from the case's current state.
        </p>
      )}

      {!isLoading && !loadError && (
        <CaseQueueTable
          cases={cases}
          organizationId={organizationId}
          onTransition={handleTransition}
          isTransitioning={isTransitioning}
          client={client}
        />
      )}
    </main>
  )
}
