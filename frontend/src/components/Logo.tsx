import { Link } from 'react-router-dom'

import { APP_NAME } from '@/lib/brand'

interface LogoProps {
  to?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const SIZES = {
  sm: { mark: 20, text: 'text-base' },
  md: { mark: 26, text: 'text-xl' },
  lg: { mark: 36, text: 'text-2xl' },
} as const

export function Logo({ to = '/', size = 'md', className = '' }: LogoProps) {
  const { mark, text } = SIZES[size]

  return (
    <Link to={to} className={`inline-flex items-center gap-2 ${className}`}>
      <svg width={mark} height={mark} viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <path d="M16 2 4 6.5v8.2c0 8 5.1 13.9 12 15.3 6.9-1.4 12-7.3 12-15.3V6.5L16 2Z" fill="#4f46e5" />
        <path
          d="M11 16.2 14.5 19.7 21.5 12.5"
          stroke="#ffffff"
          strokeWidth={2.4}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className={`${text} font-semibold tracking-tight text-neutral-900`}>{APP_NAME}</span>
    </Link>
  )
}
