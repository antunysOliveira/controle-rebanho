"use client"

import { type ReactNode } from "react"
import { DataProvider } from "@/components/data-provider"
import { StageProvider } from "@/components/stage-provider"

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <DataProvider>
      <StageProvider>{children}</StageProvider>
    </DataProvider>
  )
}
