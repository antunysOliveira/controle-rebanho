import type { Metadata, Viewport } from "next"
import { GeistSans } from "geist/font/sans"
import "./globals.css"
import { Sidebar } from "@/components/sidebar"
import { MobileHeader } from "@/components/mobile-header"
import { PWARegister } from "@/components/pwa-register"
import { StageProvider } from "@/components/stage-provider"
import { DataProvider } from "@/components/data-provider"

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${GeistSans.variable} h-full antialiased`}>
      <body className="h-full flex flex-col md:flex-row bg-background">
        <DataProvider>
          <StageProvider>
            <MobileHeader />
            <Sidebar />
            <main className="flex-1 overflow-auto">{children}</main>
            <PWARegister />
          </StageProvider>
        </DataProvider>
      </body>
    </html>
  )
}
