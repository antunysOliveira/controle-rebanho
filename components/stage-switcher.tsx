"use client"

import { useTransition } from "react"
import { setStage } from "@/app/actions/stage"
import { cn } from "@/lib/utils"

const STAGES = [
  { key: "1", label: "Estágio 1", sub: "Fev/2025", color: "bg-blue-600" },
  { key: "2", label: "Estágio 2", sub: "Ago/2025", color: "bg-amber-500" },
  { key: "3", label: "Estágio 3", sub: "Jan/2026", color: "bg-emerald-600" },
]

export function StageSwitcher({ currentStage }: { currentStage: string }) {
  const [pending, startTransition] = useTransition()

  function handleSelect(key: string) {
    startTransition(async () => {
      await setStage(key)
    })
  }

  return (
    <div className="px-2 pb-3">
      <p className="text-xs font-semibold px-1 mb-1.5 opacity-50" style={{ color: "var(--sidebar-foreground)" }}>
        SIMULAÇÃO
      </p>
      <div className="flex flex-col gap-1">
        {STAGES.map((s) => {
          const active = currentStage === s.key
          return (
            <button
              key={s.key}
              onClick={() => handleSelect(s.key)}
              disabled={pending}
              className={cn(
                "w-full text-left rounded-md px-3 py-2 transition-all text-sm",
                active
                  ? `${s.color} text-white font-semibold shadow-sm`
                  : "opacity-60 hover:opacity-90"
              )}
              style={!active ? { color: "var(--sidebar-foreground)" } : undefined}
            >
              <span className="font-medium">{s.label}</span>
              <span className={cn("ml-1.5 text-xs", active ? "text-white/80" : "opacity-70")}>
                · {s.sub}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
