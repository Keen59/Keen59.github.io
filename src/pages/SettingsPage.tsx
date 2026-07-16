import { Link } from 'react-router-dom'
import {
  Code2,
  ClipboardCheck,
  FileText,
  MapPin,
  Settings2,
  User,
  Wallet,
} from 'lucide-react'
import { SETTINGS_SHORTCUTS, USER } from '../data/mock'

const iconMap = {
  account: Settings2,
  wallet: Wallet,
  report: FileText,
  code: Code2,
  profile: User,
  services: ClipboardCheck,
  topup: Wallet,
  address: MapPin,
}

const links: Record<string, string> = {
  '7': '/balance',
  '2': '/balance',
}

export function SettingsPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-ink">
          Hi {USER.name.split(' ')[0]}, what are we going to configure today?
        </h1>
        <div className="mx-auto mt-5 max-w-xl">
          <input
            className="input rounded-full px-5 py-3 text-center shadow-card"
            placeholder="Find settings, security, balance..."
          />
        </div>
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-ink">
            Recommended shortcuts
          </h2>
          <span className="text-xs text-ink-muted">Based on your activity</span>
        </div>
        <p className="mb-4 rounded-lg bg-sky-50 px-4 py-2 text-sm text-sky-800">
          Quick access to the settings you use most often.
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SETTINGS_SHORTCUTS.map((s) => {
            const Icon = iconMap[s.icon]
            const to = links[s.id] ?? '/settings'
            return (
              <Link
                key={s.id}
                to={to}
                className="card flex flex-col items-center gap-3 p-6 text-center transition hover:shadow-md"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-muted text-brand">
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-semibold text-ink">{s.title}</p>
                  <p className="mt-1 text-xs text-ink-muted">{s.description}</p>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
