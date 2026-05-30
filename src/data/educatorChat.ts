import type { SimulationRecord } from '../data/simulation'
import { askGemini } from '../services/aiService'
import { calcMonthlySavings } from '../utils/simulation'

export const askEducator = async (
  question: string,
  simulation: SimulationRecord,
): Promise<string> => {
  const { income, expenses, debts, goalName, goalAmount, goalDeadline } = simulation
  const monthlySavings = calcMonthlySavings(simulation)

  const conversationPrompt = `Você é um educador financeiro amigável e didático. A seguir estão os dados de uma simulação financeira de um usuário. Responda à pergunta de forma clara, empática e objetiva, usando linguagem simples e sem termos técnicos difíceis. Não retorne JSON, não use markdown, nem blocos de código.

Dados da simulação:
- Renda mensal bruta: ${income}
- Custos fixos essenciais: ${expenses}
- Dívidas e parcelas mensais: ${debts}
- Valor disponível por mês: R$ ${monthlySavings.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
- Meta: ${goalName}
- Custo da meta: ${goalAmount}
- Prazo desejado: ${goalDeadline} meses

Pergunta do usuário: "${question}"

Responda como um educador financeiro experiente e encorajador.`

  const response = await askGemini(conversationPrompt)
  return response
}
