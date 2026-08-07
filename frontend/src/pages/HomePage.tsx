import { useQuery } from '@tanstack/react-query'

import { api } from '@/lib/api'

export function HomePage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['healthz'],
    queryFn: () => api.get<{ status: string }>('/healthz').then((res) => res.data),
  })

  return (
    <main className="mx-auto max-w-2xl p-8">
      <h1 className="text-2xl font-semibold">Privacy Platform</h1>
      <p className="mt-2 text-sm text-neutral-500">
        Backend health check:{' '}
        {isLoading ? 'checking...' : isError ? 'unreachable' : data?.status}
      </p>
    </main>
  )
}
