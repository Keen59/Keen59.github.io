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
  Anchor,
} from 'lucide-react'
import { NavLink, Link } from 'react-router-dom'

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
    <aside className="fixed inset-y-0 left-0 z-30 flex w-56 flex-col bg-harbor text-white">
      <div className="relative overflow-hidden border-b border-white/10 px-5 py-5">
        <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-brand/30 blur-2xl" />
        <Link to="/" className="relative flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand shadow-lift">
            <Anchor className="h-4 w-4 text-white" />
          </span>
          <div>
            <p className="text-lg font-bold tracking-tight">
              Ship<span className="text-brand">Pier</span>
            </p>
            <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-white/45">
              Logistics
            </p>
          </div>
        </Link>
      </div>

      <div className="px-3 pt-4">
        <NavLink
          to="/quote"
          className="flex items-center justify-center gap-2 rounded-xl bg-brand px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-light"
        >
          <Plus className="h-4 w-4" />
          New shipment
        </NavLink>
      </div>

      <nav className="mt-4 flex flex-1 flex-col gap-0.5 px-3">
        {mainNav.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                isActive
                  ? 'bg-white/10 text-white shadow-[inset_3px_0_0_0_#7C3AED]'
                  : 'text-white/55 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto space-y-0.5 border-t border-white/10 px-3 py-4">
        {bottomNav.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                isActive
                  ? 'bg-white/10 text-white'
                  : 'text-white/55 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            <Icon className="h-4 w-4" />
            {label}
          </NavLink>
        ))}
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/55 transition hover:bg-white/5 hover:text-white"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
        <div className="mt-3 flex items-center gap-2 rounded-xl bg-harbor-soft px-3 py-2.5">
          <Truck className="h-4 w-4 text-brand" />
          <span className="text-xs font-medium text-white/70">Live network</span>
        </div>
      </div>
    </aside>
  )
}
