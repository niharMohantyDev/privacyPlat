import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { AdminLayout } from '@/components/AdminLayout'
import { LoginPage } from '@/features/auth/components/LoginPage'
import { RequireAuth } from '@/features/auth/components/RequireAuth'
import { AdminAssetsPage } from '@/pages/AdminAssetsPage'
import { AdminConsentLogPage } from '@/pages/AdminConsentLogPage'
import { AdminDashboardPage } from '@/pages/AdminDashboardPage'
import { AdminPurposesPage } from '@/pages/AdminPurposesPage'
import { AdminWorkspacesPage } from '@/pages/AdminWorkspacesPage'
import { DemoSitePage } from '@/pages/DemoSitePage'
import { LandingPage } from '@/pages/LandingPage'
import { PrivacyPolicyPage } from '@/pages/PrivacyPolicyPage'
import { RightsPortalPage } from '@/pages/RightsPortalPage'
import { TermsPage } from '@/pages/TermsPage'

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
          <Route path="/" element={<LandingPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
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
          <Route
            path="/admin/workspaces"
            element={
              <AdminRoute>
                <AdminWorkspacesPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/assets"
            element={
              <AdminRoute>
                <AdminAssetsPage />
              </AdminRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
