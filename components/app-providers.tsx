"use client"

import { type ReactNode } from "react"
import { DataProvider } from "@/components/data-provider"
import { DismissedAlertsProvider } from "@/components/dismissed-alerts-provider"

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <DataProvider>
      <DismissedAlertsProvider>{children}</DismissedAlertsProvider>
    </DataProvider>
  )
}
