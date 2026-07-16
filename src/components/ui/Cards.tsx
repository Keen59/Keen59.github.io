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
    <div className="card flex items-center gap-3 p-4 transition hover:-translate-y-0.5 hover:shadow-lift">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-harbor text-brand">
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <p className="truncate text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-muted">
          {stat.label}
        </p>
        <p className="truncate text-xl font-bold text-ink">{stat.value}</p>
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
      <div className="flex items-center justify-between border-b border-harbor/5 bg-gradient-to-r from-brand-muted/40 to-transparent px-4 py-3">
        <h3 className="text-sm font-bold uppercase tracking-[0.12em] text-ink">
          {title}
        </h3>
        {action}
      </div>
      <div className="p-4">{children}</div>
    </div>
  )
}
