interface MissingDemoConfigProps {
  variable: string
}

export function MissingDemoConfig({ variable }: MissingDemoConfigProps) {
  return (
    <main className="mx-auto max-w-2xl p-8">
      <h1 className="text-2xl font-semibold">Configuration needed</h1>
      <p className="mt-2 text-sm text-red-600">
        {variable} is not set. Run{' '}
        <code className="rounded bg-neutral-100 px-1">python manage.py seed_demo</code> in
        backend/ and put the printed value in frontend/.env.
      </p>
    </main>
  )
}
