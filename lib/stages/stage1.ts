import { addDays, subDays } from "date-fns"
import type { StageData } from "./types"

// Estágio 1 — Fevereiro 2025
// Cenário: plena estação de partos. Bezerros recém-nascidos mamando.
// Vacas do Lote 2025-B iniciando protocolo IATF.

export const SIM_DATE = new Date(2025, 1, 15) // 15 fev 2025

const d = SIM_DATE

export const stage1: StageData = {
  simDate: SIM_DATE,
  label: "Estágio 1",
  descricao: "Estação de partos — Fev/2025",
  detalhe: "Lote 2025-A em plena fase de partos. Bezerros recém-nascidos. Lote 2025-B iniciando protocolo IATF.",

  partosProximos: [
    { idEtiqueta: "0042", nome: "Mimosa",  dataEstimada: addDays(d, 3),  diasRestantes: 3,  lote: "Lote 2025-A" },
    { idEtiqueta: "0018", nome: null,      dataEstimada: addDays(d, 6),  diasRestantes: 6,  lote: "Lote 2025-A" },
    { idEtiqueta: "0077", nome: "Pretinha",dataEstimada: addDays(d, 10), diasRestantes: 10, lote: "Lote 2025-A" },
    { idEtiqueta: "0031", nome: null,      dataEstimada: addDays(d, 14), diasRestantes: 14, lote: "Lote 2025-A" },
  ],

  desmaamesProximos: [],

  vacasEmProtocolo: [
    {
      idEtiqueta: "0055", nome: null,      lote: "Lote 2025-B",
      etapaAtual: "inseminacao_iatf",
      dataImplante: subDays(d, 2), dataInseminacao: d, dataDiagnostico: addDays(d, 30),
      veterinario: "Dr. Carlos Mendes",
    },
    {
      idEtiqueta: "0088", nome: "Estrela", lote: "Lote 2025-B",
      etapaAtual: "implante_hormonal",
      dataImplante: d, dataInseminacao: addDays(d, 2), dataDiagnostico: addDays(d, 32),
      veterinario: "Dr. Carlos Mendes",
    },
    {
      idEtiqueta: "0103", nome: null,      lote: "Lote 2025-B",
      etapaAtual: "aguardando_diagnostico",
      dataImplante: subDays(d, 32), dataInseminacao: subDays(d, 30), dataDiagnostico: d,
      veterinario: "Dr. Carlos Mendes",
    },
  ],

  diagnosticosPendentes: [
    { idEtiqueta: "0011", nome: null,     dataInseminacao: subDays(d, 28), diasAguardando: 28, lote: "Lote 2025-B" },
    { idEtiqueta: "0029", nome: "Boneca", dataInseminacao: subDays(d, 32), diasAguardando: 32, lote: "Lote 2025-B" },
  ],

  alertasMedicamentos: [
    { nome: "Ocitocina 10UI",         tipo: "HORMONIO", estoqueAtual: 2, estoqueMinimo: 10, validade: null,           alerta: "estoque"  },
    { nome: "Progesterona Dispenser", tipo: "HORMONIO", estoqueAtual: 4, estoqueMinimo: 10, validade: null,           alerta: "estoque"  },
    { nome: "Cipionato de Estradiol", tipo: "HORMONIO", estoqueAtual: 8, estoqueMinimo: 5,  validade: addDays(d, 18), alerta: "validade" },
  ],

  visaoGeralLotes: [
    { nome: "Lote 2025-A", status: "PARTO",     totalVacas: 50, gestantes: 38, paridasNoMes: 8,  bezerrosVivos: 8,  desmamados: 0 },
    { nome: "Lote 2025-B", status: "EM_MONTA",  totalVacas: 48, gestantes: 0,  paridasNoMes: 0,  bezerrosVivos: 0,  desmamados: 0 },
    { nome: "Lote 2024-A", status: "ENCERRADO", totalVacas: 50, gestantes: 0,  paridasNoMes: 0,  bezerrosVivos: 48, desmamados: 48 },
  ],

  bezarrosAtivos: [
    { idEtiqueta: "B-201", idMae: "0014", diasVida: 12, pesoNascimento: 34, pesoAtual: 42, sexo: "M", status: "MAMANDO" },
    { idEtiqueta: "B-202", idMae: "0022", diasVida: 18, pesoNascimento: 32, pesoAtual: 45, sexo: "F", status: "MAMANDO" },
    { idEtiqueta: "B-203", idMae: "0036", diasVida: 30, pesoNascimento: 36, pesoAtual: 58, sexo: "M", status: "MAMANDO" },
    { idEtiqueta: "B-204", idMae: "0051", diasVida: 42, pesoNascimento: 33, pesoAtual: 71, sexo: "F", status: "MAMANDO" },
    { idEtiqueta: "B-205", idMae: "0063", diasVida: 45, pesoNascimento: 35, pesoAtual: 74, sexo: "M", status: "MAMANDO" },
    { idEtiqueta: "B-206", idMae: "0071", diasVida: 8,  pesoNascimento: 31, pesoAtual: 37, sexo: "F", status: "MAMANDO" },
  ],

  taxaPrenhez: [
    { lote: "Lote 2025-A", inseminadas: 18, positivas: 14, taxa: 77.8 },
    { lote: "Lote 2025-B", inseminadas: 3,  positivas: 0,  taxa: 0.0  },
    { lote: "Lote 2024-A", inseminadas: 46, positivas: 41, taxa: 89.1 },
  ],

  producaoBezerrosMes: [
    { periodo: "Jan/2025",        nascimentos: 3, machos: 2,    femeas: 1,    pesoMedio: "34,3 kg" },
    { periodo: "Fev/2025",        nascimentos: 3, machos: 1,    femeas: 2,    pesoMedio: "32,7 kg" },
    { periodo: "Mar/2025 (est.)", nascimentos: 4, machos: null, femeas: null, pesoMedio: null      },
  ],

  aplicacoesCount: 11,

  repasseTouros: [
    { nome: "Brutus 520",    lote: "Lote 2025-B", dataInicio: new Date(2025, 0, 15), dataFim: new Date(2025, 5, 30), ativo: true  },
    { nome: "Imperador 450", lote: "Lote 2025-A", dataInicio: new Date(2024, 7, 1),  dataFim: new Date(2025, 5, 30), ativo: false },
  ],
}
