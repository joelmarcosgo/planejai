import { AIInsightsCard } from "@/components/features/SimulationResults/AIInsightsCard"
import { Card } from "@/components/features/SimulationResults/Card"
import { Button } from "@/components/shared/Button"
import { PageHero } from "@/components/shared/PageHero"
import { useSimulationStorage } from "@/hooks/useSimulationStorage"
import { calcMonthlySavings } from "@/utils/simulation"
import { AlertTriangle, CalendarClock, Clock, CreditCardIcon, Goal, Landmark, PiggyBank, TrendingUp, Wallet } from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"

export function SimulationResultsPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { getFormData } = useSimulationStorage()
  const data = id ? getFormData(id) : null

  if (!data) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
        <div className="rounded-[32px] border border-border bg-card p-10 text-center shadow-[4px_8px_24px_rgba(0,0,0,0.12)]">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <span className="text-3xl font-bold">
              <AlertTriangle size={60} />
            </span>
          </div>
          <h1 className="mb-4 text-3xl font-semibold text-foreground sm:text-4xl">
            Simulação não encontrada
          </h1>
          <p className="mx-auto max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
            Não foi possível carregar os dados desta simulação. Verifique se o link está correto ou volte para o histórico para tentar outra simulação.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button
              type="button"
              variant="details"
              className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
              onClick={() => navigate('/')}
            >
              <TrendingUp size={16} />
              Nova simulação
            </Button>
            <Button
              type="button"
              variant="secondary"
              className="inline-flex items-center justify-center rounded-full border border-border bg-transparent px-6 py-3 text-sm font-semibold text-foreground transition hover:bg-secondary"
              onClick={() => navigate('/historico')}
            >
              <Clock size={16} />
              Ver Histórico
            </Button>
          </div>
        </div>
      </main>
    )
  }

  const monthlySavings = calcMonthlySavings(data)

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
      <PageHero
        title="Resultado da sua simulação"
        subtitle="Com base no seu perfil financeiro e objetivos."
      />
      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card
          icon={Goal}
          label="Custo da Meta"
          value={`R$ ${data.goalAmount}`}
          subtitle={data.goalName}
        />
        <Card
          icon={CalendarClock}
          label="Prazo"
          value={`${data.goalDeadline} meses`}
          subtitle="Prazo para atingir a meta"
        />
        <Card
          variant="primary"
          icon={PiggyBank}
          label="Economia mensal"
          value={`R$ ${monthlySavings.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          subtitle="Economia mensal necessária"
        />
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <AIInsightsCard simulation={data} />
        <div className="order-1 flex flex-col gap-6 lg:order-2">
          <Card
            icon={Wallet}
            label="Renda mensal"
            value={`R$ ${data.income}`}
            subtitle="Renda total bruta por mês"
          />
          <Card
            icon={CreditCardIcon}
            label="Custos Fixos de Vida"
            value={`R$ ${data.expenses}`}
            subtitle="Gastos essenciais por mês"
          />
          <Card
            icon={Landmark}
            label="Dívidas / Parcelas"
            value={`R$ ${data.debts}`}
            subtitle="Valor comprometido em parcelas/depósito"
          />
        </div>
      </div>
    </main>
  )
}