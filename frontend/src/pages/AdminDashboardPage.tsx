import { DSARQueuePage } from '@/features/rights/components/DSARQueuePage'

const ORGANIZATION_ID = import.meta.env.VITE_DEMO_ORGANIZATION_ID as string | undefined

export function AdminDashboardPage() {
  if (!ORGANIZATION_ID) {
    return (
      <main className="mx-auto max-w-2xl p-8">
        <h1 className="text-2xl font-semibold">Admin</h1>
        <p className="mt-2 text-sm text-red-600">
          VITE_DEMO_ORGANIZATION_ID is not set. Run{' '}
          <code className="rounded bg-neutral-100 px-1">python manage.py seed_demo</code> in
          backend/ and put the printed organization id in frontend/.env.
        </p>
      </main>
    )
  }

  return <DSARQueuePage organizationId={ORGANIZATION_ID} />
}
