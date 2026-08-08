import { MissingDemoConfig } from '@/components/MissingDemoConfig'
import { WorkspaceManagementPage } from '@/features/organization/components/WorkspaceManagementPage'
import { DEMO_ORGANIZATION_ID } from '@/lib/demoConfig'

export function AdminWorkspacesPage() {
  if (!DEMO_ORGANIZATION_ID) {
    return <MissingDemoConfig variable="VITE_DEMO_ORGANIZATION_ID" />
  }

  return <WorkspaceManagementPage organizationId={DEMO_ORGANIZATION_ID} />
}
