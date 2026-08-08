import { Link } from 'react-router-dom'

import { Card } from '@/components/ui/Card'

import { PILLAR_FEATURES } from './marketingData'

export function FeatureGrid() {
  return (
    <section id="features" className="mx-auto max-w-6xl px-6 py-20">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-white">
          Six pillars, one platform
        </h2>
        <p className="mt-3 text-neutral-600 dark:text-neutral-300">
          Every question a privacy program has to answer, covered end to end.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {PILLAR_FEATURES.map((feature) => {
          const content = (
            <Card
              className={
                feature.href ? 'h-full transition-shadow hover:shadow-md' : 'h-full opacity-80'
              }
            >
              <div className="flex items-start justify-between">
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">{feature.title}</h3>
                <span
                  className={
                    feature.status === 'live'
                      ? 'rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400'
                  }
                >
                  {feature.status === 'live' ? 'Live' : 'Coming soon'}
                </span>
              </div>
              <p className="mt-1 text-sm font-medium text-indigo-600 dark:text-indigo-400">{feature.question}</p>
              <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-300">{feature.description}</p>
              {feature.href && (
                <p className="mt-4 text-sm font-medium text-indigo-600 dark:text-indigo-400">See it live →</p>
              )}
            </Card>
          )

          return feature.href ? (
            <Link key={feature.code} to={feature.href} className="block h-full">
              {content}
            </Link>
          ) : (
            <div key={feature.code}>{content}</div>
          )
        })}
      </div>
    </section>
  )
}
