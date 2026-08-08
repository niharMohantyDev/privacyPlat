import { DSARPortal } from '@/features/rights/components/DSARPortal'

const PUBLIC_KEY = import.meta.env.VITE_DEMO_ASSET_PUBLIC_KEY as string | undefined

/** Stands in for a customer's "Privacy Rights" / "Do Not Sell My Data" page. */
export function RightsPortalPage() {
  if (!PUBLIC_KEY) {
    return (
      <main className="mx-auto max-w-2xl p-8">
        <h1 className="text-2xl font-semibold">Privacy rights</h1>
        <p className="mt-2 text-sm text-red-600">
          VITE_DEMO_ASSET_PUBLIC_KEY is not set. Run{' '}
          <code className="rounded bg-neutral-100 px-1">python manage.py seed_demo</code> in
          backend/ and put the printed public_key in frontend/.env.
        </p>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-2xl p-8">
      <h1 className="text-2xl font-semibold">Manage your privacy</h1>
      <p className="mt-2 mb-8 text-sm text-neutral-600 dark:text-neutral-300">
        Submit a request about the personal data Acme holds about you. This form calls the
        platform's public DSAR API directly — the same one a real customer's privacy page would
        embed.
      </p>
      <DSARPortal publicKey={PUBLIC_KEY} />
    </main>
  )
}
