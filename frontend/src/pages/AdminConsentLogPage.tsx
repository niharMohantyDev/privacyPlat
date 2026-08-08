import { MissingDemoConfig } from '@/components/MissingDemoConfig'
import { ConsentLogPage } from '@/features/consent/components/ConsentLogPage'
import { DEMO_ORGANIZATION_ID } from '@/lib/demoConfig'

export function AdminConsentLogPage() {
  if (!DEMO_ORGANIZATION_ID) {
    return <MissingDemoConfig variable="VITE_DEMO_ORGANIZATION_ID" />
  }

  return <ConsentLogPage organizationId={DEMO_ORGANIZATION_ID} />
}
