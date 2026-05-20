import { stage1 } from "./stage1"
import { stage2 } from "./stage2"
import { stage3 } from "./stage3"
import type { StageData } from "./types"

export type { StageData } from "./types"

const stages: Record<string, StageData> = { "1": stage1, "2": stage2, "3": stage3 }

export function getStage(key: string | undefined): StageData {
  return stages[key ?? "1"] ?? stage1
}
