import { useMemo, useState } from 'react'
import {
  CheckCircle2,
  Circle,
  MapPin,
  Minus,
  Package,
  Plus,
  Truck,
  Warehouse,
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

export function OrdersOverviewPage() {
  const [stageFilter, setStageFilter] = useState<ShipmentStage | 'all'>('all')
  const [query, setQuery] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return ORDERS.filter((o) => {
      if (stageFilter !== 'all' && o.stage !== stageFilter) return false
      if (!q) return true
      return (
        o.orderNo.toLowerCase().includes(q) ||
        o.boxId.toLowerCase().includes(q) ||
        o.customer.name.toLowerCase().includes(q) ||
        o.platform.toLowerCase().includes(q) ||
        o.tracking.toLowerCase().includes(q)
      )
    })
  }, [query, stageFilter])

  const counts = useMemo(() => {
    const base = { all: ORDERS.length } as Record<string, number>
    for (const s of SHIPMENT_STAGES) {
      base[s.id] = ORDERS.filter((o) => o.stage === s.id).length
    }
    return base
  }, [])

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold uppercase tracking-wide text-ink">
          Orders Overview
        </h1>
        <p className="mt-1 text-sm text-ink-muted">
          Expand any order with + to see every stage it has passed through
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <FilterChip
          active={stageFilter === 'all'}
          label={`All (${counts.all})`}
          onClick={() => setStageFilter('all')}
        />
        {SHIPMENT_STAGES.map((s) => (
          <FilterChip
            key={s.id}
            active={stageFilter === s.id}
            label={`${s.label} (${counts[s.id]})`}
            onClick={() => setStageFilter(s.id)}
          />
        ))}
      </div>

      <div className="card p-4">
        <input
          className="input mb-4 max-w-md"
          placeholder="Search order no, box ID, customer, platform..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <div className="space-y-3">
          {filtered.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              expanded={expandedId === order.id}
              onToggle={() =>
                setExpandedId((id) => (id === order.id ? null : order.id))
              }
            />
          ))}
          {filtered.length === 0 && (
            <p className="py-10 text-center text-sm text-ink-muted">
              No orders match your filters
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

function FilterChip({
  active,
  label,
  onClick,
}: {
  active: boolean
  label: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl px-3 py-1.5 text-sm font-semibold transition ${
        active
          ? 'bg-harbor text-brand'
          : 'bg-white text-ink-muted shadow-card hover:bg-brand-muted'
      }`}
    >
      {label}
    </button>
  )
}

function OrderCard({
  order,
  expanded,
  onToggle,
}: {
  order: Order
  expanded: boolean
  onToggle: () => void
}) {
  const StageIcon = stageIcons[order.stage]

  return (
    <div
      className={`overflow-hidden rounded-2xl border transition ${
        expanded
          ? 'border-brand bg-brand-muted/30 shadow-lift'
          : 'border-harbor/8 bg-white'
      }`}
    >
      <div className="flex flex-col gap-3 p-4 lg:flex-row lg:items-center">
        <button
          type="button"
          onClick={onToggle}
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition ${
            expanded
              ? 'bg-harbor text-brand'
              : 'bg-brand-muted text-brand-ink hover:bg-brand'
          }`}
          aria-label={expanded ? 'Collapse stages' : 'Expand stages'}
        >
          {expanded ? (
            <Minus className="h-5 w-5" />
          ) : (
            <Plus className="h-5 w-5" />
          )}
        </button>

        <div className="grid min-w-0 flex-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
          <Meta label="Order No" value={order.orderNo} strong />
          <Meta label="Box ID" value={order.boxId} />
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-muted">
              Customer
            </p>
            <p className="truncate font-semibold text-ink">
              {order.customer.name}
            </p>
            <p className="truncate text-xs text-ink-muted">
              {order.customer.email}
            </p>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-muted">
              Platform
            </p>
            <p className="font-semibold text-ink">{order.platform}</p>
            <p className="truncate text-xs text-ink-muted">{order.storeName}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2 xl:justify-end">
            <span className="badge bg-harbor text-brand">
              <StageIcon className="h-3 w-3" />
              {SHIPMENT_STAGES.find((s) => s.id === order.stage)?.label}
            </span>
            <StatusBadge status={order.status} />
          </div>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-brand/40 bg-white/70 px-4 py-5">
          <div className="mb-4 grid gap-3 rounded-xl bg-surface p-4 sm:grid-cols-2 lg:grid-cols-4">
            <Meta label="Tracking" value={order.tracking} />
            <Meta label="Phone" value={order.customer.phone} />
            <Meta label="Address" value={order.customer.address} />
            <Meta
              label="Route"
              value={`${order.origin} → ${order.warehouse}`}
            />
          </div>

          <h3 className="mb-4 text-sm font-bold uppercase tracking-[0.14em] text-ink">
            Full stage history
          </h3>
          <ol className="relative space-y-0 border-l-2 border-brand/50 ml-3">
            {order.timeline.map((event) => {
              const Icon = stageIcons[event.stage]
              return (
                <li key={event.id} className="relative pb-6 pl-6 last:pb-0">
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
                  <div className="rounded-xl border border-harbor/8 bg-white p-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="badge bg-brand-muted text-brand-ink">
                        <Icon className="h-3 w-3" />
                        {
                          SHIPMENT_STAGES.find((s) => s.id === event.stage)
                            ?.label
                        }
                      </span>
                      <span className="text-xs text-ink-muted">{event.at}</span>
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
      )}
    </div>
  )
}

function Meta({
  label,
  value,
  strong,
}: {
  label: string
  value: string
  strong?: boolean
}) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-muted">
        {label}
      </p>
      <p
        className={`truncate ${strong ? 'font-bold text-brand-ink' : 'font-semibold text-ink'}`}
      >
        {value}
      </p>
    </div>
  )
}
