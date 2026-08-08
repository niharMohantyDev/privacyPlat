import axios from 'axios'

/**
 * Separate from `api` (lib/api.ts) on purpose: that instance attaches
 * the platform JWT via an interceptor. The consent banner is called by
 * anonymous website visitors who have no platform session at all —
 * reusing `api` would either send a stale/wrong token or crash trying
 * to read one that doesn't exist. Two responsibilities, two clients.
 */
export const publicApi = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000',
})
