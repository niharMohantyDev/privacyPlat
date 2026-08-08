import { MissingDemoConfig } from '@/components/MissingDemoConfig'
import { AssetManagementPage } from '@/features/organization/components/AssetManagementPage'
import { DEMO_ORGANIZATION_ID } from '@/lib/demoConfig'

export function AdminAssetsPage() {
  if (!DEMO_ORGANIZATION_ID) {
    return <MissingDemoConfig variable="VITE_DEMO_ORGANIZATION_ID" />
  }

  return <AssetManagementPage organizationId={DEMO_ORGANIZATION_ID} />
}
