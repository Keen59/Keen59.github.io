import { Bell, Menu, Plus, Search } from 'lucide-react'
import { Link } from 'react-router-dom'
import { USER } from '../../data/mock'

export function Header() {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-harbor/8 bg-white/80 px-4 backdrop-blur-md lg:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="rounded-xl p-2 text-ink-muted transition hover:bg-surface hover:text-ink lg:hidden"
          aria-label="Menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-muted">
            Control deck
          </p>
          <p className="text-sm font-semibold text-ink">Operations panel</p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <button
          type="button"
          className="rounded-xl border border-harbor/10 bg-white p-2 text-ink-muted transition hover:border-brand/40 hover:text-brand"
          aria-label="Search"
        >
          <Search className="h-4 w-4" />
        </button>

        <Link
          to="/balance"
          className="flex items-center gap-2 rounded-xl border border-brand/20 bg-brand-muted px-3 py-1.5 text-sm font-semibold text-brand-dark transition hover:bg-brand hover:text-white"
        >
          <span className="hidden sm:inline">{USER.balance}</span>
          <span className="sm:hidden">{USER.balanceShort}</span>
          <span className="flex h-5 w-5 items-center justify-center rounded-lg bg-white/90 text-brand">
            <Plus className="h-3 w-3" />
          </span>
        </Link>

        <button
          type="button"
          className="relative rounded-xl border border-harbor/10 bg-white p-2 text-ink-muted transition hover:border-steel hover:text-steel"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-md bg-brand px-1 text-[10px] font-bold text-white">
            4
          </span>
        </button>

        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-harbor text-sm font-bold text-white">
          {USER.initials}
        </div>
      </div>
    </header>
  )
}
