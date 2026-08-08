import type { ReactNode } from 'react'

import { Navigate } from 'react-router-dom'

import { LocalStorageTokenStorage } from '../storage/LocalStorageTokenStorage'
import type { TokenStorage } from '../storage/TokenStorage'

interface RequireAuthProps {
  children: ReactNode
  storage?: TokenStorage
}

/**
 * Route guard. Reads localStorage directly (via the injectable storage
 * strategy) rather than sharing React state with useAuth — localStorage
 * is already the single source of truth, and this way the guard doesn't
 * need a Context provider wiring every login/logout call site together.
 */
export function RequireAuth({ children, storage }: RequireAuthProps) {
  const tokenStorage = storage ?? new LocalStorageTokenStorage()
  const isAuthenticated = Boolean(tokenStorage.getAccessToken())

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />
  }

  return <>{children}</>
}
