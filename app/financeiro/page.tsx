"use client"

import { useState } from "react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useData } from "@/components/data-provider"
import type { CategoriaTransacao } from "@/lib/local-data"

const categoriaLabel: Record<CategoriaTransacao, string> = {
  VENDA_BEZERRO: "Venda Bezerro",
  MEDICAMENTO:   "Medicamento",
  VETERINARIO:   "Veterinário",
  RACAO:         "Ração",
  OUTRO:         "Outro",
}

const categorias: CategoriaTransacao[] = ["VENDA_BEZERRO", "MEDICAMENTO", "VETERINARIO", "RACAO", "OUTRO"]

function formatBRL(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value)
}

export default function FinanceiroPage() {
  const { getTodasTransacoes, addTransacao, removeTransacao } = useData()
  const transacoes = getTodasTransacoes()

  const receitas = transacoes.filter(t => t.tipo === "RECEITA").reduce((s, t) => s + t.valor, 0)
  const despesas = transacoes.filter(t => t.tipo === "DESPESA").reduce((s, t) => s + t.valor, 0)
  const saldo = receitas - despesas

  const porCat: Partial<Record<CategoriaTransacao, number>> = {}
  for (const t of transacoes.filter(t => t.tipo === "DESPESA")) {
    porCat[t.categoria] = (porCat[t.categoria] ?? 0) + t.valor
  }

  const [showForm, setShowForm] = useState(false)
  const [tipo, setTipo] = useState<"RECEITA" | "DESPESA">("DESPESA")
  const [categoria, setCategoria] = useState<CategoriaTransacao>("OUTRO")
  const [valor, setValor] = useState("")
  const [data, setData] = useState(new Date().toISOString().slice(0, 10))
  const [descricao, setDescricao] = useState("")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!descricao.trim() || !valor) return
    addTransacao({
      tipo,
      categoria,
      valor: parseFloat(valor),
      data: new Date(data + "T12:00:00").toISOString(),
      descricao: descricao.trim(),
    })
    setDescricao("")
    setValor("")
    setShowForm(false)
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Financeiro</h1>
          <p className="text-muted-foreground text-sm mt-1">Receitas, despesas e saldo do rebanho</p>
        </div>
        <Button size="sm" onClick={() => setShowForm(v => !v)}>
          {showForm ? "Cancelar" : "+ Nova"}
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardContent className="pt-4">
            <form onSubmit={handleSubmit} className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Tipo</label>
                <select
                  className="w-full border rounded-md px-3 py-1.5 text-sm bg-background"
                  value={tipo}
                  onChange={e => setTipo(e.target.value as "RECEITA" | "DESPESA")}
                >
                  <option value="DESPESA">Despesa</option>
                  <option value="RECEITA">Receita</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Categoria</label>
                <select
                  className="w-full border rounded-md px-3 py-1.5 text-sm bg-background"
                  value={categoria}
                  onChange={e => setCategoria(e.target.value as CategoriaTransacao)}
                >
                  {categorias.map(c => (
                    <option key={c} value={c}>{categoriaLabel[c]}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Valor (R$)</label>
                <input
                  className="w-full border rounded-md px-3 py-1.5 text-sm bg-background"
                  type="number"
                  min="0.01"
                  step="0.01"
                  placeholder="0,00"
                  value={valor}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValor(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Data</label>
                <input
                  className="w-full border rounded-md px-3 py-1.5 text-sm bg-background"
                  type="date"
                  value={data}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-medium text-muted-foreground">Descrição</label>
                <input
                  className="w-full border rounded-md px-3 py-1.5 text-sm bg-background"
                  placeholder="Ex: Compra de vacina"
                  value={descricao}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDescricao(e.target.value)}
                  required
                />
              </div>
              <div className="sm:col-span-2 flex justify-end">
                <Button type="submit" size="sm">Adicionar</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-1 pt-4 px-4">
            <CardTitle className="text-xs text-muted-foreground font-normal uppercase tracking-wide">Receitas</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <p className="text-2xl font-bold text-green-600">{formatBRL(receitas)}</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="pb-1 pt-4 px-4">
            <CardTitle className="text-xs text-muted-foreground font-normal uppercase tracking-wide">Despesas</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <p className="text-2xl font-bold text-red-600">{formatBRL(despesas)}</p>
          </CardContent>
        </Card>
        <Card className={`border-l-4 ${saldo >= 0 ? "border-l-blue-500" : "border-l-red-600"}`}>
          <CardHeader className="pb-1 pt-4 px-4">
            <CardTitle className="text-xs text-muted-foreground font-normal uppercase tracking-wide">Saldo</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <p className={`text-2xl font-bold ${saldo >= 0 ? "text-blue-600" : "text-red-600"}`}>
              {formatBRL(saldo)}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Despesas por categoria */}
        <Card className="border-l-4 border-l-amber-500">
          <CardHeader>
            <CardTitle>Despesas por Categoria</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {(Object.entries(porCat) as [CategoriaTransacao, number][])
              .sort((a, b) => b[1] - a[1])
              .map(([cat, val]) => (
                <div key={cat} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{categoriaLabel[cat]}</span>
                  <span className="font-medium tabular-nums">{formatBRL(val)}</span>
                </div>
              ))}
          </CardContent>
        </Card>

        {/* Transactions list */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Movimentações</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {transacoes.map((t) => (
                <div key={t.id} className="flex items-center gap-3 py-2 border-b last:border-0">
                  <div className="flex-1 min-w-0 space-y-0.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium truncate">{t.descricao}</span>
                      <Badge variant="outline" className="text-xs shrink-0">
                        {categoriaLabel[t.categoria]}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(t.data), "dd/MM/yyyy", { locale: ptBR })}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 text-sm font-semibold tabular-nums ${
                      t.tipo === "RECEITA" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {t.tipo === "RECEITA" ? "+" : "−"}{formatBRL(t.valor)}
                  </span>
                  <button
                    onClick={() => removeTransacao(t.id)}
                    className="shrink-0 text-muted-foreground hover:text-destructive text-xs leading-none"
                    aria-label="Remover transação"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
