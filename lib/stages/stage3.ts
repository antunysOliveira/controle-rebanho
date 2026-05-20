import { addDays, subDays } from "date-fns"
import type { StageData } from "./types"

// Estágio 3 — Janeiro 2026 (~11 meses após Stage 2)
// Cenário: vacas inseminadas em ago/25 (Stage 2) estão gestantes e prestes a parir.
// Bezerros do Stage 1 já foram desmamados. Lote 2026-B iniciando protocolo.

export const SIM_DATE = new Date(2026, 0, 20) // 20 jan 2026

const d = SIM_DATE

export const stage3: StageData = {
  simDate: SIM_DATE,
  label: "Estágio 3",
  descricao: "Novo ciclo — Jan/2026",
  detalhe: "Vacas inseminadas em Ago/2025 prestes a parir. Ciclo se repete — lote 2026-B iniciando protocolo IATF.",

  // Vacas inseminadas em ago/25 → gestação 283 dias → partos jan/fev/26
  partosProximos: [
    { idEtiqueta: "0042", nome: "Mimosa",  dataEstimada: addDays(d, 4),  diasRestantes: 4,  lote: "Lote 2026-A" },
    { idEtiqueta: "0014", nome: null,       dataEstimada: addDays(d, 7),  diasRestantes: 7,  lote: "Lote 2026-A" },
    { idEtiqueta: "0022", nome: null,       dataEstimada: addDays(d, 11), diasRestantes: 11, lote: "Lote 2026-A" },
    { idEtiqueta: "0036", nome: null,       dataEstimada: addDays(d, 13), diasRestantes: 13, lote: "Lote 2026-A" },
    { idEtiqueta: "0077", nome: "Pretinha", dataEstimada: addDays(d, 15), diasRestantes: 15, lote: "Lote 2026-A" },
  ],

  // Bezerros do Stage 2 (Lote 2025-B, nascidos em out/25) com ~85-90 dias
  desmaamesProximos: [
    { idEtiqueta: "B-301", idMae: "0055", dataNascimento: new Date(2025, 9, 15), dataEstimada: addDays(new Date(2025, 9, 15), 210), diasRestantes: 125, pesoAtual: 107 },
    { idEtiqueta: "B-302", idMae: "0088", dataNascimento: new Date(2025, 9, 8),  dataEstimada: addDays(new Date(2025, 9, 8),  210), diasRestantes: 118, pesoAtual: 112 },
  ],

  // Lote 2026-B novo protocolo
  vacasEmProtocolo: [
    {
      idEtiqueta: "0110", nome: null,     lote: "Lote 2026-B",
      etapaAtual: "implante_hormonal",
      dataImplante: d, dataInseminacao: addDays(d, 2), dataDiagnostico: addDays(d, 32),
    },
    {
      idEtiqueta: "0119", nome: "Garota", lote: "Lote 2026-B",
      etapaAtual: "implante_hormonal",
      dataImplante: d, dataInseminacao: addDays(d, 2), dataDiagnostico: addDays(d, 32),
    },
    {
      idEtiqueta: "0124", nome: null,     lote: "Lote 2026-B",
      etapaAtual: "inseminacao_iatf",
      dataImplante: subDays(d, 2), dataInseminacao: d, dataDiagnostico: addDays(d, 30),
    },
  ],

  diagnosticosPendentes: [
    { idEtiqueta: "0055", nome: null,      dataInseminacao: subDays(d, 29), diasAguardando: 29, lote: "Lote 2025-B" },
    { idEtiqueta: "0088", nome: "Estrela", dataInseminacao: subDays(d, 26), diasAguardando: 26, lote: "Lote 2025-B" },
  ],

  alertasMedicamentos: [
    { nome: "Progesterona Dispenser", tipo: "HORMONIO",       estoqueAtual: 3, estoqueMinimo: 10, validade: null,           alerta: "estoque"  },
    { nome: "Ocitocina 10UI",         tipo: "HORMONIO",       estoqueAtual: 1, estoqueMinimo: 5,  validade: null,           alerta: "estoque"  },
    { nome: "Cálcio EV",              tipo: "VITAMINA",       estoqueAtual: 2, estoqueMinimo: 8,  validade: null,           alerta: "estoque"  },
    { nome: "Ivermectina 1%",         tipo: "ANTIPARASITARIO", estoqueAtual: 45, estoqueMinimo: 20, validade: addDays(d, 25), alerta: "validade" },
  ],

  visaoGeralLotes: [
    { nome: "Lote 2026-A", status: "PARTO",     totalVacas: 50, gestantes: 42, paridasNoMes: 4,  bezerrosVivos: 4,  desmamados: 0 },
    { nome: "Lote 2026-B", status: "EM_MONTA",  totalVacas: 46, gestantes: 0,  paridasNoMes: 0,  bezerrosVivos: 0,  desmamados: 0 },
    { nome: "Lote 2025-B", status: "GESTACAO",  totalVacas: 48, gestantes: 38, paridasNoMes: 0,  bezerrosVivos: 2,  desmamados: 0 },
    { nome: "Lote 2025-A", status: "ENCERRADO", totalVacas: 50, gestantes: 0,  paridasNoMes: 0,  bezerrosVivos: 44, desmamados: 44 },
  ],

  bezarrosAtivos: [
    { idEtiqueta: "B-401", idMae: "0042", diasVida: 3,   pesoAtual: 32,  sexo: "M", status: "MAMANDO" },
    { idEtiqueta: "B-402", idMae: "0014", diasVida: 8,   pesoAtual: 39,  sexo: "F", status: "MAMANDO" },
    { idEtiqueta: "B-301", idMae: "0055", diasVida: 97,  pesoAtual: 107, sexo: "M", status: "MAMANDO" },
    { idEtiqueta: "B-302", idMae: "0088", diasVida: 104, pesoAtual: 112, sexo: "F", status: "MAMANDO" },
  ],
}
