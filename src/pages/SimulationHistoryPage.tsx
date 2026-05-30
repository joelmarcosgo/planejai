import { EyeIcon, Trash } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/shared/Button'
import { PageHero } from '../components/shared/PageHero'
import type { SimulationRecord } from '../data/simulation'
import { useSimulationStorage } from '../hooks/useSimulationStorage'
import { calcMonthlySavings } from '../utils/simulation'

export function SimulationHistoryPage() {
  const navigate = useNavigate()
  const { listSimulations, deleteSimulation } = useSimulationStorage()
  const [simulations, setSimulations] = useState<SimulationRecord[]>([])

  useEffect(() => {
    setSimulations(listSimulations())
  }, [])

  const handleDelete = (id: string) => {
    deleteSimulation(id)
    setSimulations((current) => current.filter((simulation) => simulation.id !== id))
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
      <PageHero
        title="Histórico de simulações"
        subtitle="Veja o resumo das suas simulações salvas e abra detalhes sempre que precisar."
      />

      {simulations.length === 0 ? (
        <div className="rounded-[28px] border border-border bg-card p-8 text-center text-muted-foreground shadow-[4px_8px_24px_rgba(0,0,0,0.12)]">
          <p className="text-lg font-semibold text-foreground">Ainda não há simulações salvas.</p>
          <p className="mt-2 text-sm">Faça sua primeira simulação e ela aparecerá aqui automaticamente.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {simulations.map((simulation) => {
            const monthlySavings = calcMonthlySavings(simulation)
            return (
              <article
                key={simulation.id}
                className="rounded-[28px] border border-border bg-card p-6 shadow-[4px_8px_24px_rgba(0,0,0,0.12)]"
              >
                <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.25em] text-muted-foreground">
                      {simulation.goalName}
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-foreground">{simulation.goalAmount}</p>
                  </div>
                  <Button
                    type="button"
                    variant="secondary"
                    className="rounded-full border border-destructive px-3 py-2 text-sm font-semibold text-destructive transition hover:bg-destructive/10"
                    onClick={() => handleDelete(simulation.id)}
                  >
                    <Trash size={16} />
                    Excluir
                  </Button>
                </div>

                <div className="mb-6 space-y-3 text-sm text-muted-foreground">
                  <div className="flex items-center justify-between rounded-2xl bg-secondary p-3 text-foreground">
                    <span>Prazo</span>
                    <strong>{simulation.goalDeadline} meses</strong>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl bg-secondary p-3 text-foreground">
                    <span>Economia mensal</span>
                    <strong>
                      R$ {monthlySavings.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </strong>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl bg-secondary p-3 text-foreground">
                    <span>Insight</span>
                    <strong>{simulation.insight ? 'Gerado' : 'Pendente'}</strong>
                  </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <Button
                    type="button"
                    variant="details"
                    className="rounded-full bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
                    onClick={() => navigate(`/resultado/${simulation.id}`)}
                  >
                    <EyeIcon size={16} />
                    Ver detalhes
                  </Button>
                  <span className="inline-flex items-center justify-center rounded-full bg-secondary px-3 py-1 text-xs font-semibold uppercase text-secondary-foreground">
                    {simulation.insight ? 'Insight pronto' : 'Sem insight'}
                  </span>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </main>
  )
}
