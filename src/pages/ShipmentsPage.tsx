import { useMemo, useState } from 'react'
import {
  Copy,
  Download,
  Eye,
  FileSpreadsheet,
  FileText,
  Plus,
  RefreshCw,
  Share2,
  Trash2,
} from 'lucide-react'
import { RECENT_SHIPMENTS } from '../data/mock'
import { StatusBadge } from '../components/StatusBadge'

export function ShipmentsPage() {
  const [query, setQuery] = useState('')
  const [pageSize, setPageSize] = useState(25)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return RECENT_SHIPMENTS
    return RECENT_SHIPMENTS.filter(
      (s) =>
        s.recipient.toLowerCase().includes(q) ||
        s.address.toLowerCase().includes(q) ||
        s.tracking.toLowerCase().includes(q) ||
        s.id.includes(q),
    )
  }, [query])

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-wide text-ink">
            Shipment Details
          </h1>
          <p className="mt-1 text-sm text-ink-muted">
            Track and manage all your outbound shipments
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

      <div className="card p-4">
        <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
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
            <button type="button" className="btn-ghost">
              Default
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-2">
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
              placeholder="Search by name, destination or address..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg border border-gray-100">
          <table className="w-full min-w-[1100px] text-left text-sm">
            <thead>
              <tr className="bg-ink text-xs uppercase tracking-wide text-white">
                <th className="px-3 py-3 font-semibold">Shipment ID</th>
                <th className="px-3 py-3 font-semibold">Tracking #</th>
                <th className="px-3 py-3 font-semibold">Registered</th>
                <th className="px-3 py-3 font-semibold">Recipient</th>
                <th className="px-3 py-3 font-semibold">Address</th>
                <th className="px-3 py-3 font-semibold">E-commerce</th>
                <th className="px-3 py-3 font-semibold">Carrier</th>
                <th className="px-3 py-3 font-semibold">Status</th>
                <th className="px-3 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s, i) => (
                <tr
                  key={s.id}
                  className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                >
                  <td className="px-3 py-3 font-semibold text-brand">{s.id}</td>
                  <td className="px-3 py-3 font-medium text-ink">{s.tracking}</td>
                  <td className="px-3 py-3 text-ink-muted">{s.registeredAt}</td>
                  <td className="px-3 py-3 text-ink">{s.recipient}</td>
                  <td className="max-w-[200px] truncate px-3 py-3 text-ink-muted">
                    {s.address}
                  </td>
                  <td className="px-3 py-3 text-ink-muted">{s.ecommerce}</td>
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
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex items-center justify-between text-sm text-ink-muted">
          <span>
            Showing {filtered.length} of {RECENT_SHIPMENTS.length} entries
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
