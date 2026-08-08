import type { ReactNode } from 'react'

import { Link, useLocation } from 'react-router-dom'

import { useAuth } from '@/features/auth/hooks/useAuth'

import {
  BookIcon,
  FileTextIcon,
  GlobeIcon,
  GridIcon,
  InboxIcon,
  LayersIcon,
  ListIcon,
  LogOutIcon,
  ShieldIcon,
} from './icons'
import { Logo } from './Logo'

const NAV_ITEMS = [
  { to: '/admin', label: 'Overview', icon: GridIcon },
  { to: '/admin/requests', label: 'DSAR Queue', icon: InboxIcon },
  { to: '/admin/cases', label: 'Cases', icon: ShieldIcon },
  { to: '/admin/ropa', label: 'RoPA', icon: BookIcon },
  { to: '/admin/purposes', label: 'Purposes', icon: ListIcon },
  { to: '/admin/consent-log', label: 'Consent Log', icon: FileTextIcon },
  { to: '/admin/workspaces', label: 'Workspaces', icon: LayersIcon },
  { to: '/admin/assets', label: 'Assets', icon: GlobeIcon },
] as const

interface AdminLayoutProps {
  children: ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const { logout } = useAuth()
  const location = useLocation()
  const activeItem = NAV_ITEMS.find((item) => item.to === location.pathname)

  return (
    <div className="flex min-h-screen bg-neutral-50">
      <aside className="flex w-64 shrink-0 flex-col border-r border-neutral-200 bg-white">
        <div className="border-b border-neutral-100 px-5 py-5">
          <Logo size="sm" to="/admin" />
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.to
            const Icon = item.icon
            return (
              <Link
                key={item.to}
                to={item.to}
                className={
                  isActive
                    ? 'flex items-center gap-3 rounded-lg bg-indigo-50 px-3 py-2 text-sm font-semibold text-indigo-700'
                    : 'flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-neutral-600 transition-colors hover:bg-neutral-50 hover:text-neutral-900'
                }
              >
                <Icon className="shrink-0" width={18} height={18} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="border-t border-neutral-100 p-3">
          <button
            type="button"
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-neutral-500 transition-colors hover:bg-red-50 hover:text-red-600"
          >
            <LogOutIcon width={18} height={18} className="shrink-0" />
            Sign out
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-neutral-200 bg-white px-8 py-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">Staff Console</p>
            <h1 className="text-lg font-semibold text-neutral-900">{activeItem?.label ?? 'Admin'}</h1>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-xs font-medium text-neutral-600">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Signed in
          </div>
        </header>

        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  )
}
