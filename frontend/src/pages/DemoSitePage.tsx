import { MissingDemoConfig } from '@/components/MissingDemoConfig'
import { ConsentManager } from '@/features/consent/components/ConsentManager'
import { DEMO_ASSET_PUBLIC_KEY } from '@/lib/demoConfig'

/**
 * Stands in for "a customer's actual website" — the point is that the
 * consent banner is just a component dropped onto an otherwise normal
 * page, calling the public (unauthenticated, cross-origin-safe) Consent
 * API keyed by the asset's public_key.
 */
export function DemoSitePage() {
  if (!DEMO_ASSET_PUBLIC_KEY) {
    return <MissingDemoConfig variable="VITE_DEMO_ASSET_PUBLIC_KEY" />
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
      <ConsentManager publicKey={DEMO_ASSET_PUBLIC_KEY} />
    </>
  )
}
