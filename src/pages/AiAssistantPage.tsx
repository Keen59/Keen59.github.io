import { useState } from 'react'
import { Bot, Send } from 'lucide-react'

const starter: { role: 'assistant' | 'user'; text: string }[] = [
  {
    role: 'assistant',
    text: 'Hi, I am the ESCArgo AI Assistant. Ask about order stages, box IDs, labels or returns.',
  },
]

export function AiAssistantPage() {
  const [messages, setMessages] = useState(starter)
  const [input, setInput] = useState('')

  function send() {
    const text = input.trim()
    if (!text) return
    setMessages((m) => [
      ...m,
      { role: 'user', text },
      {
        role: 'assistant',
        text: 'Mock reply: I can help track 1st transport → warehouse → 2nd transport once the backend is connected.',
      },
    ])
    setInput('')
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-4">
      <div>
        <h1 className="text-2xl font-bold uppercase tracking-wide text-ink">
          AI Assistant
        </h1>
        <p className="mt-1 text-sm text-ink-muted">
          Ask questions about orders, labels and logistics stages
        </p>
      </div>

      <div className="card flex min-h-[480px] flex-col">
        <div className="flex items-center gap-2 border-b border-harbor/8 px-4 py-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-brand-ink">
            <Bot className="h-5 w-5" />
          </span>
          <div>
            <p className="font-semibold text-ink">ESCArgo Copilot</p>
            <p className="text-xs text-ink-muted">Frontend mock · no backend</p>
          </div>
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto p-4">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                m.role === 'assistant'
                  ? 'bg-brand-muted text-brand-ink'
                  : 'ml-auto bg-harbor text-brand'
              }`}
            >
              {m.text}
            </div>
          ))}
        </div>

        <div className="flex gap-2 border-t border-harbor/8 p-4">
          <input
            className="input"
            placeholder="Ask about an order, box ID or return..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send()}
          />
          <button type="button" className="btn-primary shrink-0" onClick={send}>
            <Send className="h-4 w-4" />
            Send
          </button>
        </div>
      </div>
    </div>
  )
}
