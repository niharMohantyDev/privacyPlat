import { Link } from 'react-router-dom'

import { MissingDemoConfig } from '@/components/MissingDemoConfig'
import { GrievancePortal } from '@/features/cases/components/GrievancePortal'
import { DEMO_ASSET_PUBLIC_KEY } from '@/lib/demoConfig'

/** Stands in for a customer's "File a Grievance" / "Contact Us" page. */
export function GrievancePortalPage() {
  if (!DEMO_ASSET_PUBLIC_KEY) {
    return <MissingDemoConfig variable="VITE_DEMO_ASSET_PUBLIC_KEY" />
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="border-b border-amber-200 bg-amber-50 px-6 py-2 text-center text-xs text-amber-800">
        Simulated customer website — this portal runs on acme.com, not Consentra.{' '}
        <Link to="/" className="underline">
          ← Back to Consentra
        </Link>
      </div>
      <main className="mx-auto max-w-2xl p-8">
        <h1 className="text-2xl font-semibold text-neutral-900">File a grievance</h1>
        <p className="mt-2 mb-8 text-sm text-neutral-600">
          Let Acme Inc. know about a privacy-related concern or complaint. This form calls the platform's
          public grievance API directly — the same one a real customer's contact page would embed.
        </p>
        <GrievancePortal publicKey={DEMO_ASSET_PUBLIC_KEY} />
      </main>
    </div>
  )
}
