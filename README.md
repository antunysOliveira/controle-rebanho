# 🐄 Controle de Rebanho

Sistema web de gestão de rebanho bovino de cria — protótipo com dados simulados.

## Stack

- **Framework:** Next.js 16 (App Router) + TypeScript
- **UI:** Tailwind CSS + shadcn/ui
- **Banco (planejado):** PostgreSQL via Supabase + Prisma ORM
- **Fonte:** Geist (local, sem dependência de rede)

## Rodando localmente

```bash
npm install
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

> Não é necessário configurar banco de dados — o protótipo usa dados mockados.

## Simulação de estágios

O sistema inclui **3 estágios temporais** que simulam a passagem do tempo no ciclo do rebanho. O seletor fica no menu lateral e persiste entre páginas via cookie.

| Estágio | Data simulada | Cenário |
|---------|--------------|---------|
| **Estágio 1** | 15 Fev/2025 | Estação de partos — bezerros recém-nascidos, vacas do Lote 2025-B em protocolo IATF |
| **Estágio 2** | 20 Ago/2025 | Pré-desmame — os mesmos bezerros com ~190-210 dias, vacas do Lote 2025-A em novo ciclo reprodutivo |
| **Estágio 3** | 20 Jan/2026 | Novo ciclo — resultado das inseminações de Ago/25, novos partos chegando |

## Páginas

| Rota | Descrição |
|------|-----------|
| `/` | Dashboard — painéis de alerta por urgência/fase |
| `/animais` | Lista de vacas com filtros por status |
| `/animais/[id]` | Perfil completo + histórico reprodutivo + medicamentos |
| `/bezerros` | Lista de bezerros com peso e status |
| `/lotes` | Visão geral dos lotes de produção |
| `/lotes/[id]` | Detalhe do lote + vacas associadas |
| `/reproducao` | Protocolos IATF ativos + diagnósticos pendentes |
| `/medicamentos` | Estoque com alertas de mínimo e validade |
| `/medicamentos/aplicacoes` | Histórico de aplicações por animal |
| `/equipe` | Veterinários e encarregados |
| `/relatorios` | KPIs, taxa de prenhez, produção de bezerros |

## Modelo de dados (Prisma)

Schema completo em [`prisma/schema.prisma`](./prisma/schema.prisma) com os modelos:

`Fazenda` → `Lote` → `Animal` → `EventoReprodutivo` / `Bezerro` / `AplicacaoMedicamento`

`Veterinario` / `Encarregado` / `Medicamento`

## Conectando ao banco (próximos passos)

1. Criar projeto no [Supabase](https://supabase.com)
2. Copiar as URLs de conexão para `.env`:
```env
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."
```
3. Rodar a migration:
```bash
npx prisma migrate dev --name init
```
4. Substituir imports de `@/lib/mock/data` por queries Prisma em cada página.
