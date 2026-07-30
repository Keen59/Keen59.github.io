import { useMemo, useState } from 'react'
import {
  ArrowRightLeft,
  Package,
  RotateCcw,
  Tag,
  Truck,
  Wallet,
  Warehouse,
} from 'lucide-react'
import {
  TRANSACTIONS,
  WALLET_ACCOUNTS,
  type WalletAccountId,
} from '../data/mock'

const walletIcons = {
  labels: Tag,
  cargo: Truck,
  warehouse: Warehouse,
  returns: RotateCcw,
  general: Wallet,
} as const

export function BalancePage() {
  const [selected, setSelected] = useState<WalletAccountId>('labels')
  const [amount, setAmount] = useState('500.00')

  const account = WALLET_ACCOUNTS.find((w) => w.id === selected)!
  const Icon = walletIcons[selected]

  const recent = useMemo(
    () => TRANSACTIONS.filter((t) => t.wallet === selected).slice(0, 5),
    [selected],
  )

  const total = WALLET_ACCOUNTS.reduce((sum, w) => {
    const n = Number(w.balance.replace(/[^0-9.]/g, ''))
    return sum + (Number.isFinite(n) ? n : 0)
  }, 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">Wallet</h1>
        <p className="mt-1 text-sm text-ink-muted">
          Each cost type has its own balance — labels, cargo, warehouse and
          returns are tracked separately
        </p>
      </div>

      <div className="card flex flex-col gap-2 p-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-muted">
            Combined total
          </p>
          <p className="text-3xl font-bold text-ink">
            $ {total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
        </div>
        <p className="text-sm text-ink-muted">
          Funds are not mixed. Charges always debit the matching wallet.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {WALLET_ACCOUNTS.map((w) => {
          const WIcon = walletIcons[w.id]
          const active = selected === w.id
          return (
            <button
              key={w.id}
              type="button"
              onClick={() => setSelected(w.id)}
              className={`card p-5 text-left transition ${
                active
                  ? 'border-brand ring-2 ring-brand/25 shadow-lift'
                  : 'hover:border-brand/40'
              }`}
            >
              <div className="mb-3 flex items-start justify-between gap-2">
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                    active ? 'bg-harbor text-brand' : 'bg-brand-muted text-brand-ink'
                  }`}
                >
                  <WIcon className="h-5 w-5" />
                </span>
                <span className="badge bg-surface text-ink-muted">{w.currency}</span>
              </div>
              <p className="font-bold text-ink">{w.name}</p>
              <p className="mt-1 text-xs text-ink-muted">{w.description}</p>
              <p className="mt-4 text-2xl font-bold text-brand-ink">{w.balance}</p>
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-lg bg-surface px-2 py-1.5">
                  <p className="text-ink-muted">Spent / mo</p>
                  <p className="font-semibold text-ink">{w.spentMonth}</p>
                </div>
                <div className="rounded-lg bg-surface px-2 py-1.5">
                  <p className="text-ink-muted">Top-ups / mo</p>
                  <p className="font-semibold text-ink">{w.toppedUpMonth}</p>
                </div>
              </div>
              <p className="mt-3 truncate text-xs text-ink-muted">
                Last: {w.lastCharge}
              </p>
            </button>
          )
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="card space-y-4 p-5">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-harbor text-brand">
              <Icon className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-ink">
                Top up · {account.name}
              </h2>
              <p className="text-sm text-ink-muted">
                Money goes only into this wallet
              </p>
            </div>
          </div>

          <label className="block space-y-1.5">
            <span className="text-xs font-semibold text-ink-muted">Amount</span>
            <input
              className="input"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </label>

          <select className="input">
            <option>Credit / Debit Card ·••• 4242</option>
            <option>Bank transfer</option>
            <option>Cash payment order</option>
          </select>

          <button type="button" className="btn-primary w-full">
            Add funds to {account.name}
          </button>

          <div className="rounded-xl bg-surface p-3 text-sm">
            <div className="mb-2 flex items-center gap-2 font-semibold text-ink">
              <ArrowRightLeft className="h-4 w-4 text-brand-ink" />
              Transfer between wallets
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              <select className="input" defaultValue={selected} disabled>
                {WALLET_ACCOUNTS.map((w) => (
                  <option key={w.id} value={w.id}>
                    From: {w.name}
                  </option>
                ))}
              </select>
              <select className="input" defaultValue="general">
                {WALLET_ACCOUNTS.filter((w) => w.id !== selected).map((w) => (
                  <option key={w.id} value={w.id}>
                    To: {w.name}
                  </option>
                ))}
              </select>
            </div>
            <button type="button" className="btn-ghost mt-3 w-full">
              Transfer
            </button>
          </div>
        </div>

        <div className="card overflow-hidden">
          <div className="border-b border-harbor/8 px-5 py-4">
            <h2 className="font-bold text-ink">
              Recent activity · {account.name}
            </h2>
            <p className="text-sm text-ink-muted">
              Only movements for this wallet ledger
            </p>
          </div>
          <div className="divide-y divide-harbor/5">
            {recent.length === 0 ? (
              <p className="px-5 py-8 text-center text-sm text-ink-muted">
                No movements yet
              </p>
            ) : (
              recent.map((t) => (
                <div
                  key={t.id}
                  className="flex items-start justify-between gap-3 px-5 py-3"
                >
                  <div>
                    <p className="text-sm font-semibold text-ink">
                      {t.description}
                    </p>
                    <p className="text-xs text-ink-muted">
                      {t.date} · {t.type}
                    </p>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-sm font-bold ${
                        t.amount.startsWith('+')
                          ? 'text-emerald-600'
                          : 'text-rose-600'
                      }`}
                    >
                      {t.amount}
                    </p>
                    <p className="text-xs text-ink-muted">{t.balanceAfter}</p>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="border-t border-harbor/8 px-5 py-3 text-xs text-ink-muted">
            Full history is available under Transactions, filtered by wallet.
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-harbor px-4 py-3 text-sm font-medium text-brand">
        <span className="inline-flex items-center gap-2">
          <Package className="h-4 w-4" />
          Label charges never pull from Cargo, and cargo freight never pulls
          from Label Fees. Keep each account funded for its own operations.
        </span>
      </div>
    </div>
  )
}
