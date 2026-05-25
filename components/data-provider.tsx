"use client"

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react"
import { supabase } from "@/lib/supabase"
import type { Animal, Bezerro, Encarregado, EventoReprodutivo, Lote, Medicamento, Veterinario } from "@/lib/types"
import { type AplicacaoItem, type TransacaoItem } from "@/lib/local-data"

type AnimalLote = { loteId: string; lote: string }

interface DataContextValue {
  loading: boolean
  animais: Animal[]
  lotes: Lote[]
  bezerros: Bezerro[]
  medicamentos: Medicamento[]
  eventosReprodutivos: EventoReprodutivo[]
  veterinarios: Veterinario[]
  encarregados: Encarregado[]
  aplicacoes: AplicacaoItem[]
  transacoes: TransacaoItem[]
  getAnimalById(id: string): Animal | undefined
  getLoteById(id: string): Lote | undefined
  getAnimaisByLote(loteId: string): Animal[]
  getBezerrosByMae(maeId: string): Bezerro[]
  getEventosByAnimal(animalId: string): EventoReprodutivo[]
  getAplicacoesByAnimal(animalId: string): AplicacaoItem[]
  getAnimalLote(animalId: string): AnimalLote | null
  getTodasTransacoes(): TransacaoItem[]
  addAplicacao(item: Omit<AplicacaoItem, "id">): Promise<void>
  removeAplicacao(id: string): Promise<void>
  moveAnimalToLote(animalId: string, loteId: string, lote: string): Promise<void>
  addTransacao(item: Omit<TransacaoItem, "id">): Promise<void>
  removeTransacao(id: string): Promise<void>
}

const DataContext = createContext<DataContextValue | null>(null)

// ─── Row mappers ─────────────────────────────────────────────────────────────

function d(s: string | null | undefined): Date | null {
  return s ? new Date(s + "T00:00:00") : null
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapAnimal(r: any): Animal {
  return {
    id: r.id, idEtiqueta: r.id_etiqueta, nome: r.nome,
    loteId: r.lote_id, lote: r.lote, status: r.status,
    dataNascimento: d(r.data_nascimento)!,
    dataUltimoParto: d(r.data_ultimo_parto),
    dataPartoEstimado: d(r.data_parto_estimado),
    emLactacao: r.em_lactacao, pesoKg: r.peso_kg, raca: r.raca,
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapLote(r: any): Lote {
  return {
    id: r.id, nome: r.nome, tipo: r.tipo, status: r.status,
    dataAbertura: d(r.data_abertura)!, dataFechamento: d(r.data_fechamento),
    touro: r.touro ?? "",
    totalVacas: r.total_vacas, gestantes: r.gestantes, paridasNoMes: r.paridas_no_mes,
    bezerrosVivos: r.bezerros_vivos, desmamados: r.desmamados,
    encarregados: r.encarregados ?? [],
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapBezerro(r: any): Bezerro {
  return {
    id: r.id, idEtiqueta: r.id_etiqueta, maeId: r.mae_id, maeEtiqueta: r.mae_etiqueta,
    sexo: r.sexo, dataNascimento: d(r.data_nascimento)!, pesoNascimento: r.peso_nascimento,
    pesoAtual: r.peso_atual, diasVida: r.dias_vida,
    dataDesmameEstimada: d(r.data_desmame_estimada), status: r.status,
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapEvento(r: any): EventoReprodutivo {
  return {
    id: r.id, animalId: r.animal_id, etiqueta: r.etiqueta, tipo: r.tipo,
    data: d(r.data)!, veterinarioId: r.veterinario_id, resultado: r.resultado, obs: r.obs,
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapMedicamento(r: any): Medicamento {
  return {
    id: r.id, nome: r.nome, principioAtivo: r.principio_ativo, tipo: r.tipo,
    unidade: r.unidade, dosePadrao: r.dose_padrao, estoqueAtual: r.estoque_atual,
    estoqueMinimo: r.estoque_minimo, validade: d(r.validade)!, fornecedor: r.fornecedor, ativo: r.ativo,
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapVeterinario(r: any): Veterinario {
  return { id: r.id, nome: r.nome, crmv: r.crmv, telefone: r.telefone, email: r.email, especialidade: r.especialidade, ativo: r.ativo }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapEncarregado(r: any): Encarregado {
  return { id: r.id, nome: r.nome, cargo: r.cargo, telefone: r.telefone, lotes: r.lotes ?? [], ativo: r.ativo }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapAplicacao(r: any): AplicacaoItem {
  return {
    id: r.id, animalId: r.animal_id, etiqueta: r.etiqueta,
    medicamentoId: r.medicamento_id, medicamento: r.medicamento,
    doseAplicada: r.dose_aplicada, via: r.via, data: r.data,
    responsavel: r.responsavel ?? "", motivo: r.motivo ?? "",
    carenciaDias: r.carencia_dias ?? 0, proximaDose: r.proxima_dose ?? undefined,
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapTransacao(r: any): TransacaoItem {
  return {
    id: r.id, tipo: r.tipo, categoria: r.categoria, valor: r.valor,
    data: r.data, descricao: r.descricao, animalId: r.animal_id ?? undefined,
  }
}

// ─── Provider ────────────────────────────────────────────────────────────────

export function DataProvider({ children }: { children: ReactNode }) {
  const [loading,              setLoading]              = useState(true)
  const [animaisData,          setAnimais]              = useState<Animal[]>([])
  const [lotesData,            setLotes]                = useState<Lote[]>([])
  const [bezerrosData,         setBezerros]             = useState<Bezerro[]>([])
  const [medicamentosData,     setMedicamentos]         = useState<Medicamento[]>([])
  const [eventosData,          setEventos]              = useState<EventoReprodutivo[]>([])
  const [veterinariosData,     setVeterinarios]         = useState<Veterinario[]>([])
  const [encarregadosData,     setEncarregados]         = useState<Encarregado[]>([])
  const [aplicacoesData,       setAplicacoes]           = useState<AplicacaoItem[]>([])
  const [transacoesData,       setTransacoes]           = useState<TransacaoItem[]>([])

  useEffect(() => {
    async function loadAll() {
      setLoading(true)
      try {
        const [
          { data: vet },   { data: enc },   { data: lot },
          { data: ani },   { data: bez },   { data: evt },
          { data: med },   { data: apl },   { data: tra },
        ] = await Promise.all([
          supabase.from("veterinarios").select("*"),
          supabase.from("encarregados").select("*"),
          supabase.from("lotes").select("*"),
          supabase.from("animais").select("*"),
          supabase.from("bezerros").select("*"),
          supabase.from("eventos_reprodutivos").select("*"),
          supabase.from("medicamentos").select("*"),
          supabase.from("aplicacoes").select("*").order("data", { ascending: false }),
          supabase.from("transacoes").select("*").order("data", { ascending: false }),
        ])
        setVeterinarios((vet  ?? []).map(mapVeterinario))
        setEncarregados((enc  ?? []).map(mapEncarregado))
        setLotes(        (lot  ?? []).map(mapLote))
        setAnimais(      (ani  ?? []).map(mapAnimal))
        setBezerros(     (bez  ?? []).map(mapBezerro))
        setEventos(      (evt  ?? []).map(mapEvento).sort((a, b) => b.data.getTime() - a.data.getTime()))
        setMedicamentos( (med  ?? []).map(mapMedicamento))
        setAplicacoes(   (apl  ?? []).map(mapAplicacao))
        setTransacoes(   (tra  ?? []).map(mapTransacao))
      } finally {
        setLoading(false)
      }
    }
    loadAll()
  }, [])

  // ── Helpers ────────────────────────────────────────────────────────────────

  const getAnimalById    = useCallback((id: string) => animaisData.find(a => a.id === id), [animaisData])
  const getLoteById      = useCallback((id: string) => lotesData.find(l => l.id === id),   [lotesData])
  const getAnimaisByLote = useCallback((loteId: string) => animaisData.filter(a => a.loteId === loteId), [animaisData])
  const getBezerrosByMae = useCallback((maeId: string)  => bezerrosData.filter(b => b.maeId === maeId),  [bezerrosData])

  const getEventosByAnimal = useCallback(
    (animalId: string) => eventosData.filter(e => e.animalId === animalId).sort((a, b) => b.data.getTime() - a.data.getTime()),
    [eventosData],
  )

  const getAplicacoesByAnimal = useCallback(
    (animalId: string) => aplicacoesData.filter(a => a.animalId === animalId),
    [aplicacoesData],
  )

  const getAnimalLote = useCallback(
    (animalId: string): AnimalLote | null => {
      const a = animaisData.find(x => x.id === animalId)
      return a ? { loteId: a.loteId, lote: a.lote } : null
    },
    [animaisData],
  )

  const getTodasTransacoes = useCallback(() => transacoesData, [transacoesData])

  // ── Mutations ──────────────────────────────────────────────────────────────

  const addAplicacao = useCallback(async (item: Omit<AplicacaoItem, "id">) => {
    const id = `u-${Date.now()}`
    const { error } = await supabase.from("aplicacoes").insert({
      id, animal_id: item.animalId, etiqueta: item.etiqueta,
      medicamento_id: item.medicamentoId, medicamento: item.medicamento,
      dose_aplicada: item.doseAplicada, via: item.via, data: item.data,
      responsavel: item.responsavel, motivo: item.motivo,
      carencia_dias: item.carenciaDias, proxima_dose: item.proximaDose ?? null,
    })
    if (!error) setAplicacoes(prev => [{ ...item, id }, ...prev])
  }, [])

  const removeAplicacao = useCallback(async (id: string) => {
    const { error } = await supabase.from("aplicacoes").delete().eq("id", id)
    if (!error) setAplicacoes(prev => prev.filter(a => a.id !== id))
  }, [])

  const moveAnimalToLote = useCallback(async (animalId: string, loteId: string, lote: string) => {
    const { error } = await supabase.from("animais").update({ lote_id: loteId, lote }).eq("id", animalId)
    if (!error) setAnimais(prev => prev.map(a => a.id === animalId ? { ...a, loteId, lote } : a))
  }, [])

  const addTransacao = useCallback(async (item: Omit<TransacaoItem, "id">) => {
    const id = `f-${Date.now()}`
    const { error } = await supabase.from("transacoes").insert({
      id, tipo: item.tipo, categoria: item.categoria, valor: item.valor,
      data: item.data, descricao: item.descricao, animal_id: item.animalId ?? null,
    })
    if (!error) setTransacoes(prev => [{ ...item, id }, ...prev])
  }, [])

  const removeTransacao = useCallback(async (id: string) => {
    const { error } = await supabase.from("transacoes").delete().eq("id", id)
    if (!error) setTransacoes(prev => prev.filter(t => t.id !== id))
  }, [])

  return (
    <DataContext.Provider value={{
      loading,
      animais: animaisData, lotes: lotesData, bezerros: bezerrosData,
      medicamentos: medicamentosData, eventosReprodutivos: eventosData,
      veterinarios: veterinariosData, encarregados: encarregadosData,
      aplicacoes: aplicacoesData, transacoes: transacoesData,
      getAnimalById, getLoteById, getAnimaisByLote, getBezerrosByMae,
      getEventosByAnimal, getAplicacoesByAnimal, getAnimalLote, getTodasTransacoes,
      addAplicacao, removeAplicacao, moveAnimalToLote, addTransacao, removeTransacao,
    }}>
      {children}
    </DataContext.Provider>
  )
}

export function useData(): DataContextValue {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error("useData must be used within DataProvider")
  return ctx
}
