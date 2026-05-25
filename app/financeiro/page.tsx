import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { transacoes, getTotais, getPorCategoria } from "@/lib/mock/financeiro"
import type { CategoriaTransacao } from "@/lib/mock/financeiro"

const categoriaLabel: Record<CategoriaTransacao, string> = {
  VENDA_BEZERRO: "Venda Bezerro",
  MEDICAMENTO:   "Medicamento",
  VETERINARIO:   "Veterinário",
  RACAO:         "Ração",
  OUTRO:         "Outro",
}

function formatBRL(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value)
}

export default function FinanceiroPage() {
  const totais  = getTotais()
  const porCat  = getPorCategoria()
  const sorted  = [...transacoes].sort((a, b) => b.data.getTime() - a.data.getTime())

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Financeiro</h1>
        <p className="text-muted-foreground text-sm mt-1">Receitas, despesas e saldo do rebanho</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-1 pt-4 px-4">
            <CardTitle className="text-xs text-muted-foreground font-normal uppercase tracking-wide">Receitas</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <p className="text-2xl font-bold text-green-600">{formatBRL(totais.receitas)}</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="pb-1 pt-4 px-4">
            <CardTitle className="text-xs text-muted-foreground font-normal uppercase tracking-wide">Despesas</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <p className="text-2xl font-bold text-red-600">{formatBRL(totais.despesas)}</p>
          </CardContent>
        </Card>
        <Card className={`border-l-4 ${totais.saldo >= 0 ? "border-l-blue-500" : "border-l-red-600"}`}>
          <CardHeader className="pb-1 pt-4 px-4">
            <CardTitle className="text-xs text-muted-foreground font-normal uppercase tracking-wide">Saldo</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <p className={`text-2xl font-bold ${totais.saldo >= 0 ? "text-blue-600" : "text-red-600"}`}>
              {formatBRL(totais.saldo)}
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

        {/* Transactions */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Movimentações</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {sorted.map((t) => (
                <div key={t.id} className="flex items-center gap-3 py-2 border-b last:border-0">
                  <div className="flex-1 min-w-0 space-y-0.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium truncate">{t.descricao}</span>
                      <Badge variant="outline" className="text-xs shrink-0">
                        {categoriaLabel[t.categoria]}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {format(t.data, "dd/MM/yyyy", { locale: ptBR })}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 text-sm font-semibold tabular-nums ${
                      t.tipo === "RECEITA" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {t.tipo === "RECEITA" ? "+" : "−"}{formatBRL(t.valor)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
