import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { cookies } from "next/headers"
import "./globals.css"
import { Sidebar } from "@/components/sidebar"

export const metadata: Metadata = {
  title: "Controle de Rebanho",
  description: "Sistema de gestão de rebanho bovino",
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const store = await cookies()
  const currentStage = store.get("stage")?.value ?? "1"

  return (
    <html lang="pt-BR" className={`${GeistSans.variable} h-full antialiased`}>
      <body className="h-full flex bg-background">
        <Sidebar currentStage={currentStage} />
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </body>
    </html>
  )
}
