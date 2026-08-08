import { beforeEach, describe, expect, it } from 'vitest'

import { LocalStorageTokenStorage } from '../storage/LocalStorageTokenStorage'

describe('LocalStorageTokenStorage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('returns null when no token is stored', () => {
    expect(new LocalStorageTokenStorage().getAccessToken()).toBeNull()
  })

  it('save() then getAccessToken() round-trips the access token', () => {
    const storage = new LocalStorageTokenStorage()
    storage.save({ access: 'a1', refresh: 'r1' })
    expect(storage.getAccessToken()).toBe('a1')
  })

  it('stores the access token under the key lib/api.ts reads', () => {
    new LocalStorageTokenStorage().save({ access: 'a1', refresh: 'r1' })
    expect(localStorage.getItem('access_token')).toBe('a1')
  })

  it('clear() removes both tokens', () => {
    const storage = new LocalStorageTokenStorage()
    storage.save({ access: 'a1', refresh: 'r1' })
    storage.clear()
    expect(storage.getAccessToken()).toBeNull()
    expect(localStorage.getItem('refresh_token')).toBeNull()
  })

  it('save() then getRefreshToken() round-trips the refresh token', () => {
    const storage = new LocalStorageTokenStorage()
    storage.save({ access: 'a1', refresh: 'r1' })
    expect(storage.getRefreshToken()).toBe('r1')
  })

  it('returns null for getRefreshToken() when no token is stored', () => {
    expect(new LocalStorageTokenStorage().getRefreshToken()).toBeNull()
  })
})
