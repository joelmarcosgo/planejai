import type { SimulationRecord } from '../data/simulation'
import { askGemini } from '../services/aiService'
import { calcMonthlySavings } from '../utils/simulation'

export const askEducator = async (
  question: string,
  simulation: SimulationRecord,
): Promise<string> => {
  const { income, expenses, debts, goalName, goalAmount, goalDeadline } = simulation
  const monthlySavings = calcMonthlySavings(simulation)

  const conversationPrompt = `Você é um educador financeiro muito amigável, claro e direto. Leia os dados da simulação abaixo e responda à pergunta em linguagem natural, como se estivesse explicando para um amigo.

Use apenas texto corrido em português do Brasil. Não retorne JSON, não use listas numeradas, não use markdown, não use blocos de código e não use estruturas de dados. Seja simpático, empático e evite termos técnicos.

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

  const response = await askGemini(conversationPrompt, {
    formatFriendlyResponse: true,
  })
  return response
}
