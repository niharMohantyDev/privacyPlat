import { forwardRef } from 'react'
import type { SelectHTMLAttributes } from 'react'

const BASE_CLASSES =
  'w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 shadow-sm transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:bg-neutral-50 disabled:text-neutral-400'

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  function Select({ className = '', ...rest }, ref) {
    return <select ref={ref} className={`${BASE_CLASSES} ${className}`.trim()} {...rest} />
  },
)
