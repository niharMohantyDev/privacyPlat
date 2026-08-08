import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { DemoSitePage } from '@/pages/DemoSitePage'
import { HomePage } from '@/pages/HomePage'
import { RightsPortalPage } from '@/pages/RightsPortalPage'

const queryClient = new QueryClient()

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/demo" element={<DemoSitePage />} />
          <Route path="/rights" element={<RightsPortalPage />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
