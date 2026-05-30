import type { SimulationRecord } from '../data/simulation'
import { buildAIPrompt } from './aiPrompt'
import { askGemini } from '../services/aiService'

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

  const response = await askGemini(conversationPrompt)
  return response
}
