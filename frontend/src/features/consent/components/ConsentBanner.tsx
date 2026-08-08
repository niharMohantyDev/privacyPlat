interface ConsentBannerProps {
  onAcceptAll: () => void
  onRejectAll: () => void
  onManage: () => void
  isSubmitting: boolean
}

/** Presentational only — all state/logic lives in ConsentManager (container). */
export function ConsentBanner({ onAcceptAll, onRejectAll, onManage, isSubmitting }: ConsentBannerProps) {
  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-neutral-200 bg-white p-4 shadow-lg dark:border-neutral-800 dark:bg-neutral-900"
    >
      <div className="mx-auto flex max-w-4xl flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-neutral-600 dark:text-neutral-300">
          We use cookies for essential site functionality and, with your permission, for
          analytics, marketing, and personalization. You can change your choice anytime.
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={onManage}
            disabled={isSubmitting}
            className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 disabled:opacity-50 dark:border-neutral-700 dark:text-neutral-200"
          >
            Manage Preferences
          </button>
          <button
            type="button"
            onClick={onRejectAll}
            disabled={isSubmitting}
            className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 disabled:opacity-50 dark:border-neutral-700 dark:text-neutral-200"
          >
            Reject All
          </button>
          <button
            type="button"
            onClick={onAcceptAll}
            disabled={isSubmitting}
            className="rounded-md bg-neutral-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-neutral-700 disabled:opacity-50 dark:bg-white dark:text-neutral-900"
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  )
}
