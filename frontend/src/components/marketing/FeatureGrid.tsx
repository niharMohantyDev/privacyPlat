import { Link } from 'react-router-dom'

import { BookIcon, CheckCircleIcon, GlobeIcon, GridIcon, ShieldIcon, UsersIcon } from '@/components/icons'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'

import { PILLAR_FEATURES } from './marketingData'

const PILLAR_ICONS: Record<string, typeof GlobeIcon> = {
  discover: GlobeIcon,
  consent: CheckCircleIcon,
  rights: UsersIcon,
  govern: BookIcon,
  protect: ShieldIcon,
  prove: GridIcon,
}

export function FeatureGrid() {
  return (
    <section id="features" className="mx-auto max-w-6xl px-6 py-20">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-semibold tracking-tight text-neutral-900">Six pillars, one platform</h2>
        <p className="mt-3 text-neutral-600">
          Every question a privacy program has to answer, covered end to end.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {PILLAR_FEATURES.map((feature) => {
          const Icon = PILLAR_ICONS[feature.code] ?? GridIcon
          const content = (
            <Card
              className={
                feature.href
                  ? 'h-full transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-neutral-200/60'
                  : 'h-full opacity-80'
              }
            >
              <div className="flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                  <Icon width={20} height={20} />
                </div>
                <Badge variant={feature.status === 'live' ? 'success' : 'neutral'}>
                  {feature.status === 'live' ? 'Live' : 'Coming soon'}
                </Badge>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-neutral-900">{feature.title}</h3>
              <p className="mt-1 text-sm font-medium text-indigo-600">{feature.question}</p>
              <p className="mt-3 text-sm text-neutral-600">{feature.description}</p>
              {feature.href && <p className="mt-4 text-sm font-medium text-indigo-600">See it live →</p>}
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
