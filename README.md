# Planej.ai: Desenvolvendo um Educador Financeiro com React e IA Generativa

O **Planej.ai** é uma aplicação web de planejamento financeiro pessoal. O usuário preenche um formulário com informações sobre sua renda, gastos e uma meta financeira (como uma viagem ou a compra de um bem), e a aplicação usa inteligência artificial para gerar um diagnóstico personalizado com sugestões práticas, ideias de renda extra e um plano de ação.

Tudo funciona diretamente no navegador: sem backend, sem banco de dados remoto. Os dados são salvos no `localStorage` e as análises são geradas em tempo real pela API do Google Gemini.

---

## Stacks do Projeto

### Dependências de produção

| Pacote                   | Versão  | Finalidade                   |
| ------------------------ | ------- | ---------------------------- |
| `react`                  | ^19.2.4 | Biblioteca principal de UI   |
| `react-dom`              | ^19.2.4 | Renderização React no DOM    |
| `react-router-dom`       | ^7.13.2 | Roteamento client-side (SPA) |
| `tailwindcss`            | ^4.2.2  | Framework de CSS utilitário  |
| `@tailwindcss/vite`      | ^4.2.2  | Plugin Tailwind para Vite    |
| `@fontsource/inter`      | ^5.2.8  | Fonte Inter auto-hospedada   |
| `lucide-react`           | ^1.5.0  | Biblioteca de ícones SVG     |
| `react-loading-skeleton` | ^3.5.0  | Skeletons de carregamento    |

### Dependências de desenvolvimento

| Pacote                             | Versão  | Finalidade                               |
| ---------------------------------- | ------- | ---------------------------------------- |
| `vite`                             | ^8.0.1  | Build tool e dev server                  |
| `typescript`                       | ~5.9.3  | Tipagem estática                         |
| `@vitejs/plugin-react`             | ^6.0.1  | Suporte a React no Vite (Fast Refresh)   |
| `eslint`                           | ^9.39.4 | Linter de código                         |
| `prettier`                         | ^3.8.1  | Formatação de código                     |
| `eslint-plugin-simple-import-sort` | ^12.1.1 | Ordenação automática de imports          |
| `eslint-plugin-unused-imports`     | ^4.4.1  | Remove imports não utilizados            |
| `prettier-plugin-tailwindcss`      | ^0.7.2  | Ordenação automática de classes Tailwind |

---

## Estrutura de Pastas

```
planejai/
├── public/
│   ├── favicon.svg           # Ícone da aba do navegador
│   └── icons.svg             # Sprite de ícones SVG
├── src/
│   ├── assets/
│   │   └── images/
│   │       └── piggy-bank.png  # Imagem ilustrativa (hero)
│   ├── components/
│   │   ├── features/
│   │   │   ├── Insights/       # Componentes de exibição dos insights da IA
│   │   │   │   ├── Content.tsx
│   │   │   │   └── Error.tsx
│   │   │   ├── Simulation/     # Componentes do formulário multi-step
│   │   │   │   ├── Form.tsx
│   │   │   │   ├── FormStep.tsx
│   │   │   │   ├── Hero.tsx
│   │   │   │   └── Progress.tsx
│   │   │   └── SimulationResults/  # Componentes da página de resultados
│   │   │       ├── AIInsightCardProps.tsx
│   │   │       └── Card.tsx
│   │   ├── layout/
│   │   │   └── RootLayout.tsx  # Layout raiz com Header
│   │   └── shared/             # Componentes reutilizáveis
│   │       ├── Button.tsx
│   │       ├── Divider.tsx
│   │       ├── Header.tsx
│   │       ├── Input.tsx
│   │       └── PageHero.tsx
│   ├── context/
│   │   └── theme/
│   │       ├── ThemeContext.tsx   # Contexto de tema (claro/escuro)
│   │       └── ThemeProvider.tsx  # Provider do contexto de tema
│   ├── data/
│   │   ├── aiPrompt.ts       # Montagem do prompt para o Gemini
│   │   └── simulation.ts     # Dados e configuração do formulário
│   ├── hooks/
│   │   ├── useInsight.tsx         # Hook de chamada à API do Gemini
│   │   ├── useSimulationStorage.tsx  # Hook de leitura/escrita no localStorage
│   │   └── useTheme.tsx           # Hook de acesso ao contexto de tema
│   ├── pages/
│   │   ├── SimulationFormPage.tsx    # Página do formulário
│   │   └── SimulationResultsPage.tsx # Página de resultados
│   ├── services/
│   │   └── aiService.ts      # Chamada HTTP à API do Google Gemini
│   ├── styles/
│   │   └── theme.css         # Variáveis CSS de tema (claro/escuro)
│   ├── utils/
│   │   ├── currency.ts       # Máscara e formatação de moeda
│   │   └── simulation.ts     # Utilitários de simulação
│   ├── App.tsx               # Componente raiz
│   ├── index.css             # Estilos globais e imports
│   ├── main.tsx              # Entry point da aplicação
│   └── router.tsx            # Definição das rotas
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Desafios

### Desafio 1 — Página de Histórico de Simulações

- Exiba um resumo de cada simulação salva
- Crie um layout responsivo seguindo o protótipo
- Permita excluir uma simulação do histórico
- Ao clicar em "Ver detalhes", navegue para a página de resultados com os insights já gerados

### Desafio 2 — Conversando com o Educador Financeiro

- Adicione um campo de texto dentro do componente `AIInsightCard`
- Permita que o usuário faça perguntas sobre a simulação realizada
- A IA deve retornar respostas claras e exibi-las seguindo o protótipo
- O scroll deve rolar automaticamente quando a IA retornar uma resposta
- Mostre feedback de carregamento e erro para o usuário
- O usuário pode fazer quantas perguntas quiser por simulação
- Todo o histórico de perguntas e respostas deve ser exibido na tela
- As conversas devem ser salvas no `localStorage` para consulta posterior