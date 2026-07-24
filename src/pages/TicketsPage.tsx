import { useMemo, useState } from 'react'
import { Eye } from 'lucide-react'
import { TICKETS, TICKET_STATS } from '../data/mock'
import { TicketBadge } from '../components/StatusBadge'

const filters = ['All', 'In Tracking', 'Closed'] as const

export function TicketsPage() {
  const [filter, setFilter] = useState<(typeof filters)[number]>('All')
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    let rows = TICKETS
    if (filter === 'In Tracking') {
      rows = rows.filter(
        (t) => t.status === 'waiting' || t.status === 'in_progress',
      )
    } else if (filter === 'Closed') {
      rows = rows.filter((t) => t.status === 'closed' || t.status === 'resolved')
    }
    const q = query.trim().toLowerCase()
    if (!q) return rows
    return rows.filter(
      (t) =>
        t.id.includes(q) ||
        t.classification.toLowerCase().includes(q) ||
        t.shipmentId.includes(q),
    )
  }, [filter, query])

  const stats = TICKET_STATS

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-ink">Tracking Tickets</h1>
        <p className="mt-1 text-sm text-ink-muted">
          Follow up on shipment exceptions and support tickets
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard label="My tickets" value={stats.total} />
        <StatCard label="In tracking" value={stats.tracking} accent />
        <StatCard label="Closed" value={stats.closed} />
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <MiniStat label="Listed" value={stats.total} />
        <MiniStat label="Active" value={stats.tracking} />
        <MiniStat label="Average" value={stats.average} />
      </div>

      <div className="card p-4">
        <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <input
            className="input max-w-xl"
            placeholder="Search by ticket, classification or shipment..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="flex flex-wrap items-center gap-2">
            {filters.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                  filter === f
                    ? 'bg-harbor text-brand'
                    : 'bg-gray-100 text-ink-muted hover:bg-gray-200'
                }`}
              >
                {f}
              </button>
            ))}
            <span className="text-sm text-ink-muted">
              {filtered.length} tickets
            </span>
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg border border-gray-100">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead>
              <tr className="bg-gray-50 text-xs uppercase tracking-wide text-ink-muted">
                <th className="px-4 py-3 font-semibold">Ticket Status</th>
                <th className="px-4 py-3 font-semibold"># Ticket</th>
                <th className="px-4 py-3 font-semibold">Date</th>
                <th className="px-4 py-3 font-semibold">Classification</th>
                <th className="px-4 py-3 font-semibold"># Shipment</th>
                <th className="px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => (
                <tr key={t.id} className="border-t border-gray-100">
                  <td className="px-4 py-3">
                    <TicketBadge
                      status={t.status}
                      label={t.statusLabel}
                      subStatus={t.subStatus}
                    />
                  </td>
                  <td className="px-4 py-3 font-bold text-ink">#{t.id}</td>
                  <td className="px-4 py-3">
                    <p className="text-ink">{t.date}</p>
                    <span className="badge mt-1 bg-gray-100 text-ink-muted">
                      {t.relative}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-ink">{t.classification}</td>
                  <td className="px-4 py-3 font-medium text-brand">
                    {t.shipmentId}
                  </td>
                  <td className="px-4 py-3">
                    <button type="button" className="btn-ghost">
                      <Eye className="h-3.5 w-3.5" />
                      View Ticket
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function StatCard({
  label,
  value,
  accent,
}: {
  label: string
  value: number
  accent?: boolean
}) {
  return (
    <div
      className={`card p-5 ${accent ? 'border border-brand/30 bg-brand-muted' : ''}`}
    >
      <p className="text-3xl font-bold text-ink">{value}</p>
      <p className="mt-1 text-sm font-medium text-ink-muted">{label}</p>
    </div>
  )
}

function MiniStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl bg-gray-100 px-4 py-3">
      <p className="text-xs font-semibold uppercase text-ink-muted">{label}</p>
      <p className="text-xl font-bold text-ink">{value}</p>
    </div>
  )
}
