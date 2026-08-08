import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { RequireAuth } from '../components/RequireAuth'
import type { TokenStorage } from '../storage/TokenStorage'

function fakeStorage(accessToken: string | null): TokenStorage {
  return {
    getAccessToken: () => accessToken,
    getRefreshToken: () => null,
    save: () => {},
    clear: () => {},
  }
}

function renderAt(path: string, storage: TokenStorage) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/admin/login" element={<div>Login page</div>} />
        <Route
          path="/admin"
          element={
            <RequireAuth storage={storage}>
              <div>Protected content</div>
            </RequireAuth>
          }
        />
      </Routes>
    </MemoryRouter>,
  )
}

describe('RequireAuth', () => {
  it('renders the protected content when a token is present', () => {
    renderAt('/admin', fakeStorage('a-token'))
    expect(screen.getByText('Protected content')).toBeInTheDocument()
  })

  it('redirects to /admin/login when no token is present', () => {
    renderAt('/admin', fakeStorage(null))
    expect(screen.getByText('Login page')).toBeInTheDocument()
    expect(screen.queryByText('Protected content')).not.toBeInTheDocument()
  })
})
