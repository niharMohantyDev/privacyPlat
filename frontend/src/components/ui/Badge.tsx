import type { ButtonHTMLAttributes, HTMLAttributes } from 'react'

export type BadgeVariant = 'neutral' | 'success' | 'warning' | 'danger' | 'info' | 'brand'

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  neutral: 'bg-neutral-100 text-neutral-700',
  success: 'bg-emerald-100 text-emerald-800',
  warning: 'bg-amber-100 text-amber-800',
  danger: 'bg-red-100 text-red-800',
  info: 'bg-blue-100 text-blue-800',
  brand: 'bg-indigo-100 text-indigo-800',
}

const BASE_CLASSES = 'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
}

export function Badge({ variant = 'neutral', className = '', ...rest }: BadgeProps) {
  return <span className={`${BASE_CLASSES} ${VARIANT_CLASSES[variant]} ${className}`.trim()} {...rest} />
}

interface BadgeButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: BadgeVariant
}

/** Same visual as Badge, but an actual button — for the "click to toggle" status pills. */
export function BadgeButton({ variant = 'neutral', className = '', ...rest }: BadgeButtonProps) {
  return (
    <button
      type="button"
      className={`${BASE_CLASSES} ${VARIANT_CLASSES[variant]} transition-opacity hover:opacity-80 ${className}`.trim()}
      {...rest}
    />
  )
}
