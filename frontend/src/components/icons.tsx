/**
 * Minimal hand-drawn stroke icon set for the admin shell — no icon
 * library dependency, same "own the SVG" convention as Logo.tsx. Every
 * icon shares the same 24x24 viewBox / stroke contract so they drop
 * into nav rows and headers interchangeably.
 */
import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement>

const BASE_PROPS = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.75,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
}

export function GridIcon(props: IconProps) {
  return (
    <svg {...BASE_PROPS} {...props}>
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" />
    </svg>
  )
}

export function InboxIcon(props: IconProps) {
  return (
    <svg {...BASE_PROPS} {...props}>
      <path d="M3.5 12.5h4.7l1.6 2.4h4.4l1.6-2.4h4.7" />
      <path d="M5.2 6.5 3.5 12.5v5a2 2 0 0 0 2 2h13a2 2 0 0 0 2-2v-5l-1.7-6a2 2 0 0 0-1.9-1.5H7.1a2 2 0 0 0-1.9 1.5Z" />
    </svg>
  )
}

export function ShieldIcon(props: IconProps) {
  return (
    <svg {...BASE_PROPS} {...props}>
      <path d="M12 3.5 5 6.2v5.4c0 5 3.2 8.7 7 9.6 3.8-.9 7-4.6 7-9.6V6.2L12 3.5Z" />
      <path d="M9 12.1 11.2 14.3 15.5 9.7" />
    </svg>
  )
}

export function ListIcon(props: IconProps) {
  return (
    <svg {...BASE_PROPS} {...props}>
      <circle cx="4.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      <circle cx="4.5" cy="12" r="1" fill="currentColor" stroke="none" />
      <circle cx="4.5" cy="17.5" r="1" fill="currentColor" stroke="none" />
      <path d="M8.5 6.5h11.5" />
      <path d="M8.5 12h11.5" />
      <path d="M8.5 17.5h11.5" />
    </svg>
  )
}

export function FileTextIcon(props: IconProps) {
  return (
    <svg {...BASE_PROPS} {...props}>
      <path d="M7 3.5h7l4 4v12a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-15a1 1 0 0 1 1-1Z" />
      <path d="M14 3.5v4h4" />
      <path d="M9 13h6" />
      <path d="M9 16.5h6" />
    </svg>
  )
}

export function LayersIcon(props: IconProps) {
  return (
    <svg {...BASE_PROPS} {...props}>
      <path d="M12 3.5 20.5 8 12 12.5 3.5 8Z" />
      <path d="m3.5 12 8.5 4.5 8.5-4.5" />
      <path d="m3.5 16 8.5 4.5 8.5-4.5" />
    </svg>
  )
}

export function GlobeIcon(props: IconProps) {
  return (
    <svg {...BASE_PROPS} {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17" />
      <path d="M12 3.5c2.4 2.3 3.7 5.2 3.7 8.5s-1.3 6.2-3.7 8.5c-2.4-2.3-3.7-5.2-3.7-8.5s1.3-6.2 3.7-8.5Z" />
    </svg>
  )
}

export function BookIcon(props: IconProps) {
  return (
    <svg {...BASE_PROPS} {...props}>
      <path d="M4 5.5c0-1.1.9-2 2-2h6v15H6c-1.1 0-2 .9-2 2Z" />
      <path d="M12 3.5h6c1.1 0 2 .9 2 2V19H6c-1.1 0-2 .9-2 2" />
    </svg>
  )
}

export function ClockIcon(props: IconProps) {
  return (
    <svg {...BASE_PROPS} {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </svg>
  )
}

export function AlertTriangleIcon(props: IconProps) {
  return (
    <svg {...BASE_PROPS} {...props}>
      <path d="M12 4 21 19.5H3Z" />
      <path d="M12 10v4" />
      <circle cx="12" cy="16.7" r="0.15" fill="currentColor" />
    </svg>
  )
}

export function CheckCircleIcon(props: IconProps) {
  return (
    <svg {...BASE_PROPS} {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="m8.3 12.3 2.4 2.4 5-5" />
    </svg>
  )
}

export function UsersIcon(props: IconProps) {
  return (
    <svg {...BASE_PROPS} {...props}>
      <circle cx="9" cy="8.5" r="3" />
      <path d="M3.5 19.5c0-3 2.5-5.3 5.5-5.3s5.5 2.3 5.5 5.3" />
      <path d="M15.5 6a3 3 0 0 1 0 6" />
      <path d="M15.2 14.3c2.6.3 4.6 2.5 4.6 5.2" />
    </svg>
  )
}

export function PencilIcon(props: IconProps) {
  return (
    <svg {...BASE_PROPS} {...props}>
      <path d="m15 4.5 4.5 4.5-11 11H4v-4.5Z" />
      <path d="m13.3 6.2 4.5 4.5" />
    </svg>
  )
}

export function TrashIcon(props: IconProps) {
  return (
    <svg {...BASE_PROPS} {...props}>
      <path d="M5 7h14" />
      <path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
      <path d="M6.5 7 7.3 19a1.5 1.5 0 0 0 1.5 1.4h6.4a1.5 1.5 0 0 0 1.5-1.4L17.5 7" />
      <path d="M10.3 11v6" />
      <path d="M13.7 11v6" />
    </svg>
  )
}

export function LogOutIcon(props: IconProps) {
  return (
    <svg {...BASE_PROPS} {...props}>
      <path d="M9 4.5H6a1.5 1.5 0 0 0-1.5 1.5v12A1.5 1.5 0 0 0 6 19.5h3" />
      <path d="M14 15.5 19 12l-5-3.5" />
      <path d="M19 12H9" />
    </svg>
  )
}
