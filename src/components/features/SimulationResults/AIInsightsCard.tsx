import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import type { SimulationRecord } from '../../../data/simulation'

import { useInsight } from '../../../hooks/useInsight'
import { Error } from '../Insights/Error'
import { EducatorChat } from './EducatorChat'

interface AIInsightCardProps {
  simulation: SimulationRecord
}

export function AIInsightsCard({ simulation }: AIInsightCardProps) {
  const { insight, isLoading, error, fetchInsight } = useInsight(simulation.id)

  return (
    <div className="bg-card order-2 rounded-[32px] p-6 shadow-[4px_4px_18px_0px_rgba(0,0,0,0.2)] lg:order-1 lg:col-span-2">
      <div className="mb-4 flex items-center gap-1.5">
        <span>✨</span>
        <span className="text-primary text-xs font-semibold tracking-widest uppercase">
          Insight Financeiro Personalizado
        </span>
      </div>

      <div className="mb-6">
        <h1 className="text-3xl font-semibold text-foreground">Plano de Ação: {simulation.goalName}</h1>
      </div>

      <div className="rounded-[28px] border border-border bg-secondary/30 p-6">
        {isLoading && (
          <div className="flex">
            <Skeleton
              count={10.5}
              baseColor="var(--color-skeleton-base)"
              highlightColor="var(--color-skeleton-highlight)"
              className="mb-3 flex rounded-lg"
              containerClassName="flex-1"
              inline
            />
          </div>
        )}
        {!isLoading && error && (
          <Error
            simulationId={simulation.id}
            message={error}
            onRetry={() => fetchInsight(simulation.id)}
          />
        )}
        {!isLoading && insight && (
          <EducatorChat simulation={simulation} insight={insight} />
        )}
      </div>
    </div>
  )
}