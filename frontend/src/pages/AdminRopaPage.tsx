import { MissingDemoConfig } from '@/components/MissingDemoConfig'
import { RopaRegisterPage } from '@/features/ropa/components/RopaRegisterPage'
import { DEMO_ORGANIZATION_ID } from '@/lib/demoConfig'

export function AdminRopaPage() {
  if (!DEMO_ORGANIZATION_ID) {
    return <MissingDemoConfig variable="VITE_DEMO_ORGANIZATION_ID" />
  }

  return <RopaRegisterPage organizationId={DEMO_ORGANIZATION_ID} />
}
