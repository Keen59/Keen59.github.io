import { useMemo, useState, type ReactNode } from 'react'
import { Box, Check, Layers, Mail, Package } from 'lucide-react'

const packageTypes = [
  { id: 'box', label: 'Box', icon: Box },
  { id: 'envelope', label: 'Envelope', icon: Mail },
  { id: 'pallet', label: 'Pallet', icon: Layers },
  { id: 'consolidated', label: 'Consolidated Load', icon: Package },
] as const

export function PackagesPage() {
  const [type, setType] = useState<(typeof packageTypes)[number]['id']>('box')
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric')
  const [length, setLength] = useState('40')
  const [width, setWidth] = useState('30')
  const [height, setHeight] = useState('20')
  const [qty, setQty] = useState('1')
  const [weight, setWeight] = useState('2.5')

  const volumetric = useMemo(() => {
    const l = Number(length) || 0
    const w = Number(width) || 0
    const h = Number(height) || 0
    const divisor = unit === 'metric' ? 5000 : 139
    return ((l * w * h) / divisor).toFixed(2)
  }, [length, width, height, unit])

  const dimLabel = unit === 'metric' ? 'Cm' : 'In'
  const weightLabel = unit === 'metric' ? 'Kg' : 'Lb'

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="card p-6">
        <h1 className="text-lg font-bold uppercase tracking-wide text-ink">
          Enter Package Data (Quote)
        </h1>
        <div className="mt-4 flex items-center justify-between">
          <h2 className="font-semibold text-ink">Add packages</h2>
          <select className="input w-40 py-1.5">
            <option>New Package</option>
            <option>Saved Template</option>
          </select>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {packageTypes.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setType(id)}
              className={`flex flex-col items-center gap-2 rounded-xl px-3 py-4 text-center text-xs font-semibold transition ${
                type === id
                  ? 'bg-brand text-brand-ink shadow-md shadow-brand/30'
                  : 'bg-brand-muted text-brand hover:bg-brand/20'
              }`}
            >
              <Icon className="h-6 w-6" />
              {label}
            </button>
          ))}
        </div>

        <div className="mt-5 flex gap-4">
          {(['metric', 'imperial'] as const).map((u) => (
            <label key={u} className="flex items-center gap-2 text-sm font-medium">
              <input
                type="radio"
                name="unit"
                checked={unit === u}
                onChange={() => setUnit(u)}
                className="text-brand focus:ring-brand"
              />
              {u === 'metric' ? 'CM / KG' : 'IN / LB'}
            </label>
          ))}
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <Field label={`Length (${dimLabel})`}>
            <input
              className="input"
              value={length}
              onChange={(e) => setLength(e.target.value)}
            />
          </Field>
          <Field label={`Width (${dimLabel})`}>
            <input
              className="input"
              value={width}
              onChange={(e) => setWidth(e.target.value)}
            />
          </Field>
          <Field label={`Height (${dimLabel})`}>
            <input
              className="input"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
            />
          </Field>
        </div>

        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <Field label="Quantity">
            <input
              className="input"
              type="number"
              min={1}
              value={qty}
              onChange={(e) => setQty(e.target.value)}
            />
          </Field>
          <Field label={`Weight (${weightLabel})`}>
            <input
              className="input"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
            />
          </Field>
          <Field label={`Volumetric Weight (${weightLabel})`}>
            <input className="input bg-gray-50" value={volumetric} readOnly />
          </Field>
        </div>

        <div className="mt-6 flex justify-end">
          <button type="button" className="btn-primary">
            <Check className="h-4 w-4" />
            Add
          </button>
        </div>
      </div>

      <div className="card p-6">
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-lg font-bold uppercase tracking-wide text-ink">
            Rate Options
          </h2>
          <span className="badge bg-rose-100 text-rose-700">
            Insurance · More info
          </span>
        </div>
        <div className="mt-8 flex min-h-[280px] flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50 text-center">
          <p className="text-sm font-medium text-ink-muted">
            Add a package to see available rates
          </p>
          <p className="mt-1 text-xs text-ink-muted">
            Carrier options will appear here after quoting
          </p>
        </div>
      </div>
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
      <span className="text-xs font-semibold text-ink-muted">{label}</span>
      {children}
    </label>
  )
}
