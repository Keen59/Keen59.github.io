import {
  LayoutDashboard,
  Package,
  Truck,
  ListOrdered,
  Ticket,
  Scale,
  Settings,
  LogOut,
  Plus,
  Calculator,
} from 'lucide-react'
import { NavLink } from 'react-router-dom'

const mainNav = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/shipments', icon: ListOrdered, label: 'Shipments' },
  { to: '/quote', icon: Calculator, label: 'Get Quote' },
  { to: '/packages', icon: Package, label: 'Packages' },
  { to: '/tickets', icon: Ticket, label: 'Tickets' },
  { to: '/overweight', icon: Scale, label: 'Overweight' },
]

const bottomNav = [{ to: '/settings', icon: Settings, label: 'Settings' }]

export function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 flex w-16 flex-col items-center bg-ink py-4 text-white">
      <NavLink
        to="/quote"
        className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-brand text-white shadow-lg shadow-brand/30 transition hover:bg-brand-light"
        title="New shipment"
      >
        <Plus className="h-5 w-5" />
      </NavLink>

      <nav className="flex flex-1 flex-col items-center gap-1">
        {mainNav.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            title={label}
            className={({ isActive }) =>
              `flex h-10 w-10 items-center justify-center rounded-xl transition ${
                isActive
                  ? 'bg-brand text-white'
                  : 'text-gray-400 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            <Icon className="h-5 w-5" />
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto flex flex-col items-center gap-1">
        {bottomNav.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            title={label}
            className={({ isActive }) =>
              `flex h-10 w-10 items-center justify-center rounded-xl transition ${
                isActive
                  ? 'bg-brand text-white'
                  : 'text-gray-400 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            <Icon className="h-5 w-5" />
          </NavLink>
        ))}
        <button
          type="button"
          title="Logout"
          className="flex h-10 w-10 items-center justify-center rounded-xl text-gray-400 transition hover:bg-white/10 hover:text-white"
        >
          <LogOut className="h-5 w-5" />
        </button>
        <div className="mt-3 flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
          <Truck className="h-4 w-4 text-brand-light" />
        </div>
      </div>
    </aside>
  )
}
