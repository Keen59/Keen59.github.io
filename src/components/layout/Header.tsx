import { Bell, Menu, Plus, Search } from 'lucide-react'
import { Link } from 'react-router-dom'
import { USER } from '../../data/mock'

export function Header() {
  return (
    <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-white/5 bg-ink px-4 text-white lg:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="rounded-lg p-1.5 text-gray-300 transition hover:bg-white/10 hover:text-white"
          aria-label="Menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <Link to="/" className="flex items-center gap-2">
          <span className="text-lg font-bold tracking-tight">
            Tei<span className="text-orange-400">Ker</span>
          </span>
        </Link>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <button
          type="button"
          className="rounded-lg p-2 text-gray-300 transition hover:bg-white/10 hover:text-white"
          aria-label="Search"
        >
          <Search className="h-4 w-4" />
        </button>

        <Link
          to="/balance"
          className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-sm font-semibold transition hover:bg-white/15"
        >
          <span className="hidden sm:inline">{USER.balance}</span>
          <span className="sm:hidden">$106k</span>
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand">
            <Plus className="h-3 w-3" />
          </span>
        </Link>

        <button
          type="button"
          className="relative rounded-lg p-2 text-gray-300 transition hover:bg-white/10 hover:text-white"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
            4
          </span>
        </button>

        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 text-sm font-bold">
          {USER.initials}
        </div>
      </div>
    </header>
  )
}
