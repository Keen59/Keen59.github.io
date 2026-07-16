import type { ShipmentStatus, TicketStatus } from '../data/mock'

const shipmentStyles: Record<ShipmentStatus, string> = {
  documented: 'bg-brand-muted text-brand-dark',
  in_transit: 'bg-sky-100 text-sky-700',
  delivered: 'bg-emerald-100 text-emerald-700',
  exception: 'bg-rose-100 text-rose-700',
  pending: 'bg-amber-100 text-amber-700',
}

const shipmentLabels: Record<ShipmentStatus, string> = {
  documented: 'Documented',
  in_transit: 'In Transit',
  delivered: 'Delivered',
  exception: 'Exception',
  pending: 'Pending',
}

const ticketStyles: Record<TicketStatus, string> = {
  waiting: 'bg-emerald-100 text-emerald-800',
  in_progress: 'bg-sky-100 text-sky-800',
  resolved: 'bg-teal-50 text-teal-800',
  closed: 'bg-gray-100 text-gray-600',
}

export function StatusBadge({ status }: { status: ShipmentStatus }) {
  return (
    <span className={`badge ${shipmentStyles[status]}`}>
      {shipmentLabels[status]}
    </span>
  )
}

export function TicketBadge({
  status,
  label,
  subStatus,
}: {
  status: TicketStatus
  label: string
  subStatus: string
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className={`badge w-fit ${ticketStyles[status]}`}>{label}</span>
      <span className="text-xs text-ink-muted">{subStatus}</span>
    </div>
  )
}
