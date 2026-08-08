import { useMemo, useState } from 'react'

import { useMutation } from '@tanstack/react-query'

import { AuthApiClient } from '../api/AuthApiClient'
import { LocalStorageTokenStorage } from '../storage/LocalStorageTokenStorage'
import type { TokenStorage } from '../storage/TokenStorage'
import type { IAuthApiClient, LoginInput } from '../types'

interface UseAuthOptions {
  client?: IAuthApiClient
  storage?: TokenStorage
}

export function useAuth({ client, storage }: UseAuthOptions = {}) {
  const authClient = useMemo(() => client ?? new AuthApiClient(), [client])
  const tokenStorage = useMemo(() => storage ?? new LocalStorageTokenStorage(), [storage])
  const [isAuthenticated, setIsAuthenticated] = useState(() => Boolean(tokenStorage.getAccessToken()))

  const loginMutation = useMutation({
    mutationFn: (input: LoginInput) => authClient.login(input),
    onSuccess: (tokens) => {
      tokenStorage.save(tokens)
      setIsAuthenticated(true)
    },
  })

  const logout = () => {
    tokenStorage.clear()
    setIsAuthenticated(false)
  }

  return {
    isAuthenticated,
    login: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,
    logout,
  }
}
