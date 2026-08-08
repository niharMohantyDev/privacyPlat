import { MissingDemoConfig } from '@/components/MissingDemoConfig'
import { DSARQueuePage } from '@/features/rights/components/DSARQueuePage'
import { DEMO_ORGANIZATION_ID } from '@/lib/demoConfig'

export function AdminRequestsPage() {
  if (!DEMO_ORGANIZATION_ID) {
    return <MissingDemoConfig variable="VITE_DEMO_ORGANIZATION_ID" />
  }

  return <DSARQueuePage organizationId={DEMO_ORGANIZATION_ID} />
}
