import { AuthApiClient } from '../api/AuthApiClient'
import { LocalStorageTokenStorage } from '../storage/LocalStorageTokenStorage'
import type { TokenStorage } from '../storage/TokenStorage'
import type { IAuthApiClient } from '../types'

/**
 * Handles what happens when an authenticated request comes back 401.
 * The access token is short-lived by design (SIMPLE_JWT
 * ACCESS_TOKEN_LIFETIME = 30 min), so an expired-but-otherwise-valid
 * session should silently refresh rather than bouncing the user back
 * to the login screen mid-task. Concurrent 401s (e.g. several queries
 * firing at once on a dashboard) share one in-flight refresh call via
 * refreshPromise, instead of each independently hitting the refresh
 * endpoint and racing to rotate the same refresh token.
 */
export class AuthSessionManager {
  private readonly authClient: IAuthApiClient
  private readonly tokenStorage: TokenStorage
  private refreshPromise: Promise<string> | null = null

  constructor(
    authClient: IAuthApiClient = new AuthApiClient(),
    tokenStorage: TokenStorage = new LocalStorageTokenStorage(),
  ) {
    this.authClient = authClient
    this.tokenStorage = tokenStorage
  }

  /** Resolves with a fresh access token, or rejects if the session can't be recovered. */
  refreshAccessToken(): Promise<string> {
    if (!this.refreshPromise) {
      this.refreshPromise = this.doRefresh().finally(() => {
        this.refreshPromise = null
      })
    }
    return this.refreshPromise
  }

  private async doRefresh(): Promise<string> {
    const refreshToken = this.tokenStorage.getRefreshToken()
    if (!refreshToken) {
      throw new Error('No refresh token available.')
    }
    const tokens = await this.authClient.refresh(refreshToken)
    this.tokenStorage.save(tokens)
    return tokens.access
  }

  /** The session couldn't be recovered — clear it and send the user back to sign in. */
  expire(): void {
    this.tokenStorage.clear()
    window.location.assign('/admin/login')
  }
}
