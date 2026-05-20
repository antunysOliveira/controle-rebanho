# 🐄 Sistema de Controle de Rebanho — Especificação do Projeto

## Visão Geral

Sistema web para gestão completa de rebanho bovino de cria, contemplando o ciclo reprodutivo das vacas, controle de bezerros, protocolo IATF com repasse de touro, além de gestão de medicamentos, veterinários e encarregados.

---

## 1. Contexto do Negócio

### Modelo de Produção
- **Tipo:** Fazenda de "vaca cria" — produção de bezerros
- **Lote padrão:** 50 vacas por lote fechado
- **Protocolo reprodutivo:** IATF (Inseminação Artificial em Tempo Fixo) + repasse de touro
- **Estação de monta:** Encerra em junho

### Fluxo do Lote
1. A última vaca do lote para
2. Aguarda **30 dias** após o último parto
3. Inicia implante hormonal
4. Após **2 dias** do implante → inseminação
5. Touro entra no lote como repasse até junho
6. Bezerros nascem concentrados em **janeiro, fevereiro e março**

---

## 2. Entidades do Sistema

### 2.1 Animal (Vaca)
Cada animal é identificado por uma **etiqueta física auricular** (brinco/TAG).

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id_etiqueta` | String | Número físico do brinco (ex: "0042") |
| `nome` | String | Apelido opcional |
| `lote_id` | FK | Lote ao qual pertence |
| `data_nascimento` | Date | Data de nascimento da vaca |
| `status_atual` | Enum | Estado atual no ciclo |
| `data_ultimo_parto` | Date | Último parto registrado |
| `data_proximo_parto_estimado` | Date | Calculado automaticamente |
| `em_lactacao` | Boolean | Se está amamentando |
| `historico_partos` | Array | Lista de todos os eventos de parto |
| `observacoes` | Text | Campo livre para anotações |

**Status possíveis da vaca:**
- `gestante` — prenha, aguardando parto
- `lactando` — amamentando o bezerro
- `vazia` — não prenha, não amamentando
- `em_protocolo` — em protocolo IATF
- `inseminada` — aguardando diagnóstico de prenhez
- `descarte` — marcada para saída do rebanho

---

### 2.2 Bezerro
| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id_etiqueta` | String | Número do brinco do bezerro |
| `mae_id` | FK | Referência à vaca mãe |
| `sexo` | Enum | Macho / Fêmea |
| `data_nascimento` | Date | Data de nascimento |
| `data_desmame_estimada` | Date | Calculado (nascimento + ~210 dias) |
| `data_desmame_real` | Date | Data efetiva do desmame |
| `peso_nascimento` | Decimal | Peso ao nascer (kg) |
| `peso_desmame` | Decimal | Peso no desmame (kg) |
| `status` | Enum | Mamando / Desmamado / Vendido / Morto |

---

### 2.3 Lote
| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | UUID | Identificador único |
| `nome` | String | Ex: "Lote 2025 - A" |
| `tipo` | Enum | Vaca Cria / Recria / Engorda |
| `data_abertura` | Date | Início da estação de monta |
| `data_fechamento` | Date | Fim da estação / entrada do touro |
| `touro_id` | FK | Touro de repasse |
| `vacas` | Array FK | Lista de vacas do lote |
| `status` | Enum | Aberto / Em monta / Gestação / Parto / Encerrado |

---

### 2.4 Evento Reprodutivo
Registro cronológico de cada etapa do ciclo.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `animal_id` | FK | Vaca relacionada |
| `tipo_evento` | Enum | Ver lista abaixo |
| `data` | Date | Data do evento |
| `responsavel_id` | FK | Veterinário ou encarregado |
| `observacoes` | Text | Notas do evento |

**Tipos de evento:**
- `implante_hormonal`
- `inseminacao_iatf`
- `entrada_touro`
- `diagnostico_prenhez` (positivo/negativo)
- `parto`
- `desmame`
- `secagem` (parada da lactação)
- `descarte`

---

### 2.5 Medicamento / Produto Veterinário
| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | UUID | — |
| `nome` | String | Nome comercial |
| `principio_ativo` | String | Ex: progesterona, ocitocina |
| `tipo` | Enum | Hormônio / Antibiótico / Antiparasitário / Vitamina / Outro |
| `dose_padrao` | Decimal | Dose padrão em ml ou mg |
| `unidade` | String | ml / mg / comprimido |
| `estoque_atual` | Decimal | Quantidade em estoque |
| `estoque_minimo` | Decimal | Alerta de reposição |
| `validade` | Date | Data de vencimento |
| `fornecedor` | String | — |

---

### 2.6 Aplicação de Medicamento
| Campo | Tipo | Descrição |
|-------|------|-----------|
| `animal_id` | FK | Animal que recebeu |
| `medicamento_id` | FK | Produto aplicado |
| `dose_aplicada` | Decimal | Quantidade real aplicada |
| `via` | Enum | Intramuscular / Subcutânea / Oral / Tópica |
| `data` | Date | Data da aplicação |
| `responsavel_id` | FK | Quem aplicou |
| `motivo` | Text | Justificativa / Diagnóstico |
| `carencia_dias` | Integer | Período de carência do produto |
| `data_fim_carencia` | Date | Calculado automaticamente |

---

### 2.7 Veterinário
| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | UUID | — |
| `nome` | String | Nome completo |
| `crmv` | String | Registro profissional |
| `telefone` | String | — |
| `email` | String | — |
| `especialidade` | String | Ex: Reprodução Bovina |
| `ativo` | Boolean | — |

---

### 2.8 Encarregado / Funcionário
| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | UUID | — |
| `nome` | String | — |
| `cargo` | Enum | Vaqueiro / Encarregado / Gerente |
| `telefone` | String | — |
| `responsavel_pelo_lote` | Array FK | Lotes sob sua responsabilidade |
| `ativo` | Boolean | — |

---

## 3. Lógica de Negócio e Cálculos Automáticos

### Ciclo Reprodutivo da Vaca
```
Parto → Período pós-parto (≈60-90 dias) → Protocolo IATF
     → Inseminação (+2 dias do implante)
     → Diagnóstico de prenhez (≈30 dias pós-IA)
     → Gestação (≈283 dias) → Parto
```

### Cálculos Automáticos
| Dado | Fórmula |
|------|---------|
| Data estimada do parto | `data_inseminacao + 283 dias` |
| Data estimada do desmame | `data_nascimento_bezerro + 210 dias` |
| Início do protocolo do lote | `data_ultimo_parto_do_lote + 30 dias` |
| Data de inseminação | `data_implante + 2 dias` |
| Alerta de parto próximo | `data_estimada_parto - 15 dias` |
| Alerta de desmame próximo | `data_estimada_desmame - 15 dias` |

---

## 4. Interface — Zonas de Visualização (Dashboard)

O dashboard é organizado em **cards/painéis por urgência e fase do ciclo**.

### 4.1 Painel: Partos Próximos
> Vacas com parto estimado nos próximos **15 dias**
- Exibe: ID da vaca, data estimada, dias restantes
- Cor de alerta: vermelho (< 7 dias), amarelo (8–15 dias)

### 4.2 Painel: Desmames Próximos
> Bezerros que estão prestes a parar de mamar (próximos **15 dias**)
- Exibe: ID do bezerro, ID da mãe, data estimada, peso atual

### 4.3 Painel: Vacas em Protocolo IATF
> Vacas em andamento no protocolo hormonal
- Exibe: etapa atual (implante / inseminação / aguardando diagnóstico)
- Linha do tempo visual do protocolo

### 4.4 Painel: Diagnósticos Pendentes
> Vacas inseminadas que ainda não têm resultado de prenhez

### 4.5 Painel: Estoque de Medicamentos
> Produtos abaixo do estoque mínimo ou com validade próxima (< 30 dias)

### 4.6 Painel: Visão Geral do Lote
> Resumo por lote: total de vacas, prenhas, paridas no mês, bezerros vivos, desmamados

---

## 5. Funcionalidades do Sistema

### Gestão de Animais
- [x] Cadastro de vaca com ID de etiqueta física
- [x] Histórico completo de eventos por animal
- [x] Edição de todos os campos
- [x] Registro de morte / descarte
- [x] Filtros por status, lote, mês de parto

### Gestão de Lotes
- [x] Criação e fechamento de lotes
- [x] Associação de vacas ao lote
- [x] Registro de touro de repasse
- [x] Controle da estação de monta

### Controle Reprodutivo
- [x] Registro de protocolo IATF (passo a passo)
- [x] Registro de partos
- [x] Registro de desmames
- [x] Diagnóstico de prenhez (positivo/negativo)
- [x] Cálculos automáticos de datas estimadas

### Medicamentos
- [x] Cadastro de produtos
- [x] Registro de aplicações por animal
- [x] Controle de estoque (entrada/saída automática)
- [x] Alertas de estoque mínimo e validade
- [x] Rastreabilidade: qual animal recebeu o quê e quando

### Equipe
- [x] Cadastro de veterinários e encarregados
- [x] Associação de eventos a responsáveis
- [x] Histórico de atividades por profissional

### Relatórios
- [x] Taxa de prenhez por lote / protocolo
- [x] Produção de bezerros por período
- [x] Ganho de peso (nascimento → desmame)
- [x] Consumo de medicamentos por período
- [x] Histórico individual de cada animal

---

## 6. Stack Tecnológica Sugerida

### Frontend
- **Framework:** Next.js (React)
- **UI:** Tailwind CSS + shadcn/ui
- **Gráficos:** Recharts
- **Estado:** Zustand ou React Query

### Backend
- **API:** Node.js com Fastify **ou** Next.js API Routes
- **ORM:** Prisma
- **Autenticação:** NextAuth.js

### Banco de Dados
- **Principal:** PostgreSQL (dados relacionais, histórico de eventos)
- **Hospedagem sugerida:** Supabase (PostgreSQL gerenciado + Auth + Storage)

### Hospedagem
- **Frontend + Backend:** Vercel
- **Banco:** Supabase

---

## 7. Estrutura de Páginas

```
/                          → Dashboard (painéis de alerta)
/animais                   → Lista geral de vacas
/animais/[id]              → Perfil completo da vaca + histórico
/animais/novo              → Cadastro de nova vaca
/bezerros                  → Lista de bezerros
/bezerros/[id]             → Perfil do bezerro
/lotes                     → Lista de lotes
/lotes/[id]                → Detalhe do lote + vacas associadas
/reproducao                → Controle de protocolos IATF
/reproducao/novo-protocolo → Iniciar protocolo para um lote
/medicamentos              → Estoque e cadastro
/medicamentos/aplicacoes   → Histórico de aplicações
/equipe                    → Veterinários e encarregados
/relatorios                → Relatórios e exportações
/configuracoes             → Configurações gerais da fazenda
```

---

## 8. Modelo de Dados — Relacionamentos

```
Fazenda
  └── Lotes (N)
        └── Vacas (N)
              ├── EventosReprodutivos (N)
              ├── Bezerros (N)
              └── AplicacoesMedicamento (N)

Veterinario → EventosReprodutivos (N)
Encarregado → EventosReprodutivos (N)
Medicamento → AplicacoesMedicamento (N)
```

---

## 9. Regras de Negócio Importantes

1. **Um lote é "fechado"** quando todas as vacas já pariram — nenhuma nova vaca entra após o fechamento
2. **O protocolo começa 30 dias após o último parto do lote**, não individualmente
3. **Toda vaca inseminada que não for diagnosticada prenhe** deve entrar no ciclo de repasse de touro
4. **O touro fica até junho**, independente do resultado das inseminações
5. **Bezerros nascem em janeiro, fevereiro e março** — concentrado no verão
6. **Desmame estimado em ~210 dias** após o nascimento
7. **Alertas automáticos** devem ser gerados com antecedência configurável (padrão: 15 dias)
8. **Estoque de medicamentos** é debitado automaticamente ao registrar uma aplicação

---

## 10. Próximos Passos (Ordem de Desenvolvimento)

1. **Modelagem do banco de dados** (Prisma Schema)
2. **CRUD de animais** (vaca + bezerro) com etiqueta física
3. **CRUD de lotes** e associação de vacas
4. **Registro de eventos reprodutivos** (parto, IATF, desmame)
5. **Cálculos automáticos de datas**
6. **Dashboard com painéis de alerta**
7. **Módulo de medicamentos** (estoque + aplicações)
8. **Módulo de equipe** (veterinários + encarregados)
9. **Relatórios**
10. **Autenticação e controle de acesso**

---

*Documento gerado como base de planejamento — versão 1.0*
