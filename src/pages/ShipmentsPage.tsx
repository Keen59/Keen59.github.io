import { Fragment, useMemo, useState } from 'react'
import {
  ArrowRight,
  CheckCircle2,
  Circle,
  Copy,
  Download,
  Eye,
  FileSpreadsheet,
  FileText,
  MapPin,
  Package,
  Plus,
  RefreshCw,
  Share2,
  Trash2,
  Truck,
  Warehouse,
  X,
} from 'lucide-react'
import {
  ORDERS,
  SHIPMENT_STAGES,
  type Order,
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
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const stageCounts = useMemo(() => {
    return SHIPMENT_STAGES.reduce(
      (acc, s) => {
        acc[s.id] = ORDERS.filter((row) => row.stage === s.id).length
        return acc
      },
      {} as Record<ShipmentStage, number>,
    )
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return ORDERS.filter((o) => {
      if (o.stage !== stage) return false
      if (!q) return true
      return (
        o.customer.name.toLowerCase().includes(q) ||
        o.customer.address.toLowerCase().includes(q) ||
        o.tracking.toLowerCase().includes(q) ||
        o.orderNo.toLowerCase().includes(q) ||
        o.boxId.toLowerCase().includes(q) ||
        o.origin.toLowerCase().includes(q) ||
        o.warehouse.toLowerCase().includes(q) ||
        o.platform.toLowerCase().includes(q)
      )
    }).slice(0, pageSize)
  }, [query, stage, pageSize])

  const activeMeta = SHIPMENT_STAGES.find((s) => s.id === stage)!
  const selected = ORDERS.find((o) => o.id === selectedId) ?? null

  function toggleOrder(id: string) {
    setSelectedId((prev) => (prev === id ? null : id))
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-wide text-ink">
            Shipping List
          </h1>
          <p className="mt-1 text-sm text-ink-muted">
            Click an order number to open customer info and the full update
            trail from origin to customer
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="btn-primary">
            <Plus className="h-4 w-4" />
            Create Label
          </button>
          <button
            type="button"
            className="btn-primary bg-harbor text-brand hover:bg-harbor-soft"
          >
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
                onClick={() => {
                  setStage(s.id)
                  setSelectedId(null)
                }}
                className={`card flex w-full items-start gap-3 p-4 text-left transition ${
                  active
                    ? 'border-brand ring-2 ring-brand/20 shadow-lift'
                    : 'hover:border-brand/30'
                }`}
              >
                <span
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                    active ? 'bg-brand text-brand-ink' : 'bg-harbor text-brand'
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
                          ? 'bg-harbor text-brand'
                          : 'bg-brand-muted text-brand-ink'
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
            placeholder="Search order no, box ID, customer, platform..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto rounded-lg border border-gray-100">
          <table className="w-full min-w-[1180px] text-left text-sm">
            <thead>
              <tr className="bg-harbor text-xs uppercase tracking-wide text-brand">
                <th className="px-3 py-3 font-semibold">Order No</th>
                <th className="px-3 py-3 font-semibold">Box ID</th>
                <th className="px-3 py-3 font-semibold">Customer</th>
                <th className="px-3 py-3 font-semibold">Platform</th>
                <th className="px-3 py-3 font-semibold">Origin</th>
                <th className="px-3 py-3 font-semibold">Warehouse</th>
                <th className="px-3 py-3 font-semibold">Carrier</th>
                <th className="px-3 py-3 font-semibold">Last Update</th>
                <th className="px-3 py-3 font-semibold">Status</th>
                <th className="px-3 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={10}
                    className="px-3 py-10 text-center text-ink-muted"
                  >
                    No shipments in this stage
                  </td>
                </tr>
              ) : (
                filtered.map((o, i) => {
                  const lastUpdate = [...o.timeline]
                    .reverse()
                    .find((e) => e.done)
                  const open = selectedId === o.id
                  return (
                    <Fragment key={o.id}>
                      <tr
                        className={`${i % 2 === 0 ? 'bg-white' : 'bg-surface'} ${
                          open ? 'bg-brand-muted/40' : ''
                        }`}
                      >
                        <td className="px-3 py-3">
                          <button
                            type="button"
                            onClick={() => toggleOrder(o.id)}
                            className="font-bold text-brand-ink underline decoration-brand/60 underline-offset-2 transition hover:text-harbor"
                          >
                            {o.orderNo}
                          </button>
                        </td>
                        <td className="px-3 py-3 font-medium text-ink">
                          {o.boxId}
                        </td>
                        <td className="px-3 py-3">
                          <p className="font-medium text-ink">
                            {o.customer.name}
                          </p>
                          <p className="max-w-[180px] truncate text-xs text-ink-muted">
                            {o.customer.address}
                          </p>
                        </td>
                        <td className="px-3 py-3">
                          <p className="font-semibold text-ink">{o.platform}</p>
                          <p className="text-xs text-ink-muted">{o.storeName}</p>
                        </td>
                        <td className="px-3 py-3 text-ink">{o.origin}</td>
                        <td className="px-3 py-3 text-ink">{o.warehouse}</td>
                        <td className="px-3 py-3">
                          <span className="font-semibold lowercase text-rose-600">
                            {o.carrier}
                          </span>
                        </td>
                        <td className="px-3 py-3">
                          <p className="font-medium text-ink">
                            {lastUpdate?.title ?? 'Awaiting first scan'}
                          </p>
                          <p className="text-xs text-ink-muted">
                            {lastUpdate?.at ?? o.registeredAt}
                          </p>
                        </td>
                        <td className="px-3 py-3">
                          <div className="space-y-1.5">
                            <StatusBadge status={o.status} />
                            <div className="h-1.5 w-24 overflow-hidden rounded-full bg-gray-200">
                              <div
                                className="h-full rounded-full bg-brand"
                                style={{ width: `${o.progress}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-1">
                            <ActionBtn
                              icon={Eye}
                              tone="brand"
                              onClick={() => toggleOrder(o.id)}
                            />
                            <ActionBtn icon={Download} tone="brand" />
                            <ActionBtn icon={Trash2} tone="danger" />
                            <ActionBtn icon={RefreshCw} tone="brand" />
                            <ActionBtn icon={Share2} tone="muted" />
                          </div>
                        </td>
                      </tr>
                      {open && (
                        <tr className="bg-brand-muted/25">
                          <td colSpan={10} className="px-3 py-4">
                            <OrderDetailPanel
                              order={o}
                              onClose={() => setSelectedId(null)}
                            />
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  )
                })
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

      {selected && (
        <p className="text-xs text-ink-muted">
          Open detail: {selected.orderNo} · click order number again to close
        </p>
      )}
    </div>
  )
}

function OrderDetailPanel({
  order,
  onClose,
}: {
  order: Order
  onClose: () => void
}) {
  return (
    <div className="rounded-2xl border border-brand/40 bg-white p-4 shadow-card">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-ink">
            {order.orderNo} · journey updates
          </h3>
          <p className="text-sm text-ink-muted">
            From first departure ({order.origin}) to customer delivery
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-1.5 text-ink-muted hover:bg-surface hover:text-ink"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="mb-5 grid gap-3 rounded-xl bg-surface p-4 sm:grid-cols-2 lg:grid-cols-4">
        <Detail label="Customer" value={order.customer.name} />
        <Detail label="Email" value={order.customer.email} />
        <Detail label="Phone" value={order.customer.phone} />
        <Detail label="Address" value={order.customer.address} />
        <Detail label="Box ID" value={order.boxId} />
        <Detail label="Platform" value={`${order.platform} · ${order.storeName}`} />
        <Detail label="Tracking" value={order.tracking} />
        <Detail
          label="Route"
          value={`${order.origin} → ${order.warehouse} → Customer`}
        />
      </div>

      <h4 className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-ink">
        All updates
      </h4>
      <ol className="relative ml-3 space-y-0 border-l-2 border-brand/50">
        {order.timeline.map((event) => {
          const Icon = stageIcons[event.stage]
          return (
            <li key={event.id} className="relative pb-5 pl-6 last:pb-0">
              <span
                className={`absolute -left-[9px] top-1 flex h-4 w-4 items-center justify-center rounded-full ${
                  event.done
                    ? 'bg-harbor text-brand'
                    : 'bg-white text-ink-muted ring-2 ring-brand'
                }`}
              >
                {event.done ? (
                  <CheckCircle2 className="h-3.5 w-3.5" />
                ) : (
                  <Circle className="h-3 w-3" />
                )}
              </span>
              <div className="rounded-xl border border-harbor/8 bg-surface/60 p-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="badge bg-brand-muted text-brand-ink">
                    <Icon className="h-3 w-3" />
                    {SHIPMENT_STAGES.find((s) => s.id === event.stage)?.label}
                  </span>
                  <span className="text-xs text-ink-muted">{event.at}</span>
                  {!event.done && (
                    <span className="badge bg-amber-100 text-amber-800">
                      Upcoming
                    </span>
                  )}
                </div>
                <p className="mt-2 font-semibold text-ink">{event.title}</p>
                <p className="text-sm text-ink-muted">{event.detail}</p>
                <p className="mt-1 flex items-center gap-1 text-xs text-ink-muted">
                  <MapPin className="h-3 w-3" />
                  {event.location}
                </p>
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-muted">
        {label}
      </p>
      <p className="truncate text-sm font-semibold text-ink">{value}</p>
    </div>
  )
}

function ActionBtn({
  icon: Icon,
  tone,
  onClick,
}: {
  icon: typeof Download
  tone: 'brand' | 'danger' | 'muted'
  onClick?: () => void
}) {
  const tones = {
    brand: 'bg-harbor text-brand hover:bg-harbor-soft',
    danger: 'bg-rose-500 text-white hover:bg-rose-600',
    muted: 'bg-gray-200 text-ink hover:bg-gray-300',
  }
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-7 w-7 items-center justify-center rounded-md transition ${tones[tone]}`}
    >
      <Icon className="h-3.5 w-3.5" />
    </button>
  )
}
