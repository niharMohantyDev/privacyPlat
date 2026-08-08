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
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      <MarketingHeader />
      <main className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-white">{title}</h1>
        <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">Last updated: {lastUpdated}</p>
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
      <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">{heading}</h2>
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
        {children}
      </div>
    </section>
  )
}
