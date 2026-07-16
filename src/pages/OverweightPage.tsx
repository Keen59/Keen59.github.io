import { useState } from 'react'
import { OVERWEIGHT_ROWS } from '../data/mock'

export function OverweightPage() {
  const [query, setQuery] = useState('')

  const filtered = OVERWEIGHT_ROWS.filter(
    (r) =>
      r.guide.toLowerCase().includes(query.toLowerCase()) ||
      r.shipPierId.toLowerCase().includes(query.toLowerCase()),
  )

  return (
    <div className="space-y-5">
      <div className="card max-w-md overflow-hidden">
        <div className="border-b border-gray-100 bg-gray-50 px-4 py-2 text-xs font-bold uppercase tracking-wide text-ink">
          Overweight Tracking
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase text-ink-muted">
              <th className="px-4 py-2 font-semibold">Status</th>
              <th className="px-4 py-2 font-semibold">Quantity</th>
              <th className="px-4 py-2 font-semibold">Percentage</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-4 py-3 font-medium text-ink">No Dispute</td>
              <td className="px-4 py-3">3005</td>
              <td className="px-4 py-3 text-brand">1,341.52%</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="card p-4">
        <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <h1 className="text-xl font-bold uppercase tracking-wide text-ink">
            Overweight
          </h1>
          <div className="flex flex-wrap items-center gap-3">
            <p className="max-w-md text-xs font-medium text-rose-600">
              To determine shipping weight, the GREATER of real weight and
              volumetric weight is used.
            </p>
            <input
              className="input max-w-xs"
              placeholder="Search by Shipment #"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg border border-gray-100">
          <table className="w-full min-w-[1100px] text-left text-sm">
            <thead>
              <tr className="bg-ink text-xs uppercase text-white">
                <th className="px-3 py-2" rowSpan={2}>
                  Date
                </th>
                <th className="px-3 py-2" rowSpan={2}>
                  ShipPier #
                </th>
                <th className="px-3 py-2" rowSpan={2}>
                  Guide #
                </th>
                <th className="px-3 py-2" rowSpan={2}>
                  Carrier
                </th>
                <th className="px-3 py-2" rowSpan={2}>
                  Type
                </th>
                <th
                  className="bg-steel px-3 py-2 text-center"
                  colSpan={3}
                >
                  Declared on Label
                </th>
                <th
                  className="bg-harbor px-3 py-2 text-center"
                  colSpan={3}
                >
                  Detected at Hub
                </th>
              </tr>
              <tr className="bg-ink-soft text-xs uppercase text-white">
                <th className="bg-steel/90 px-3 py-2">Dims</th>
                <th className="bg-steel/90 px-3 py-2">Weight</th>
                <th className="bg-steel/90 px-3 py-2">Vol.</th>
                <th className="bg-harbor-mist px-3 py-2">Dims</th>
                <th className="bg-harbor-mist px-3 py-2">Weight</th>
                <th className="bg-harbor-mist px-3 py-2">Vol.</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, i) => (
                <tr
                  key={r.id}
                  className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                >
                  <td className="px-3 py-3">
                    <button
                      type="button"
                      className="mb-1 badge bg-brand text-white"
                    >
                      + See more
                    </button>
                    <p className="text-ink-muted">{r.date}</p>
                  </td>
                  <td className="px-3 py-3 font-medium text-brand">
                    {r.shipPierId}
                  </td>
                  <td className="px-3 py-3 font-medium text-ink">{r.guide}</td>
                  <td className="px-3 py-3 lowercase text-rose-600">
                    {r.carrier}
                  </td>
                  <td className="px-3 py-3 text-ink-muted">{r.shippingType}</td>
                  <td className="px-3 py-3">{r.declaredDims}</td>
                  <td className="px-3 py-3">{r.declaredWeight}</td>
                  <td className="px-3 py-3">{r.declaredVol}</td>
                  <td className="px-3 py-3 font-semibold">{r.actualDims}</td>
                  <td className="px-3 py-3 font-semibold text-rose-600">
                    {r.actualWeight}
                  </td>
                  <td className="px-3 py-3 font-semibold">{r.actualVol}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
