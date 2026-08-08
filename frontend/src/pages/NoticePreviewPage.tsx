import { Link } from 'react-router-dom'

import { MissingDemoConfig } from '@/components/MissingDemoConfig'
import { NoticePreview } from '@/features/notices/components/NoticePreview'
import { DEMO_ASSET_PUBLIC_KEY } from '@/lib/demoConfig'

/** Stands in for a customer's published "Privacy Policy" page. */
export function NoticePreviewPage() {
  if (!DEMO_ASSET_PUBLIC_KEY) {
    return <MissingDemoConfig variable="VITE_DEMO_ASSET_PUBLIC_KEY" />
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="border-b border-amber-200 bg-amber-50 px-6 py-2 text-center text-xs text-amber-800">
        Simulated customer website — this page runs on acme.com, not Consentra.{' '}
        <Link to="/" className="underline">
          ← Back to Consentra
        </Link>
      </div>
      <main className="mx-auto max-w-2xl px-6 py-16">
        <NoticePreview publicKey={DEMO_ASSET_PUBLIC_KEY} noticeType="privacy_policy" />
      </main>
    </div>
  )
}
