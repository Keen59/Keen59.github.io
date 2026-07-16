import type { ReactNode } from 'react'
import {
  Truck,
  DollarSign,
  Scale,
  Weight,
  CheckCircle2,
  Route,
} from 'lucide-react'
import type { KpiStat } from '../../data/mock'

const icons = {
  truck: Truck,
  dollar: DollarSign,
  scale: Scale,
  weight: Weight,
  check: CheckCircle2,
  route: Route,
}

export function KpiCard({ stat }: { stat: KpiStat }) {
  const Icon = icons[stat.icon]
  return (
    <div className="card flex items-center gap-3 p-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-muted text-brand">
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <p className="truncate text-xs font-medium uppercase tracking-wide text-ink-muted">
          {stat.label}
        </p>
        <p className="truncate text-lg font-bold text-ink">{stat.value}</p>
      </div>
    </div>
  )
}

export function SectionCard({
  title,
  action,
  children,
  className = '',
}: {
  title: string
  action?: ReactNode
  children: ReactNode
  className?: string
}) {
  return (
    <div className={`card overflow-hidden ${className}`}>
      <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-ink">
          {title}
        </h3>
        {action}
      </div>
      <div className="p-4">{children}</div>
    </div>
  )
}
