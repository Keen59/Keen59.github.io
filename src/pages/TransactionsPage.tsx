import { TRANSACTIONS } from '../data/mock'

const typeStyles = {
  top_up: 'bg-emerald-100 text-emerald-700',
  label: 'bg-brand-muted text-brand-ink',
  refund: 'bg-sky-100 text-sky-700',
  fee: 'bg-amber-100 text-amber-800',
} as const

const typeLabels = {
  top_up: 'Top-up',
  label: 'Label',
  refund: 'Refund',
  fee: 'Fee',
} as const

export function TransactionsPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold uppercase tracking-wide text-ink">
          Transactions
        </h1>
        <p className="mt-1 text-sm text-ink-muted">
          Balance movements for labels, fees, refunds and top-ups
        </p>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="bg-harbor text-xs uppercase tracking-wide text-brand">
                <th className="px-4 py-3 font-semibold">Date</th>
                <th className="px-4 py-3 font-semibold">Type</th>
                <th className="px-4 py-3 font-semibold">Description</th>
                <th className="px-4 py-3 font-semibold">Amount</th>
                <th className="px-4 py-3 font-semibold">Balance After</th>
              </tr>
            </thead>
            <tbody>
              {TRANSACTIONS.map((t, i) => (
                <tr
                  key={t.id}
                  className={i % 2 === 0 ? 'bg-white' : 'bg-surface'}
                >
                  <td className="px-4 py-3 text-ink-muted">{t.date}</td>
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
