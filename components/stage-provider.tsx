"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { getStoredStageKey, setStoredStageKey, getStageData } from "@/lib/stage-store"
import { computeAlertas } from "@/lib/alerts"
import { useData } from "@/components/data-provider"
import type { StageData } from "@/lib/stages/types"

interface StageContextValue {
  stageKey: string
  data: StageData
  setStage: (key: string) => void
  alertCount: number
}

const StageContext = createContext<StageContextValue | null>(null)

export function StageProvider({ children }: { children: React.ReactNode }) {
  const [stageKey, setStageKey] = useState("1")
  const { animais, bezerros, medicamentos, eventosReprodutivos } = useData()

  useEffect(() => {
    setStageKey(getStoredStageKey())
  }, [])

  const data = getStageData(stageKey)

  const alertCount = computeAlertas({
    today:        data.simDate,
    animais:      animais      as Parameters<typeof computeAlertas>[0]["animais"],
    bezerros:     bezerros.filter(b => b.dataDesmameEstimada) as Parameters<typeof computeAlertas>[0]["bezerros"],
    medicamentos: medicamentos as Parameters<typeof computeAlertas>[0]["medicamentos"],
    eventos:      eventosReprodutivos as Parameters<typeof computeAlertas>[0]["eventos"],
  }).length

  function setStage(key: string) {
    setStoredStageKey(key)
    setStageKey(key)
  }

  return (
    <StageContext.Provider value={{ stageKey, data, setStage, alertCount }}>
      {children}
    </StageContext.Provider>
  )
}

export function useStage(): StageContextValue {
  const ctx = useContext(StageContext)
  if (!ctx) throw new Error("useStage must be used within StageProvider")
  return ctx
}
