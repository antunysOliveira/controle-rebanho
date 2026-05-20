import type { Metadata } from "next"
import { Geist } from "next/font/google"
import "./globals.css"
import { Sidebar } from "@/components/sidebar"

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Controle de Rebanho",
  description: "Sistema de gestão de rebanho bovino",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${geist.variable} h-full antialiased`}>
      <body className="h-full flex bg-background">
        <Sidebar />
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </body>
    </html>
  )
}
