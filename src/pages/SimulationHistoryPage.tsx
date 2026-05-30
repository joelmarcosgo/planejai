import { EyeIcon, Goal, Trash } from 'lucide-react'
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
        <div className="space-y-6">
          {simulations.map((simulation) => {
            const monthlySavings = calcMonthlySavings(simulation)
            const createdAt = simulation.createdAt
              ? new Date(simulation.createdAt).toLocaleDateString('pt-BR')
              : ''

            return (
              <article
                key={simulation.id}
                className="flex flex-col items-center justify-between gap-4 rounded-[28px] border border-border bg-card px-6 py-5 shadow-[4px_8px_24px_rgba(0,0,0,0.12)] lg:flex-row"
              >
                <div className="flex min-w-0 items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-primary/10 text-primary">
                    <Goal size={22} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                      {simulation.goalName}
                    </p>
                    <p className="mt-2 text-xl font-semibold text-foreground">{`R$ ${simulation.goalAmount}`}</p>
                    {createdAt && (
                      <p className="mt-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                        {createdAt}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex flex-1 flex-wrap items-center justify-between gap-3">
                  <div className="min-w-[160px] rounded-[20px] bg-secondary px-4 py-3 text-center text-sm text-foreground shadow-sm">
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Custo da meta</p>
                    <p className="mt-2 font-semibold">R$ {simulation.goalAmount}</p>
                  </div>
                  <div className="min-w-[160px] rounded-[20px] bg-secondary px-4 py-3 text-center text-sm text-foreground shadow-sm">
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Prazo</p>
                    <p className="mt-2 font-semibold">{simulation.goalDeadline} meses</p>
                  </div>
                  <div className="min-w-[160px] rounded-[20px] bg-secondary px-4 py-3 text-center text-sm text-foreground shadow-sm">
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Economia mensal</p>
                    <p className="mt-2 font-semibold">
                      R$ {monthlySavings.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">                  
                  <Button
                    type="button"
                    variant="destructive"
                    className="inline-flex items-center justify-center"
                    onClick={() => handleDelete(simulation.id)}
                  >
                    <Trash size={18} />
                  </Button>
                  <Button
                    type="button"
                    variant="details"
                    className="h-11 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
                    onClick={() => navigate(`/resultado/${simulation.id}`)}
                  >
                    <EyeIcon size={16} />
                    Ver detalhes
                  </Button>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </main>
  )
}
