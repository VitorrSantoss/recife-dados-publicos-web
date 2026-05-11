# Dashboard de Saúde Pública do Recife - Frontend

Interface web para visualização de indicadores de saúde pública do Recife, consumindo dados reais do Portal de Dados Abertos da Prefeitura e complementando com histórico epidemiológico estimado.

> Projeto desenvolvido como **Teste Prático para a vaga de Analista de Inovação** - Secretaria de Planejamento e Gestão da Prefeitura do Recife.

---

## Sobre a aplicação
### ⚠️ Dependência Obrigatória: Backend API

> **ATENÇÃO:** O frontend **SÓ irá funcionar** caso a API do backend (Spring Boot) esteja em execução. Sem a API ativa, a aplicação exibirá uma tela de erro e nenhum dado poderá ser visualizado no dashboard.

O frontend consome a API REST do backend Spring Boot e apresenta os dados em um dashboard
interativo com filtros, gráficos e tabela de unidades de saúde.

A aplicação combina duas fontes de dados:

- **2025 (tempo real)** - casos de Dengue, Zika e Chikungunya consumidos diretamente
  do Portal de Dados Abertos da Prefeitura do Recife via backend.
  **Estes dados só aparecem com o backend rodando localmente.**
  Sem a API ativa, a aplicação exibe uma tela de erro informando que não foi possível
  carregar os dados.

- **2023 e 2024 (histórico fictício)** - gerados deterministicamente com sazonalidade
  epidemiológica real do Recife (pico em abril/maio), para contextualizar a tendência
  histórica. Estes dados estão embutidos no frontend e não dependem da API.

### Comportamento por estado da API

| Estado da API | 2023 | 2024 | 2025 |
|---|---|---|---|
| Backend rodando | Fictício | Fictício | Tempo real (Portal do Recife) |
| Backend fora | Indisponível | Indisponível | Erro - tela de indisponibilidade |

> Para que o dashboard funcione corretamente, o backend deve estar rodando
> em `http://localhost:8080/api` antes de iniciar o frontend.
> Consulte o repositório do backend para instruções de execução.

---

## Arquitetura

```
src/
├── assets/               # Imagens e recursos estáticos
├── components/
│   ├── ui/               # Componentes base (shadcn/ui)
│   ├── FiltrosBar        # Barra de filtros (ano, doenca, bairro)
│   ├── GraficoEvolucao   # Grafico de linha - evolucao temporal
│   ├── GraficoTopBairros # Grafico de barras - top 10 bairros
│   ├── GraficoDistribuicaoUnidades  # Grafico de pizza - rede de saude
│   ├── KpiCard           # Cards de indicadores com animacao
│   └── TabelaUnidades    # Tabela paginada com busca e ordenacao
├── data/
│   └── mockData.ts       # Historico estimado 2023-2024 + fallback 2025
├── hooks/
│   ├── useDadosBackend   # Orquestra dados reais + historico mock
│   └── useFiltros        # Estado dos filtros do dashboard
├── pages/
│   └── DashboardPage     # Pagina principal
├── services/
│   ├── api.ts            # Chamadas HTTP ao backend
│   └── adapters.ts       # Normaliza tipos backend para tipos frontend
├── types/
│   └── index.ts          # Contratos de dados do frontend
└── utils/
    └── aggregations.ts   # Calculos de KPIs, agrupamentos e filtros
```
---

## Stack tecnológica

- **React 18** com TypeScript
- **TanStack Start** - framework SSR
- **TanStack Router** - roteamento baseado em arquivos
- **TanStack Query** - cache e sincronizacao de estado servidor
- **TailwindCSS v4** - estilizacao
- **Recharts** - graficos (linha, barras, pizza)
- **shadcn/ui** - componentes de interface
- **Lucide React** - icones

---

## Como executar localmente

### Pré-requisitos

- Node.js 18 ou superior
- Backend rodando em `http://localhost:8080/api`

### Passos

```bash
# clonar o repositório
git clone https://github.com/SEU-USUARIO/saude-dashboard-frontend.git
cd saude-dashboard-frontend

# instalar dependências
npm install

# configurar variável de ambiente
echo "VITE_API_URL=http://localhost:8080/api" > .env

# rodar em desenvolvimento
npm run dev
```

A aplicação estará disponível em **`http://localhost:5173`**.

### Executando junto com o backend

```bash
# Terminal 1 - backend
cd saude-dashboard-backend
./mvnw spring-boot:run

# Terminal 2 - frontend
cd saude-dashboard-frontend
npm run dev
```

---

## Funcionalidades

### Dashboard principal

- Cards de KPI com animacao de contagem ao carregar
- Skeleton loading durante a busca dos dados
- Banner informando a origem dos dados em tempo real
- Estado de erro com mensagem amigavel
- Exportacao dos casos filtrados em CSV
- Impressao da pagina

### Filtros interativos

- Filtro por ano (2023, 2024, 2025 em tempo real)
- Filtro por doenca (Dengue, Zika, Chikungunya)
- Busca por bairro com autocomplete
- Botao de limpar todos os filtros
- Todos os graficos e KPIs respondem aos filtros em tempo real

### Graficos

- **Evolucao temporal** - grafico de linha com 3 anos e 3 doencas, mostrando sazonalidade
- **Top 10 bairros** - grafico de barras horizontais empilhadas por doenca
- **Distribuicao da rede** - grafico de pizza com percentual por tipo de unidade

### Tabela de unidades de saude

- Busca por nome, tipo ou bairro
- Ordenacao por coluna (nome, tipo, bairro)
- Paginacao com 10 registros por pagina
- Filtro por bairro integrado com a barra de filtros

---

## Decisões técnicas e justificativas

| Decisão | Justificativa |
|---------|---------------|
| **TanStack Query para fetch** | Cache automatico, estados de loading/error/success, retry configuravel e `placeholderData` para experiencia sem flash de conteudo vazio. |
| **Agregacoes no frontend** | Filtros respondem instantaneamente sem nova requisicao ao backend. Com cache de 1h no servidor e 5min no cliente, o custo de rede e minimo. |
| **Camada de adapters isolada** | O backend retorna campos do SINAN em CAPS (`"DENGUE"`, `"BOA VIAGEM"`). Os adapters normalizam para o formato do frontend sem poluir os componentes. |
| **Historico mock deterministico** | `gerarCasosAno` usa seed fixa, garantindo que os dados nao mudam entre renders ou recargas. O pico sazonal em abril/maio reflete o padrao real do Recife. |
| **Fallback silencioso para mock** | Se a API estiver fora, `placeholderData` exibe os dados mock de 2025 sem erro visivel. O dashboard continua funcional para demonstracao. |
| **shadcn/ui + Tailwind** | Componentes acessiveis por padrao (Radix UI internamente) com estilizacao utilitaria. Sem CSS externo para manter. |

---

## Tratamento de dados no frontend

| Problema vindo da API | Tratamento no frontend |
|---|---|
| `tipo: "DENGUE"` (CAPS) | `adapters.ts` converte para `doenca: "Dengue"` via mapa de traducao |
| `bairro: "BOA VIAGEM"` (caixa alta) | Funcao `titleCase` converte para `"Boa Viagem"` |
| Campos `null` ou `undefined` | Todos os adapters tem fallback explícito para string vazia ou valor padrao |
| `ano` pode vir como string ou numero | `adaptarCaso` normaliza para `number` com `?? 2025` |
| Backend sem `periodoLabel` | Frontend gera o label de exibicao (`"Abr/25"`) a partir de `ano` e `mes` em `aggregations.ts` |

---

## Estrutura de dados

### Tipos do frontend (`src/types/index.ts`)

```typescript
type Doenca = "Dengue" | "Zika" | "Chikungunya";

interface CasoArbovirose {
  id: string;
  doenca: Doenca;
  bairro: string;
  ano: number;
  mes: number;
}

interface UnidadeSaude {
  id: string;
  nome: string;
  tipo: string;
  endereco: string;
  bairro: string;
  telefone: string;
}
```

### Origem dos dados por ano

| Ano | Origem | Volume aproximado |
|-----|--------|-------------------|
| 2023 | Mock deterministico com sazonalidade real | 2.800 casos |
| 2024 | Mock deterministico com sazonalidade real | 4.200 casos |
| 2025 | API em tempo real via Portal de Dados Abertos do Recife | variavel |

---

## Backend relacionado

Este frontend consome a API do repositorio:
`https://github.com/SEU-USUARIO/saude-dashboard-backend`

O backend deve estar rodando localmente na porta `8080` antes de iniciar o frontend.

---

## Autor

**Vitor Santos**
Candidato a vaga de Analista de Inovacao - Prefeitura do Recife

---

## Licenca

[MIT](LICENSE) - 2026 Vitor Santos
