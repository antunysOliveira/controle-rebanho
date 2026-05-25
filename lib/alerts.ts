import { differenceInDays } from "date-fns"

interface AnimalInput {
  id: string
  idEtiqueta: string
  nome: string | null
  lote: string
  dataPartoEstimado: Date | null
  status: string
}

interface BezerroInput {
  id: string
  idEtiqueta: string
  maeEtiqueta: string
  dataDesmameEstimada: Date
  status: string
}

interface MedicamentoInput {
  id: string
  nome: string
  unidade: string
  estoqueAtual: number
  estoqueMinimo: number
  validade: Date | null
  ativo: boolean
}

interface EventoInput {
  id: string
  animalId: string
  tipo: string
  data: Date
}

export type AlertaTipo = "parto" | "desmame" | "estoque" | "validade" | "diagnostico"
export type AlertaUrgencia = "alta" | "media" | "baixa"

export interface Alerta {
  id: string
  tipo: AlertaTipo
  urgencia: AlertaUrgencia
  titulo: string
  descricao: string
}

export function computeAlertas(params: {
  today: Date
  animais: AnimalInput[]
  bezerros: BezerroInput[]
  medicamentos: MedicamentoInput[]
  eventos: EventoInput[]
}): Alerta[] {
  const { today, animais, bezerros, medicamentos, eventos } = params
  const alertas: Alerta[] = []

  for (const a of animais) {
    if (a.dataPartoEstimado) {
      const dias = differenceInDays(a.dataPartoEstimado, today)
      if (dias >= 0 && dias <= 15) {
        alertas.push({
          id: `parto-${a.id}`,
          tipo: "parto",
          urgencia: dias < 7 ? "alta" : "media",
          titulo: `Parto próximo — #${a.idEtiqueta}${a.nome ? ` (${a.nome})` : ""}`,
          descricao: `${dias === 0 ? "Hoje" : `Em ${dias} dia${dias !== 1 ? "s" : ""}`} · ${a.lote}`,
        })
      }
    }
  }

  for (const b of bezerros) {
    if (b.status === "MAMANDO") {
      const dias = differenceInDays(b.dataDesmameEstimada, today)
      if (dias >= 0 && dias <= 15) {
        alertas.push({
          id: `desmame-${b.id}`,
          tipo: "desmame",
          urgencia: dias < 7 ? "alta" : "media",
          titulo: `Desmame próximo — #${b.idEtiqueta}`,
          descricao: `Mãe: #${b.maeEtiqueta} · Em ${dias} dia${dias !== 1 ? "s" : ""}`,
        })
      }
    }
  }

  for (const m of medicamentos) {
    if (m.ativo && m.estoqueAtual <= m.estoqueMinimo) {
      alertas.push({
        id: `estoque-${m.id}`,
        tipo: "estoque",
        urgencia: m.estoqueAtual === 0 ? "alta" : "media",
        titulo: `Estoque baixo — ${m.nome}`,
        descricao: `${m.estoqueAtual} ${m.unidade} restante${m.estoqueAtual !== 1 ? "s" : ""} (mín. ${m.estoqueMinimo})`,
      })
    }
  }

  for (const m of medicamentos) {
    if (m.ativo && m.validade && m.estoqueAtual > m.estoqueMinimo) {
      const dias = differenceInDays(m.validade, today)
      if (dias >= 0 && dias <= 30) {
        alertas.push({
          id: `validade-${m.id}`,
          tipo: "validade",
          urgencia: dias < 7 ? "alta" : "media",
          titulo: `Validade próxima — ${m.nome}`,
          descricao: `Vence em ${dias} dia${dias !== 1 ? "s" : ""}`,
        })
      }
    }
  }

  const comDiagnostico = new Set(
    eventos.filter(e => e.tipo === "DIAGNOSTICO_PRENHEZ").map(e => e.animalId)
  )
  const inseminacoes = eventos.filter(e => e.tipo === "INSEMINACAO_IATF")
  for (const ins of inseminacoes) {
    if (comDiagnostico.has(ins.animalId)) continue
    const diasAguardando = differenceInDays(today, ins.data)
    if (diasAguardando > 30) {
      const animal = animais.find(a => a.id === ins.animalId)
      if (animal && animal.status === "INSEMINADA") {
        alertas.push({
          id: `diag-${ins.id}`,
          tipo: "diagnostico",
          urgencia: "media",
          titulo: `Diagnóstico pendente — #${animal.idEtiqueta}`,
          descricao: `${diasAguardando} dias aguardando diagnóstico de prenhez`,
        })
      }
    }
  }

  const order: Record<AlertaUrgencia, number> = { alta: 0, media: 1, baixa: 2 }
  return alertas.sort((a, b) => order[a.urgencia] - order[b.urgencia])
}
