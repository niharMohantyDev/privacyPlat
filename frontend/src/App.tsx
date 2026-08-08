import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { AdminLayout } from '@/components/AdminLayout'
import { LoginPage } from '@/features/auth/components/LoginPage'
import { RequireAuth } from '@/features/auth/components/RequireAuth'
import { AdminConsentLogPage } from '@/pages/AdminConsentLogPage'
import { AdminDashboardPage } from '@/pages/AdminDashboardPage'
import { AdminPurposesPage } from '@/pages/AdminPurposesPage'
import { DemoSitePage } from '@/pages/DemoSitePage'
import { HomePage } from '@/pages/HomePage'
import { RightsPortalPage } from '@/pages/RightsPortalPage'

const queryClient = new QueryClient()

function AdminRoute({ children }: { children: React.ReactNode }) {
  return (
    <RequireAuth>
      <AdminLayout>{children}</AdminLayout>
    </RequireAuth>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/demo" element={<DemoSitePage />} />
          <Route path="/rights" element={<RightsPortalPage />} />
          <Route path="/admin/login" element={<LoginPage />} />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboardPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/purposes"
            element={
              <AdminRoute>
                <AdminPurposesPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/consent-log"
            element={
              <AdminRoute>
                <AdminConsentLogPage />
              </AdminRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
