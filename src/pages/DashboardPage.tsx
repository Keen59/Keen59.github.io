import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  CARRIER_USAGE,
  DELIVERY_AVG,
  KPI_STATS,
  RECENT_SHIPMENTS,
  USER,
} from '../data/mock'
import { KpiCard, SectionCard } from '../components/ui/Cards'
import { StatusBadge } from '../components/StatusBadge'

const periods = ['Today', '1 Day', '7 Days', '30 Days', 'This Month'] as const

export function DashboardPage() {
  const [period, setPeriod] = useState<(typeof periods)[number]>('7 Days')

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink">
            Welcome back, {USER.name}
          </h1>
          <p className="mt-1 text-sm text-ink-muted">
            Shipping overview for the selected period
          </p>
        </div>
        <div className="flex flex-wrap gap-1 rounded-xl bg-white p-1 shadow-card">
          {periods.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPeriod(p)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition ${
                period === p
                  ? 'bg-brand text-white'
                  : 'text-ink-muted hover:bg-gray-50 hover:text-ink'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {KPI_STATS.map((stat) => (
          <KpiCard key={stat.id} stat={stat} />
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
        <SectionCard title="Most Used Carriers">
          <ul className="space-y-3">
            {CARRIER_USAGE.map((c) => (
              <li
                key={c.id}
                className="flex items-center justify-between gap-2 border-b border-gray-50 pb-3 last:border-0 last:pb-0"
              >
                <div>
                  <p className="text-sm font-semibold text-ink">{c.name}</p>
                  <p className="text-xs text-ink-muted">
                    {c.shipments} shipments
                  </p>
                </div>
                <p className="text-sm font-bold text-brand">{c.spend}</p>
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard
          title="Primary Origins"
          action={
            <button type="button" className="text-xs font-semibold text-brand">
              View more
            </button>
          }
        >
          <div className="flex h-44 items-center justify-center rounded-lg bg-gradient-to-br from-sky-50 to-sky-100">
            <div className="text-center">
              <div className="mx-auto mb-2 h-24 w-28 rounded-[40%] bg-gradient-to-b from-sky-200 to-sky-400 opacity-80" />
              <p className="text-xs text-ink-muted">Origin heatmap (mock)</p>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Avg. Delivery Days">
          <ul className="space-y-3">
            {DELIVERY_AVG.map((d) => (
              <li
                key={d.id}
                className="flex items-center justify-between gap-2"
              >
                <div>
                  <p className="text-sm font-semibold text-ink">{d.carrier}</p>
                  <p className="text-xs text-ink-muted">{d.days} days</p>
                </div>
                <span
                  className={`badge ${
                    d.speed === 'Fast'
                      ? 'bg-emerald-100 text-emerald-700'
                      : d.speed === 'Normal'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-rose-100 text-rose-700'
                  }`}
                >
                  {d.speed}
                </span>
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard
          title="Primary Destinations"
          action={
            <button type="button" className="text-xs font-semibold text-brand">
              View more
            </button>
          }
        >
          <div className="flex h-44 items-center justify-center rounded-lg bg-gradient-to-br from-amber-50 to-orange-100">
            <div className="text-center">
              <div className="mx-auto mb-2 h-24 w-28 rounded-[40%] bg-gradient-to-b from-amber-200 to-orange-400 opacity-80" />
              <p className="text-xs text-ink-muted">Destination heatmap (mock)</p>
            </div>
          </div>
        </SectionCard>
      </div>

      <SectionCard
        title="Latest 25 Shipments"
        action={
          <Link to="/shipments" className="text-xs font-semibold text-brand">
            View all
          </Link>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-xs uppercase text-ink-muted">
                <th className="pb-2 font-semibold">Tracking</th>
                <th className="pb-2 font-semibold">Service</th>
                <th className="pb-2 font-semibold">Date</th>
                <th className="pb-2 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {RECENT_SHIPMENTS.slice(0, 6).map((s) => (
                <tr key={s.id} className="border-b border-gray-50 last:border-0">
                  <td className="py-3 font-medium text-ink">{s.tracking}</td>
                  <td className="py-3">
                    <span className="badge bg-sky-50 text-sky-700">
                      {s.carrier}
                    </span>
                  </td>
                  <td className="py-3 text-ink-muted">{s.registeredAt}</td>
                  <td className="py-3">
                    <StatusBadge status={s.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  )
}
