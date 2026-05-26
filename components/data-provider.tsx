"use client"

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react"
import { differenceInDays } from "date-fns"
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
  addAnimal(item: Omit<Animal, "id">): Promise<void>
  updateAnimal(id: string, item: Omit<Animal, "id">): Promise<void>
  deleteAnimal(id: string): Promise<void>
  addBezerro(item: Omit<Bezerro, "id" | "diasVida">): Promise<void>
  updateBezerro(id: string, item: Omit<Bezerro, "id" | "diasVida">): Promise<void>
  deleteBezerro(id: string): Promise<void>
  addLote(item: Omit<Lote, "id">): Promise<void>
  updateLote(id: string, item: Omit<Lote, "id">): Promise<void>
  deleteLote(id: string): Promise<void>
  addMedicamento(item: Omit<Medicamento, "id">): Promise<void>
  updateMedicamento(id: string, item: Omit<Medicamento, "id">): Promise<void>
  deleteMedicamento(id: string): Promise<void>
  addEvento(item: Omit<EventoReprodutivo, "id">): Promise<void>
  deleteEvento(id: string): Promise<void>
  addVeterinario(item: Omit<Veterinario, "id">): Promise<void>
  updateVeterinario(id: string, item: Omit<Veterinario, "id">): Promise<void>
  deleteVeterinario(id: string): Promise<void>
  addEncarregado(item: Omit<Encarregado, "id">): Promise<void>
  updateEncarregado(id: string, item: Omit<Encarregado, "id">): Promise<void>
  deleteEncarregado(id: string): Promise<void>
}

const DataContext = createContext<DataContextValue | null>(null)

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toISO(dt: Date | null | undefined): string | null {
  return dt ? dt.toISOString().split("T")[0] : null
}

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
    pesoAtual: r.peso_atual,
    diasVida: differenceInDays(new Date(), d(r.data_nascimento)!),
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

  // ── Animal CRUD ────────────────────────────────────────────────────────────

  const addAnimal = useCallback(async (item: Omit<Animal, "id">) => {
    const id = crypto.randomUUID()
    const { error } = await supabase.from("animais").insert({
      id, id_etiqueta: item.idEtiqueta, nome: item.nome ?? null,
      lote_id: item.loteId, lote: item.lote, status: item.status,
      data_nascimento: toISO(item.dataNascimento),
      data_ultimo_parto: toISO(item.dataUltimoParto),
      data_parto_estimado: toISO(item.dataPartoEstimado),
      em_lactacao: item.emLactacao, peso_kg: item.pesoKg ?? null, raca: item.raca ?? null,
    })
    if (!error) setAnimais(prev => [...prev, { ...item, id }])
  }, [])

  const updateAnimal = useCallback(async (id: string, item: Omit<Animal, "id">) => {
    const { error } = await supabase.from("animais").update({
      id_etiqueta: item.idEtiqueta, nome: item.nome ?? null,
      lote_id: item.loteId, lote: item.lote, status: item.status,
      data_nascimento: toISO(item.dataNascimento),
      data_ultimo_parto: toISO(item.dataUltimoParto),
      data_parto_estimado: toISO(item.dataPartoEstimado),
      em_lactacao: item.emLactacao, peso_kg: item.pesoKg ?? null, raca: item.raca ?? null,
    }).eq("id", id)
    if (!error) setAnimais(prev => prev.map(a => a.id === id ? { ...a, ...item } : a))
  }, [])

  const deleteAnimal = useCallback(async (id: string) => {
    const { error } = await supabase.from("animais").delete().eq("id", id)
    if (!error) setAnimais(prev => prev.filter(a => a.id !== id))
  }, [])

  // ── Bezerro CRUD ───────────────────────────────────────────────────────────

  const addBezerro = useCallback(async (item: Omit<Bezerro, "id" | "diasVida">) => {
    const id = crypto.randomUUID()
    const { error } = await supabase.from("bezerros").insert({
      id, id_etiqueta: item.idEtiqueta, mae_id: item.maeId, mae_etiqueta: item.maeEtiqueta,
      sexo: item.sexo, data_nascimento: toISO(item.dataNascimento),
      peso_nascimento: item.pesoNascimento, peso_atual: item.pesoAtual,
      data_desmame_estimada: toISO(item.dataDesmameEstimada), status: item.status,
    })
    if (!error) setBezerros(prev => [
      ...prev,
      { ...item, id, diasVida: differenceInDays(new Date(), item.dataNascimento) },
    ])
  }, [])

  const updateBezerro = useCallback(async (id: string, item: Omit<Bezerro, "id" | "diasVida">) => {
    const { error } = await supabase.from("bezerros").update({
      id_etiqueta: item.idEtiqueta, mae_id: item.maeId, mae_etiqueta: item.maeEtiqueta,
      sexo: item.sexo, data_nascimento: toISO(item.dataNascimento),
      peso_nascimento: item.pesoNascimento, peso_atual: item.pesoAtual,
      data_desmame_estimada: toISO(item.dataDesmameEstimada), status: item.status,
    }).eq("id", id)
    if (!error) setBezerros(prev => prev.map(b =>
      b.id === id
        ? { ...b, ...item, diasVida: differenceInDays(new Date(), item.dataNascimento) }
        : b
    ))
  }, [])

  const deleteBezerro = useCallback(async (id: string) => {
    const { error } = await supabase.from("bezerros").delete().eq("id", id)
    if (!error) setBezerros(prev => prev.filter(b => b.id !== id))
  }, [])

  // ── Lote CRUD ──────────────────────────────────────────────────────────────

  const addLote = useCallback(async (item: Omit<Lote, "id">) => {
    const id = crypto.randomUUID()
    const { error } = await supabase.from("lotes").insert({
      id, nome: item.nome, tipo: item.tipo, status: item.status,
      data_abertura: toISO(item.dataAbertura), data_fechamento: toISO(item.dataFechamento),
      touro: item.touro, total_vacas: item.totalVacas, gestantes: item.gestantes,
      paridas_no_mes: item.paridasNoMes, bezerros_vivos: item.bezerrosVivos,
      desmamados: item.desmamados, encarregados: item.encarregados ?? [],
    })
    if (!error) setLotes(prev => [...prev, { ...item, id }])
  }, [])

  const updateLote = useCallback(async (id: string, item: Omit<Lote, "id">) => {
    const { error } = await supabase.from("lotes").update({
      nome: item.nome, tipo: item.tipo, status: item.status,
      data_abertura: toISO(item.dataAbertura), data_fechamento: toISO(item.dataFechamento),
      touro: item.touro, total_vacas: item.totalVacas, gestantes: item.gestantes,
      paridas_no_mes: item.paridasNoMes, bezerros_vivos: item.bezerrosVivos,
      desmamados: item.desmamados,
    }).eq("id", id)
    if (!error) setLotes(prev => prev.map(l => l.id === id ? { ...l, ...item } : l))
  }, [])

  const deleteLote = useCallback(async (id: string) => {
    const { error } = await supabase.from("lotes").delete().eq("id", id)
    if (!error) setLotes(prev => prev.filter(l => l.id !== id))
  }, [])

  // ── Medicamento CRUD ───────────────────────────────────────────────────────

  const addMedicamento = useCallback(async (item: Omit<Medicamento, "id">) => {
    const id = crypto.randomUUID()
    const { error } = await supabase.from("medicamentos").insert({
      id, nome: item.nome, principio_ativo: item.principioAtivo, tipo: item.tipo,
      unidade: item.unidade, dose_padrao: item.dosePadrao,
      estoque_atual: item.estoqueAtual, estoque_minimo: item.estoqueMinimo,
      validade: toISO(item.validade), fornecedor: item.fornecedor, ativo: item.ativo,
    })
    if (!error) setMedicamentos(prev => [...prev, { ...item, id }])
  }, [])

  const updateMedicamento = useCallback(async (id: string, item: Omit<Medicamento, "id">) => {
    const { error } = await supabase.from("medicamentos").update({
      nome: item.nome, principio_ativo: item.principioAtivo, tipo: item.tipo,
      unidade: item.unidade, dose_padrao: item.dosePadrao,
      estoque_atual: item.estoqueAtual, estoque_minimo: item.estoqueMinimo,
      validade: toISO(item.validade), fornecedor: item.fornecedor, ativo: item.ativo,
    }).eq("id", id)
    if (!error) setMedicamentos(prev => prev.map(m => m.id === id ? { ...m, ...item } : m))
  }, [])

  const deleteMedicamento = useCallback(async (id: string) => {
    const { error } = await supabase.from("medicamentos").delete().eq("id", id)
    if (!error) setMedicamentos(prev => prev.filter(m => m.id !== id))
  }, [])

  // ── Evento Reprodutivo CRUD ────────────────────────────────────────────────

  const addEvento = useCallback(async (item: Omit<EventoReprodutivo, "id">) => {
    const id = crypto.randomUUID()
    const { error } = await supabase.from("eventos_reprodutivos").insert({
      id, animal_id: item.animalId, etiqueta: item.etiqueta, tipo: item.tipo,
      data: toISO(item.data), veterinario_id: item.veterinarioId ?? null,
      resultado: item.resultado ?? null, obs: item.obs ?? null,
    })
    if (!error) setEventos(prev =>
      [{ ...item, id }, ...prev].sort((a, b) => b.data.getTime() - a.data.getTime())
    )
  }, [])

  const deleteEvento = useCallback(async (id: string) => {
    const { error } = await supabase.from("eventos_reprodutivos").delete().eq("id", id)
    if (!error) setEventos(prev => prev.filter(e => e.id !== id))
  }, [])

  // ── Veterinario CRUD ───────────────────────────────────────────────────────

  const addVeterinario = useCallback(async (item: Omit<Veterinario, "id">) => {
    const id = crypto.randomUUID()
    const { error } = await supabase.from("veterinarios").insert({
      id, nome: item.nome, crmv: item.crmv, telefone: item.telefone,
      email: item.email, especialidade: item.especialidade, ativo: item.ativo,
    })
    if (!error) setVeterinarios(prev => [...prev, { ...item, id }])
  }, [])

  const updateVeterinario = useCallback(async (id: string, item: Omit<Veterinario, "id">) => {
    const { error } = await supabase.from("veterinarios").update({
      nome: item.nome, crmv: item.crmv, telefone: item.telefone,
      email: item.email, especialidade: item.especialidade, ativo: item.ativo,
    }).eq("id", id)
    if (!error) setVeterinarios(prev => prev.map(v => v.id === id ? { ...v, ...item } : v))
  }, [])

  const deleteVeterinario = useCallback(async (id: string) => {
    const { error } = await supabase.from("veterinarios").delete().eq("id", id)
    if (!error) setVeterinarios(prev => prev.filter(v => v.id !== id))
  }, [])

  // ── Encarregado CRUD ───────────────────────────────────────────────────────

  const addEncarregado = useCallback(async (item: Omit<Encarregado, "id">) => {
    const id = crypto.randomUUID()
    const { error } = await supabase.from("encarregados").insert({
      id, nome: item.nome, cargo: item.cargo, telefone: item.telefone,
      lotes: item.lotes, ativo: item.ativo,
    })
    if (!error) setEncarregados(prev => [...prev, { ...item, id }])
  }, [])

  const updateEncarregado = useCallback(async (id: string, item: Omit<Encarregado, "id">) => {
    const { error } = await supabase.from("encarregados").update({
      nome: item.nome, cargo: item.cargo, telefone: item.telefone,
      lotes: item.lotes, ativo: item.ativo,
    }).eq("id", id)
    if (!error) setEncarregados(prev => prev.map(e => e.id === id ? { ...e, ...item } : e))
  }, [])

  const deleteEncarregado = useCallback(async (id: string) => {
    const { error } = await supabase.from("encarregados").delete().eq("id", id)
    if (!error) setEncarregados(prev => prev.filter(e => e.id !== id))
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
      addAnimal, updateAnimal, deleteAnimal,
      addBezerro, updateBezerro, deleteBezerro,
      addLote, updateLote, deleteLote,
      addMedicamento, updateMedicamento, deleteMedicamento,
      addEvento, deleteEvento,
      addVeterinario, updateVeterinario, deleteVeterinario,
      addEncarregado, updateEncarregado, deleteEncarregado,
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
