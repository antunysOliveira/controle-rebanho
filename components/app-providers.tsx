"use client"

import { useState, useEffect, type ReactNode } from "react"
import { DataProvider } from "@/components/data-provider"
import { StageProvider } from "@/components/stage-provider"

export function AppProviders({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  if (!mounted) return <div className="h-full" />

  return (
    <DataProvider>
      <StageProvider>{children}</StageProvider>
    </DataProvider>
  )
}
