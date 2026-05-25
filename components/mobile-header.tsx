"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { StageSwitcher } from "@/components/stage-switcher"
import { useStage } from "@/components/stage-provider"
import { navItems } from "@/lib/nav-items"

export function MobileHeader() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const { alertCount } = useStage()

  return (
    <>
      <header
        className="flex md:hidden items-center justify-between px-4 py-3 shrink-0"
        style={{ background: "var(--sidebar)", borderBottom: "1px solid var(--sidebar-border)" }}
      >
        <div className="flex items-center gap-2">
          <span className="text-xl">🐄</span>
          <span className="font-bold text-sm" style={{ color: "var(--sidebar-foreground)" }}>
            Controle de Rebanho
          </span>
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 rounded-md opacity-70 hover:opacity-100 transition-opacity relative"
          style={{ color: "var(--sidebar-foreground)" }}
          aria-label="Abrir menu"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <rect y="3"  width="20" height="2" rx="1" />
            <rect y="9"  width="20" height="2" rx="1" />
            <rect y="15" width="20" height="2" rx="1" />
          </svg>
          {alertCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center leading-none">
              {alertCount > 9 ? "9+" : alertCount}
            </span>
          )}
        </button>
      </header>

      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsOpen(false)} />
          <aside
            className="absolute left-0 top-0 h-full w-64 flex flex-col overflow-y-auto"
            style={{ background: "var(--sidebar)" }}
          >
            <div
              className="flex items-center justify-between p-4"
              style={{ borderBottom: "1px solid var(--sidebar-border)" }}
            >
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
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded opacity-60 hover:opacity-100 transition-opacity"
                style={{ color: "var(--sidebar-foreground)" }}
                aria-label="Fechar menu"
              >
                ✕
              </button>
            </div>

            <nav className="flex-1 p-2 space-y-0.5 mt-1">
              {navItems.map((item) => {
                const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex items-center gap-2.5 px-3 py-2.5 rounded-md text-sm transition-all",
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
                      <span className="bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[20px] text-center leading-none">
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
        </div>
      )}
    </>
  )
}
