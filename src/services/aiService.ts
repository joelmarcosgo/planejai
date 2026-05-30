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
    const errorText = await response.text()

    try {
      const errorJson = JSON.parse(errorText)
      const code = errorJson?.error?.code
      const message = errorJson?.error?.message

      if (code === 503) {
        throw new Error(
          'A IA está ocupada no momento. Tente novamente em alguns segundos.',
        )
      }

      throw new Error(message || `Erro na requisição: ${response.status}`)
    } catch {
      if (errorText.includes('high demand')) {
        throw new Error(
          'A IA está ocupada no momento. Tente novamente em alguns segundos.',
        )
      }

      throw new Error(errorText || `Erro na requisição: ${response.status}`)
    }
  }

  const data = (await response.json()) as GeminiResponse
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text

  if (!text) {
    throw new Error('Resposta inválida do Gemini')
  }

  return text
}

const tryParseJson = (text: string) => {
  try {
    return JSON.parse(text.trim())
  } catch {
    return null
  }
}

const formatJsonAsFriendlyText = (json: unknown): string => {
  if (!json || typeof json !== 'object') {
    return String(json)
  }

  const data = json as Record<string, unknown>
  const paragraphs: string[] = []

  if (data.feasibility && typeof data.feasibility === 'object') {
    const feasibility = data.feasibility as Record<string, unknown>
    if (typeof feasibility.content === 'string') {
      paragraphs.push(feasibility.content)
    }
  }

  if (data.diagnosis && typeof data.diagnosis === 'object') {
    const diagnosis = data.diagnosis as Record<string, unknown>
    if (typeof diagnosis.content === 'string') {
      paragraphs.push(diagnosis.content)
    }
  }

  const addItems = (section: unknown) => {
    if (section && typeof section === 'object') {
      const sectionObject = section as Record<string, unknown>
      const items = sectionObject.items
      if (Array.isArray(items) && items.length > 0) {
        paragraphs.push(items.filter((item) => typeof item === 'string').join(' '))
      }
    }
  }

  addItems(data.suggestions)
  addItems(data.extraIncome)
  addItems(data.investment)

  if (data.motivation && typeof data.motivation === 'object') {
    const motivation = data.motivation as Record<string, unknown>
    if (typeof motivation.content === 'string') {
      paragraphs.push(motivation.content)
    }
  }

  if (paragraphs.length === 0) {
    return JSON.stringify(json, null, 2)
  }

  return paragraphs.join('\n\n')
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
  const responseText = await callGeminiAPI(prompt)
  return JSON.parse(responseText) as InsightData
}

export type AskGeminiOptions = {
  formatFriendlyResponse?: boolean
}

export const askGemini = async (
  prompt: string,
  options?: AskGeminiOptions,
) => {
  const responseText = await callGeminiAPI(prompt)

  if (options?.formatFriendlyResponse) {
    const parsedJson = tryParseJson(responseText)
    if (parsedJson) {
      return formatJsonAsFriendlyText(parsedJson)
    }
  }

  return responseText
}