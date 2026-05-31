import { Content } from '@/components/features/Insights/Content'
import { Button } from '@/components/shared/Button'
import { Input } from '@/components/shared/Input'
import { askEducator } from '@/data/educatorChat'
import type { SimulationRecord } from '@/data/simulation'
import { useConversationStorage } from '@/hooks/useConversationStorage'
import type { InsightData } from '@/services/aiService'
import { MessageCircle, Send } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

interface EducatorChatProps {
  simulation: SimulationRecord
  insight: InsightData
}

export function EducatorChat({ simulation, insight }: EducatorChatProps) {
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
    <div className="space-y-6">
      <div className="mb-4 max-h-[520px] divide-y divide-border overflow-y-auto rounded-[28px] bg-secondary/30 bg-opacity-90">
        {insight && (
          <div className="space-y-3 px-5 py-5">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              <MessageCircle size={18} />
              Resposta da IA
            </div>
            <div className="rounded-[28px] bg-card p-5 text-sm leading-relaxed">
              <Content insight={insight} />
            </div>
          </div>
        )}

        {messages.length === 0 && !insight && (
          <div className="rounded-[28px] bg-card p-5 text-center text-sm text-muted-foreground">
            Faça uma pergunta sobre sua simulação financeira para começar.
          </div>
        )}

        {messages.map((message) => (
          <div key={message.id} className="space-y-3 px-5 py-5">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              <MessageCircle size={18} />
              {message.role === 'user' ? 'Você' : 'Resposta da IA'}
            </div>
            <div className="rounded-[28px] bg-card p-5 text-sm leading-relaxed text-foreground">
              {message.content}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="space-y-3 px-5 py-5">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              <MessageCircle size={18} />
              Resposta da IA
            </div>
            <div className="rounded-[28px] bg-card p-5 text-sm leading-relaxed">
              <div className="mb-3 text-sm text-muted-foreground">O educador está escrevendo...</div>
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-primary" />
                <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-primary" />
                <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-primary" />
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="space-y-3 px-5 py-5">
            <div className="rounded-[28px] bg-destructive/10 p-5 text-sm text-destructive">
              <div>{error}</div>
              <div className="mt-4 flex flex-wrap gap-2">
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
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="flex flex-col gap-3 rounded-[28px] bg-secondary p-4 sm:flex-row sm:items-center">
        <Input
          type="text"
          placeholder="Faça uma nova pergunta sobre sua simulação..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && !isLoading) {
              handleSendMessage()
            }
          }}
          disabled={isLoading}
          className="flex-1 min-w-0 rounded-full bg-card px-4 py-3 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
        />
        <Button
          type="button"
          variant="send"
          className="inline-flex h-12 items-center justify-center"
          onClick={handleSendMessage}
          disabled={isLoading || !input.trim()}
        >
          <Send size={18} />
        </Button>
      </div>
    </div>
  )
}
