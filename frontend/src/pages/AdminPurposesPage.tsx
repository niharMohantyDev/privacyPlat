import { MissingDemoConfig } from '@/components/MissingDemoConfig'
import { PurposeManagementPage } from '@/features/consent/components/PurposeManagementPage'
import { DEMO_ORGANIZATION_ID } from '@/lib/demoConfig'

export function AdminPurposesPage() {
  if (!DEMO_ORGANIZATION_ID) {
    return <MissingDemoConfig variable="VITE_DEMO_ORGANIZATION_ID" />
  }

  return <PurposeManagementPage organizationId={DEMO_ORGANIZATION_ID} />
}
