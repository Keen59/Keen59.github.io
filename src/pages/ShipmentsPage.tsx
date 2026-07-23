import { useMemo, useState } from 'react'
import {
  ArrowRight,
  Copy,
  Download,
  Eye,
  FileSpreadsheet,
  FileText,
  Package,
  Plus,
  RefreshCw,
  Share2,
  Trash2,
  Truck,
  Warehouse,
} from 'lucide-react'
import {
  RECENT_SHIPMENTS,
  SHIPMENT_STAGES,
  type ShipmentStage,
} from '../data/mock'
import { StatusBadge } from '../components/StatusBadge'

const stageIcons = {
  first_transport: Truck,
  warehouse: Warehouse,
  second_transport: Package,
} as const

export function ShipmentsPage() {
  const [stage, setStage] = useState<ShipmentStage>('first_transport')
  const [query, setQuery] = useState('')
  const [pageSize, setPageSize] = useState(25)

  const stageCounts = useMemo(() => {
    return SHIPMENT_STAGES.reduce(
      (acc, s) => {
        acc[s.id] = RECENT_SHIPMENTS.filter((row) => row.stage === s.id).length
        return acc
      },
      {} as Record<ShipmentStage, number>,
    )
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return RECENT_SHIPMENTS.filter((s) => {
      if (s.stage !== stage) return false
      if (!q) return true
      return (
        s.recipient.toLowerCase().includes(q) ||
        s.address.toLowerCase().includes(q) ||
        s.tracking.toLowerCase().includes(q) ||
        s.id.includes(q) ||
        (s.origin?.toLowerCase().includes(q) ?? false) ||
        (s.warehouse?.toLowerCase().includes(q) ?? false)
      )
    })
  }, [query, stage])

  const activeMeta = SHIPMENT_STAGES.find((s) => s.id === stage)!

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-wide text-ink">
            Shipment Details
          </h1>
          <p className="mt-1 text-sm text-ink-muted">
            Pipeline: 1st Transport → Warehouse → 2nd Transport
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="btn-primary">
            <Plus className="h-4 w-4" />
            Create Label
          </button>
          <button type="button" className="btn-primary bg-brand-dark">
            <RefreshCw className="h-4 w-4" />
            Update Orders
          </button>
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-[1fr_auto_1fr_auto_1fr] lg:items-stretch">
        {SHIPMENT_STAGES.map((s, index) => {
          const Icon = stageIcons[s.id]
          const active = stage === s.id
          return (
            <div key={s.id} className="contents">
              <button
                type="button"
                onClick={() => setStage(s.id)}
                className={`card flex w-full items-start gap-3 p-4 text-left transition ${
                  active
                    ? 'border-brand ring-2 ring-brand/20 shadow-lift'
                    : 'hover:border-brand/30'
                }`}
              >
                <span
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                    active ? 'bg-brand text-white' : 'bg-harbor text-brand'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-muted">
                      Step {s.step}
                    </p>
                    <span
                      className={`badge ${
                        active
                          ? 'bg-brand text-white'
                          : 'bg-brand-muted text-brand-dark'
                      }`}
                    >
                      {stageCounts[s.id]}
                    </span>
                  </div>
                  <p className="mt-1 text-lg font-bold text-ink">{s.label}</p>
                  <p className="text-xs text-ink-muted">{s.description}</p>
                </div>
              </button>
              {index < SHIPMENT_STAGES.length - 1 && (
                <div className="hidden items-center justify-center text-brand lg:flex">
                  <ArrowRight className="h-5 w-5" />
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="card p-4">
        <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-bold text-ink">{activeMeta.label}</h2>
            <p className="text-sm text-ink-muted">{activeMeta.description}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" className="btn-ghost">
              <Copy className="h-3.5 w-3.5" />
              Copy
            </button>
            <button type="button" className="btn-ghost">
              <FileSpreadsheet className="h-3.5 w-3.5" />
              Excel
            </button>
            <button type="button" className="btn-ghost">
              <FileText className="h-3.5 w-3.5" />
              PDF
            </button>
          </div>
        </div>

        <div className="mb-4 flex flex-wrap items-center gap-2">
          <label className="flex items-center gap-2 text-sm text-ink-muted">
            Show
            <select
              className="input w-20 py-1.5"
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </label>
          <input
            className="input max-w-sm"
            placeholder="Search by name, tracking, origin or warehouse..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto rounded-lg border border-gray-100">
          <table className="w-full min-w-[1100px] text-left text-sm">
            <thead>
              <tr className="bg-harbor text-xs uppercase tracking-wide text-white">
                <th className="px-3 py-3 font-semibold">Shipment ID</th>
                <th className="px-3 py-3 font-semibold">Tracking #</th>
                <th className="px-3 py-3 font-semibold">Registered</th>
                <th className="px-3 py-3 font-semibold">Origin</th>
                <th className="px-3 py-3 font-semibold">Warehouse</th>
                <th className="px-3 py-3 font-semibold">Recipient</th>
                <th className="px-3 py-3 font-semibold">Carrier</th>
                <th className="px-3 py-3 font-semibold">Status</th>
                <th className="px-3 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    className="px-3 py-10 text-center text-ink-muted"
                  >
                    No shipments in this stage
                  </td>
                </tr>
              ) : (
                filtered.map((s, i) => (
                  <tr
                    key={s.id}
                    className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                  >
                    <td className="px-3 py-3 font-semibold text-brand">
                      {s.id}
                    </td>
                    <td className="px-3 py-3 font-medium text-ink">
                      {s.tracking}
                    </td>
                    <td className="px-3 py-3 text-ink-muted">
                      {s.registeredAt}
                    </td>
                    <td className="px-3 py-3 text-ink">{s.origin ?? '—'}</td>
                    <td className="px-3 py-3 text-ink">{s.warehouse ?? '—'}</td>
                    <td className="px-3 py-3">
                      <p className="font-medium text-ink">{s.recipient}</p>
                      <p className="max-w-[180px] truncate text-xs text-ink-muted">
                        {s.address}
                      </p>
                    </td>
                    <td className="px-3 py-3">
                      <span className="font-semibold lowercase text-rose-600">
                        {s.carrier}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <div className="space-y-1.5">
                        <StatusBadge status={s.status} />
                        <div className="h-1.5 w-24 overflow-hidden rounded-full bg-gray-200">
                          <div
                            className="h-full rounded-full bg-brand"
                            style={{ width: `${s.progress}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-1">
                        <ActionBtn icon={Download} tone="brand" />
                        <ActionBtn icon={Trash2} tone="danger" />
                        <ActionBtn icon={Eye} tone="brand" />
                        <ActionBtn icon={RefreshCw} tone="brand" />
                        <ActionBtn icon={Share2} tone="muted" />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex items-center justify-between text-sm text-ink-muted">
          <span>
            Showing {filtered.length} of {stageCounts[stage]} in{' '}
            {activeMeta.label}
          </span>
          <div className="flex items-center gap-1">
            <button type="button" className="btn-ghost px-2 py-1">
              Previous
            </button>
            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-xs font-bold text-ink"
            >
              1
            </button>
            <button type="button" className="btn-ghost px-2 py-1">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function ActionBtn({
  icon: Icon,
  tone,
}: {
  icon: typeof Download
  tone: 'brand' | 'danger' | 'muted'
}) {
  const tones = {
    brand: 'bg-brand text-white hover:bg-brand-dark',
    danger: 'bg-rose-500 text-white hover:bg-rose-600',
    muted: 'bg-gray-200 text-ink hover:bg-gray-300',
  }
  return (
    <button
      type="button"
      className={`flex h-7 w-7 items-center justify-center rounded-md transition ${tones[tone]}`}
    >
      <Icon className="h-3.5 w-3.5" />
    </button>
  )
}
