export type Veterinario = {
  id: string
  nome: string
  crmv: string
  telefone: string
  email: string
  especialidade: string
  ativo: boolean
}

export type Encarregado = {
  id: string
  nome: string
  cargo: string
  telefone: string
  lotes: string[]
  ativo: boolean
}

export type Lote = {
  id: string
  nome: string
  tipo: string
  status: string
  dataAbertura: Date
  dataFechamento: Date | null
  touro: string
  totalVacas: number
  gestantes: number
  paridasNoMes: number
  bezerrosVivos: number
  desmamados: number
  encarregados: string[]
}

export type Animal = {
  id: string
  idEtiqueta: string
  nome: string | null
  loteId: string
  lote: string
  status: string
  dataNascimento: Date
  dataUltimoParto: Date | null
  dataPartoEstimado: Date | null
  emLactacao: boolean
  pesoKg?: number | null
  raca?: string | null
}

export type Bezerro = {
  id: string
  idEtiqueta: string
  maeId: string
  maeEtiqueta: string
  sexo: string
  dataNascimento: Date
  pesoNascimento: number
  pesoAtual: number
  diasVida: number
  dataDesmameEstimada: Date | null
  status: string
}

export type EventoReprodutivo = {
  id: string
  animalId: string
  etiqueta: string
  tipo: string
  data: Date
  veterinarioId?: string | null
  resultado?: string | null
  obs?: string | null
}

export type Medicamento = {
  id: string
  nome: string
  principioAtivo: string
  tipo: string
  unidade: string
  dosePadrao: number
  estoqueAtual: number
  estoqueMinimo: number
  validade: Date
  fornecedor: string
  ativo: boolean
}
