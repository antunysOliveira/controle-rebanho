"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"

const STAGES = [
  { key: "1", label: "Estágio 1", sub: "Fev/2025 · Partos", color: "bg-blue-600" },
  { key: "2", label: "Estágio 2", sub: "Ago/2025 · Desmames", color: "bg-amber-500" },
  { key: "3", label: "Estágio 3", sub: "Jan/2026 · Novo ciclo", color: "bg-emerald-600" },
]

export function StageSwitcher() {
  const params = useSearchParams()
  const current = params.get("stage") ?? "1"

  return (
    <div className="rounded-lg border bg-muted/40 p-1 flex gap-1">
      {STAGES.map((s) => {
        const active = current === s.key
        return (
          <Link
            key={s.key}
            href={`/?stage=${s.key}`}
            className={cn(
              "flex-1 rounded-md px-3 py-2 text-center transition-all",
              active
                ? `${s.color} text-white shadow-sm`
                : "hover:bg-muted text-muted-foreground"
            )}
          >
            <div className="text-sm font-semibold leading-none">{s.label}</div>
            <div className={cn("text-xs mt-0.5", active ? "text-white/80" : "text-muted-foreground")}>
              {s.sub}
            </div>
          </Link>
        )
      })}
    </div>
  )
}
