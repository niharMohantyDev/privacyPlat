// Centralizes the local-dev demo seed values (see backend's seed_demo
// management command) so every page that needs one reads from a single
// place instead of repeating import.meta.env.VITE_DEMO_* everywhere.
export const DEMO_ASSET_PUBLIC_KEY = import.meta.env.VITE_DEMO_ASSET_PUBLIC_KEY as
  | string
  | undefined
export const DEMO_ORGANIZATION_ID = import.meta.env.VITE_DEMO_ORGANIZATION_ID as
  | string
  | undefined
