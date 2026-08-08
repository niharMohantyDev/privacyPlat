import { MissingDemoConfig } from '@/components/MissingDemoConfig'
import { DSARPortal } from '@/features/rights/components/DSARPortal'
import { DEMO_ASSET_PUBLIC_KEY } from '@/lib/demoConfig'

/** Stands in for a customer's "Privacy Rights" / "Do Not Sell My Data" page. */
export function RightsPortalPage() {
  if (!DEMO_ASSET_PUBLIC_KEY) {
    return <MissingDemoConfig variable="VITE_DEMO_ASSET_PUBLIC_KEY" />
  }

  return (
    <main className="mx-auto max-w-2xl p-8">
      <h1 className="text-2xl font-semibold">Manage your privacy</h1>
      <p className="mt-2 mb-8 text-sm text-neutral-600 dark:text-neutral-300">
        Submit a request about the personal data Acme holds about you. This form calls the
        platform's public DSAR API directly — the same one a real customer's privacy page would
        embed.
      </p>
      <DSARPortal publicKey={DEMO_ASSET_PUBLIC_KEY} />
    </main>
  )
}
