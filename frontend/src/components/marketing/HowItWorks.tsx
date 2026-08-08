const STEPS = [
  {
    step: '01',
    title: 'Visitors decide',
    description:
      'An embeddable banner asks for consent per purpose, and lets people submit a rights request at any time — both call your live API, not a static form.',
  },
  {
    step: '02',
    title: 'Staff stay in control',
    description:
      'Your team manages the purpose taxonomy, triages requests through their real statutory deadlines, and can revoke an integration instantly.',
  },
  {
    step: '03',
    title: 'Everything is provable',
    description:
      'Every decision — consent given, request resolved, purpose changed — lands in an audit trail you can hand to a regulator, not reconstruct after the fact.',
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-neutral-50 py-20 dark:bg-neutral-900/40">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-white">
            How it works
          </h2>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-10 sm:grid-cols-3">
          {STEPS.map((item) => (
            <div key={item.step}>
              <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">{item.step}</span>
              <h3 className="mt-2 text-lg font-semibold text-neutral-900 dark:text-white">{item.title}</h3>
              <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
