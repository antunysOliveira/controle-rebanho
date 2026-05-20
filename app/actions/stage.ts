"use server"

import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"

export async function setStage(stage: string) {
  const store = await cookies()
  store.set("stage", stage, { path: "/", maxAge: 60 * 60 * 24 * 30 })
  revalidatePath("/", "layout")
}
