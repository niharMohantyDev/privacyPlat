import { ConsentManager } from '@/features/consent/components/ConsentManager'

const PUBLIC_KEY = import.meta.env.VITE_DEMO_ASSET_PUBLIC_KEY as string | undefined

/**
 * Stands in for "a customer's actual website" — the point is that the
 * consent banner is just a component dropped onto an otherwise normal
 * page, calling the public (unauthenticated, cross-origin-safe) Consent
 * API keyed by the asset's public_key.
 */
export function DemoSitePage() {
  if (!PUBLIC_KEY) {
    return (
      <main className="mx-auto max-w-2xl p-8">
        <h1 className="text-2xl font-semibold">Demo site</h1>
        <p className="mt-2 text-sm text-red-600">
          VITE_DEMO_ASSET_PUBLIC_KEY is not set. Run{' '}
          <code className="rounded bg-neutral-100 px-1">python manage.py seed_demo</code> in
          backend/ and put the printed public_key in frontend/.env.
        </p>
      </main>
    )
  }

  return (
    <>
      <main className="mx-auto max-w-2xl p-8">
        <h1 className="text-2xl font-semibold">Acme — Demo Site</h1>
        <p className="mt-4 text-sm text-neutral-600">
          This page stands in for a real customer website. The banner at the bottom is the
          embeddable Consent Banner widget, calling the platform's public Consent API.
        </p>
        <p className="mt-4 text-sm text-neutral-600">
          Reload after deciding — the banner won't reappear, since your decision is fetched and
          stored. Clear localStorage to reset it.
        </p>
      </main>
      <ConsentManager publicKey={PUBLIC_KEY} />
    </>
  )
}
