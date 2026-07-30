import { useMemo, useRef, useState } from 'react'
import {
  Banknote,
  CheckCircle2,
  Copy,
  Eye,
  FileText,
  Image as ImageIcon,
  Info,
  MessageSquare,
  Package,
  Paperclip,
  Send,
  User,
  Wallet,
  X,
} from 'lucide-react'
import {
  COMPENSATIONS,
  TICKETS,
  TICKET_STATS,
  WALLET_ACCOUNTS,
  type Ticket,
  type TicketMessage,
} from '../data/mock'
import { TicketBadge } from '../components/StatusBadge'

const filters = ['All', 'In Tracking', 'Closed'] as const

const compensationReasons = [
  'Lost / no movement',
  'Delay beyond SLA',
  'Damaged package',
  'Return to origin credit',
  'Delivery not recognized',
  'Goodwill / other',
] as const

export function TicketsPage() {
  const [filter, setFilter] = useState<(typeof filters)[number]>('All')
  const [query, setQuery] = useState('')
  const [activeTicketId, setActiveTicketId] = useState<string | null>(null)
  const [modalTab, setModalTab] = useState<'chat' | 'compensation'>('chat')

  const filtered = useMemo(() => {
    let rows = TICKETS
    if (filter === 'In Tracking') {
      rows = rows.filter(
        (t) => t.status === 'waiting' || t.status === 'in_progress',
      )
    } else if (filter === 'Closed') {
      rows = rows.filter((t) => t.status === 'closed' || t.status === 'resolved')
    }
    const q = query.trim().toLowerCase()
    if (!q) return rows
    return rows.filter(
      (t) =>
        t.id.includes(q) ||
        t.classification.toLowerCase().includes(q) ||
        t.shipmentId.includes(q) ||
        t.customer.name.toLowerCase().includes(q),
    )
  }, [filter, query])

  const activeTicket = TICKETS.find((t) => t.id === activeTicketId) ?? null
  const stats = TICKET_STATS

  function openTicket(id: string, tab: 'chat' | 'compensation' = 'chat') {
    setActiveTicketId(id)
    setModalTab(tab)
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-ink">Tracking Tickets</h1>
        <p className="mt-1 text-sm text-ink-muted">
          Chat with customers or issue compensation as a direct transfer
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard label="My tickets" value={stats.total} />
        <StatCard label="In tracking" value={stats.tracking} accent />
        <StatCard label="Closed" value={stats.closed} />
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <MiniStat label="Listed" value={stats.total} />
        <MiniStat label="Active" value={stats.tracking} />
        <MiniStat label="Average" value={stats.average} />
      </div>

      <div className="card p-4">
        <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <input
            className="input max-w-xl"
            placeholder="Search by ticket, customer, classification or shipment..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="flex flex-wrap items-center gap-2">
            {filters.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                  filter === f
                    ? 'bg-harbor text-brand'
                    : 'bg-gray-100 text-ink-muted hover:bg-gray-200'
                }`}
              >
                {f}
              </button>
            ))}
            <span className="text-sm text-ink-muted">
              {filtered.length} tickets
            </span>
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg border border-gray-100">
          <table className="w-full min-w-[980px] text-left text-sm">
            <thead>
              <tr className="bg-gray-50 text-xs uppercase tracking-wide text-ink-muted">
                <th className="px-4 py-3 font-semibold">Ticket Status</th>
                <th className="px-4 py-3 font-semibold"># Ticket</th>
                <th className="px-4 py-3 font-semibold">Customer</th>
                <th className="px-4 py-3 font-semibold">Date</th>
                <th className="px-4 py-3 font-semibold">Classification</th>
                <th className="px-4 py-3 font-semibold"># Shipment</th>
                <th className="px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => (
                <tr key={t.id} className="border-t border-gray-100">
                  <td className="px-4 py-3">
                    <TicketBadge
                      status={t.status}
                      label={t.statusLabel}
                      subStatus={t.subStatus}
                    />
                  </td>
                  <td className="px-4 py-3 font-bold text-ink">#{t.id}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-ink">{t.customer.name}</p>
                    <p className="text-xs text-ink-muted">{t.customer.company}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-ink">{t.date}</p>
                    <span className="badge mt-1 bg-gray-100 text-ink-muted">
                      {t.relative}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-ink">{t.classification}</td>
                  <td className="px-4 py-3 font-medium text-brand-ink">
                    {t.shipmentId}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        className="btn-ghost"
                        onClick={() => openTicket(t.id, 'chat')}
                      >
                        <Eye className="h-3.5 w-3.5" />
                        View Ticket
                      </button>
                      <button
                        type="button"
                        className="btn-ghost border-brand/40 bg-brand-muted text-brand-ink"
                        onClick={() => openTicket(t.id, 'compensation')}
                      >
                        <Banknote className="h-3.5 w-3.5" />
                        Compensation
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <CompensationHistory />

      {activeTicket && (
        <TicketChatModal
          ticket={activeTicket}
          initialTab={modalTab}
          onClose={() => setActiveTicketId(null)}
        />
      )}
    </div>
  )
}

function CompensationHistory() {
  const statusStyles = {
    pending: 'bg-amber-100 text-amber-800',
    sent: 'bg-emerald-100 text-emerald-700',
    failed: 'bg-rose-100 text-rose-700',
  } as const

  return (
    <div className="card overflow-hidden">
      <div className="border-b border-harbor/8 px-5 py-4">
        <h2 className="text-lg font-bold text-ink">Compensation transfers</h2>
        <p className="text-sm text-ink-muted">
          Direct payouts issued from tickets — wallet credit or bank transfer
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[860px] text-left text-sm">
          <thead>
            <tr className="bg-harbor text-xs uppercase tracking-wide text-brand">
              <th className="px-4 py-3 font-semibold">Date</th>
              <th className="px-4 py-3 font-semibold">Ticket</th>
              <th className="px-4 py-3 font-semibold">Customer</th>
              <th className="px-4 py-3 font-semibold">Method</th>
              <th className="px-4 py-3 font-semibold">Destination</th>
              <th className="px-4 py-3 font-semibold">Amount</th>
              <th className="px-4 py-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {COMPENSATIONS.map((c, i) => (
              <tr
                key={c.id}
                className={i % 2 === 0 ? 'bg-white' : 'bg-surface'}
              >
                <td className="px-4 py-3 text-ink-muted">{c.date}</td>
                <td className="px-4 py-3 font-semibold text-ink">#{c.ticketId}</td>
                <td className="px-4 py-3 text-ink">{c.customerName}</td>
                <td className="px-4 py-3 text-ink">
                  {c.method === 'wallet_credit'
                    ? 'Wallet credit'
                    : 'Bank transfer'}
                </td>
                <td className="px-4 py-3 text-ink-muted">{c.destination}</td>
                <td className="px-4 py-3 font-bold text-brand-ink">{c.amount}</td>
                <td className="px-4 py-3">
                  <span className={`badge capitalize ${statusStyles[c.status]}`}>
                    {c.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function TicketChatModal({
  ticket,
  initialTab,
  onClose,
}: {
  ticket: Ticket
  initialTab: 'chat' | 'compensation'
  onClose: () => void
}) {
  const [tab, setTab] = useState<'chat' | 'compensation'>(initialTab)
  const [messages, setMessages] = useState<TicketMessage[]>(ticket.messages)
  const [draft, setDraft] = useState('')
  const [pendingFiles, setPendingFiles] = useState<
    { name: string; type: 'image' | 'file' }[]
  >([])
  const fileRef = useRef<HTMLInputElement>(null)

  function copyText(value: string) {
    void navigator.clipboard?.writeText(value)
  }

  function onPickFiles(files: FileList | null) {
    if (!files?.length) return
    const next = Array.from(files).map((f) => ({
      name: f.name,
      type: (f.type.startsWith('image/') ? 'image' : 'file') as
        | 'image'
        | 'file',
    }))
    setPendingFiles((prev) => [...prev, ...next])
  }

  function sendMessage() {
    const text = draft.trim()
    if (!text && pendingFiles.length === 0) return

    const stamp = new Date().toLocaleString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    })

    const base: TicketMessage[] = []
    if (text) {
      base.push({
        id: `local-${Date.now()}`,
        from: 'customer',
        author: ticket.customer.name,
        at: stamp,
        text,
      })
    }
    pendingFiles.forEach((file, index) => {
      base.push({
        id: `local-file-${Date.now()}-${index}`,
        from: 'customer',
        author: ticket.customer.name,
        at: stamp,
        text: file.type === 'image' ? 'Attached photo' : 'Attached file',
        attachment: file,
      })
    })

    setMessages((prev) => [...prev, ...base])
    setDraft('')
    setPendingFiles([])
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-harbor/50 backdrop-blur-sm"
        aria-label="Close overlay"
        onClick={onClose}
      />
      <div className="relative z-10 flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-surface shadow-2xl">
        <div className="flex items-center justify-between border-b border-harbor/10 bg-white px-5 py-4">
          <div>
            <h2 className="text-lg font-bold text-ink">Ticket Tracking</h2>
            <p className="text-sm text-ink-muted">
              #{ticket.id} · {ticket.classification}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-ink-muted hover:bg-surface hover:text-ink"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex gap-2 border-b border-harbor/10 bg-white px-5 pt-2">
          <TabBtn
            active={tab === 'chat'}
            onClick={() => setTab('chat')}
            icon={MessageSquare}
            label="Chat"
          />
          <TabBtn
            active={tab === 'compensation'}
            onClick={() => setTab('compensation')}
            icon={Banknote}
            label="Compensation"
          />
        </div>

        <div className="overflow-y-auto p-5">
          <div className="grid gap-3 lg:grid-cols-2">
            <section className="rounded-xl border border-brand/40 bg-white p-4">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-ink">
                <User className="h-4 w-4 text-brand-ink" />
                Account details
              </div>
              <dl className="space-y-2 text-sm">
                <Row label="Name" value={ticket.customer.name} />
                <Row label="Company" value={ticket.customer.company} />
                <Row label="Email" value={ticket.customer.email} />
                <Row label="Phone" value={ticket.customer.phone} />
              </dl>
            </section>

            <section className="rounded-xl border border-brand/40 bg-white p-4">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-ink">
                <Info className="h-4 w-4 text-brand-ink" />
                Ticket details
              </div>
              <dl className="space-y-2 text-sm">
                <Row
                  label="Tracking"
                  value={ticket.tracking}
                  onCopy={() => copyText(ticket.tracking)}
                />
                <Row
                  label="ESCArgo Ref."
                  value={ticket.shipmentId}
                  onCopy={() => copyText(ticket.shipmentId)}
                />
                <Row label="Carrier" value={ticket.carrier} accent />
              </dl>
            </section>
          </div>

          {tab === 'chat' ? (
            <div className="mt-5">
              <div className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.14em] text-ink">
                <MessageSquare className="h-4 w-4" />
                Chat
              </div>

              <div className="max-h-[280px] space-y-4 overflow-y-auto rounded-xl border border-harbor/8 bg-white p-4">
                {messages.map((m) => (
                  <div key={m.id} className="flex gap-3">
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                        m.from === 'support'
                          ? 'bg-harbor text-brand'
                          : 'bg-brand text-brand-ink'
                      }`}
                    >
                      {m.from === 'support' ? (
                        <Package className="h-4 w-4" />
                      ) : (
                        <User className="h-4 w-4" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex flex-wrap items-center gap-2">
                        <span className="text-sm font-semibold text-ink">
                          {m.author}
                        </span>
                        <span className="text-xs text-ink-muted">{m.at}</span>
                      </div>
                      <div className="rounded-xl bg-surface px-3 py-2.5 text-sm text-ink">
                        <p>{m.text}</p>
                        {m.attachment && (
                          <div className="mt-2 flex items-center gap-2 rounded-lg border border-harbor/10 bg-white p-2">
                            {m.attachment.type === 'image' ? (
                              <div className="flex h-12 w-16 items-center justify-center rounded-md bg-brand-muted text-brand-ink">
                                <ImageIcon className="h-5 w-5" />
                              </div>
                            ) : (
                              <div className="flex h-12 w-12 items-center justify-center rounded-md bg-harbor text-brand">
                                <FileText className="h-5 w-5" />
                              </div>
                            )}
                            <div>
                              <p className="text-xs font-semibold text-ink">
                                {m.attachment.name}
                              </p>
                              <p className="text-[11px] uppercase text-ink-muted">
                                {m.attachment.type}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 rounded-xl border border-harbor/10 bg-white p-3">
                <textarea
                  className="min-h-[90px] w-full resize-none rounded-xl border border-harbor/10 bg-surface px-3 py-2.5 text-sm outline-none focus:border-brand-dark focus:ring-2 focus:ring-brand/40"
                  placeholder="Write a message..."
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                />

                {pendingFiles.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {pendingFiles.map((f, i) => (
                      <span
                        key={`${f.name}-${i}`}
                        className="badge bg-brand-muted text-brand-ink"
                      >
                        {f.type === 'image' ? (
                          <ImageIcon className="h-3 w-3" />
                        ) : (
                          <FileText className="h-3 w-3" />
                        )}
                        {f.name}
                        <button
                          type="button"
                          className="ml-1"
                          onClick={() =>
                            setPendingFiles((prev) =>
                              prev.filter((_, idx) => idx !== i),
                            )
                          }
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/*,.pdf,.doc,.docx,.png,.jpg,.jpeg"
                      multiple
                      className="hidden"
                      onChange={(e) => {
                        onPickFiles(e.target.files)
                        e.target.value = ''
                      }}
                    />
                    <button
                      type="button"
                      className="inline-flex items-center gap-2 rounded-xl bg-brand px-3 py-2 text-sm font-semibold text-brand-ink transition hover:bg-brand-dark"
                      onClick={() => fileRef.current?.click()}
                    >
                      <Paperclip className="h-4 w-4" />
                      Attach files (optional)
                    </button>
                  </div>
                  <button
                    type="button"
                    className="btn-primary bg-harbor text-brand hover:bg-harbor-soft"
                    onClick={sendMessage}
                  >
                    <Send className="h-4 w-4" />
                    Send
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <CompensationPanel ticket={ticket} />
          )}
        </div>
      </div>
    </div>
  )
}

function CompensationPanel({ ticket }: { ticket: Ticket }) {
  const [method, setMethod] = useState<'wallet_credit' | 'bank_transfer'>(
    'wallet_credit',
  )
  const [amount, setAmount] = useState('48.90')
  const [reason, setReason] =
    useState<(typeof compensationReasons)[number]>('Lost / no movement')
  const [sourceWallet, setSourceWallet] = useState('general')
  const [iban, setIban] = useState('')
  const [note, setNote] = useState('')
  const [sent, setSent] = useState(false)

  if (sent) {
    return (
      <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center">
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white">
          <CheckCircle2 className="h-7 w-7" />
        </div>
        <h3 className="text-xl font-bold text-ink">Compensation queued</h3>
        <p className="mt-2 text-sm text-ink-muted">
          ${amount} will be sent to {ticket.customer.name} via{' '}
          {method === 'wallet_credit' ? 'wallet credit' : 'bank transfer'} for
          ticket #{ticket.id}.
        </p>
        <button
          type="button"
          className="btn-ghost mt-5"
          onClick={() => setSent(false)}
        >
          Create another
        </button>
      </div>
    )
  }

  return (
    <div className="mt-5 space-y-4">
      <div className="rounded-2xl border border-brand/40 bg-gradient-to-br from-brand-muted/80 to-white p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-ink">
              Direct transfer
            </p>
            <h3 className="mt-1 text-xl font-bold text-ink">
              Issue compensation
            </h3>
            <p className="mt-1 max-w-xl text-sm text-ink-muted">
              Pay the customer instantly from a dedicated wallet. Label, cargo
              and general funds stay separate.
            </p>
          </div>
          <div className="rounded-xl bg-harbor px-4 py-3 text-right text-brand">
            <p className="text-[11px] uppercase tracking-wide text-brand/70">
              Ticket
            </p>
            <p className="text-lg font-bold">#{ticket.id}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => setMethod('wallet_credit')}
          className={`rounded-2xl border p-4 text-left transition ${
            method === 'wallet_credit'
              ? 'border-brand bg-brand-muted shadow-lift'
              : 'border-harbor/10 bg-white hover:border-brand/40'
          }`}
        >
          <Wallet className="mb-2 h-5 w-5 text-brand-ink" />
          <p className="font-bold text-ink">Wallet credit</p>
          <p className="mt-1 text-xs text-ink-muted">
            Credit lands on the customer ESCArgo balance immediately
          </p>
        </button>
        <button
          type="button"
          onClick={() => setMethod('bank_transfer')}
          className={`rounded-2xl border p-4 text-left transition ${
            method === 'bank_transfer'
              ? 'border-brand bg-brand-muted shadow-lift'
              : 'border-harbor/10 bg-white hover:border-brand/40'
          }`}
        >
          <Banknote className="mb-2 h-5 w-5 text-brand-ink" />
          <p className="font-bold text-ink">Bank transfer</p>
          <p className="mt-1 text-xs text-ink-muted">
            Direct payout to customer IBAN / account
          </p>
        </button>
      </div>

      <div className="grid gap-4 rounded-2xl border border-harbor/10 bg-white p-5 lg:grid-cols-2">
        <label className="block space-y-1.5">
          <span className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
            Amount (USD)
          </span>
          <input
            className="input text-lg font-bold"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </label>

        <label className="block space-y-1.5">
          <span className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
            Reason
          </span>
          <select
            className="input"
            value={reason}
            onChange={(e) =>
              setReason(e.target.value as (typeof compensationReasons)[number])
            }
          >
            {compensationReasons.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </label>

        <label className="block space-y-1.5">
          <span className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
            Debit from wallet
          </span>
          <select
            className="input"
            value={sourceWallet}
            onChange={(e) => setSourceWallet(e.target.value)}
          >
            {WALLET_ACCOUNTS.map((w) => (
              <option key={w.id} value={w.id}>
                {w.name} · {w.balance}
              </option>
            ))}
          </select>
        </label>

        {method === 'bank_transfer' ? (
          <label className="block space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
              Customer IBAN / account
            </span>
            <input
              className="input"
              placeholder="TR00 0000 0000 0000 0000 0000 00"
              value={iban}
              onChange={(e) => setIban(e.target.value)}
            />
          </label>
        ) : (
          <div className="rounded-xl bg-surface p-3 text-sm">
            <p className="text-xs font-semibold uppercase text-ink-muted">
              Credit to
            </p>
            <p className="mt-1 font-semibold text-ink">
              {ticket.customer.name} · {ticket.customer.company}
            </p>
            <p className="text-xs text-ink-muted">{ticket.customer.email}</p>
          </div>
        )}

        <label className="block space-y-1.5 lg:col-span-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
            Internal note (optional)
          </span>
          <textarea
            className="input min-h-[80px]"
            placeholder="Visible only to ESCArgo staff..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </label>
      </div>

      <div className="rounded-2xl bg-harbor p-5 text-brand">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-brand/70">
              Transfer summary
            </p>
            <p className="mt-1 text-2xl font-bold">${amount || '0.00'}</p>
            <p className="mt-1 text-sm text-brand/80">
              {method === 'wallet_credit' ? 'Wallet credit' : 'Bank transfer'} ·{' '}
              {reason} · from{' '}
              {WALLET_ACCOUNTS.find((w) => w.id === sourceWallet)?.name}
            </p>
          </div>
          <button
            type="button"
            className="btn-primary"
            onClick={() => setSent(true)}
          >
            <Send className="h-4 w-4" />
            Send compensation
          </button>
        </div>
      </div>
    </div>
  )
}

function TabBtn({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean
  onClick: () => void
  icon: typeof MessageSquare
  label: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 border-b-2 px-3 py-2.5 text-sm font-semibold transition ${
        active
          ? 'border-brand-ink text-brand-ink'
          : 'border-transparent text-ink-muted hover:text-ink'
      }`}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  )
}

function Row({
  label,
  value,
  onCopy,
  accent,
}: {
  label: string
  value: string
  onCopy?: () => void
  accent?: boolean
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <dt className="shrink-0 text-ink-muted">{label}</dt>
      <dd className="flex min-w-0 items-center gap-1.5 text-right font-semibold text-ink">
        <span className={`truncate ${accent ? 'text-brand-ink' : ''}`}>
          {value}
        </span>
        {onCopy && (
          <button
            type="button"
            onClick={onCopy}
            className="rounded p-0.5 text-ink-muted hover:bg-surface hover:text-ink"
            aria-label={`Copy ${label}`}
          >
            <Copy className="h-3.5 w-3.5" />
          </button>
        )}
      </dd>
    </div>
  )
}

function StatCard({
  label,
  value,
  accent,
}: {
  label: string
  value: number
  accent?: boolean
}) {
  return (
    <div
      className={`card p-5 ${accent ? 'border border-brand/30 bg-brand-muted' : ''}`}
    >
      <p className="text-3xl font-bold text-ink">{value}</p>
      <p className="mt-1 text-sm font-medium text-ink-muted">{label}</p>
    </div>
  )
}

function MiniStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl bg-gray-100 px-4 py-3">
      <p className="text-xs font-semibold uppercase text-ink-muted">{label}</p>
      <p className="text-xl font-bold text-ink">{value}</p>
    </div>
  )
}
