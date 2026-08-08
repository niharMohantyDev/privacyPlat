import type { ReactNode } from 'react'

import { Link, useLocation } from 'react-router-dom'

import { useAuth } from '@/features/auth/hooks/useAuth'

const NAV_ITEMS = [
  { to: '/admin', label: 'DSAR Queue' },
  { to: '/admin/purposes', label: 'Purposes' },
  { to: '/admin/consent-log', label: 'Consent Log' },
  { to: '/admin/workspaces', label: 'Workspaces' },
  { to: '/admin/assets', label: 'Assets' },
] as const

interface AdminLayoutProps {
  children: ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const { logout } = useAuth()
  const location = useLocation()

  return (
    <div className="min-h-screen">
      <nav className="border-b border-neutral-200 dark:border-neutral-800">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-8 py-4">
          <div className="flex gap-6">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={
                  location.pathname === item.to
                    ? 'text-sm font-semibold text-neutral-900 dark:text-white'
                    : 'text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                }
              >
                {item.label}
              </Link>
            ))}
          </div>
          <button type="button" onClick={logout} className="text-sm text-blue-600 underline">
            Sign out
          </button>
        </div>
      </nav>
      {children}
    </div>
  )
}
