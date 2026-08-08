import { LinkButton } from '@/components/ui/LinkButton'
import { APP_DESCRIPTION } from '@/lib/brand'

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 -top-40 -z-10 flex justify-center overflow-hidden blur-3xl"
      >
        <div className="aspect-square w-[50rem] rounded-full bg-gradient-to-tr from-indigo-200 to-sky-100 opacity-50" />
      </div>

      <div className="mx-auto max-w-4xl px-6 py-24 text-center sm:py-32">
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
    </section>
  )
}
