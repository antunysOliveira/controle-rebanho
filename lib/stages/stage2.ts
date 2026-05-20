import { addDays, subDays } from "date-fns"
import type { StageData } from "./types"

// Estágio 2 — Agosto 2025 (~6 meses após Stage 1)
// Cenário: bezerros do Stage 1 (~190-207 dias) prestes a desmamar.
// Vacas do Lote 2025-A iniciando novo ciclo reprodutivo.

export const SIM_DATE = new Date(2025, 7, 20) // 20 ago 2025

const d = SIM_DATE

// Nascimentos do Stage 1 — datas fixas
const nasc = {
  B201: new Date(2025, 1, 3),  // 03 fev
  B202: new Date(2025, 0, 28), // 28 jan
  B203: new Date(2025, 1, 16), // 16 fev
  B204: new Date(2025, 0, 20), // 20 jan
  B205: new Date(2025, 0, 16), // 16 jan
}

function diasRest(nascimento: Date): number {
  const desmame = addDays(nascimento, 210)
  return Math.round((desmame.getTime() - d.getTime()) / 86400000)
}

export const stage2: StageData = {
  simDate: SIM_DATE,
  label: "Estágio 2",
  descricao: "Pré-desmame — Ago/2025",
  detalhe: "Bezerros de Jan-Fev/2025 prestes a serem desmamados. Vacas do Lote 2025-A em novo protocolo IATF.",

  partosProximos: [],

  desmaamesProximos: [
    { idEtiqueta: "B-201", idMae: "0014", dataNascimento: nasc.B201, dataEstimada: addDays(nasc.B201, 210), diasRestantes: diasRest(nasc.B201), pesoAtual: 168 },
    { idEtiqueta: "B-202", idMae: "0022", dataNascimento: nasc.B202, dataEstimada: addDays(nasc.B202, 210), diasRestantes: diasRest(nasc.B202), pesoAtual: 172 },
    { idEtiqueta: "B-203", idMae: "0036", dataNascimento: nasc.B203, dataEstimada: addDays(nasc.B203, 210), diasRestantes: diasRest(nasc.B203), pesoAtual: 181 },
    { idEtiqueta: "B-204", idMae: "0051", dataNascimento: nasc.B204, dataEstimada: addDays(nasc.B204, 210), diasRestantes: diasRest(nasc.B204), pesoAtual: 185 },
    { idEtiqueta: "B-205", idMae: "0063", dataNascimento: nasc.B205, dataEstimada: addDays(nasc.B205, 210), diasRestantes: diasRest(nasc.B205), pesoAtual: 188 },
  ],

  vacasEmProtocolo: [
    {
      idEtiqueta: "0042", nome: "Mimosa",   lote: "Lote 2025-A",
      etapaAtual: "aguardando_diagnostico",
      dataImplante: subDays(d, 32), dataInseminacao: subDays(d, 30), dataDiagnostico: subDays(d, 2),
      veterinario: "Dr. Carlos Mendes",
    },
    {
      idEtiqueta: "0018", nome: null,        lote: "Lote 2025-A",
      etapaAtual: "inseminacao_iatf",
      dataImplante: subDays(d, 2), dataInseminacao: d, dataDiagnostico: addDays(d, 30),
      veterinario: "Dr. Carlos Mendes",
    },
    {
      idEtiqueta: "0077", nome: "Pretinha", lote: "Lote 2025-A",
      etapaAtual: "implante_hormonal",
      dataImplante: d, dataInseminacao: addDays(d, 2), dataDiagnostico: addDays(d, 32),
      veterinario: "Dr. Carlos Mendes",
    },
  ],

  diagnosticosPendentes: [
    { idEtiqueta: "0042", nome: "Mimosa", dataInseminacao: subDays(d, 30), diasAguardando: 30, lote: "Lote 2025-A" },
    { idEtiqueta: "0014", nome: null,     dataInseminacao: subDays(d, 27), diasAguardando: 27, lote: "Lote 2025-A" },
    { idEtiqueta: "0022", nome: null,     dataInseminacao: subDays(d, 24), diasAguardando: 24, lote: "Lote 2025-A" },
    { idEtiqueta: "0036", nome: null,     dataInseminacao: subDays(d, 22), diasAguardando: 22, lote: "Lote 2025-A" },
  ],

  alertasMedicamentos: [
    { nome: "Ivermectina 1%",         tipo: "ANTIPARASITARIO", estoqueAtual: 30, estoqueMinimo: 100, validade: null,           alerta: "estoque"  },
    { nome: "Vitamina ADE",           tipo: "VITAMINA",        estoqueAtual: 10, estoqueMinimo: 50,  validade: null,           alerta: "estoque"  },
    { nome: "Cipionato de Estradiol", tipo: "HORMONIO",        estoqueAtual: 6,  estoqueMinimo: 5,   validade: addDays(d, 22), alerta: "validade" },
  ],

  visaoGeralLotes: [
    { nome: "Lote 2025-A", status: "GESTACAO",  totalVacas: 50, gestantes: 22, paridasNoMes: 0, bezerrosVivos: 44, desmamados: 0 },
    { nome: "Lote 2025-B", status: "GESTACAO",  totalVacas: 48, gestantes: 40, paridasNoMes: 0, bezerrosVivos: 0,  desmamados: 0 },
    { nome: "Lote 2024-A", status: "ENCERRADO", totalVacas: 50, gestantes: 0,  paridasNoMes: 0, bezerrosVivos: 48, desmamados: 48 },
  ],

  bezarrosAtivos: [
    { idEtiqueta: "B-201", idMae: "0014", diasVida: 198, pesoNascimento: 34, pesoAtual: 168, sexo: "M", status: "MAMANDO" },
    { idEtiqueta: "B-202", idMae: "0022", diasVida: 204, pesoNascimento: 32, pesoAtual: 172, sexo: "F", status: "MAMANDO" },
    { idEtiqueta: "B-203", idMae: "0036", diasVida: 185, pesoNascimento: 36, pesoAtual: 181, sexo: "M", status: "MAMANDO" },
    { idEtiqueta: "B-204", idMae: "0051", diasVida: 212, pesoNascimento: 33, pesoAtual: 185, sexo: "F", status: "MAMANDO" },
    { idEtiqueta: "B-205", idMae: "0063", diasVida: 216, pesoNascimento: 35, pesoAtual: 188, sexo: "M", status: "MAMANDO" },
  ],

  taxaPrenhez: [
    { lote: "Lote 2025-A", inseminadas: 22, positivas: 4,  taxa: 18.2  },
    { lote: "Lote 2025-B", inseminadas: 40, positivas: 40, taxa: 100.0 },
    { lote: "Lote 2024-A", inseminadas: 46, positivas: 41, taxa: 89.1  },
  ],

  producaoBezerrosMes: [
    { periodo: "Jan/2025",        nascimentos: 3, machos: 2,    femeas: 1,    pesoMedio: "34,3 kg" },
    { periodo: "Fev/2025",        nascimentos: 3, machos: 1,    femeas: 2,    pesoMedio: "32,7 kg" },
    { periodo: "Mar/2025",        nascimentos: 4, machos: 2,    femeas: 2,    pesoMedio: "33,1 kg" },
    { periodo: "Jan/2026 (est.)", nascimentos: 5, machos: null, femeas: null, pesoMedio: null      },
  ],

  aplicacoesCount: 28,

  repasseTouros: [
    { nome: "Imperador 450", lote: "Lote 2025-A", dataInicio: new Date(2025, 7, 1),  dataFim: new Date(2026, 0, 31), ativo: true  },
    { nome: "Brutus 520",    lote: "Lote 2025-B", dataInicio: new Date(2025, 0, 15), dataFim: new Date(2025, 5, 30), ativo: false },
  ],
}
