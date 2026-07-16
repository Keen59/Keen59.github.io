import { useState, type ReactNode } from 'react'
import { Search } from 'lucide-react'

export function QuotePage() {
  const [customDims, setCustomDims] = useState(false)

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink">
            Teiker — Cargo Quote System
          </h1>
          <p className="mt-1 text-sm text-ink-muted">
            Enter an Amazon ASIN and destination zip code to get a shipping
            quote.
          </p>
        </div>
        <span className="badge shrink-0 bg-emerald-100 text-emerald-700">
          LIVE API
        </span>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-1">
        {[
          { id: 'quote', label: 'Cargo Quote', active: true },
          { id: 'return', label: 'Return Label', active: false },
          { id: 'c2c', label: 'Customer to Customer', active: false },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`rounded-t-lg px-4 py-2 text-sm font-semibold transition ${
              tab.active
                ? 'border-b-2 border-brand text-brand'
                : 'text-ink-muted hover:text-ink'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="card space-y-5 p-6">
        <div>
          <h2 className="text-lg font-semibold text-ink">New quote</h2>
          <p className="mt-1 text-sm text-ink-muted">
            Product dimensions are pulled from Keepa API and rates are
            calculated via Teiker API.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Amazon ASIN">
            <input className="input" placeholder="B08N5WRWNW" />
          </Field>
          <Field label="Destination Zip Code">
            <input className="input" placeholder="90210" />
          </Field>
          <Field label="Origin Zip Code">
            <input className="input" placeholder="10001" defaultValue="10001" />
          </Field>
          <Field label="Package Quantity">
            <input className="input" type="number" defaultValue={1} min={1} />
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Package Type">
            <select className="input">
              <option>Box</option>
              <option>Envelope</option>
              <option>Pallet</option>
              <option>Consolidated Load</option>
            </select>
          </Field>
          <label className="mt-7 flex items-center gap-2 text-sm text-ink">
            <input
              type="checkbox"
              checked={customDims}
              onChange={(e) => setCustomDims(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-brand focus:ring-brand"
            />
            I will send with my own measurements
          </label>
        </div>

        {customDims && (
          <div className="grid gap-4 rounded-xl bg-gray-50 p-4 sm:grid-cols-4">
            <Field label="Length (cm)">
              <input className="input" type="number" placeholder="40" />
            </Field>
            <Field label="Width (cm)">
              <input className="input" type="number" placeholder="30" />
            </Field>
            <Field label="Height (cm)">
              <input className="input" type="number" placeholder="20" />
            </Field>
            <Field label="Weight (kg)">
              <input className="input" type="number" placeholder="2.5" />
            </Field>
          </div>
        )}

        <button type="button" className="btn-primary w-full sm:w-auto">
          <Search className="h-4 w-4" />
          Get Quote
        </button>
      </div>

      <details className="card overflow-hidden">
        <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-4 text-sm font-semibold text-ink">
          Cancel Shipment
          <span className="badge bg-rose-100 text-rose-700">Cancel</span>
        </summary>
        <div className="border-t border-gray-100 px-5 py-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              className="input"
              placeholder="Enter tracking number to cancel..."
            />
            <button
              type="button"
              className="rounded-lg bg-rose-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-rose-600"
            >
              Cancel Shipment
            </button>
          </div>
        </div>
      </details>

      <p className="text-center text-xs text-ink-muted">
        Infrastructure: Keepa API + Teiker API · Prices shown in carrier
        currency
      </p>
    </div>
  )
}

function Field({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
        {label}
      </span>
      {children}
    </label>
  )
}
