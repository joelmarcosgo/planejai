
export interface ConversationMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

export interface Conversation {
  simulationId: string
  messages: ConversationMessage[]
}

const CONVERSATION_STORAGE_KEY = 'conversation-history'

export const useConversationStorage = () => {
  const getConversation = (simulationId: string): Conversation | null => {
    const storage = localStorage.getItem(CONVERSATION_STORAGE_KEY)
    if (!storage) return null

    const conversations = JSON.parse(storage) as Conversation[]
    return conversations.find((conv) => conv.simulationId === simulationId) ?? null
  }

  const saveMessage = (
    simulationId: string,
    role: 'user' | 'assistant',
    content: string,
  ): ConversationMessage => {
    const storage = localStorage.getItem(CONVERSATION_STORAGE_KEY)
    const conversations: Conversation[] = storage ? JSON.parse(storage) : []

    let conversation = conversations.find((conv) => conv.simulationId === simulationId)
    if (!conversation) {
      conversation = {
        simulationId,
        messages: [],
      }
      conversations.push(conversation)
    }

    const message: ConversationMessage = {
      id: crypto.randomUUID(),
      role,
      content,
      timestamp: Date.now(),
    }

    conversation.messages.push(message)
    localStorage.setItem(CONVERSATION_STORAGE_KEY, JSON.stringify(conversations))

    return message
  }

  const clearConversation = (simulationId: string) => {
    const storage = localStorage.getItem(CONVERSATION_STORAGE_KEY)
    if (!storage) return

    const conversations: Conversation[] = JSON.parse(storage)
    const updated = conversations.filter((conv) => conv.simulationId !== simulationId)
    localStorage.setItem(CONVERSATION_STORAGE_KEY, JSON.stringify(updated))
  }

  return {
    getConversation,
    saveMessage,
    clearConversation,
  }
}
