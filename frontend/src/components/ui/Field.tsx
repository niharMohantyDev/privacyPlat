import type { ReactNode } from 'react'

interface FieldProps {
  label: string
  htmlFor: string
  children: ReactNode
  className?: string
}

/** Consistent label+control spacing — wraps an Input/Select so every
 * form across the app shares the same label style and gap. */
export function Field({ label, htmlFor, children, className = '' }: FieldProps) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="mb-1.5 block text-xs font-medium text-neutral-600">
        {label}
      </label>
      {children}
    </div>
  )
}
