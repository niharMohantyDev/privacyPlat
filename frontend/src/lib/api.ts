import axios from 'axios'

import { AuthSessionManager } from '@/features/auth/session/AuthSessionManager'
import { createAuthResponseInterceptor } from '@/features/auth/session/createAuthResponseInterceptor'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000',
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// The access token expires after 30 minutes (SIMPLE_JWT
// ACCESS_TOKEN_LIFETIME) — without this, any request made after that
// window fails with a raw 401 and the user has to know to manually log
// out and back in. See createAuthResponseInterceptor for the retry-once
// logic and AuthSessionManager for the refresh/expire mechanics.
const sessionManager = new AuthSessionManager()
api.interceptors.response.use((response) => response, createAuthResponseInterceptor(sessionManager, api))
