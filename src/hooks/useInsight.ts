import { useCallback, useEffect, useRef, useState } from 'react'

import { buildAIPrompt } from '../data/aiPrompt'
import type { SimulationRecord } from '../data/simulation'
import { getInsight, type InsightData } from '../services/aiService'
import { useSimulationStorage } from './useSimulationStorage'

export const useInsight = (id: string) => {
  const { getFormData, updateSimulation } = useSimulationStorage()
  const isRequestPending = useRef(false)
  
  const [insight, setInsight] = useState<InsightData | any>(
    () => {
      const simulation = getFormData(id)

      if (simulation?.insight) {
        return simulation.insight
      }

      return null
    }
  )

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // useCallback é necessário pois essa função entra no array de dependências do useEffect
  const fetchInsight = useCallback(
    async (simulationId: string) => {
      const simulation = getFormData(simulationId)

      if (!simulation) {
        setError('Simulação não encontrada.')
        return
      }

      isRequestPending.current = true
      setIsLoading(true)
      setError(null)

      try {
        const prompt = buildAIPrompt(simulation)
        const data = await getInsight(prompt)
        console.log('Insight recebido:', data)
        setInsight(data)
        updateSimulation(simulationId, {
          ...simulation,
          insight: data,
        } as SimulationRecord)
        return data
      } catch {
        setError('Erro ao gerar o diagnóstico. Tente novamente.')
      } finally {
        isRequestPending.current = false
        setIsLoading(false)
      }
    },
    [getFormData],
  )

  useEffect(() => {
    if (insight || isLoading || isRequestPending.current || error) {
      return
    }

    fetchInsight(id).then((data) => {
      isRequestPending.current = false
      if (!data) return
      setInsight(data)
    })
  }, [id, insight, isLoading, fetchInsight])

  return { insight, isLoading, error, fetchInsight }
}