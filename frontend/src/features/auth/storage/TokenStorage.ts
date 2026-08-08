import type { AuthTokens } from '../types'

export interface TokenStorage {
  getAccessToken(): string | null
  save(tokens: AuthTokens): void
  clear(): void
}
