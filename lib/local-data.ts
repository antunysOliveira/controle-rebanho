export type AplicacaoItem = {
  id: string
  animalId: string
  etiqueta: string
  medicamentoId: string
  medicamento: string
  doseAplicada: number
  via: "INTRAMUSCULAR" | "SUBCUTANEA" | "ORAL" | "TOPICA"
  data: string       // ISO date string
  responsavel: string
  motivo: string
  carenciaDias: number
  proximaDose?: string // ISO date string — próxima dose agendada
}

type AnimalLoteOverride = Record<string, { loteId: string; lote: string }>

const KEYS = {
  ADDED:       "rebanho-aplicacoes-added",
  REMOVED:     "rebanho-aplicacoes-removed",
  ANIMAL_LOTES:"rebanho-animal-lotes",
}

function load<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function save(key: string, value: unknown): void {
  if (typeof window === "undefined") return
  localStorage.setItem(key, JSON.stringify(value))
}

// ─── Aplicações ──────────────────────────────────────────────────────────────

export function getAddedAplicacoes(): AplicacaoItem[] {
  return load<AplicacaoItem[]>(KEYS.ADDED, [])
}

export function persistAddAplicacao(item: AplicacaoItem): void {
  save(KEYS.ADDED, [...getAddedAplicacoes(), item])
}

export function getRemovedAplicacaoIds(): string[] {
  return load<string[]>(KEYS.REMOVED, [])
}

export function persistRemoveAplicacao(id: string): void {
  const current = getRemovedAplicacaoIds()
  if (!current.includes(id)) save(KEYS.REMOVED, [...current, id])
}

// ─── Lote overrides ──────────────────────────────────────────────────────────

export function getAnimalLoteOverrides(): AnimalLoteOverride {
  return load<AnimalLoteOverride>(KEYS.ANIMAL_LOTES, {})
}

export function persistAnimalLote(animalId: string, loteId: string, lote: string): void {
  save(KEYS.ANIMAL_LOTES, { ...getAnimalLoteOverrides(), [animalId]: { loteId, lote } })
}
