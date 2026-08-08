import { Button } from '@/components/ui/Button'
import { APP_NAME } from '@/lib/brand'

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
      className="fixed inset-x-0 bottom-0 z-50 border-t border-neutral-200 bg-white p-4 shadow-lg"
    >
      <div className="mx-auto flex max-w-4xl flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-neutral-600">
            We use cookies for essential site functionality and, with your permission, for analytics,
            marketing, and personalization. You can change your choice anytime.
          </p>
          <p className="mt-1 text-xs text-neutral-400">Powered by {APP_NAME}</p>
        </div>
        <div className="flex shrink-0 gap-2">
          <Button variant="outline" size="sm" onClick={onManage} disabled={isSubmitting}>
            Manage Preferences
          </Button>
          <Button variant="outline" size="sm" onClick={onRejectAll} disabled={isSubmitting}>
            Reject All
          </Button>
          <Button size="sm" onClick={onAcceptAll} disabled={isSubmitting}>
            Accept All
          </Button>
        </div>
      </div>
    </div>
  )
}
