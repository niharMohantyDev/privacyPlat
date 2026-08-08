import { MissingDemoConfig } from '@/components/MissingDemoConfig'
import { CaseQueuePage } from '@/features/cases/components/CaseQueuePage'
import { DEMO_ORGANIZATION_ID } from '@/lib/demoConfig'

export function AdminCasesPage() {
  if (!DEMO_ORGANIZATION_ID) {
    return <MissingDemoConfig variable="VITE_DEMO_ORGANIZATION_ID" />
  }

  return <CaseQueuePage organizationId={DEMO_ORGANIZATION_ID} />
}
