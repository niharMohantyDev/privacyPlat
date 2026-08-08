import { LinkButton } from '@/components/ui/LinkButton'

export function CtaBanner() {
  return (
    <section className="mx-auto max-w-6xl px-6 pb-20">
      <div className="rounded-2xl bg-indigo-600 px-8 py-14 text-center">
        <h2 className="text-3xl font-semibold tracking-tight text-white">Ready to see it running?</h2>
        <p className="mx-auto mt-3 max-w-xl text-indigo-100">
          Every demo on this site calls the real API — nothing here is a mockup.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <LinkButton to="/demo" variant="secondary" size="lg">
            View live demo
          </LinkButton>
          <LinkButton
            to="/admin/login"
            size="lg"
            className="border border-indigo-300 bg-transparent text-white hover:bg-indigo-500"
          >
            Staff sign in
          </LinkButton>
        </div>
      </div>
    </section>
  )
}
