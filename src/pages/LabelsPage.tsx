import { LABELS, RETURN_LABELS, type LabelRow } from '../data/mock'

const statusStyles = {
  ready: 'bg-sky-100 text-sky-700',
  printed: 'bg-emerald-100 text-emerald-700',
  void: 'bg-rose-100 text-rose-700',
} as const

export function LabelsPage() {
  return (
    <LabelsTable
      title="Labels"
      subtitle="Outbound shipping labels linked to box IDs and orders"
      rows={LABELS}
    />
  )
}

export function ReturnLabelsPage() {
  return (
    <LabelsTable
      title="Return Labels"
      subtitle="Return labels created for customer send-backs"
      rows={RETURN_LABELS}
    />
  )
}

function LabelsTable({
  title,
  subtitle,
  rows,
}: {
  title: string
  subtitle: string
  rows: LabelRow[]
}) {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold uppercase tracking-wide text-ink">
          {title}
        </h1>
        <p className="mt-1 text-sm text-ink-muted">{subtitle}</p>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead>
              <tr className="bg-harbor text-xs uppercase tracking-wide text-brand">
                <th className="px-4 py-3 font-semibold">Label No</th>
                <th className="px-4 py-3 font-semibold">Order No</th>
                <th className="px-4 py-3 font-semibold">Box ID</th>
                <th className="px-4 py-3 font-semibold">Carrier</th>
                <th className="px-4 py-3 font-semibold">Created</th>
                <th className="px-4 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr
                  key={r.id}
                  className={i % 2 === 0 ? 'bg-white' : 'bg-surface'}
                >
                  <td className="px-4 py-3 font-semibold text-brand-ink">
                    {r.labelNo}
                  </td>
                  <td className="px-4 py-3 text-ink">{r.orderNo}</td>
                  <td className="px-4 py-3 font-medium text-ink">{r.boxId}</td>
                  <td className="px-4 py-3 text-ink-muted">{r.carrier}</td>
                  <td className="px-4 py-3 text-ink-muted">{r.createdAt}</td>
                  <td className="px-4 py-3">
                    <span className={`badge capitalize ${statusStyles[r.status]}`}>
                      {r.status}
                    </span>
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
