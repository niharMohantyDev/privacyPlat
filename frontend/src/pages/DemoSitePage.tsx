import { Link } from 'react-router-dom'

import { MissingDemoConfig } from '@/components/MissingDemoConfig'
import { Card } from '@/components/ui/Card'
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
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <div className="border-b border-amber-200 bg-amber-50 px-6 py-2 text-center text-xs text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200">
        Simulated customer website — everything below runs on acme.com, not Consentra.{' '}
        <Link to="/" className="underline">
          ← Back to Consentra
        </Link>
      </div>
      <main className="mx-auto max-w-2xl p-8">
        <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white">Acme Inc.</h1>
        <Card className="mt-6">
          <p className="text-sm text-neutral-600 dark:text-neutral-300">
            This page stands in for a real customer website. The banner at the bottom is the
            embeddable Consent Banner widget, calling the platform's public Consent API.
          </p>
          <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-300">
            Reload after deciding — the banner won't reappear, since your decision is fetched and
            stored. Clear localStorage to reset it.
          </p>
        </Card>
      </main>
      <ConsentManager publicKey={DEMO_ASSET_PUBLIC_KEY} />
    </div>
  )
}
