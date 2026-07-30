import { useMemo, useState } from 'react'
import {
  TRANSACTIONS,
  WALLET_ACCOUNTS,
  type WalletAccountId,
} from '../data/mock'

const typeStyles = {
  top_up: 'bg-emerald-100 text-emerald-700',
  charge: 'bg-brand-muted text-brand-ink',
  refund: 'bg-sky-100 text-sky-700',
  transfer: 'bg-amber-100 text-amber-800',
} as const

const typeLabels = {
  top_up: 'Top-up',
  charge: 'Charge',
  refund: 'Refund',
  transfer: 'Transfer',
} as const

export function TransactionsPage() {
  const [wallet, setWallet] = useState<WalletAccountId | 'all'>('all')

  const filtered = useMemo(() => {
    if (wallet === 'all') return TRANSACTIONS
    return TRANSACTIONS.filter((t) => t.wallet === wallet)
  }, [wallet])

  const walletName = (id: WalletAccountId) =>
    WALLET_ACCOUNTS.find((w) => w.id === id)?.name ?? id

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold uppercase tracking-wide text-ink">
          Transactions
        </h1>
        <p className="mt-1 text-sm text-ink-muted">
          Separate ledgers for label fees, cargo, warehouse and returns
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <FilterChip
          active={wallet === 'all'}
          label="All wallets"
          onClick={() => setWallet('all')}
        />
        {WALLET_ACCOUNTS.map((w) => (
          <FilterChip
            key={w.id}
            active={wallet === w.id}
            label={w.name}
            onClick={() => setWallet(w.id)}
          />
        ))}
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead>
              <tr className="bg-harbor text-xs uppercase tracking-wide text-brand">
                <th className="px-4 py-3 font-semibold">Date</th>
                <th className="px-4 py-3 font-semibold">Wallet</th>
                <th className="px-4 py-3 font-semibold">Type</th>
                <th className="px-4 py-3 font-semibold">Description</th>
                <th className="px-4 py-3 font-semibold">Amount</th>
                <th className="px-4 py-3 font-semibold">Wallet Balance After</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t, i) => (
                <tr
                  key={t.id}
                  className={i % 2 === 0 ? 'bg-white' : 'bg-surface'}
                >
                  <td className="px-4 py-3 text-ink-muted">{t.date}</td>
                  <td className="px-4 py-3 font-semibold text-ink">
                    {walletName(t.wallet)}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`badge ${typeStyles[t.type]}`}>
                      {typeLabels[t.type]}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium text-ink">
                    {t.description}
                  </td>
                  <td
                    className={`px-4 py-3 font-bold ${
                      t.amount.startsWith('+')
                        ? 'text-emerald-600'
                        : 'text-rose-600'
                    }`}
                  >
                    {t.amount}
                  </td>
                  <td className="px-4 py-3 text-ink">{t.balanceAfter}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function FilterChip({
  active,
  label,
  onClick,
}: {
  active: boolean
  label: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl px-3 py-1.5 text-sm font-semibold transition ${
        active
          ? 'bg-harbor text-brand'
          : 'bg-white text-ink-muted shadow-card hover:bg-brand-muted'
      }`}
    >
      {label}
    </button>
  )
}
