export type TipoTransacao = "RECEITA" | "DESPESA"
export type CategoriaTransacao = "VENDA_BEZERRO" | "MEDICAMENTO" | "VETERINARIO" | "RACAO" | "OUTRO"

export interface Transacao {
  id: string
  tipo: TipoTransacao
  categoria: CategoriaTransacao
  valor: number
  data: Date
  descricao: string
  animalId?: string
}

export const transacoes: Transacao[] = [
  { id: "t1",  tipo: "RECEITA", categoria: "VENDA_BEZERRO", valor: 3200, data: new Date(2025, 0, 20), descricao: "Venda bezerro B-155 (Mimosa)",              animalId: "a8"  },
  { id: "t2",  tipo: "RECEITA", categoria: "VENDA_BEZERRO", valor: 2800, data: new Date(2025, 0, 25), descricao: "Venda bezerra B-134 (Pretinha)",            animalId: "a14" },
  { id: "t3",  tipo: "DESPESA", categoria: "MEDICAMENTO",   valor: 450,  data: new Date(2025, 0, 5),  descricao: "Reposição Ivermectina 1% — 500mL"           },
  { id: "t4",  tipo: "DESPESA", categoria: "VETERINARIO",   valor: 800,  data: new Date(2025, 1, 13), descricao: "Protocolo IATF — Dr. Carlos Mendes"         },
  { id: "t5",  tipo: "DESPESA", categoria: "RACAO",         valor: 1200, data: new Date(2025, 1, 1),  descricao: "Ração suplementar jan/fev — Lote 2025-A"    },
  { id: "t6",  tipo: "DESPESA", categoria: "MEDICAMENTO",   valor: 320,  data: new Date(2025, 1, 10), descricao: "Enrofloxacina 10% + Flunixin Meglumine"      },
  { id: "t7",  tipo: "DESPESA", categoria: "VETERINARIO",   valor: 200,  data: new Date(2025, 1, 7),  descricao: "Visita emergência — Dra. Ana Ferreira"       },
  { id: "t8",  tipo: "RECEITA", categoria: "OUTRO",         valor: 500,  data: new Date(2024, 11, 20),descricao: "Venda esterco orgânico"                      },
  { id: "t9",  tipo: "DESPESA", categoria: "OUTRO",         valor: 350,  data: new Date(2025, 0, 15), descricao: "Manutenção cercas e instalações"             },
  { id: "t10", tipo: "DESPESA", categoria: "MEDICAMENTO",   valor: 180,  data: new Date(2024, 11, 10),descricao: "Vitamina ADE — Ceva 1L"                      },
  { id: "t11", tipo: "DESPESA", categoria: "RACAO",         valor: 980,  data: new Date(2024, 11, 1), descricao: "Ração suplementar dez/2024"                  },
  { id: "t12", tipo: "RECEITA", categoria: "VENDA_BEZERRO", valor: 2600, data: new Date(2024, 10, 15),descricao: "Venda 2 bezerros Lote 2024-A"                },
]

export function getTotais() {
  const receitas = transacoes.filter(t => t.tipo === "RECEITA").reduce((s, t) => s + t.valor, 0)
  const despesas = transacoes.filter(t => t.tipo === "DESPESA").reduce((s, t) => s + t.valor, 0)
  return { receitas, despesas, saldo: receitas - despesas }
}

export function getPorCategoria(): Record<CategoriaTransacao, number> {
  const result = {} as Record<CategoriaTransacao, number>
  for (const t of transacoes.filter(t => t.tipo === "DESPESA")) {
    result[t.categoria] = (result[t.categoria] ?? 0) + t.valor
  }
  return result
}
