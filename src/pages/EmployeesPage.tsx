import { EMPLOYEES } from '../data/mock'

const statusStyles = {
  active: 'bg-emerald-100 text-emerald-700',
  away: 'bg-amber-100 text-amber-800',
  offline: 'bg-gray-100 text-gray-600',
} as const

export function EmployeesPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold uppercase tracking-wide text-ink">
          Employees
        </h1>
        <p className="mt-1 text-sm text-ink-muted">
          Team members handling warehouse, labels and support
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {EMPLOYEES.map((e) => (
          <div key={e.id} className="card p-5">
            <div className="mb-3 flex items-start justify-between gap-2">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-harbor text-sm font-bold text-brand">
                {e.name
                  .split(' ')
                  .map((p) => p[0])
                  .join('')}
              </div>
              <span className={`badge capitalize ${statusStyles[e.status]}`}>
                {e.status}
              </span>
            </div>
            <p className="font-bold text-ink">{e.name}</p>
            <p className="text-sm text-ink-muted">{e.role}</p>
            <p className="mt-2 truncate text-xs text-ink-muted">{e.email}</p>
            <p className="mt-4 text-sm font-semibold text-brand-ink">
              {e.ordersHandled.toLocaleString()} orders handled
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
