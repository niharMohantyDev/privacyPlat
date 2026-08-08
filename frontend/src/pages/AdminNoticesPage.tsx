import { MissingDemoConfig } from '@/components/MissingDemoConfig'
import { NoticeManagementPage } from '@/features/notices/components/NoticeManagementPage'
import { DEMO_ORGANIZATION_ID } from '@/lib/demoConfig'

export function AdminNoticesPage() {
  if (!DEMO_ORGANIZATION_ID) {
    return <MissingDemoConfig variable="VITE_DEMO_ORGANIZATION_ID" />
  }

  return <NoticeManagementPage organizationId={DEMO_ORGANIZATION_ID} />
}
