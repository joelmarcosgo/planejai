interface GeminiResponse {
  candidates: {
    content: {
      parts: { text: string }[]
    }
  }[]
}

// URL da API do Gemini - usando a variável de ambiente para o endpoint, que pode ser configurada para apontar para o backend local ou para a API real do Gemini
// const GEMINI_API_URL = `${import.meta.env.VITE_API_URL ?? ''}/api/gemini`

// const callGeminiAPI = async (prompt: string) => {
//   const response = await fetch(GEMINI_API_URL, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ prompt }),
//   })

//   if (!response.ok) {
//     const errorBody = await response.text()
//     throw new Error(`Erro na requisição: ${response.status} - ${errorBody}`)
//   }

//   console.log(`Gemini: ${response}`)

//   return (await response.json()) as GeminiResponse
// }

// chamada para a API do Gemini (Google) - descomentada para evitar erros de compilação, já que a chave de API não está disponível no ambiente de desenvolvimento
const API_KEY = String(import.meta.env.VITE_GEMINI_API_KEY)
const MODEL_NAME = 'gemini-flash-latest'
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`

const callGeminiAPI = async (prompt: string) => {
  const response = await fetch(GEMINI_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
    }),
  })

  if (!response.ok) {
    throw new Error(`Erro na requisição: ${response.status}`)
  }

  return (await response.json()) as GeminiResponse
}

export interface InsightData {
  feasibility: {
    status: 'viable' | 'needs_adjustment' | 'unfeasible'
    content: string
  }
  diagnosis: { content: string }
  suggestions: { items: string[] }
  extraIncome: { items: string[] }
  investment: { items: string[] }
  motivation: { content: string }
}

export const getInsight = async (prompt: string) => {
  const response = await callGeminiAPI(prompt)
  const json = response.candidates[0].content.parts[0].text
  return JSON.parse(json) as InsightData
}