import type { ReactNode } from 'react'

import { Link, useLocation } from 'react-router-dom'

import { useAuth } from '@/features/auth/hooks/useAuth'

import { Logo } from './Logo'
import { Button } from './ui/Button'

const NAV_ITEMS = [
  { to: '/admin', label: 'DSAR Queue' },
  { to: '/admin/cases', label: 'Cases' },
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
    <div className="min-h-screen bg-neutral-50">
      <nav className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-8 py-3">
          <div className="flex items-center gap-8">
            <Logo size="sm" to="/admin" />
            <div className="flex gap-6">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={
                    location.pathname === item.to
                      ? 'border-b-2 border-indigo-600 py-1 text-sm font-semibold text-neutral-900'
                      : 'border-b-2 border-transparent py-1 text-sm text-neutral-500 hover:text-neutral-900'
                  }
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={logout}>
            Sign out
          </Button>
        </div>
      </nav>
      {children}
    </div>
  )
}
