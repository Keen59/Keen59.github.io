import { Routes, Route } from 'react-router-dom'
import { AppLayout } from './components/layout/AppLayout'
import { DashboardPage } from './pages/DashboardPage'
import { ShipmentsPage } from './pages/ShipmentsPage'
import { OrdersOverviewPage } from './pages/OrdersOverviewPage'
import { QuotePage } from './pages/QuotePage'
import { PackagesPage } from './pages/PackagesPage'
import { TicketsPage } from './pages/TicketsPage'
import { SettingsPage } from './pages/SettingsPage'
import { BalancePage } from './pages/BalancePage'
import { TransactionsPage } from './pages/TransactionsPage'
import { AiAssistantPage } from './pages/AiAssistantPage'
import { EmployeesPage } from './pages/EmployeesPage'
import { LabelsPage, ReturnLabelsPage } from './pages/LabelsPage'

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="orders" element={<OrdersOverviewPage />} />
        <Route path="shipments" element={<ShipmentsPage />} />
        <Route path="labels" element={<LabelsPage />} />
        <Route path="return-labels" element={<ReturnLabelsPage />} />
        <Route path="transactions" element={<TransactionsPage />} />
        <Route path="employees" element={<EmployeesPage />} />
        <Route path="ai" element={<AiAssistantPage />} />
        <Route path="quote" element={<QuotePage />} />
        <Route path="packages" element={<PackagesPage />} />
        <Route path="tickets" element={<TicketsPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="balance" element={<BalancePage />} />
      </Route>
    </Routes>
  )
}
