"use client"

import { createContext, useCallback, useContext, useState, type ReactNode } from "react"

const STORAGE_KEY = "alertas-dismissed"

function load(): Set<string> {
  if (typeof window === "undefined") return new Set()
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? new Set(JSON.parse(raw)) : new Set()
  } catch {
    return new Set()
  }
}

interface DismissedAlertsContextValue {
  dismissed: Set<string>
  dismiss(id: string): void
  restore(id: string): void
  clearDismissed(): void
}

const DismissedAlertsContext = createContext<DismissedAlertsContextValue | null>(null)

export function DismissedAlertsProvider({ children }: { children: ReactNode }) {
  const [dismissed, setDismissed] = useState<Set<string>>(load)

  const dismiss = useCallback((id: string) => {
    setDismissed(prev => {
      const next = new Set(prev)
      next.add(id)
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]))
      return next
    })
  }, [])

  const restore = useCallback((id: string) => {
    setDismissed(prev => {
      const next = new Set(prev)
      next.delete(id)
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]))
      return next
    })
  }, [])

  const clearDismissed = useCallback(() => {
    setDismissed(new Set())
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  return (
    <DismissedAlertsContext.Provider value={{ dismissed, dismiss, restore, clearDismissed }}>
      {children}
    </DismissedAlertsContext.Provider>
  )
}

export function useDismissedAlerts(): DismissedAlertsContextValue {
  const ctx = useContext(DismissedAlertsContext)
  if (!ctx) throw new Error("useDismissedAlerts must be used within DismissedAlertsProvider")
  return ctx
}
