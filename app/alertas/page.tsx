"use client"

import { useData } from "@/components/data-provider"
import { computeAlertas } from "@/lib/alerts"
import type { AlertaTipo, AlertaUrgencia } from "@/lib/alerts"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const tipoLabel: Record<AlertaTipo, string> = {
  parto: "Parto", desmame: "Desmame", estoque: "Estoque",
  validade: "Validade", diagnostico: "Diagnóstico",
}

const tipoBadge: Record<AlertaTipo, string> = {
  parto:       "bg-blue-100 text-blue-700 border-blue-200",
  desmame:     "bg-teal-100 text-teal-700 border-teal-200",
  estoque:     "bg-red-100 text-red-700 border-red-200",
  validade:    "bg-amber-100 text-amber-700 border-amber-200",
  diagnostico: "bg-violet-100 text-violet-700 border-violet-200",
}

const urgenciaLeft: Record<AlertaUrgencia, string> = {
  alta:  "border-l-red-500",
  media: "border-l-amber-400",
  baixa: "border-l-gray-300",
}

export default function AlertasPage() {
  const { animais, bezerros, medicamentos, eventosReprodutivos, loading } = useData()

  if (loading) return <div className="p-4 md:p-6 text-sm text-muted-foreground">Carregando...</div>

  const alertas = computeAlertas({
    today:        new Date(),
    animais:      animais      as Parameters<typeof computeAlertas>[0]["animais"],
    bezerros:     bezerros.filter(b => b.dataDesmameEstimada !== null) as Parameters<typeof computeAlertas>[0]["bezerros"],
    medicamentos: medicamentos as Parameters<typeof computeAlertas>[0]["medicamentos"],
    eventos:      eventosReprodutivos as Parameters<typeof computeAlertas>[0]["eventos"],
  })

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Alertas</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {alertas.length} alerta{alertas.length !== 1 ? "s" : ""} ativo{alertas.length !== 1 ? "s" : ""}
        </p>
      </div>

      {alertas.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground text-sm">
            Nenhum alerta ativo no momento.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {alertas.map((alerta) => (
            <div
              key={alerta.id}
              className={`rounded-lg border border-l-4 bg-card px-4 py-3 flex items-start gap-3 ${urgenciaLeft[alerta.urgencia]}`}
            >
              <div className="flex-1 space-y-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-sm">{alerta.titulo}</span>
                  <Badge className={`text-xs ${tipoBadge[alerta.tipo]}`} variant="outline">
                    {tipoLabel[alerta.tipo]}
                  </Badge>
                  {alerta.urgencia === "alta" && (
                    <Badge variant="destructive" className="text-xs">Urgente</Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{alerta.descricao}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
