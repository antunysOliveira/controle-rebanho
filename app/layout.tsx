import type { Metadata, Viewport } from "next"
import { GeistSans } from "geist/font/sans"
import "./globals.css"
import { Sidebar } from "@/components/sidebar"
import { MobileHeader } from "@/components/mobile-header"
import { PWARegister } from "@/components/pwa-register"
import { getCurrentStage } from "@/lib/get-stage"
import { animais, bezerros, medicamentos, eventosReprodutivos } from "@/lib/mock/data"
import { computeAlertas } from "@/lib/alerts"

export const metadata: Metadata = {
  title: "Controle de Rebanho",
  description: "Sistema de gestão de rebanho bovino",
  manifest: "/manifest.json",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "Rebanho" },
}

export const viewport: Viewport = {
  themeColor: "#2d5a27",
  width: "device-width",
  initialScale: 1,
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { key: currentStage, data } = await getCurrentStage()
  const alertas = computeAlertas({
    today:        data.simDate,
    animais:      animais as Parameters<typeof computeAlertas>[0]["animais"],
    bezerros:     bezerros as Parameters<typeof computeAlertas>[0]["bezerros"],
    medicamentos: medicamentos as Parameters<typeof computeAlertas>[0]["medicamentos"],
    eventos:      eventosReprodutivos as Parameters<typeof computeAlertas>[0]["eventos"],
  })
  const alertCount = alertas.length

  return (
    <html lang="pt-BR" className={`${GeistSans.variable} h-full antialiased`}>
      <body className="h-full flex flex-col md:flex-row bg-background">
        <MobileHeader currentStage={currentStage} alertCount={alertCount} />
        <Sidebar currentStage={currentStage} alertCount={alertCount} />
        <main className="flex-1 overflow-auto">{children}</main>
        <PWARegister />
      </body>
    </html>
  )
}
