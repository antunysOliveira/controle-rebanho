"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/", label: "Dashboard", icon: "🏠" },
  { href: "/animais", label: "Animais", icon: "🐄" },
  { href: "/bezerros", label: "Bezerros", icon: "🐮" },
  { href: "/lotes", label: "Lotes", icon: "📋" },
  { href: "/reproducao", label: "Reprodução", icon: "🔬" },
  { href: "/medicamentos", label: "Medicamentos", icon: "💊" },
  { href: "/equipe", label: "Equipe", icon: "👥" },
  { href: "/relatorios", label: "Relatórios", icon: "📊" },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-56 shrink-0 border-r bg-card flex flex-col">
      <div className="p-4 border-b">
        <h1 className="font-bold text-base leading-tight">🐄 Controle</h1>
        <p className="text-xs text-muted-foreground">de Rebanho</p>
      </div>
      <nav className="flex-1 p-2 space-y-0.5">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors",
              pathname === item.href
                ? "bg-primary text-primary-foreground font-medium"
                : "text-muted-foreground hover:bg-accent hover:text-foreground"
            )}
          >
            <span>{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  )
}
