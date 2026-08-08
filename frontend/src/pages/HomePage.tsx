import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'

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
      <p className="mt-4 text-sm">
        <Link to="/demo" className="text-blue-600 underline">
          View the consent banner demo →
        </Link>
      </p>
      <p className="mt-2 text-sm">
        <Link to="/rights" className="text-blue-600 underline">
          View the DSAR request portal demo →
        </Link>
      </p>
    </main>
  )
}
