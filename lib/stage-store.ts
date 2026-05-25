import { getStage } from "@/lib/stages"
import type { StageData } from "@/lib/stages/types"

const KEY = "rebanho-stage"

export function getStoredStageKey(): string {
  if (typeof window === "undefined") return "1"
  return localStorage.getItem(KEY) ?? "1"
}

export function setStoredStageKey(key: string): void {
  if (typeof window === "undefined") return
  localStorage.setItem(KEY, key)
}

export function getStageData(key: string): StageData {
  return getStage(key)
}
