"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { StageSwitcher } from "@/components/stage-switcher"
import { useStage } from "@/components/stage-provider"
import { navItems } from "@/lib/nav-items"

export function Sidebar() {
  const pathname = usePathname()
  const { alertCount } = useStage()

  return (
    <aside
      className="w-56 shrink-0 hidden md:flex flex-col overflow-y-auto"
      style={{ background: "var(--sidebar)", borderRight: "1px solid var(--sidebar-border)" }}
    >
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
              <span className="flex-1">{item.label}</span>
              {item.badge && alertCount > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[18px] text-center leading-none">
                  {alertCount}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      <div style={{ borderTop: "1px solid var(--sidebar-border)" }} className="pt-3 mt-1">
        <StageSwitcher />
      </div>

      <div className="px-4 py-2" style={{ borderTop: "1px solid var(--sidebar-border)" }}>
        <p className="text-xs opacity-40" style={{ color: "var(--sidebar-foreground)" }}>
          Protótipo v0.1
        </p>
      </div>
    </aside>
  )
}
