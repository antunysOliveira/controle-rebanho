import { addDays, subDays } from "date-fns"

const hoje = new Date()

export const partosProximos = [
  { idEtiqueta: "0042", nome: "Mimosa", dataEstimada: addDays(hoje, 3), diasRestantes: 3, lote: "Lote 2025-A" },
  { idEtiqueta: "0018", nome: null, dataEstimada: addDays(hoje, 6), diasRestantes: 6, lote: "Lote 2025-A" },
  { idEtiqueta: "0077", nome: "Pretinha", dataEstimada: addDays(hoje, 10), diasRestantes: 10, lote: "Lote 2025-B" },
  { idEtiqueta: "0031", nome: null, dataEstimada: addDays(hoje, 14), diasRestantes: 14, lote: "Lote 2025-A" },
]

export const desmaamesProximos = [
  { idEtiqueta: "B-201", idMae: "0042", dataNascimento: subDays(hoje, 198), dataEstimada: addDays(hoje, 12), pesoAtual: 168.5 },
  { idEtiqueta: "B-189", idMae: "0015", dataNascimento: subDays(hoje, 203), dataEstimada: addDays(hoje, 7), pesoAtual: 174.0 },
  { idEtiqueta: "B-194", idMae: "0063", dataNascimento: subDays(hoje, 207), dataEstimada: addDays(hoje, 3), pesoAtual: 181.2 },
]

export const vacasEmProtocolo = [
  {
    idEtiqueta: "0055",
    nome: null,
    lote: "Lote 2025-B",
    etapaAtual: "inseminacao_iatf" as const,
    dataImplante: subDays(hoje, 2),
    dataInseminacao: hoje,
    dataDiagnostico: addDays(hoje, 30),
  },
  {
    idEtiqueta: "0088",
    nome: "Estrela",
    lote: "Lote 2025-B",
    etapaAtual: "implante_hormonal" as const,
    dataImplante: hoje,
    dataInseminacao: addDays(hoje, 2),
    dataDiagnostico: addDays(hoje, 32),
  },
  {
    idEtiqueta: "0103",
    nome: null,
    lote: "Lote 2025-B",
    etapaAtual: "aguardando_diagnostico" as const,
    dataImplante: subDays(hoje, 32),
    dataInseminacao: subDays(hoje, 30),
    dataDiagnostico: hoje,
  },
]

export const diagnosticosPendentes = [
  { idEtiqueta: "0011", nome: null, dataInseminacao: subDays(hoje, 28), diasAguardando: 28, lote: "Lote 2025-A" },
  { idEtiqueta: "0029", nome: "Boneca", dataInseminacao: subDays(hoje, 32), diasAguardando: 32, lote: "Lote 2025-A" },
  { idEtiqueta: "0047", nome: null, dataInseminacao: subDays(hoje, 25), diasAguardando: 25, lote: "Lote 2025-A" },
]

export const alertasMedicamentos = [
  { nome: "Progesterona Dispenser", tipo: "HORMONIO", estoqueAtual: 3, estoqueMinimo: 10, validade: null, alerta: "estoque" as const },
  { nome: "Cipionato de Estradiol", tipo: "HORMONIO", estoqueAtual: 8, estoqueMinimo: 5, validade: addDays(hoje, 18), alerta: "validade" as const },
  { nome: "Ocitocina 10UI", tipo: "HORMONIO", estoqueAtual: 1, estoqueMinimo: 5, validade: null, alerta: "estoque" as const },
  { nome: "Ivermectina 1%", tipo: "ANTIPARASITARIO", estoqueAtual: 50, estoqueMinimo: 20, validade: addDays(hoje, 22), alerta: "validade" as const },
]

export const visaoGeralLotes = [
  {
    nome: "Lote 2025-A",
    status: "PARTO",
    totalVacas: 50,
    gestantes: 38,
    paridasNoMes: 8,
    bezerrosVivos: 44,
    desmamados: 12,
  },
  {
    nome: "Lote 2025-B",
    status: "EM_MONTA",
    totalVacas: 48,
    gestantes: 0,
    paridasNoMes: 0,
    bezerrosVivos: 0,
    desmamados: 0,
  },
  {
    nome: "Lote 2024-A",
    status: "ENCERRADO",
    totalVacas: 50,
    gestantes: 0,
    paridasNoMes: 0,
    bezerrosVivos: 48,
    desmamados: 48,
  },
]
