import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

import { AdminLayout } from '../AdminLayout'

function renderAt(path: string) {
  const queryClient = new QueryClient()
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route
            path="/admin/purposes"
            element={
              <AdminLayout>
                <div>Purposes content</div>
              </AdminLayout>
            }
          />
          <Route
            path="/admin"
            element={
              <AdminLayout>
                <div>Queue content</div>
              </AdminLayout>
            }
          />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('AdminLayout', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('renders nav links and the page content', () => {
    renderAt('/admin')
    expect(screen.getByText('DSAR Queue')).toBeInTheDocument()
    expect(screen.getByText('Purposes')).toBeInTheDocument()
    expect(screen.getByText('Consent Log')).toBeInTheDocument()
    expect(screen.getByText('Queue content')).toBeInTheDocument()
  })

  it('clears the stored token when Sign out is clicked', () => {
    localStorage.setItem('access_token', 'a-token')
    renderAt('/admin/purposes')

    fireEvent.click(screen.getByText('Sign out'))

    expect(localStorage.getItem('access_token')).toBeNull()
  })
})
