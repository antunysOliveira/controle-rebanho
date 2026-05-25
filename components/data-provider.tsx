"use client"

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react"
import { aplicacoes as mockAplicacoes } from "@/lib/mock/data"
import { transacoes as mockTransacoes } from "@/lib/mock/financeiro"
import {
  type AplicacaoItem,
  type TransacaoItem,
  getAddedAplicacoes,
  persistAddAplicacao,
  getRemovedAplicacaoIds,
  persistRemoveAplicacao,
  getAnimalLoteOverrides,
  persistAnimalLote,
  getAddedTransacoes,
  persistAddTransacao,
  getRemovedTransacaoIds,
  persistRemoveTransacao,
} from "@/lib/local-data"

type AnimalLote = { loteId: string; lote: string }

interface DataContextValue {
  getAplicacoesByAnimal(animalId: string): AplicacaoItem[]
  addAplicacao(item: Omit<AplicacaoItem, "id">): void
  removeAplicacao(id: string): void
  getAnimalLote(animalId: string): AnimalLote | null
  moveAnimalToLote(animalId: string, loteId: string, lote: string): void
  getTodasTransacoes(): TransacaoItem[]
  addTransacao(item: Omit<TransacaoItem, "id">): void
  removeTransacao(id: string): void
}

const DataContext = createContext<DataContextValue | null>(null)

export function DataProvider({ children }: { children: ReactNode }) {
  const [added, setAdded] = useState<AplicacaoItem[]>([])
  const [removed, setRemoved] = useState<string[]>([])
  const [loteOverrides, setLoteOverrides] = useState<Record<string, AnimalLote>>({})
  const [transacoesAdded, setTransacoesAdded] = useState<TransacaoItem[]>([])
  const [transacoesRemoved, setTransacoesRemoved] = useState<string[]>([])

  useEffect(() => {
    setAdded(getAddedAplicacoes())
    setRemoved(getRemovedAplicacaoIds())
    setLoteOverrides(getAnimalLoteOverrides())
    setTransacoesAdded(getAddedTransacoes())
    setTransacoesRemoved(getRemovedTransacaoIds())
  }, [])

  const getAplicacoesByAnimal = useCallback(
    (animalId: string): AplicacaoItem[] => {
      const mock = mockAplicacoes
        .filter((a) => a.animalId === animalId && !removed.includes(a.id))
        .map((a) => ({
          id: a.id,
          animalId: a.animalId,
          etiqueta: a.etiqueta,
          medicamentoId: a.medicamentoId,
          medicamento: a.medicamento,
          doseAplicada: a.doseAplicada,
          via: a.via as AplicacaoItem["via"],
          data: a.data.toISOString(),
          responsavel: a.responsavel,
          motivo: a.motivo,
          carenciaDias: a.carenciaDias,
          proximaDose: undefined,
        }))
      const userAdded = added.filter((a) => a.animalId === animalId)
      return [...mock, ...userAdded].sort(
        (a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()
      )
    },
    [added, removed]
  )

  const addAplicacao = useCallback((item: Omit<AplicacaoItem, "id">) => {
    const full: AplicacaoItem = { ...item, id: `u-${Date.now()}` }
    persistAddAplicacao(full)
    setAdded((prev) => [...prev, full])
  }, [])

  const removeAplicacao = useCallback((id: string) => {
    persistRemoveAplicacao(id)
    setRemoved((prev) => [...prev, id])
  }, [])

  const getAnimalLote = useCallback(
    (animalId: string): AnimalLote | null => loteOverrides[animalId] ?? null,
    [loteOverrides]
  )

  const moveAnimalToLote = useCallback((animalId: string, loteId: string, lote: string) => {
    persistAnimalLote(animalId, loteId, lote)
    setLoteOverrides((prev) => ({ ...prev, [animalId]: { loteId, lote } }))
  }, [])

  const getTodasTransacoes = useCallback((): TransacaoItem[] => {
    const mock: TransacaoItem[] = mockTransacoes
      .filter((t) => !transacoesRemoved.includes(t.id))
      .map((t) => ({
        id: t.id,
        tipo: t.tipo,
        categoria: t.categoria,
        valor: t.valor,
        data: t.data.toISOString(),
        descricao: t.descricao,
        animalId: t.animalId,
      }))
    return [...mock, ...transacoesAdded].sort(
      (a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()
    )
  }, [transacoesAdded, transacoesRemoved])

  const addTransacao = useCallback((item: Omit<TransacaoItem, "id">) => {
    const full: TransacaoItem = { ...item, id: `f-${Date.now()}` }
    persistAddTransacao(full)
    setTransacoesAdded((prev) => [...prev, full])
  }, [])

  const removeTransacao = useCallback((id: string) => {
    persistRemoveTransacao(id)
    setTransacoesRemoved((prev) => [...prev, id])
  }, [])

  return (
    <DataContext.Provider value={{
      getAplicacoesByAnimal, addAplicacao, removeAplicacao,
      getAnimalLote, moveAnimalToLote,
      getTodasTransacoes, addTransacao, removeTransacao,
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
