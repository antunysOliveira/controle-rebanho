"use client"

import { type ReactNode } from "react"
import { DataProvider } from "@/components/data-provider"

export function AppProviders({ children }: { children: ReactNode }) {
  return <DataProvider>{children}</DataProvider>
}
