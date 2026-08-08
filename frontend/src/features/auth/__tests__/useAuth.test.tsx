import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act, renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useAuth } from '../hooks/useAuth'
import type { TokenStorage } from '../storage/TokenStorage'
import type { AuthTokens, IAuthApiClient } from '../types'

function fakeStorage(): TokenStorage {
  let tokens: AuthTokens | null = null
  return {
    getAccessToken: () => tokens?.access ?? null,
    getRefreshToken: () => tokens?.refresh ?? null,
    save: (t) => {
      tokens = t
    },
    clear: () => {
      tokens = null
    },
  }
}

function wrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient()
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}

describe('useAuth', () => {
  it('starts unauthenticated, becomes authenticated after a successful login', async () => {
    const client: IAuthApiClient = {
      login: vi.fn().mockResolvedValue({ access: 'a', refresh: 'r' }),
      refresh: vi.fn(),
    }
    const storage = fakeStorage()

    const { result } = renderHook(() => useAuth({ client, storage }), { wrapper })
    expect(result.current.isAuthenticated).toBe(false)

    await act(async () => {
      await result.current.login({ email: 'staff@demo-org.test', password: 'x' })
    })

    await waitFor(() => expect(result.current.isAuthenticated).toBe(true))
    expect(storage.getAccessToken()).toBe('a')
  })

  it('logout() clears the token and flips isAuthenticated back to false', async () => {
    const client: IAuthApiClient = {
      login: vi.fn().mockResolvedValue({ access: 'a', refresh: 'r' }),
      refresh: vi.fn(),
    }
    const storage = fakeStorage()

    const { result } = renderHook(() => useAuth({ client, storage }), { wrapper })
    await act(async () => {
      await result.current.login({ email: 'staff@demo-org.test', password: 'x' })
    })
    await waitFor(() => expect(result.current.isAuthenticated).toBe(true))

    act(() => result.current.logout())
    expect(result.current.isAuthenticated).toBe(false)
    expect(storage.getAccessToken()).toBeNull()
  })
})
