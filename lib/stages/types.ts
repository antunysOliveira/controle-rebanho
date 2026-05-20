export type EtapaProtocolo = "implante_hormonal" | "inseminacao_iatf" | "aguardando_diagnostico"
export type AlertaTipo = "estoque" | "validade"

export interface PartoProximo {
  idEtiqueta: string
  nome: string | null
  dataEstimada: Date
  diasRestantes: number
  lote: string
}

export interface DesmameProximo {
  idEtiqueta: string
  idMae: string
  dataNascimento: Date
  dataEstimada: Date
  diasRestantes: number
  pesoAtual: number
}

export interface VacaProtocolo {
  idEtiqueta: string
  nome: string | null
  lote: string
  etapaAtual: EtapaProtocolo
  dataImplante: Date
  dataInseminacao: Date
  dataDiagnostico: Date
}

export interface DiagnosticoPendente {
  idEtiqueta: string
  nome: string | null
  dataInseminacao: Date
  diasAguardando: number
  lote: string
}

export interface AlertaMedicamento {
  nome: string
  tipo: string
  estoqueAtual: number
  estoqueMinimo: number
  validade: Date | null
  alerta: AlertaTipo
}

export interface VisaoLote {
  nome: string
  status: string
  totalVacas: number
  gestantes: number
  paridasNoMes: number
  bezerrosVivos: number
  desmamados: number
}

export interface BezerroAtivo {
  idEtiqueta: string
  idMae: string
  diasVida: number
  pesoAtual: number
  sexo: "M" | "F"
  status: string
}

export interface StageData {
  simDate: Date
  label: string
  descricao: string
  detalhe: string
  partosProximos: PartoProximo[]
  desmaamesProximos: DesmameProximo[]
  vacasEmProtocolo: VacaProtocolo[]
  diagnosticosPendentes: DiagnosticoPendente[]
  alertasMedicamentos: AlertaMedicamento[]
  visaoGeralLotes: VisaoLote[]
  bezarrosAtivos: BezerroAtivo[]
}
