import { Routes, Route } from 'react-router-dom'
import { AppLayout } from './components/layout/AppLayout'
import { DashboardPage } from './pages/DashboardPage'
import { ShipmentsPage } from './pages/ShipmentsPage'
import { QuotePage } from './pages/QuotePage'
import { PackagesPage } from './pages/PackagesPage'
import { TicketsPage } from './pages/TicketsPage'
import { SettingsPage } from './pages/SettingsPage'
import { BalancePage } from './pages/BalancePage'

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="shipments" element={<ShipmentsPage />} />
        <Route path="quote" element={<QuotePage />} />
        <Route path="packages" element={<PackagesPage />} />
        <Route path="tickets" element={<TicketsPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="balance" element={<BalancePage />} />
      </Route>
    </Routes>
  )
}
