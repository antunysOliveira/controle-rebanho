"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { StageSwitcher } from "@/components/stage-switcher"
import { Separator } from "@/components/ui/separator"

const navItems = [
  { href: "/",             label: "Dashboard",   icon: "🏠" },
  { href: "/animais",      label: "Animais",      icon: "🐄" },
  { href: "/bezerros",     label: "Bezerros",     icon: "🐮" },
  { href: "/lotes",        label: "Lotes",        icon: "📋" },
  { href: "/reproducao",   label: "Reprodução",   icon: "🔬" },
  { href: "/medicamentos", label: "Medicamentos", icon: "💊" },
  { href: "/equipe",       label: "Equipe",       icon: "👥" },
  { href: "/relatorios",   label: "Relatórios",   icon: "📊" },
]

export function Sidebar({ currentStage }: { currentStage: string }) {
  const pathname = usePathname()

  return (
    <aside className="w-56 shrink-0 flex flex-col overflow-y-auto" style={{ background: "var(--sidebar)", borderRight: "1px solid var(--sidebar-border)" }}>
      {/* Logo */}
      <div className="p-4 pb-3" style={{ borderBottom: "1px solid var(--sidebar-border)" }}>
        <div className="flex items-center gap-2">
          <span className="text-2xl">🐄</span>
          <div>
            <h1 className="font-bold text-sm leading-tight" style={{ color: "var(--sidebar-foreground)" }}>
              Controle de
            </h1>
            <p className="text-xs font-semibold" style={{ color: "var(--sidebar-primary)" }}>
              Rebanho
            </p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-2 space-y-0.5 mt-1">
        {navItems.map((item) => {
          const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-all",
                active ? "font-semibold shadow-sm" : "opacity-60 hover:opacity-100"
              )}
              style={
                active
                  ? { background: "var(--sidebar-primary)", color: "var(--sidebar-primary-foreground)" }
                  : { color: "var(--sidebar-foreground)" }
              }
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Stage Switcher */}
      <div style={{ borderTop: "1px solid var(--sidebar-border)" }} className="pt-3 mt-1">
        <StageSwitcher currentStage={currentStage} />
      </div>

      {/* Footer */}
      <div className="px-4 py-2" style={{ borderTop: "1px solid var(--sidebar-border)" }}>
        <p className="text-xs opacity-40" style={{ color: "var(--sidebar-foreground)" }}>
          Protótipo v0.1
        </p>
      </div>
    </aside>
  )
}
