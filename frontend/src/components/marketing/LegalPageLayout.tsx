import type { ReactNode } from 'react'

import { MarketingFooter } from './MarketingFooter'
import { MarketingHeader } from './MarketingHeader'

interface LegalPageLayoutProps {
  title: string
  lastUpdated: string
  children: ReactNode
}

export function LegalPageLayout({ title, lastUpdated, children }: LegalPageLayoutProps) {
  return (
    <div className="min-h-screen bg-white">
      <MarketingHeader />
      <main className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-900">{title}</h1>
        <p className="mt-2 text-sm text-neutral-500">Last updated: {lastUpdated}</p>
        <div className="mt-10 space-y-10">{children}</div>
      </main>
      <MarketingFooter />
    </div>
  )
}

interface LegalSectionProps {
  heading: string
  children: ReactNode
}

export function LegalSection({ heading, children }: LegalSectionProps) {
  return (
    <section>
      <h2 className="text-xl font-semibold text-neutral-900">{heading}</h2>
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-neutral-600">{children}</div>
    </section>
  )
}
