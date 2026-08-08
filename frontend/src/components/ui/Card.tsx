import type { ElementType, HTMLAttributes } from 'react'

interface CardProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType
}

export function Card({ as: Component = 'div', className = '', ...rest }: CardProps) {
  return (
    <Component
      className={`rounded-xl border border-neutral-200 bg-white p-6 shadow-sm ${className}`.trim()}
      {...rest}
    />
  )
}
