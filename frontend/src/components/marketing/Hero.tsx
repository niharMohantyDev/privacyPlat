import { LinkButton } from '@/components/ui/LinkButton'
import { APP_DESCRIPTION } from '@/lib/brand'

const PREVIEW_STATS = [
  { label: 'Open DSARs', value: '2', tone: 'text-neutral-900' },
  { label: 'On-time rate', value: '100%', tone: 'text-emerald-600' },
  { label: 'Open breaches', value: '1', tone: 'text-amber-600' },
]

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 -top-40 -z-10 flex justify-center overflow-hidden blur-3xl"
      >
        <div className="aspect-square w-[50rem] rounded-full bg-gradient-to-tr from-indigo-200 to-sky-100 opacity-50" />
      </div>

      <div className="mx-auto max-w-4xl px-6 pt-24 text-center sm:pt-32">
        <span className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
          Consent · Rights · Governance — one platform
        </span>
        <h1 className="mt-6 text-4xl font-semibold tracking-tight text-neutral-900 sm:text-6xl">
          Privacy compliance, <span className="text-indigo-600">wired in.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-neutral-600">{APP_DESCRIPTION}</p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <LinkButton to="/demo" size="lg">
            View live demo
          </LinkButton>
          <LinkButton to="/admin/login" variant="outline" size="lg">
            Staff sign in
          </LinkButton>
        </div>
      </div>

      <div className="relative mx-auto mt-16 max-w-5xl px-6 pb-8 sm:mt-20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-x-10 top-10 -z-10 h-full bg-gradient-to-b from-indigo-50/80 to-transparent blur-2xl"
        />
        <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-2xl shadow-indigo-200/40">
          <div className="flex items-center gap-1.5 border-b border-neutral-100 bg-neutral-50 px-4 py-3">
            <span className="h-2.5 w-2.5 rounded-full bg-red-300" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
            <span className="ml-3 text-xs text-neutral-400">app.consentra.io/admin</span>
          </div>
          <div className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-3 sm:p-8">
            <div className="space-y-4 sm:col-span-2">
              <p className="text-left text-xs font-semibold uppercase tracking-wide text-neutral-400">
                Compliance Overview
              </p>
              <div className="grid grid-cols-3 gap-3">
                {PREVIEW_STATS.map((stat) => (
                  <div key={stat.label} className="rounded-lg border border-neutral-100 bg-neutral-50/60 p-3 text-left">
                    <p className="text-[10px] font-medium uppercase tracking-wide text-neutral-400">
                      {stat.label}
                    </p>
                    <p className={`mt-1 text-lg font-semibold ${stat.tone}`}>{stat.value}</p>
                  </div>
                ))}
              </div>
              <div className="space-y-2 rounded-lg border border-neutral-100 bg-neutral-50/60 p-3 text-left">
                <div className="flex items-center justify-between text-xs text-neutral-500">
                  <span>Regulator notified</span>
                  <span className="font-medium text-emerald-600">Done</span>
                </div>
                <div className="flex items-center justify-between text-xs text-neutral-500">
                  <span>Data subjects notified</span>
                  <span className="font-medium text-amber-600">Pending · due in 21d</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-neutral-100 bg-neutral-50/60 p-4">
              <div
                aria-hidden="true"
                className="h-24 w-24 rounded-full"
                style={{
                  background:
                    'conic-gradient(#4f46e5 0% 72%, #e5e5e5 72% 100%)',
                  mask: 'radial-gradient(farthest-side, transparent calc(100% - 12px), black calc(100% - 11px))',
                  WebkitMask: 'radial-gradient(farthest-side, transparent calc(100% - 12px), black calc(100% - 11px))',
                }}
              />
              <p className="text-xs font-medium text-neutral-500">72% resolved on time</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
