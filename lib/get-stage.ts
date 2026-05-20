import { cookies } from "next/headers"
import { getStage } from "@/lib/stages"
import type { StageData } from "@/lib/stages/types"

export async function getCurrentStage(): Promise<{ key: string; data: StageData }> {
  const store = await cookies()
  const key = store.get("stage")?.value ?? "1"
  return { key, data: getStage(key) }
}
