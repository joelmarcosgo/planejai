import { MessageCircle, Send } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { askEducator } from '../../../data/educatorChat'
import type { SimulationRecord } from '../../../data/simulation'
import { useConversationStorage } from '../../../hooks/useConversationStorage'

interface EducatorChatProps {
  simulation: SimulationRecord
}

export function EducatorChat({ simulation }: EducatorChatProps) {
  const { getConversation, saveMessage } = useConversationStorage()
  const [messages, setMessages] = useState(getConversation(simulation.id)?.messages ?? [])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [input, setInput] = useState('')
  const [lastQuestion, setLastQuestion] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendQuestion = async (question: string, saveUserMessage = true) => {
    if (!question.trim()) return

    setError(null)

    if (saveUserMessage) {
      const savedUserMessage = saveMessage(simulation.id, 'user', question)
      setMessages((prev) => [...prev, savedUserMessage])
      setLastQuestion(question)
    }

    setIsLoading(true)

    try {
      const response = await askEducator(question, simulation)
      const savedAssistantMessage = saveMessage(simulation.id, 'assistant', response)
      setMessages((prev) => [...prev, savedAssistantMessage])
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao obter resposta'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendMessage = async () => {
    const userMessage = input.trim()
    if (!userMessage) return

    setInput('')
    await sendQuestion(userMessage, true)
  }

  const handleRetry = async () => {
    if (!lastQuestion) return
    await sendQuestion(lastQuestion, false)
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-[4px_4px_18px_0px_rgba(0,0,0,0.2)]">
      <div className="mb-4 flex items-center gap-2">
        <MessageCircle size={20} className="text-primary" />
        <h2 className="text-lg font-semibold text-foreground">Educador Financeiro</h2>
      </div>

      <div className="mb-4 max-h-96 space-y-4 overflow-y-auto rounded-xl bg-secondary/30 p-4">
        {messages.length === 0 && (
          <p className="text-center text-sm text-muted-foreground">
            Faça uma pergunta sobre sua simulação financeira...
          </p>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div
              className={`flex-1 rounded-2xl p-3 text-sm leading-relaxed ${
                message.role === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card text-foreground border border-border'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3">
            <div className="flex-1 rounded-2xl border border-border bg-card p-4 text-sm text-foreground shadow-sm">
              <div className="mb-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Educador Financeiro está digitando...
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-primary" />
                <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-primary" />
                <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-primary" />
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="rounded-2xl border border-destructive bg-destructive/10 p-3 text-sm text-destructive">
            <div>{error}</div>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setError(null)}
                className="rounded-full border border-destructive px-3 py-2 text-xs font-semibold transition hover:bg-destructive/10"
              >
                Descartar
              </button>
              {lastQuestion && (
                <button
                  type="button"
                  onClick={handleRetry}
                  disabled={isLoading}
                  className="rounded-full bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-50"
                >
                  Tentar novamente
                </button>
              )}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Faça uma pergunta sobre sua simulação..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && !isLoading) {
              handleSendMessage()
            }
          }}
          disabled={isLoading}
          className="flex-1 rounded-full border border-border bg-secondary px-4 py-3 text-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
        />
        <button
          type="button"
          onClick={handleSendMessage}
          disabled={isLoading || !input.trim()}
          className="rounded-full bg-primary p-3 text-primary-foreground transition hover:bg-primary/90 disabled:opacity-50"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  )
}
