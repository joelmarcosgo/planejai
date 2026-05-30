import type { SimulationRecord } from '../data/simulation'
import { buildAIPrompt } from './aiPrompt'

export const askEducator = async (
  question: string,
  simulation: SimulationRecord,
): Promise<string> => {
  const basePrompt = buildAIPrompt(simulation)

  const conversationPrompt = `${basePrompt}

Pergunta do usuário: "${question}"

Responda de forma clara, concisa e educativa, mantendo o tom amigável. 
A resposta deve ter no máximo 3 parágrafos.
Não use markdown ou formatação especial. Use quebras de linha simples para separar parágrafos.`

  const response = await fetch('/api/insight', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt: conversationPrompt }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(errorText || 'Erro ao buscar resposta do educador')
  }

  const data = await response.json()
  return typeof data === 'string' ? data : data.content || JSON.stringify(data)
}
