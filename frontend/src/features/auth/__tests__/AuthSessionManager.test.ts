import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { AuthSessionManager } from '../session/AuthSessionManager'
import type { TokenStorage } from '../storage/TokenStorage'
import type { AuthTokens, IAuthApiClient } from '../types'

function fakeStorage(initial: AuthTokens | null = null): TokenStorage {
  let tokens = initial
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

describe('AuthSessionManager', () => {
  // jsdom's window.location doesn't allow spying on its own methods
  // directly (assign is non-configurable there), so the whole property
  // is swapped out for a plain stub for the duration of these tests.
  const originalLocation = window.location
  let assignSpy: ReturnType<typeof vi.fn>

  beforeEach(() => {
    assignSpy = vi.fn()
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { ...originalLocation, assign: assignSpy },
    })
  })

  afterEach(() => {
    Object.defineProperty(window, 'location', { configurable: true, value: originalLocation })
  })

  it('refreshes using the stored refresh token and saves the rotated pair', async () => {
    const storage = fakeStorage({ access: 'stale', refresh: 'r1' })
    const authClient: IAuthApiClient = {
      login: vi.fn(),
      refresh: vi.fn().mockResolvedValue({ access: 'fresh', refresh: 'r2' }),
    }
    const manager = new AuthSessionManager(authClient, storage)

    const accessToken = await manager.refreshAccessToken()

    expect(authClient.refresh).toHaveBeenCalledWith('r1')
    expect(accessToken).toBe('fresh')
    expect(storage.getAccessToken()).toBe('fresh')
    expect(storage.getRefreshToken()).toBe('r2')
  })

  it('dedupes concurrent refresh calls into a single request', async () => {
    const storage = fakeStorage({ access: 'stale', refresh: 'r1' })
    let resolveRefresh: (tokens: AuthTokens) => void = () => {}
    const authClient: IAuthApiClient = {
      login: vi.fn(),
      refresh: vi.fn(
        () =>
          new Promise<AuthTokens>((resolve) => {
            resolveRefresh = resolve
          }),
      ),
    }
    const manager = new AuthSessionManager(authClient, storage)

    const first = manager.refreshAccessToken()
    const second = manager.refreshAccessToken()
    resolveRefresh({ access: 'fresh', refresh: 'r2' })

    await expect(first).resolves.toBe('fresh')
    await expect(second).resolves.toBe('fresh')
    expect(authClient.refresh).toHaveBeenCalledOnce()
  })

  it('allows a new refresh after a prior one finished', async () => {
    const storage = fakeStorage({ access: 'stale', refresh: 'r1' })
    const authClient: IAuthApiClient = {
      login: vi.fn(),
      refresh: vi.fn().mockResolvedValue({ access: 'fresh', refresh: 'r2' }),
    }
    const manager = new AuthSessionManager(authClient, storage)

    await manager.refreshAccessToken()
    await manager.refreshAccessToken()

    expect(authClient.refresh).toHaveBeenCalledTimes(2)
  })

  it('rejects without calling the API when there is no refresh token stored', async () => {
    const storage = fakeStorage(null)
    const authClient: IAuthApiClient = { login: vi.fn(), refresh: vi.fn() }
    const manager = new AuthSessionManager(authClient, storage)

    await expect(manager.refreshAccessToken()).rejects.toThrow()
    expect(authClient.refresh).not.toHaveBeenCalled()
  })

  it('expire() clears storage and redirects to the login page', () => {
    const storage = fakeStorage({ access: 'a', refresh: 'r' })
    const manager = new AuthSessionManager({ login: vi.fn(), refresh: vi.fn() }, storage)

    manager.expire()

    expect(storage.getAccessToken()).toBeNull()
    expect(assignSpy).toHaveBeenCalledWith('/admin/login')
  })
})
