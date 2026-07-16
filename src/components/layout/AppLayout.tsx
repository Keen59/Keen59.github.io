import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { Sidebar } from './Sidebar'

export function AppLayout() {
  return (
    <div className="min-h-full bg-surface bg-harbor-grid bg-grid">
      <Sidebar />
      <div className="pl-56">
        <Header />
        <main className="min-h-[calc(100vh-4rem)] p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
