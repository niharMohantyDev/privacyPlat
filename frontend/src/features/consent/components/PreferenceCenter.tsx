import { Button } from '@/components/ui/Button'

import type { ConsentPurpose } from '../types'

interface PreferenceCenterProps {
  purposes: ConsentPurpose[]
  decisions: Record<string, boolean>
  onToggle: (code: string) => void
  onSave: () => void
  onClose: () => void
  isSubmitting: boolean
}

/** Presentational only — all state/logic lives in ConsentManager (container). */
export function PreferenceCenter({
  purposes,
  decisions,
  onToggle,
  onSave,
  onClose,
  isSubmitting,
}: PreferenceCenterProps) {
  return (
    <div
      role="dialog"
      aria-label="Manage cookie preferences"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
    >
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-neutral-900">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
          Manage Preferences
        </h2>
        <ul className="mt-4 space-y-4">
          {purposes.map((purpose) => (
            <li key={purpose.code} className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-neutral-900 dark:text-white">
                  {purpose.name}
                  {purpose.is_essential && (
                    <span className="ml-2 text-xs font-normal text-neutral-400">(required)</span>
                  )}
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  {purpose.description}
                </p>
              </div>
              <label className="relative inline-flex shrink-0 cursor-pointer items-center">
                <input
                  type="checkbox"
                  role="switch"
                  aria-label={purpose.name}
                  checked={purpose.is_essential || Boolean(decisions[purpose.code])}
                  disabled={purpose.is_essential}
                  onChange={() => onToggle(purpose.code)}
                  className="peer sr-only"
                />
                <div className="h-5 w-9 rounded-full bg-neutral-300 transition peer-checked:bg-indigo-600 peer-disabled:opacity-50 dark:bg-neutral-700" />
                <div className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white transition peer-checked:translate-x-4" />
              </label>
            </li>
          ))}
        </ul>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button size="sm" onClick={onSave} disabled={isSubmitting}>
            Save Preferences
          </Button>
        </div>
      </div>
    </div>
  )
}
