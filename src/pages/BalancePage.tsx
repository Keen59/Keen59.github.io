import { BALANCE_STATS, USER } from '../data/mock'

const stats = BALANCE_STATS.map((s, i) =>
  i === 0 ? { ...s, value: USER.balance } : s,
)

export function BalancePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">Recharge Balance</h1>
        <p className="mt-1 text-sm text-ink-muted">
          Add funds to keep creating labels and shipping
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl bg-gray-100 p-4">
            <p className="text-xs font-semibold uppercase text-ink-muted">
              {s.label}
            </p>
            <p className="mt-1 text-lg font-bold text-ink">{s.value}</p>
          </div>
        ))}
      </div>

      <div>
        <h2 className="mb-3 text-lg font-semibold text-ink">
          Choose how you want to pay
        </h2>
        <div className="mb-4 rounded-xl bg-brand px-4 py-3 text-sm font-medium text-white">
          Card top-ups are applied instantly. Bank transfers may take 1–2
          business days.
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <div className="card space-y-4 p-5">
            <h3 className="font-bold text-ink">Credit / Debit Card</h3>
            <button type="button" className="btn-primary w-full">
              Add Card
            </button>
            <select className="input">
              <option>Select saved card...</option>
              <option>•••• 4242</option>
            </select>
            <label className="block space-y-1.5">
              <span className="text-xs font-semibold text-ink-muted">
                Amount
              </span>
              <input className="input" placeholder="1000.00" />
            </label>
            <p className="text-xs text-ink-muted">Processing fee: 2.9% + $0.30</p>
          </div>

          <div className="card space-y-4 p-5">
            <h3 className="font-bold text-ink">Cash Payment</h3>
            <label className="block space-y-1.5">
              <span className="text-xs font-semibold text-ink-muted">
                Amount
              </span>
              <input className="input" placeholder="500.00" />
            </label>
            <button type="button" className="btn-primary w-full">
              Create Order
            </button>
            <div className="rounded-lg bg-gray-50 p-3 text-sm">
              <p className="text-ink-muted">Total to pay</p>
              <p className="text-lg font-bold text-ink">—</p>
            </div>
          </div>

          <div className="card space-y-3 p-5">
            <h3 className="font-bold text-ink">Bank Transfer</h3>
            <InfoRow label="Bank" value="ShipPier Bank" />
            <InfoRow label="Beneficiary" value="ShipPier Logistics SA" />
            <InfoRow label="Tax ID" value="TKR880101XXX" />
            <InfoRow label="Account" value="012345678901234567" />
          </div>
        </div>
      </div>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-2 border-b border-gray-50 py-2 text-sm last:border-0">
      <span className="text-ink-muted">{label}</span>
      <span className="font-semibold text-ink">{value}</span>
    </div>
  )
}
